import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPassword });

function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success(t("auth.resetSent"));
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-md py-8">
        <Card className="rounded-2xl p-8 shadow-[var(--shadow-soft)]">
          <h1 className="text-2xl font-bold">{t("auth.forgotTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("auth.forgotSub")}</p>
          {sent ? (
            <div className="mt-6 rounded-xl bg-success/10 p-4 text-sm text-success-foreground">
              {t("auth.resetSent")}
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-12 rounded-xl" />
              </div>
              <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl bg-[image:var(--gradient-primary)] text-base font-semibold">
                {busy ? "..." : t("auth.sendReset")}
              </Button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/login" className="font-semibold text-primary">{t("auth.backToLogin")}</Link>
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
