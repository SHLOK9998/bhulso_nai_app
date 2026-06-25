import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-D98PLsb2.mjs";
import { A as AppShell, B as Button, C as Card } from "./card-Mow16zMX.mjs";
import "../_libs/sonner.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { H as Heart, a as ArrowRight, p as Pill, t as Sparkles, l as Leaf, A as Activity, L as Languages, s as ShieldCheck } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-CRJ153-x.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
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
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function Landing() {
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();
  const nav = useNavigate();
  reactExports.useEffect(() => {
    if (user) nav({
      to: "/dashboard"
    });
  }, [user, nav]);
  const features = [{
    k: "med",
    icon: Pill
  }, {
    k: "ai",
    icon: Sparkles
  }, {
    k: "ayur",
    icon: Leaf
  }, {
    k: "score",
    icon: Activity
  }, {
    k: "tri",
    icon: Languages
  }, {
    k: "private",
    icon: ShieldCheck
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] px-6 py-16 text-white md:px-16 md:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.6
      }, className: "relative max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-3 w-3", fill: "currentColor" }),
          " ",
          t("landing.heroBadge")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-5 text-4xl font-extrabold leading-tight md:text-6xl", children: t("app.name") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-lg text-white/90 md:text-xl", children: t("app.tagline") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "h-12 rounded-2xl bg-white px-6 text-base font-semibold text-primary hover:bg-white/95", children: [
            t("landing.ctaPrimary"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#features", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "ghost", className: "h-12 rounded-2xl border border-white/30 px-6 text-base text-white hover:bg-white/10", children: t("landing.ctaSecondary") }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "features", className: "mt-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-center text-3xl font-bold md:text-4xl", children: t("landing.featuresTitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3", children: features.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, transition: {
        delay: i * 0.05
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group h-full rounded-2xl border-border/60 p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 text-lg font-semibold", children: t(`landing.features.${f.k}.title`) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: t(`landing.features.${f.k}.desc`) })
      ] }) }, f.k)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-center text-3xl font-bold md:text-4xl", children: t("landing.guideTitle", "How to Use HealthMate AI") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-8 md:grid-cols-3", children: [{
        step: "1",
        title: t("landing.guideStep1Title", "Sign Up & Profile"),
        desc: t("landing.guideStep1Desc", "Create an account and set up your health profile, language, and goals.")
      }, {
        step: "2",
        title: t("landing.guideStep2Title", "Add Medicines & Reminders"),
        desc: t("landing.guideStep2Desc", "Log your medicines and set up daily reminders to stay on track.")
      }, {
        step: "3",
        title: t("landing.guideStep3Title", "Track & Get AI Insights"),
        desc: t("landing.guideStep3Desc", "Log your daily vitals and get personalized AI advice and Ayurvedic tips.")
      }].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative p-8 rounded-3xl border-border/60 shadow-[var(--shadow-soft)] text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-lg", children: g.step }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-6 text-xl font-semibold", children: g.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: g.desc })
      ] }, g.step)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-16 rounded-3xl bg-card p-10 text-center shadow-[var(--shadow-soft)] md:p-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold md:text-4xl", children: t("app.tagline") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "mt-8 inline-block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "h-12 rounded-2xl bg-[image:var(--gradient-primary)] px-8 text-base font-semibold shadow-[var(--shadow-glow)]", children: t("landing.ctaPrimary") }) })
    ] })
  ] });
}
export {
  Landing as component
};
