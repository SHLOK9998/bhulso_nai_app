import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";

export const Route = createFileRoute("/api/health-coach")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { prompt } = (await request.json()) as { prompt?: string };
        if (!prompt || typeof prompt !== "string" || prompt.length > 5000) {
          return new Response(JSON.stringify({ error: "Invalid prompt" }), { status: 400 });
        }

        const geminiKey = process.env.GEMINI_API_KEY;
        const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

        if (!geminiKey) {
          return new Response(JSON.stringify({ error: "No API key configured" }), { status: 500 });
        }

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
            console.error("Gemini native error:", errorText);
            return new Response(JSON.stringify({ error: "Gemini API service error" }), { status: 500 });
          }

          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
          return Response.json({ text });
        } catch (e: any) {
          console.error("Gemini native exception:", e);
          return new Response(JSON.stringify({ error: e.message || "Failed to contact Gemini API" }), { status: 500 });
        }
      },
    },
  },
});
