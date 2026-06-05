import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { setLanguage } from "@/lib/i18n";
import { LogOut, Bell, BellOff, KeyRound } from "lucide-react";
import { ensurePermission, playChime } from "@/lib/notifications";
import { PasswordInput } from "@/components/PasswordInput";

export const Route = createFileRoute("/settings")({ component: () => <RequireAuth><Settings /></RequireAuth> });

type Prefs = { sound: boolean; leadMinutes: number };
const PREFS_KEY = "notif-prefs";
function loadPrefs(): Prefs {
  try { return { sound: true, leadMinutes: 0, ...JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}") }; }
  catch { return { sound: true, leadMinutes: 0 }; }
}

function Settings() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [language, setLang] = useState(i18n.language || "en");
  const [busy, setBusy] = useState(false);

  const [perm, setPerm] = useState<NotificationPermission>(typeof Notification !== "undefined" ? Notification.permission : "denied");
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  const updatePassword = async () => {
    if (newPw.length < 6) return toast.error(t("auth.passwordTooShort"));
    if (newPw !== confirmPw) return toast.error(t("auth.passwordMismatch"));
    setPwBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwBusy(false);
    if (error) return toast.error(error.message);
    setNewPw(""); setConfirmPw("");
    toast.success(t("auth.passwordUpdated"));
  };

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("name,language").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data?.name) setName(data.name);
      if (data?.language) setLang(data.language);
    });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update({ name, language, updated_at: new Date().toISOString() }).eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    setLanguage(language);
    toast.success(t("settings.saved"));
  };

  const savePrefs = (next: Prefs) => {
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
    try { new Notification("HealthMate AI", { body: "✓ " + t("notifications.test"), icon: "/favicon.ico" }); } catch {}
    if (prefs.sound) playChime();
  };

  const logout = async () => { await supabase.auth.signOut(); nav({ to: "/" }); };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">{t("settings.title")}</h1>

        <Card className="mt-8 rounded-2xl p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold">{t("settings.profile")}</h2>
          <div className="mt-5 space-y-4">
            <div>
              <Label>{t("auth.email")}</Label>
              <Input value={user?.email ?? ""} disabled readOnly className="mt-1.5 h-11 rounded-xl bg-muted/40 cursor-not-allowed" />
              <p className="mt-1 text-xs text-muted-foreground">{t("settings.emailReadonly")}</p>
            </div>
            <div>
              <Label>{t("auth.name")}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div>
              <Label>{t("settings.language")}</Label>
              <Select value={language} onValueChange={setLang}>
                <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="gu">ગુજરાતી</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={save} disabled={busy} className="rounded-xl bg-[image:var(--gradient-primary)]">{busy ? "..." : t("settings.save")}</Button>
          </div>
        </Card>

        <Card className="mt-6 rounded-2xl p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold">{t("notifications.title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("notifications.sub")}</p>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-3">
              {perm === "granted" ? <Bell className="h-5 w-5 text-primary" /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
              <div>
                <div className="text-sm font-semibold">{t("notifications.enable")}</div>
                <div className="text-xs text-muted-foreground">
                  {perm === "granted" ? t("notifications.enabled") : perm === "denied" ? t("notifications.blocked") : ""}
                </div>
              </div>
            </div>
            <Button onClick={request} disabled={perm === "granted"} size="sm" className="rounded-xl bg-[image:var(--gradient-primary)]">
              {t("notifications.permRequest")}
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound">{t("notifications.sound")}</Label>
              <Switch id="sound" checked={prefs.sound} onCheckedChange={(v) => savePrefs({ ...prefs, sound: v })} />
            </div>
            <div>
              <Label htmlFor="lead">{t("notifications.lead")}</Label>
              <Input id="lead" type="number" min={0} max={60} value={prefs.leadMinutes}
                onChange={(e) => savePrefs({ ...prefs, leadMinutes: Number(e.target.value) || 0 })}
                className="mt-1.5 h-11 w-32 rounded-xl" />
            </div>
            <Button variant="outline" onClick={test} className="rounded-xl">{t("notifications.test")}</Button>
          </div>
        </Card>

        <Card className="mt-6 rounded-2xl p-6 shadow-[var(--shadow-soft)]">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><KeyRound className="h-5 w-5 text-primary" />{t("auth.updatePassword")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("auth.updatePasswordSub")}</p>
          <div className="mt-5 space-y-4">
            <div>
              <Label htmlFor="np">{t("auth.newPassword")}</Label>
              <PasswordInput id="np" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="cp">{t("auth.confirmPassword")}</Label>
              <PasswordInput id="cp" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
            </div>
            <Button onClick={updatePassword} disabled={pwBusy || !newPw} className="rounded-xl bg-[image:var(--gradient-primary)]">
              {pwBusy ? "..." : t("auth.updatePassword")}
            </Button>
          </div>
        </Card>

        <Card className="mt-6 rounded-2xl p-6 shadow-[var(--shadow-soft)]">
          <Button variant="outline" onClick={logout} className="gap-2 rounded-xl text-destructive">
            <LogOut className="h-4 w-4" /> {t("settings.logout")}
          </Button>
        </Card>
      </div>
    </AppShell>
  );
}
