import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell, C as Card, B as Button } from "./card-Mow16zMX.mjs";
import { R as RequireAuth } from "./RequireAuth-D1Lajl0o.mjs";
import { L as Label, I as Input } from "./label-DNU6CMww.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-T9q0yX0h.mjs";
import { s as supabase } from "./client-CRJ153-x.mjs";
import { u as useAuth } from "./router-D98PLsb2.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-label.mjs";
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
const GOALS = ["fitness", "weight", "chronic", "sleep", "stress"];
function Onboarding() {
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();
  const nav = useNavigate();
  const [age, setAge] = reactExports.useState("");
  const [gender, setGender] = reactExports.useState("other");
  const [conditions, setConditions] = reactExports.useState("");
  const [goals, setGoals] = reactExports.useState([]);
  const [wake, setWake] = reactExports.useState("07:00");
  const [sleep, setSleep] = reactExports.useState("23:00");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("onboarded").eq("id", user.id).maybeSingle().then(({
      data
    }) => {
      if (data?.onboarded) nav({
        to: "/dashboard"
      });
    });
  }, [user, nav]);
  const toggleGoal = (g) => setGoals((cur) => cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]);
  const finish = async (skip = false) => {
    if (!user) return;
    setBusy(true);
    const base = {
      onboarded: true,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const payload = skip ? base : {
      ...base,
      age: age ? Number(age) : null,
      gender,
      conditions: conditions.split(",").map((s) => s.trim()).filter(Boolean),
      goals,
      wake_time: wake,
      sleep_time: sleep
    };
    const {
      error
    } = await supabase.from("profiles").update(payload).eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    nav({
      to: "/dashboard"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: t("onboarding.title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: t("onboarding.sub") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6 rounded-2xl p-6 shadow-[var(--shadow-soft)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("onboarding.age") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: age, onChange: (e) => setAge(e.target.value), className: "mt-1.5 h-11 rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("onboarding.gender") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: gender, onValueChange: setGender, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5 h-11 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "male", children: t("onboarding.male") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "female", children: t("onboarding.female") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "other", children: t("onboarding.other") })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("onboarding.conditions") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: conditions, onChange: (e) => setConditions(e.target.value), placeholder: t("onboarding.conditionsPh"), className: "mt-1.5 h-11 rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("onboarding.goals") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: GOALS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => toggleGoal(g), className: `rounded-xl border px-4 py-2 text-sm transition ${goals.includes(g) ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`, children: t(`onboarding.goalsList.${g}`) }, g)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("onboarding.wake") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "time", value: wake, onChange: (e) => setWake(e.target.value), className: "mt-1.5 h-11 rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("onboarding.sleep") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "time", value: sleep, onChange: (e) => setSleep(e.target.value), className: "mt-1.5 h-11 rounded-xl" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "rounded-xl", disabled: busy, onClick: () => finish(true), children: t("onboarding.skip") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1 rounded-xl bg-[image:var(--gradient-primary)]", disabled: busy, onClick: () => finish(false), children: busy ? "..." : t("onboarding.finish") })
      ] })
    ] })
  ] }) });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Onboarding, {}) });
export {
  SplitComponent as component
};
