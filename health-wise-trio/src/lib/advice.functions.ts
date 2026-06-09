import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getPersonalAdvice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const since = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
    const [{ data: profile }, { data: logs }, { data: meds }] = await Promise.all([
      supabase.from("profiles").select("name,age,gender,conditions,goals,wake_time,sleep_time,language").eq("id", userId).maybeSingle(),
      supabase.from("health_logs").select("log_date,mood,sleep_hours,water_glasses,symptoms").eq("user_id", userId).gte("log_date", since).order("log_date", { ascending: false }),
      supabase.from("medicines").select("name,reminder_times,tags").eq("user_id", userId).eq("active", true),
    ]);
    if (!logs || logs.length === 0) {
      return { advice: null, empty: true };
    }
    const lang = profile?.language || "en";
    const langName = lang === "hi" ? "Hindi" : lang === "gu" ? "Gujarati" : "English";
    const geminiKey = process.env.GEMINI_API_KEY;
    const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const lovableKey = process.env.LOVABLE_API_KEY;

    if (!geminiKey && !lovableKey) return { advice: null, empty: false, error: "AI not configured" };

    const prompt = `You are a friendly health coach. Based on the user's recent data, give ONE short personalized tip (max 3 sentences) in ${langName}. Be warm, specific, and reference at least one concrete data point. No medical diagnoses.\n\nProfile: ${JSON.stringify(profile)}\nActive medicines: ${JSON.stringify(meds)}\nLast 14 days of logs: ${JSON.stringify(logs)}`;

    let advice: string | null = null;

    if (geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }]
              }
            ]
          })
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Gemini native advice error:", errorText);
          return { advice: null, empty: false, error: "Gemini API error" };
        }

        const data = await res.json();
        advice = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
      } catch (e: any) {
        console.error("Gemini native advice exception:", e);
        return { advice: null, empty: false, error: e.message || "Failed to contact Gemini API" };
      }
    } else if (lovableKey) {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) return { advice: null, empty: false, error: `AI error ${res.status}` };
      const data = await res.json();
      advice = data?.choices?.[0]?.message?.content?.trim() ?? null;
    }

    return { advice, empty: false };
  });
