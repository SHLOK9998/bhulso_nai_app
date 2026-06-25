import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-CRJ153-x.mjs";
import { u as useAuth, s as setLanguage } from "./router-D98PLsb2.mjs";
import { A as AppShell, C as Card, B as Button } from "./card-Mow16zMX.mjs";
import { L as Label, I as Input } from "./label-DNU6CMww.mjs";
import { P as PasswordInput } from "./PasswordInput-DKQQIL4U.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-T9q0yX0h.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/use-sync-external-store.mjs";
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
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
function Signup() {
  const {
    t,
    i18n
  } = useTranslation();
  const {
    user
  } = useAuth();
  const nav = useNavigate();
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [language, setLang] = reactExports.useState(i18n.language || "en");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (user) nav({
      to: "/onboarding"
    });
  }, [user, nav]);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const redirectTo = typeof window !== "undefined" ? window.location.origin : void 0;
    const {
      error
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          language
        },
        emailRedirectTo: redirectTo
      }
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setLanguage(language);
    toast.success("Account created!");
    nav({
      to: "/onboarding"
    });
  };
  const handleLangChange = (code) => {
    setLang(code);
    setLanguage(code);
    setTimeout(() => window.dispatchEvent(new Event("languagechange")), 0);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-8 shadow-[var(--shadow-soft)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: t("auth.signupTitle") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: t("auth.signupSub") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-4 justify-start", children: [{
      code: "en",
      label: "English"
    }, {
      code: "hi",
      label: "हिंदी"
    }, {
      code: "gu",
      label: "ગુજરાતી"
    }].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: language === l.code ? "default" : "outline", onClick: () => handleLangChange(l.code), className: "h-8 rounded-full text-xs font-semibold px-3", children: l.label }, l.code)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: t("auth.name") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", required: true, value: name, onChange: (e) => setName(e.target.value), className: "mt-1.5 h-12 rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: t("auth.email") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1.5 h-12 rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pw", children: t("auth.password") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { id: "pw", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), className: "mt-1.5 h-12 rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("auth.language") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: language, onValueChange: handleLangChange, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5 h-12 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "en", children: "English" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "hi", children: "हिंदी" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "gu", children: "ગુજરાતી" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "h-12 w-full rounded-xl bg-[image:var(--gradient-primary)] text-base font-semibold", children: busy ? "..." : t("auth.submitSignup") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
      t("auth.haveAccount"),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "font-semibold text-primary", children: t("nav.login") })
    ] })
  ] }) }) });
}
export {
  Signup as component
};
