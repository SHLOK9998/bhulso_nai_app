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
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) nav({ to: "/dashboard" }); }, [user, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else nav({ to: "/dashboard" });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-md py-8">
        <Card className="rounded-2xl p-8 shadow-[var(--shadow-soft)]">
          <h1 className="text-2xl font-bold">{t("auth.loginTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("auth.loginSub")}</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-12 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="pw">{t("auth.password")}</Label>
              <PasswordInput id="pw" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-12 rounded-xl" />
            </div>
            <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl bg-[image:var(--gradient-primary)] text-base font-semibold">
              {busy ? "..." : t("auth.submitLogin")}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            <Link to="/forgot-password" className="text-muted-foreground hover:text-primary">{t("auth.forgotLink")}</Link>
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {t("auth.noAccount")} <Link to="/signup" className="font-semibold text-primary">{t("nav.signup")}</Link>
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
