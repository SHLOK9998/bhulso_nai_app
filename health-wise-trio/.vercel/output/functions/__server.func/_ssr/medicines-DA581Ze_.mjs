import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { g as useSearch } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell, B as Button, C as Card, c as cn } from "./card-Mow16zMX.mjs";
import { R as RequireAuth } from "./RequireAuth-D1Lajl0o.mjs";
import { L as Label, I as Input } from "./label-DNU6CMww.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-B9296iqD.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-T9q0yX0h.mjs";
import { s as supabase } from "./client-CRJ153-x.mjs";
import { u as useAuth } from "./router-D98PLsb2.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { q as Plus, p as Pill, P as Pencil, T as Trash2, h as Clock, I as Infinity } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
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
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const SELF_COLOR = "#0EA5A4";
function formatMealTiming(mealTimingStr, t) {
  if (!mealTimingStr || mealTimingStr === "none") return "";
  try {
    if (mealTimingStr.startsWith("{")) {
      const obj = JSON.parse(mealTimingStr);
      const parts = [];
      if (obj.morning && obj.morning !== "none") {
        parts.push(`${t("med.morning")}: ${t(`med.meal.${obj.morning}`)}`);
      }
      if (obj.afternoon && obj.afternoon !== "none") {
        parts.push(`${t("med.afternoon")}: ${t(`med.meal.${obj.afternoon}`)}`);
      }
      if (obj.night && obj.night !== "none") {
        parts.push(`${t("med.night")}: ${t(`med.meal.${obj.night}`)}`);
      }
      return parts.join(", ");
    }
  } catch (e) {
  }
  return t(`med.meal.${mealTimingStr}`, mealTimingStr);
}
function colorFor(med, members) {
  if (med.member_id) {
    const m = members.find((x) => x.id === med.member_id);
    if (m?.color) return m.color;
  }
  return med.pill_color ?? SELF_COLOR;
}
function Medicines() {
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();
  const search = useSearch({
    from: "/medicines"
  });
  const [meds, setMeds] = reactExports.useState([]);
  const [members, setMembers] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [prefillMember, setPrefillMember] = reactExports.useState(null);
  const load = async () => {
    if (!user) return;
    const [{
      data: m
    }, {
      data: fm
    }] = await Promise.all([supabase.from("medicines").select("*").eq("user_id", user.id).order("created_at", {
      ascending: false
    }), supabase.from("family_members").select("id,name,color,relation").eq("user_id", user.id).order("created_at")]);
    setMeds(m ?? []);
    setMembers(fm ?? []);
  };
  reactExports.useEffect(() => {
    load();
  }, [user]);
  reactExports.useEffect(() => {
    if (search.memberId) {
      setEditing(null);
      setPrefillMember(search.memberId);
      setOpen(true);
    }
  }, [search.memberId]);
  const remove = async (id) => {
    if (!confirm(t("med.deleteConfirm"))) return;
    const {
      error
    } = await supabase.from("medicines").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: t("med.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
        setEditing(null);
        setOpen(true);
      }, className: "gap-2 rounded-xl bg-[image:var(--gradient-primary)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        t("med.add")
      ] })
    ] }),
    meds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-8 rounded-2xl border-dashed p-16 text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { className: "mx-auto h-10 w-10 opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4", children: t("med.noneYet") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: meds.map((m) => {
      const col = colorFor(m, members);
      const owner = m.member_id ? members.find((x) => x.id === m.member_id) : null;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { layout: true, initial: {
        opacity: 0,
        y: 10
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "h-full rounded-2xl p-5 shadow-[var(--shadow-soft)] border", style: {
        backgroundColor: col + "12",
        borderColor: col + "33"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-xl", style: {
            background: col + "22",
            color: col
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: m.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm capitalize text-muted-foreground flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: m.medicine_type }),
              owner && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 font-medium", style: {
                background: col + "22",
                color: col
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full", style: {
                  background: col
                } }),
                owner.name
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => {
              setEditing(m);
              setOpen(true);
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => remove(m.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-1.5", children: [
          m.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "rounded-lg", children: t(`med.${tag}`, tag) }, tag)),
          m.meal_timing && m.meal_timing !== "none" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "rounded-lg", children: formatMealTiming(m.meal_timing, t) }),
          m.duration_days != null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "gap-1 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
            t("med.days", {
              count: m.duration_days
            })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "gap-1 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Infinity, { className: "h-3 w-3" }),
            t("med.lifetime")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1.5 text-xs text-muted-foreground", children: m.reminder_times.map((tm) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-lg bg-muted px-2 py-1 font-mono", children: tm }, tm)) })
      ] }) }, m.id);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MedicineDialog, { open, onOpenChange: (v) => {
      setOpen(v);
      if (!v) setPrefillMember(null);
    }, med: editing, members, prefillMember, onSaved: load })
  ] });
}
function MedicineDialog({
  open,
  onOpenChange,
  med,
  members,
  prefillMember,
  onSaved
}) {
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();
  const [name, setName] = reactExports.useState("");
  const [type, setType] = reactExports.useState("tablet");
  const [duration, setDuration] = reactExports.useState("");
  const [tags, setTags] = reactExports.useState([]);
  const [timeMap, setTimeMap] = reactExports.useState({});
  const [memberId, setMemberId] = reactExports.useState("self");
  const [mealTimingsObj, setMealTimingsObj] = reactExports.useState({});
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (med) {
      setName(med.name);
      setType(med.medicine_type ?? "tablet");
      setDuration(med.duration_days?.toString() ?? "");
      setTags(med.tags);
      const newMap = {};
      med.tags.forEach((tag, i) => {
        if (med.reminder_times[i]) newMap[tag] = med.reminder_times[i];
      });
      setTimeMap(newMap);
      setMemberId(med.member_id ?? "self");
      if (med.meal_timing) {
        if (med.meal_timing.startsWith("{")) {
          try {
            setMealTimingsObj(JSON.parse(med.meal_timing));
          } catch (e) {
            setMealTimingsObj({});
          }
        } else {
          const legacyVal = med.meal_timing;
          const initialMap = {};
          if (legacyVal.includes("breakfast")) initialMap.morning = legacyVal;
          else if (legacyVal.includes("lunch")) initialMap.afternoon = legacyVal;
          else if (legacyVal.includes("dinner")) initialMap.night = legacyVal;
          setMealTimingsObj(initialMap);
        }
      } else {
        setMealTimingsObj({});
      }
    } else {
      setName("");
      setType("tablet");
      setDuration("");
      setTags([]);
      setTimeMap({});
      setMemberId(prefillMember ?? "self");
      setMealTimingsObj({});
    }
  }, [med, open, prefillMember]);
  const toggleTag = (tag) => {
    setTags((cur) => {
      const active = cur.includes(tag);
      if (active) {
        const nextTimings = {
          ...mealTimingsObj
        };
        delete nextTimings[tag];
        setMealTimingsObj(nextTimings);
        return cur.filter((x) => x !== tag);
      } else {
        return [...cur, tag];
      }
    });
  };
  const save = async (e) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const reminder_times = tags.map((tg) => timeMap[tg]).filter(Boolean);
    const ownerColor = memberId === "self" ? SELF_COLOR : members.find((x) => x.id === memberId)?.color ?? SELF_COLOR;
    const activeMealTimings = {};
    tags.forEach((tg) => {
      if (mealTimingsObj[tg]) activeMealTimings[tg] = mealTimingsObj[tg];
    });
    const payload = {
      user_id: user.id,
      name,
      medicine_type: type,
      tags,
      reminder_times,
      pill_color: ownerColor,
      notes: null,
      duration_days: duration ? Number(duration) : null,
      member_id: memberId === "self" ? null : memberId,
      meal_timing: Object.keys(activeMealTimings).length > 0 ? JSON.stringify(activeMealTimings) : null
    };
    const {
      error
    } = med ? await supabase.from("medicines").update(payload).eq("id", med.id) : await supabase.from("medicines").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onOpenChange(false);
    onSaved();
  };
  const memberOptions = [{
    id: "self",
    name: t("med.self"),
    color: SELF_COLOR
  }, ...members.map((m) => ({
    id: m.id,
    name: m.name,
    color: m.color ?? SELF_COLOR
  }))];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: med ? t("med.edit") : t("med.add") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("med.name") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: name, onChange: (e) => setName(e.target.value), className: "mt-1.5 h-11 rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("med.forMember") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 flex flex-wrap gap-2", children: memberOptions.map((m) => {
          const active = memberId === m.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setMemberId(m.id), className: `flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${active ? "border-foreground" : "border-border hover:bg-muted/50"}`, style: active ? {
            background: m.color + "22"
          } : void 0, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full ring-2 ring-background", style: {
              background: m.color
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: m.name })
          ] }, m.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("med.type") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: type, onValueChange: setType, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5 h-11 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "tablet", children: "Tablet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "syrup", children: "Syrup" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "injection", children: "Injection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "capsule", children: "Capsule" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("med.duration") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 1, value: duration, onChange: (e) => setDuration(e.target.value), placeholder: t("med.durationLifetimePh"), className: "mt-1.5 h-11 rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: t("med.durationHint") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("med.times") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 grid gap-2 grid-cols-3", children: ["morning", "afternoon", "night"].map((tg) => {
          const active = tags.includes(tg);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border p-2 transition flex flex-col justify-between ${active ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center", onClick: () => toggleTag(tg), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-4 w-4 rounded-full border flex flex-shrink-0 items-center justify-center ${active ? "border-primary bg-primary text-primary-foreground" : "border-input"}`, children: active && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-current" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium cursor-pointer", children: t(`med.${tg}`) })
            ] }),
            active && /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "time", required: true, value: timeMap[tg] || "", onChange: (e) => setTimeMap((m) => ({
              ...m,
              [tg]: e.target.value
            })), className: "mt-2 h-8 w-full px-1 text-center text-xs rounded-md bg-background" })
          ] }, tg);
        }) })
      ] }),
      tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2 border-t pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold", children: t("med.mealTiming") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: tags.map((tg) => {
          const options = tg === "morning" ? [{
            val: "none",
            label: t("med.meal.none")
          }, {
            val: "before_breakfast",
            label: t("med.meal.before_breakfast")
          }, {
            val: "after_breakfast",
            label: t("med.meal.after_breakfast")
          }] : tg === "afternoon" ? [{
            val: "none",
            label: t("med.meal.none")
          }, {
            val: "before_lunch",
            label: t("med.meal.before_lunch")
          }, {
            val: "after_lunch",
            label: t("med.meal.after_lunch")
          }] : [{
            val: "none",
            label: t("med.meal.none")
          }, {
            val: "before_dinner",
            label: t("med.meal.before_dinner")
          }, {
            val: "after_dinner",
            label: t("med.meal.after_dinner")
          }];
          const currentVal = mealTimingsObj[tg] || "none";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-border/60 bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase text-muted-foreground", children: t(`med.${tg}`) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap", children: options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: currentVal === opt.val ? "default" : "outline", size: "sm", onClick: () => setMealTimingsObj((prev) => ({
              ...prev,
              [tg]: opt.val
            })), className: "h-8 rounded-lg text-xs font-medium px-2.5", children: opt.label }, opt.val)) })
          ] }, tg);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", className: "flex-1 rounded-xl", onClick: () => onOpenChange(false), children: t("med.cancel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "flex-1 rounded-xl bg-[image:var(--gradient-primary)]", children: busy ? "..." : t("med.save") })
      ] })
    ] })
  ] }) });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Medicines, {}) });
export {
  SplitComponent as component,
  formatMealTiming
};
