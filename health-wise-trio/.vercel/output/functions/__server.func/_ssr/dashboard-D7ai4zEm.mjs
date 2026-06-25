import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link, f as useRouter } from "../_libs/tanstack__react-router.mjs";
import { y as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { A as AppShell, B as Button, C as Card } from "./card-Mow16zMX.mjs";
import { R as RequireAuth } from "./RequireAuth-D1Lajl0o.mjs";
import { s as supabase } from "./client-CRJ153-x.mjs";
import { u as useAuth, s as setLanguage } from "./router-D98PLsb2.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as scheduleAll, c as clearScheduled, e as ensurePermission } from "./notifications-oawvSogp.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, b as getServerFnById } from "./server-C6FBhYsJ.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-STxo7KBz.mjs";
import "../_libs/i18next.mjs";
import "../_libs/seroval.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { B as Bell, b as BellOff, i as Droplet, o as Moon, q as Plus, v as Sunset, u as Sun, p as Pill, x as User, U as Undo2, c as Check, t as Sparkles, R as RefreshCw, N as Notebook } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/use-sync-external-store.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
function calculateHealthScore(i) {
  const adherence = i.adherenceRate === null ? 1 : Math.min(1, Math.max(0, i.adherenceRate));
  const med = adherence * 35;
  const water = Math.min(1, Math.max(0, i.waterGlasses) / 8) * 20;
  const sleepIdeal = i.sleepHours >= 7 && i.sleepHours <= 9 ? 1 : Math.max(0, 1 - Math.abs(8 - i.sleepHours) / 8);
  const sleep = sleepIdeal * 20;
  const mood = i.mood != null ? Math.min(5, Math.max(1, i.mood)) / 5 * 15 : 0;
  const log = (i.loggedToday ? 1 : 0) * 10;
  const parts = [
    { key: "med", label: "Medicines", got: Math.round(med), max: 35 },
    { key: "water", label: "Water", got: Math.round(water), max: 20 },
    { key: "sleep", label: "Sleep", got: Math.round(sleep), max: 20 },
    { key: "mood", label: "Mood", got: Math.round(mood), max: 15 },
    { key: "log", label: "Daily log", got: Math.round(log), max: 10 }
  ];
  const total = Math.round(med + water + sleep + mood + log);
  return { score: Math.min(100, Math.max(0, total)), parts };
}
function scoreColor(score) {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
}
function HealthScoreRing({ score, label }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score));
  const offset = c - pct / 100 * c;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid place-items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "140", height: "140", viewBox: "0 0 140 140", className: "-rotate-90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "70", cy: "70", r, stroke: "currentColor", strokeWidth: "12", fill: "none", className: "text-muted/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.circle,
        {
          cx: "70",
          cy: "70",
          r,
          stroke: "currentColor",
          strokeWidth: "12",
          fill: "none",
          strokeLinecap: "round",
          className: "text-primary",
          initial: { strokeDasharray: c, strokeDashoffset: c },
          animate: { strokeDashoffset: offset },
          transition: { duration: 1, ease: "easeOut" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-4xl font-extrabold ${scoreColor(score)}`, children: score }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label })
    ] }) })
  ] });
}
const KEY = "hm-offline-v1";
function saveSnapshot(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...s, savedAt: (/* @__PURE__ */ new Date()).toISOString() }));
  } catch {
  }
}
function loadSnapshot() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function isOnline() {
  return typeof navigator === "undefined" ? true : navigator.onLine;
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getPersonalAdvice = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b4a4083c2c3b9ce1f51ba55e0656d1a294f01cbce919473c9387d0ff75f24c88"));
const SELF_COLOR = "#0EA5A4";
function getMealTimingForBucket(mealTimingStr, bucket) {
  if (!mealTimingStr || mealTimingStr === "none") return null;
  try {
    if (mealTimingStr.startsWith("{")) {
      const obj = JSON.parse(mealTimingStr);
      const key = bucket === "evening" ? "night" : bucket;
      const val = obj[key];
      return val && val !== "none" ? val : null;
    }
  } catch (e) {
  }
  if (bucket === "morning" && (mealTimingStr.includes("breakfast") || mealTimingStr === "anytime")) return mealTimingStr;
  if (bucket === "afternoon" && (mealTimingStr.includes("lunch") || mealTimingStr === "anytime")) return mealTimingStr;
  if (bucket === "evening" && (mealTimingStr.includes("dinner") || mealTimingStr === "anytime")) return mealTimingStr;
  return null;
}
function bucketOf(time) {
  const h = Number(time.split(":")[0] ?? 0);
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
function Dashboard() {
  const {
    t,
    i18n
  } = useTranslation();
  const {
    user
  } = useAuth();
  const nav = useNavigate();
  const [meds, setMeds] = reactExports.useState([]);
  const [members, setMembers] = reactExports.useState([]);
  const [todayLog, setTodayLog] = reactExports.useState(null);
  const [name, setName] = reactExports.useState("");
  const [todayTaken, setTodayTaken] = reactExports.useState({});
  const [offline, setOffline] = reactExports.useState(!isOnline());
  const [alarmsOn, setAlarmsOn] = reactExports.useState(() => typeof window !== "undefined" ? localStorage.getItem("alarms-enabled") !== "false" : true);
  const [notifPerm, setNotifPerm] = reactExports.useState(typeof Notification !== "undefined" ? Notification.permission : "denied");
  const [advice, setAdvice] = reactExports.useState(null);
  const [adviceLoading, setAdviceLoading] = reactExports.useState(false);
  const fetchAdvice = useServerFn(getPersonalAdvice);
  reactExports.useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  reactExports.useEffect(() => {
    if (!user) return;
    const snap = loadSnapshot();
    if (snap) {
      setMeds(snap.meds ?? []);
      setMembers(snap.members ?? []);
      setTodayLog(snap.todayLog ?? null);
      setTodayTaken(snap.todayTaken ?? {});
    }
    if (!isOnline()) return;
    (async () => {
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const [{
        data: profile
      }, {
        data: medsData
      }, {
        data: logData
      }, {
        data: reminders
      }, {
        data: fm
      }] = await Promise.all([supabase.from("profiles").select("name,language,onboarded").eq("id", user.id).maybeSingle(), supabase.from("medicines").select("*").eq("user_id", user.id).eq("active", true), supabase.from("health_logs").select("water_glasses,sleep_hours,mood").eq("user_id", user.id).eq("log_date", today).maybeSingle(), supabase.from("reminders").select("medicine_id,scheduled_time,status").eq("user_id", user.id).eq("scheduled_date", today), supabase.from("family_members").select("id,name,color").eq("user_id", user.id)]);
      if (profile && !profile.onboarded) {
        nav({
          to: "/onboarding"
        });
        return;
      }
      if (profile?.name) setName(profile.name);
      if (profile?.language && !localStorage.getItem("lang")) setLanguage(profile.language);
      const allMeds = medsData ?? [];
      setMeds(allMeds);
      setMembers(fm ?? []);
      setTodayLog(logData ?? null);
      const map = {};
      (reminders ?? []).forEach((r) => {
        map[`${r.medicine_id}|${r.scheduled_time}`] = r.status === "taken";
      });
      setTodayTaken(map);
      saveSnapshot({
        date: today,
        meds: allMeds,
        members: fm ?? [],
        todayLog: logData ?? null,
        todayTaken: map
      });
      if (alarmsOn && typeof Notification !== "undefined" && Notification.permission === "granted") {
        const items = allMeds.flatMap((m) => m.reminder_times.map((tm) => ({
          id: m.id,
          name: m.name,
          time: tm,
          taken: map[`${m.id}|${tm}`]
        }))).filter((it) => !it.taken);
        scheduleAll(items);
      }
    })();
  }, [user, nav, alarmsOn]);
  const loadAdvice = reactExports.useCallback(async () => {
    setAdviceLoading(true);
    try {
      const res = await fetchAdvice();
      setAdvice(res.advice ?? null);
    } catch {
      setAdvice(null);
    } finally {
      setAdviceLoading(false);
    }
  }, [fetchAdvice]);
  reactExports.useEffect(() => {
    if (user) loadAdvice();
  }, [user, loadAdvice]);
  const setTakenStatus = async (medId, time, taken) => {
    if (!user) return;
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const key = `${medId}|${time}`;
    const nextMap = {
      ...todayTaken,
      [key]: taken
    };
    setTodayTaken(nextMap);
    saveSnapshot({
      date: today,
      meds,
      members,
      todayLog,
      todayTaken: nextMap
    });
    if (!isOnline()) {
      toast.success(taken ? t("med.taken") : t("dashboard.undo"));
      return;
    }
    const {
      error
    } = await supabase.from("reminders").upsert({
      user_id: user.id,
      medicine_id: medId,
      scheduled_date: today,
      scheduled_time: time,
      status: taken ? "taken" : "pending",
      taken_at: taken ? (/* @__PURE__ */ new Date()).toISOString() : null
    }, {
      onConflict: "medicine_id,scheduled_date,scheduled_time"
    });
    if (error) {
      setTodayTaken((m) => ({
        ...m,
        [key]: !taken
      }));
      return toast.error(error.message);
    }
    toast.success(taken ? t("med.taken") : t("dashboard.undo"));
  };
  const toggleAlarms = async () => {
    if (alarmsOn) {
      localStorage.setItem("alarms-enabled", "false");
      clearScheduled();
      setAlarmsOn(false);
      toast.success(t("dashboard.alarmsDisabled"));
      return;
    }
    const perm = await ensurePermission();
    setNotifPerm(perm);
    if (perm === "granted") {
      localStorage.setItem("alarms-enabled", "true");
      setAlarmsOn(true);
      const items = meds.flatMap((m) => m.reminder_times.map((tm) => ({
        id: m.id,
        name: m.name,
        time: tm
      }))).filter((it) => !todayTaken[`${it.id}|${it.time}`]);
      scheduleAll(items);
      toast.success(t("dashboard.alarmsOn"));
    } else if (perm === "denied") {
      toast.error(t("dashboard.alarmsBlocked"));
    }
  };
  const adherence = reactExports.useMemo(() => {
    const expected = meds.reduce((s, m) => s + m.reminder_times.length, 0);
    if (expected === 0) return null;
    const taken = meds.reduce((s, m) => s + m.reminder_times.filter((tm) => todayTaken[`${m.id}|${tm}`]).length, 0);
    return taken / expected;
  }, [meds, todayTaken]);
  const {
    score,
    parts
  } = reactExports.useMemo(() => calculateHealthScore({
    adherenceRate: adherence,
    waterGlasses: todayLog?.water_glasses ?? 0,
    sleepHours: todayLog?.sleep_hours ?? 0,
    mood: todayLog?.mood ?? null,
    loggedToday: !!todayLog
  }), [adherence, todayLog]);
  const colorFor = (med) => {
    if (med.member_id) {
      const m = members.find((x) => x.id === med.member_id);
      if (m?.color) return m.color;
    }
    return med.pill_color ?? SELF_COLOR;
  };
  const todaysItems = meds.flatMap((m) => m.reminder_times.map((tm) => ({
    med: m,
    time: tm
  })));
  todaysItems.sort((a, b) => a.time.localeCompare(b.time));
  const grouped = {
    morning: [],
    afternoon: [],
    evening: []
  };
  todaysItems.forEach((it) => grouped[bucketOf(it.time)].push(it));
  const bucketIcon = {
    morning: Sun,
    afternoon: Sun,
    evening: Sunset
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 12
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold md:text-4xl", children: t("dashboard.greeting", {
          name: name || "👋"
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: (/* @__PURE__ */ new Date()).toLocaleDateString(i18n.language === "hi" ? "hi-IN" : i18n.language === "gu" ? "gu-IN" : "en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long"
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2", children: [
        offline && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-warning" }),
          " ",
          t("dashboard.offline")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "gap-2 rounded-xl", onClick: toggleAlarms, children: alarmsOn && notifPerm === "granted" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 text-primary" }),
          t("dashboard.alarmsOn")
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-4 w-4" }),
          t("dashboard.alarmsOff")
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-5 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-6 shadow-[var(--shadow-soft)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: t("dashboard.healthScore") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HealthScoreRing, { score, label: "/ 100" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: t("dashboard.scoreBreakdown") }),
          parts.map((p) => {
            const pct = Math.round(p.got / p.max * 100);
            const isLow = pct < 70;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isLow ? "text-muted-foreground" : "font-medium", children: t(`dashboard.score.${p.key}`) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `tabular-nums ${isLow ? "text-destructive" : "text-success"}`, children: [
                  p.got,
                  "/",
                  p.max
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full rounded-full ${isLow ? "bg-destructive/60" : "bg-success/80"}`, style: {
                width: `${pct}%`
              } }) })
            ] }, p.key);
          })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3 text-center text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/60 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { className: "mx-auto h-4 w-4 text-secondary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 font-semibold", children: [
              todayLog?.water_glasses ?? 0,
              "/8"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t("dashboard.water") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/60 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "mx-auto h-4 w-4 text-secondary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 font-semibold", children: [
              todayLog?.sleep_hours ?? 0,
              "h"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t("dashboard.sleep") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-6 shadow-[var(--shadow-soft)] lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: t("dashboard.todayTitle") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/medicines", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "gap-1 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            t("dashboard.addMedicine")
          ] }) })
        ] }),
        todaysItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground", children: t("dashboard.noMeds") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-3 md:grid-cols-3", children: ["morning", "afternoon", "evening"].map((bk) => {
          const Icon = bucketIcon[bk];
          const items = grouped[bk];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-muted/30 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2 text-sm font-semibold text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
              t(`dashboard.bucket.${bk}`)
            ] }),
            items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 py-2", children: t("dashboard.bucketEmpty") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: items.map(({
              med,
              time
            }) => {
              const taken = todayTaken[`${med.id}|${time}`];
              const col = colorFor(med);
              const owner = med.member_id ? members.find((x) => x.id === med.member_id) : null;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-lg p-2.5 border transition-all", style: {
                backgroundColor: col + "12",
                borderColor: col + "25"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg", style: {
                    background: col + "22",
                    color: col
                  }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm truncate", children: med.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: time }),
                      owner && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5", style: {
                        color: col
                      }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3" }),
                        owner.name
                      ] })
                    ] }),
                    getMealTimingForBucket(med.meal_timing, bk) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wide text-muted-foreground/80 mt-0.5", children: t(`med.meal.${getMealTimingForBucket(med.meal_timing, bk)}`) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: taken ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "w-full gap-1 h-8 rounded-lg text-xs", onClick: () => setTakenStatus(med.id, time, false), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "h-3 w-3" }),
                  t("dashboard.undo")
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "w-full gap-1 h-8 rounded-lg text-xs bg-[image:var(--gradient-primary)]", onClick: () => setTakenStatus(med.id, time, true), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
                  t("med.taken")
                ] }) })
              ] }, `${med.id}-${time}`);
            }) })
          ] }, bk);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6 rounded-2xl p-6 shadow-[var(--shadow-soft)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "flex items-center gap-2 text-lg font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-primary" }),
          t("dashboard.insightsTitle")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: loadAdvice, disabled: adviceLoading, "aria-label": t("dashboard.insightsRefresh"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${adviceLoading ? "animate-spin" : ""}` }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-sm leading-relaxed text-muted-foreground", children: adviceLoading ? t("dashboard.insightsLoading") : advice ?? t("dashboard.insightsEmpty") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-5 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/medicines", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group flex h-full cursor-pointer items-center gap-4 rounded-2xl p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: t("dashboard.addMedicine") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t("med.title") })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/log", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group flex h-full cursor-pointer items-center gap-4 rounded-2xl p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-xl bg-secondary/10 text-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Notebook, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: t("dashboard.logHealth") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t("log.title") })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/symptoms", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group flex h-full cursor-pointer items-center gap-4 rounded-2xl p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: t("dashboard.askAi") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t("symptoms.title") })
        ] })
      ] }) })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dashboard, {}) });
export {
  SplitComponent as component,
  getMealTimingForBucket
};
