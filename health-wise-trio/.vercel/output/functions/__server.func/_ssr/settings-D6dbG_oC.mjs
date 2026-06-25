import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell, C as Card, B as Button, c as cn } from "./card-Mow16zMX.mjs";
import { R as RequireAuth } from "./RequireAuth-D1Lajl0o.mjs";
import { L as Label, I as Input } from "./label-DNU6CMww.mjs";
import { R as Root, T as Thumb } from "../_libs/radix-ui__react-switch.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-T9q0yX0h.mjs";
import { s as supabase } from "./client-CRJ153-x.mjs";
import { u as useAuth, s as setLanguage } from "./router-D98PLsb2.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as ensurePermission, p as playChime } from "./notifications-oawvSogp.mjs";
import { P as PasswordInput } from "./PasswordInput-DKQQIL4U.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { B as Bell, b as BellOff, K as KeyRound, m as LogOut } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
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
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Thumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Root.displayName;
const PREFS_KEY = "notif-prefs";
function loadPrefs() {
  try {
    return {
      sound: true,
      leadMinutes: 0,
      ...JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}")
    };
  } catch {
    return {
      sound: true,
      leadMinutes: 0
    };
  }
}
function Settings() {
  const {
    t,
    i18n
  } = useTranslation();
  const {
    user
  } = useAuth();
  const nav = useNavigate();
  const [name, setName] = reactExports.useState("");
  const [language, setLang] = reactExports.useState(i18n.language || "en");
  const [busy, setBusy] = reactExports.useState(false);
  const [perm, setPerm] = reactExports.useState(typeof Notification !== "undefined" ? Notification.permission : "denied");
  const [prefs, setPrefs] = reactExports.useState(loadPrefs);
  const [newPw, setNewPw] = reactExports.useState("");
  const [confirmPw, setConfirmPw] = reactExports.useState("");
  const [pwBusy, setPwBusy] = reactExports.useState(false);
  const updatePassword = async () => {
    if (newPw.length < 6) return toast.error(t("auth.passwordTooShort"));
    if (newPw !== confirmPw) return toast.error(t("auth.passwordMismatch"));
    setPwBusy(true);
    const {
      error
    } = await supabase.auth.updateUser({
      password: newPw
    });
    setPwBusy(false);
    if (error) return toast.error(error.message);
    setNewPw("");
    setConfirmPw("");
    toast.success(t("auth.passwordUpdated"));
  };
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("name,language").eq("id", user.id).maybeSingle().then(({
      data
    }) => {
      if (data?.name) setName(data.name);
      if (data?.language) setLang(data.language);
    });
  }, [user]);
  const save = async () => {
    if (!user) return;
    setBusy(true);
    const {
      error
    } = await supabase.from("profiles").update({
      name,
      language,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    setLanguage(language);
    toast.success(t("settings.saved"));
  };
  const savePrefs = (next) => {
    setPrefs(next);
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    toast.success(t("notifications.saved"));
  };
  const request = async () => {
    const p = await ensurePermission();
    setPerm(p);
    if (p === "granted") toast.success(t("notifications.enabled"));
    else if (p === "denied") toast.error(t("notifications.blocked"));
  };
  const test = () => {
    if (perm !== "granted") return toast.error(t("notifications.blocked"));
    try {
      new Notification("HealthMate AI", {
        body: "✓ " + t("notifications.test"),
        icon: "/favicon.ico"
      });
    } catch {
    }
    if (prefs.sound) playChime();
  };
  const logout = async () => {
    await supabase.auth.signOut();
    nav({
      to: "/"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: t("settings.title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-8 rounded-2xl p-6 shadow-[var(--shadow-soft)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: t("settings.profile") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("auth.email") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: user?.email ?? "", disabled: true, readOnly: true, className: "mt-1.5 h-11 rounded-xl bg-muted/40 cursor-not-allowed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: t("settings.emailReadonly") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("auth.name") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: name, onChange: (e) => setName(e.target.value), className: "mt-1.5 h-11 rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("settings.language") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: language, onValueChange: setLang, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5 h-11 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "en", children: "English" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "hi", children: "हिंदी" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "gu", children: "ગુજરાતી" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, disabled: busy, className: "rounded-xl bg-[image:var(--gradient-primary)]", children: busy ? "..." : t("settings.save") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6 rounded-2xl p-6 shadow-[var(--shadow-soft)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: t("notifications.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: t("notifications.sub") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center justify-between gap-3 rounded-xl border border-border/60 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          perm === "granted" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-5 w-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: t("notifications.enable") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: perm === "granted" ? t("notifications.enabled") : perm === "denied" ? t("notifications.blocked") : "" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: request, disabled: perm === "granted", size: "sm", className: "rounded-xl bg-[image:var(--gradient-primary)]", children: t("notifications.permRequest") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sound", children: t("notifications.sound") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { id: "sound", checked: prefs.sound, onCheckedChange: (v) => savePrefs({
            ...prefs,
            sound: v
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "lead", children: t("notifications.lead") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "lead", type: "number", min: 0, max: 60, value: prefs.leadMinutes, onChange: (e) => savePrefs({
            ...prefs,
            leadMinutes: Number(e.target.value) || 0
          }), className: "mt-1.5 h-11 w-32 rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: test, className: "rounded-xl", children: t("notifications.test") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6 rounded-2xl p-6 shadow-[var(--shadow-soft)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 text-lg font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-5 w-5 text-primary" }),
        t("auth.updatePassword")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: t("auth.updatePasswordSub") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "np", children: t("auth.newPassword") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { id: "np", value: newPw, onChange: (e) => setNewPw(e.target.value), className: "mt-1.5 h-11 rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cp", children: t("auth.confirmPassword") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { id: "cp", value: confirmPw, onChange: (e) => setConfirmPw(e.target.value), className: "mt-1.5 h-11 rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: updatePassword, disabled: pwBusy || !newPw, className: "rounded-xl bg-[image:var(--gradient-primary)]", children: pwBusy ? "..." : t("auth.updatePassword") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mt-6 rounded-2xl p-6 shadow-[var(--shadow-soft)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: logout, className: "gap-2 rounded-xl text-destructive", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
      " ",
      t("settings.logout")
    ] }) })
  ] }) });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, {}) });
export {
  SplitComponent as component
};
