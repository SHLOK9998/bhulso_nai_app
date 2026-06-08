import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/PasswordInput";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({ component: ResetPassword });

function ResetPassword() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  // Supabase recovery links land here with the access token in the URL hash.
  // detectSessionInUrl in the client picks it up automatically; we just wait for the session.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error(t("auth.passwordTooShort"));
    if (password !== confirm) return toast.error(t("auth.passwordMismatch"));
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(t("auth.passwordUpdated"));
    nav({ to: "/dashboard" });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-md py-8">
        <Card className="rounded-2xl p-8 shadow-[var(--shadow-soft)]">
          <h1 className="text-2xl font-bold">{t("auth.resetTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ready ? t("auth.resetSub") : t("auth.resetWaiting")}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="pw">{t("auth.newPassword")}</Label>
              <PasswordInput id="pw" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-12 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="pw2">{t("auth.confirmPassword")}</Label>
              <PasswordInput id="pw2" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1.5 h-12 rounded-xl" />
            </div>
            <Button type="submit" disabled={busy || !ready} className="h-12 w-full rounded-xl bg-[image:var(--gradient-primary)] text-base font-semibold">
              {busy ? "..." : t("auth.updatePassword")}
            </Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
