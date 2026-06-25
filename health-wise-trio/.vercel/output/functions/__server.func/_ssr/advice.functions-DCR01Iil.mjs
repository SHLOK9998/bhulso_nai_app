import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-C6FBhYsJ.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-STxo7KBz.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getPersonalAdvice_createServerFn_handler = createServerRpc({
  id: "b4a4083c2c3b9ce1f51ba55e0656d1a294f01cbce919473c9387d0ff75f24c88",
  name: "getPersonalAdvice",
  filename: "src/lib/advice.functions.ts"
}, (opts) => getPersonalAdvice.__executeServer(opts));
const getPersonalAdvice = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(getPersonalAdvice_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const since = new Date(Date.now() - 14 * 864e5).toISOString().slice(0, 10);
  const [{
    data: profile
  }, {
    data: logs
  }, {
    data: meds
  }] = await Promise.all([supabase.from("profiles").select("name,age,gender,conditions,goals,wake_time,sleep_time,language").eq("id", userId).maybeSingle(), supabase.from("health_logs").select("log_date,mood,sleep_hours,water_glasses,symptoms").eq("user_id", userId).gte("log_date", since).order("log_date", {
    ascending: false
  }), supabase.from("medicines").select("name,reminder_times,tags").eq("user_id", userId).eq("active", true)]);
  if (!logs || logs.length === 0) {
    return {
      advice: null,
      empty: true
    };
  }
  const lang = profile?.language || "en";
  const langName = lang === "hi" ? "Hindi" : lang === "gu" ? "Gujarati" : "English";
  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const lovableKey = process.env.LOVABLE_API_KEY;
  if (!geminiKey && !lovableKey) return {
    advice: null,
    empty: false,
    error: "AI not configured"
  };
  const prompt = `You are a friendly health coach. Based on the user's recent data, give ONE short personalized tip (max 3 sentences) in ${langName}. Be warm, specific, and reference at least one concrete data point. No medical diagnoses.

Profile: ${JSON.stringify(profile)}
Active medicines: ${JSON.stringify(meds)}
Last 14 days of logs: ${JSON.stringify(logs)}`;
  let advice = null;
  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Gemini native advice error:", errorText);
        return {
          advice: null,
          empty: false,
          error: "Gemini API error"
        };
      }
      const data = await res.json();
      advice = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
    } catch (e) {
      console.error("Gemini native advice exception:", e);
      return {
        advice: null,
        empty: false,
        error: e.message || "Failed to contact Gemini API"
      };
    }
  } else if (lovableKey) {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{
          role: "user",
          content: prompt
        }]
      })
    });
    if (!res.ok) return {
      advice: null,
      empty: false,
      error: `AI error ${res.status}`
    };
    const data = await res.json();
    advice = data?.choices?.[0]?.message?.content?.trim() ?? null;
  }
  return {
    advice,
    empty: false
  };
});
export {
  getPersonalAdvice_createServerFn_handler
};
