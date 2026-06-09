import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PasswordInput } from "@/components/PasswordInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { setLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLang] = useState(i18n.language || "en");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) nav({ to: "/onboarding" }); }, [user, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name, language }, emailRedirectTo: redirectTo },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setLanguage(language);
    toast.success("Account created!");
    nav({ to: "/onboarding" });
  };

  const handleLangChange = (code: string) => {
    setLang(code);
    setLanguage(code);
    setTimeout(() => window.dispatchEvent(new Event("languagechange")), 0);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-md py-8">
        <Card className="rounded-2xl p-8 shadow-[var(--shadow-soft)]">
          <h1 className="text-2xl font-bold">{t("auth.signupTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("auth.signupSub")}</p>

          <div className="flex gap-2 mt-4 justify-start">
            {[{ code: "en", label: "English" }, { code: "hi", label: "हिंदी" }, { code: "gu", label: "ગુજરાતી" }].map((l) => (
              <Button
                key={l.code}
                type="button"
                variant={language === l.code ? "default" : "outline"}
                onClick={() => handleLangChange(l.code)}
                className="h-8 rounded-full text-xs font-semibold px-3"
              >
                {l.label}
              </Button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">{t("auth.name")}</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 h-12 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-12 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="pw">{t("auth.password")}</Label>
              <PasswordInput id="pw" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-12 rounded-xl" />
            </div>
            <div>
              <Label>{t("auth.language")}</Label>
              <Select value={language} onValueChange={handleLangChange}>
                <SelectTrigger className="mt-1.5 h-12 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="gu">ગુજરાતી</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl bg-[image:var(--gradient-primary)] text-base font-semibold">
              {busy ? "..." : t("auth.submitSignup")}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.haveAccount")} <Link to="/login" className="font-semibold text-primary">{t("nav.login")}</Link>
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
