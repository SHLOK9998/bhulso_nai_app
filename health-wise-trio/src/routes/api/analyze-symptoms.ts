import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";

const SYS = `You are HealthMate AI, a careful trilingual (English/Hindi/Gujarati) wellness companion.
You NEVER diagnose. You provide safe, general self-care guidance and clearly flag when professional care is needed.
Detect the user's input language and respond ENTIRELY in that same language (en, hi, or gu).
Return STRICT JSON only — no markdown, no prose around it.

JSON shape:
{
  "language": "en"|"hi"|"gu",
  "summary": string,                 // 1 short sentence rephrasing what the user said
  "causes": string[],                // 2-4 plain possible causes
  "suggestions": string[],           // 2-5 safe self-care actions (rest, hydration, OTC categories)
  "ayurveda": string[],              // 2-4 traditional Indian home remedies (e.g., tulsi tea, haldi milk, ginger, ajwain)
  "urgency": "low"|"medium"|"high"   // high = seek urgent care
}

Rules:
- Never name prescription drugs or doses.
- If symptoms suggest emergency (chest pain, stroke signs, heavy bleeding, breathing trouble), set urgency "high" and tell them to seek immediate care.
- Keep each list item short (max ~12 words).`;

export const Route = createFileRoute("/api/analyze-symptoms")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { input } = (await request.json()) as { input?: string };
        if (!input || typeof input !== "string" || input.length > 2000) {
          return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
        }

        const geminiKey = process.env.GEMINI_API_KEY;
        const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        const lovableKey = process.env.LOVABLE_API_KEY;

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
                    parts: [{ text: `${SYS}\n\nUser input: ${input}` }]
                  }
                ],
                generationConfig: {
                  responseMimeType: "application/json"
                }
              })
            });

            if (!res.ok) {
              const errorText = await res.text();
              console.error("Gemini native error:", errorText);
              return new Response(JSON.stringify({ error: "Gemini API service error" }), { status: 500 });
            }

            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
            let parsed: unknown;
            try { parsed = JSON.parse(text); } catch { parsed = { error: "Bad AI response" }; }
            return Response.json(parsed);
          } catch (e: any) {
            console.error("Gemini native exception:", e);
            return new Response(JSON.stringify({ error: e.message || "Failed to contact Gemini API" }), { status: 500 });
          }
        } else if (lovableKey) {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableKey },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [
                { role: "system", content: SYS },
                { role: "user", content: input },
              ],
              response_format: { type: "json_object" },
            }),
          });

          if (res.status === 429) return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), { status: 429 });
          if (res.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits to continue." }), { status: 402 });
          if (!res.ok) return new Response(JSON.stringify({ error: "AI service error" }), { status: 500 });

          const data = await res.json();
          const text = data?.choices?.[0]?.message?.content ?? "{}";
          let parsed: unknown;
          try { parsed = JSON.parse(text); } catch { parsed = { error: "Bad AI response" }; }
          return Response.json(parsed);
        } else {
          return new Response(JSON.stringify({ error: "No LLM API key configured. Please configure GEMINI_API_KEY in env." }), { status: 500 });
        }
      },
    },
  },
});
