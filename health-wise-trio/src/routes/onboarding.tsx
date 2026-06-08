import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({ component: () => <RequireAuth><Onboarding /></RequireAuth> });

const GOALS = ["fitness", "weight", "chronic", "sleep", "stress"] as const;

function Onboarding() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("other");
  const [conditions, setConditions] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [wake, setWake] = useState("07:00");
  const [sleep, setSleep] = useState("23:00");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("onboarded").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data?.onboarded) nav({ to: "/dashboard" });
    });
  }, [user, nav]);

  const toggleGoal = (g: string) => setGoals((cur) => cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]);

  const finish = async (skip = false) => {
    if (!user) return;
    setBusy(true);
    const base = { onboarded: true, updated_at: new Date().toISOString() };
    const payload = skip ? base : {
      ...base,
      age: age ? Number(age) : null,
      gender,
      conditions: conditions.split(",").map((s) => s.trim()).filter(Boolean),
      goals,
      wake_time: wake,
      sleep_time: sleep,
    };
    const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    nav({ to: "/dashboard" });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">{t("onboarding.title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("onboarding.sub")}</p>
        <Card className="mt-6 rounded-2xl p-6 shadow-[var(--shadow-soft)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t("onboarding.age")}</Label>
              <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div>
              <Label>{t("onboarding.gender")}</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t("onboarding.male")}</SelectItem>
                  <SelectItem value="female">{t("onboarding.female")}</SelectItem>
                  <SelectItem value="other">{t("onboarding.other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>{t("onboarding.conditions")}</Label>
              <Input value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder={t("onboarding.conditionsPh")} className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <Label>{t("onboarding.goals")}</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {GOALS.map((g) => (
                  <button key={g} type="button" onClick={() => toggleGoal(g)}
                    className={`rounded-xl border px-4 py-2 text-sm transition ${goals.includes(g) ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}>
                    {t(`onboarding.goalsList.${g}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>{t("onboarding.wake")}</Label>
              <Input type="time" value={wake} onChange={(e) => setWake(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div>
              <Label>{t("onboarding.sleep")}</Label>
              <Input type="time" value={sleep} onChange={(e) => setSleep(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <Button variant="outline" className="rounded-xl" disabled={busy} onClick={() => finish(true)}>{t("onboarding.skip")}</Button>
            <Button className="flex-1 rounded-xl bg-[image:var(--gradient-primary)]" disabled={busy} onClick={() => finish(false)}>
              {busy ? "..." : t("onboarding.finish")}
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
