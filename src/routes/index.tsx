import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Pill, Sparkles, Leaf, Activity, Languages, ShieldCheck, ArrowRight, Heart } from "lucide-react";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (user) nav({ to: "/dashboard" }); }, [user, nav]);

  const features = [
    { k: "med", icon: Pill }, { k: "ai", icon: Sparkles }, { k: "ayur", icon: Leaf },
    { k: "score", icon: Activity }, { k: "tri", icon: Languages }, { k: "private", icon: ShieldCheck },
  ];

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] px-6 py-16 text-white md:px-16 md:py-24">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Heart className="h-3 w-3" fill="currentColor" /> {t("landing.heroBadge")}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">{t("app.name")}</h1>
          <p className="mt-4 text-lg text-white/90 md:text-xl">{t("app.tagline")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup">
              <Button size="lg" className="h-12 rounded-2xl bg-white px-6 text-base font-semibold text-primary hover:bg-white/95">
                {t("landing.ctaPrimary")} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="ghost" className="h-12 rounded-2xl border border-white/30 px-6 text-base text-white hover:bg-white/10">
                {t("landing.ctaSecondary")}
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="mt-16">
        <h2 className="text-center text-3xl font-bold md:text-4xl">{t("landing.featuresTitle")}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div key={f.k} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Card className="group h-full rounded-2xl border-border/60 p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{t(`landing.features.${f.k}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`landing.features.${f.k}.desc`)}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Guide */}
      <section className="mt-20">
        <h2 className="text-center text-3xl font-bold md:text-4xl">{t("landing.guideTitle", "How to Use HealthMate AI")}</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            { step: "1", title: t("landing.guideStep1Title", "Sign Up & Profile"), desc: t("landing.guideStep1Desc", "Create an account and set up your health profile, language, and goals.") },
            { step: "2", title: t("landing.guideStep2Title", "Add Medicines & Reminders"), desc: t("landing.guideStep2Desc", "Log your medicines and set up daily reminders to stay on track.") },
            { step: "3", title: t("landing.guideStep3Title", "Track & Get AI Insights"), desc: t("landing.guideStep3Desc", "Log your daily vitals and get personalized AI advice and Ayurvedic tips.") }
          ].map((g) => (
            <Card key={g.step} className="relative p-8 rounded-3xl border-border/60 shadow-[var(--shadow-soft)] text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-lg">
                {g.step}
              </div>
              <h3 className="mt-6 text-xl font-semibold">{g.title}</h3>
              <p className="mt-3 text-muted-foreground">{g.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-3xl bg-card p-10 text-center shadow-[var(--shadow-soft)] md:p-16">
        <h2 className="text-3xl font-bold md:text-4xl">{t("app.tagline")}</h2>
        <Link to="/signup" className="mt-8 inline-block">
          <Button size="lg" className="h-12 rounded-2xl bg-[image:var(--gradient-primary)] px-8 text-base font-semibold shadow-[var(--shadow-glow)]">
            {t("landing.ctaPrimary")}
          </Button>
        </Link>
      </section>
    </AppShell>
  );
}
