import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/api/advice")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

        if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
          return new Response(JSON.stringify({ error: "Missing Supabase configuration" }), { status: 500 });
        }

        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");
        const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          global: { headers: { Authorization: `Bearer ${token}` } },
        });

        const { data, error } = await supabase.auth.getClaims(token);
        if (error || !data?.claims?.sub) {
          return new Response(JSON.stringify({ error: "Unauthorized: Invalid token" }), { status: 401 });
        }

        const userId = data.claims.sub;
        const since = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);

        const [{ data: profile }, { data: logs }, { data: meds }] = await Promise.all([
          supabase.from("profiles").select("name,age,gender,conditions,goals,wake_time,sleep_time,language").eq("id", userId).maybeSingle(),
          supabase.from("health_logs").select("log_date,mood,sleep_hours,water_glasses,symptoms").eq("user_id", userId).gte("log_date", since).order("log_date", { ascending: false }),
          supabase.from("medicines").select("name,reminder_times,tags").eq("user_id", userId).eq("active", true),
        ]);

        if (!logs || logs.length === 0) {
          return Response.json({ advice: null, empty: true });
        }

        const lang = profile?.language || "en";
        const langName = lang === "hi" ? "Hindi" : lang === "gu" ? "Gujarati" : "English";
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return Response.json({ advice: null, empty: false, error: "AI not configured" }, { status: 500 });

        const prompt = `You are a friendly health coach. Based on the user's recent data, give ONE short personalized tip (max 3 sentences) in ${langName}. Be warm, specific, and reference at least one concrete data point. No medical diagnoses.\n\nProfile: ${JSON.stringify(profile)}\nActive medicines: ${JSON.stringify(meds)}\nLast 14 days of logs: ${JSON.stringify(logs)}`;

        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [{ role: "user", content: prompt }],
            }),
          });
          if (!res.ok) return Response.json({ advice: null, empty: false, error: `AI error ${res.status}` }, { status: 500 });
          const completionData = await res.json();
          const advice = completionData?.choices?.[0]?.message?.content?.trim() ?? null;
          return Response.json({ advice, empty: false });
        } catch (err: any) {
          return Response.json({ error: err.message }, { status: 500 });
        }
      },
    },
  },
});
