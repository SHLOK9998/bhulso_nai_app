import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { A as AppShell, c as cn, C as Card, B as Button } from "./card-Mow16zMX.mjs";
import { R as RequireAuth } from "./RequireAuth-D1Lajl0o.mjs";
import { L as Label, I as Input } from "./label-DNU6CMww.mjs";
import { a as Root, b as Track, R as Range, T as Thumb } from "../_libs/radix-ui__react-slider.mjs";
import { R as Root2, L as List, T as Trigger, C as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { s as supabase } from "./client-CRJ153-x.mjs";
import { u as useAuth } from "./router-D98PLsb2.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { j as jsPDF } from "../_libs/jspdf.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { n as Minus, i as Droplet, q as Plus, D as Download, C as CalendarDays } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
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
import "fs";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
const Slider = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Root,
  {
    ref,
    className: cn("relative flex w-full touch-none select-none items-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Track, { className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Range, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = Root.displayName;
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
const MOODS = [{
  v: 1,
  e: "😔"
}, {
  v: 2,
  e: "😕"
}, {
  v: 3,
  e: "😐"
}, {
  v: 4,
  e: "🙂"
}, {
  v: 5,
  e: "😄"
}];
function monthBounds(month) {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 0));
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10)
  };
}
function LogPage() {
  const {
    t
  } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: t("log.title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-muted-foreground", children: [
      t("log.today"),
      " · ",
      (/* @__PURE__ */ new Date()).toLocaleDateString()
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "today", className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "today", className: "rounded-lg", children: t("log.tabToday") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "history", className: "rounded-lg", children: t("log.tabHistory") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "today", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TodayTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "history", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryTab, {}) })
    ] })
  ] });
}
function TodayTab() {
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();
  const [mood, setMood] = reactExports.useState(null);
  const [symptoms, setSymptoms] = reactExports.useState("");
  const [water, setWater] = reactExports.useState(0);
  const [sleep, setSleep] = reactExports.useState([7]);
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user) return;
    (async () => {
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const {
        data
      } = await supabase.from("health_logs").select("*").eq("user_id", user.id).eq("log_date", today).maybeSingle();
      if (data) {
        setMood(data.mood);
        setSymptoms((data.symptoms ?? []).join(", "));
        setWater(data.water_glasses);
        setSleep([data.sleep_hours ?? 7]);
      }
    })();
  }, [user]);
  const save = async () => {
    if (!user) return;
    setBusy(true);
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const sym = symptoms.split(",").map((s) => s.trim()).filter(Boolean);
    const {
      error
    } = await supabase.from("health_logs").upsert({
      user_id: user.id,
      log_date: today,
      mood,
      symptoms: sym,
      water_glasses: water,
      sleep_hours: sleep[0]
    }, {
      onConflict: "user_id,log_date"
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(t("log.saved"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-6 shadow-[var(--shadow-soft)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base", children: t("log.mood") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-5 gap-2", children: MOODS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMood(m.v), className: `flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition ${mood === m.v ? "border-primary bg-primary/10" : "border-border hover:bg-muted"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: m.e }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: t(`log.moods.${m.v}`) })
        ] }, m.v)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-6 shadow-[var(--shadow-soft)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base", children: t("log.water") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", className: "h-12 w-12 rounded-xl", onClick: () => setWater(Math.max(0, water - 1)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { className: "h-10 w-10 text-secondary", fill: "currentColor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-3xl font-bold", children: water }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "/ 8" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", className: "h-12 w-12 rounded-xl", onClick: () => setWater(water + 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, {}) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-6 shadow-[var(--shadow-soft)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-base", children: [
          t("log.sleep"),
          ": ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
            sleep[0],
            "h"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { min: 0, max: 12, step: 0.5, value: sleep, onValueChange: setSleep, className: "mt-6" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-6 shadow-[var(--shadow-soft)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base", children: t("log.symptoms") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: symptoms, onChange: (e) => setSymptoms(e.target.value), placeholder: t("log.symptomsPh"), className: "mt-3 h-11 rounded-xl" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, disabled: busy, className: "mt-6 h-12 w-full rounded-2xl bg-[image:var(--gradient-primary)] text-base font-semibold md:w-auto md:px-12", children: busy ? "..." : t("log.save") })
  ] });
}
function HistoryTab() {
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();
  const [month, setMonth] = reactExports.useState(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
  const [logs, setLogs] = reactExports.useState([]);
  const [name, setName] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!user) return;
    const {
      start,
      end
    } = monthBounds(month);
    supabase.from("health_logs").select("log_date,mood,sleep_hours,water_glasses,symptoms").eq("user_id", user.id).gte("log_date", start).lte("log_date", end).order("log_date", {
      ascending: false
    }).then(({
      data
    }) => setLogs(data ?? []));
    supabase.from("profiles").select("name").eq("id", user.id).maybeSingle().then(({
      data
    }) => setName(data?.name ?? ""));
  }, [user, month]);
  const stats = reactExports.useMemo(() => {
    if (logs.length === 0) return null;
    const moods = logs.filter((l) => l.mood != null).map((l) => l.mood);
    const sleeps = logs.filter((l) => l.sleep_hours != null).map((l) => l.sleep_hours);
    const avg = (a) => a.length ? +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) : 0;
    return {
      avgMood: avg(moods),
      avgSleep: avg(sleeps),
      avgWater: avg(logs.map((l) => l.water_glasses)),
      days: logs.length
    };
  }, [logs]);
  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("HealthMate AI — Monthly Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Patient: ${name || "—"}`, 14, 30);
    doc.text(`Month: ${month}`, 14, 36);
    if (stats) {
      doc.setTextColor(0);
      doc.setFontSize(13);
      doc.text("Summary", 14, 48);
      doc.setFontSize(10);
      doc.setTextColor(60);
      doc.text(`Logged days: ${stats.days}`, 14, 56);
      doc.text(`Avg mood: ${stats.avgMood} / 5`, 14, 62);
      doc.text(`Avg sleep: ${stats.avgSleep} h`, 14, 68);
      doc.text(`Avg water: ${stats.avgWater} glasses`, 14, 74);
    }
    doc.setTextColor(0);
    doc.setFontSize(13);
    doc.text("Daily logs", 14, 88);
    let y = 96;
    doc.setFontSize(9);
    logs.forEach((l) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.setTextColor(0);
      doc.text(`${l.log_date}`, 14, y);
      doc.setTextColor(80);
      doc.text(`mood ${l.mood ?? "-"} • sleep ${l.sleep_hours ?? "-"}h • water ${l.water_glasses}`, 50, y);
      const extra = l.symptoms?.join(", ") ?? "";
      if (extra) {
        y += 5;
        const wrapped = doc.splitTextToSize(extra, 180);
        doc.text(wrapped, 14, y);
        y += wrapped.length * 4;
      }
      y += 6;
    });
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text("This report is informational and not a medical document.", 14, 290);
    doc.save(`healthmate-${month}.pdf`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-2xl p-5 shadow-[var(--shadow-soft)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("history.month") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "month", value: month, onChange: (e) => setMonth(e.target.value), className: "mt-1.5 h-11 rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: exportPdf, disabled: logs.length === 0, className: "gap-2 rounded-xl bg-[image:var(--gradient-primary)] ml-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
        t("history.export")
      ] })
    ] }) }),
    stats && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-4 rounded-2xl p-5 shadow-[var(--shadow-soft)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: t("history.summary") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: t("history.loggedDays"), value: `${stats.days}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: t("history.avgMood"), value: `${stats.avgMood}/5` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: t("history.avgSleep"), value: `${stats.avgSleep}h` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: t("history.avgWater"), value: `${stats.avgWater}` })
      ] })
    ] }),
    logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6 rounded-2xl border-dashed p-12 text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "mx-auto h-10 w-10 opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4", children: t("history.noLogs") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-3", children: logs.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-4 shadow-[var(--shadow-soft)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: new Date(l.log_date).toLocaleDateString(void 0, {
          weekday: "short",
          day: "numeric",
          month: "short"
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
          "mood ",
          l.mood ?? "-",
          " · sleep ",
          l.sleep_hours ?? "-",
          "h · water ",
          l.water_glasses
        ] })
      ] }),
      l.symptoms?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: l.symptoms.join(", ") }) : null
    ] }, l.log_date)) })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/60 p-3 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-primary", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogPage, {}) });
export {
  SplitComponent as component
};
