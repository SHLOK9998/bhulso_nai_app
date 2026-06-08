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
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), { status: 500 });
        const { input } = (await request.json()) as { input?: string };
        if (!input || typeof input !== "string" || input.length > 2000) {
          return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
        }

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
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
      },
    },
  },
});
