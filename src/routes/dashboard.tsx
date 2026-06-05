import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HealthScoreRing } from "@/components/HealthScoreRing";
import { Pill, Droplet, Moon, Sparkles, Plus, Notebook, Check, Bell, BellOff, Undo2, RefreshCw, Sun, Sunset, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { calculateHealthScore } from "@/lib/healthScore";
import { toast } from "sonner";
import { setLanguage } from "@/lib/i18n";
import { ensurePermission, scheduleAll, clearScheduled } from "@/lib/notifications";
import { saveSnapshot, loadSnapshot, isOnline } from "@/lib/offlineCache";
import { useServerFn } from "@tanstack/react-start";
import { getPersonalAdvice } from "@/lib/advice.functions";

export const Route = createFileRoute("/dashboard")({ component: () => <RequireAuth><Dashboard /></RequireAuth> });

type Med = { id: string; name: string; pill_color: string | null; reminder_times: string[]; tags: string[]; member_id: string | null; meal_timing: string | null };
type LogRow = { water_glasses: number; sleep_hours: number | null; mood: number | null };
type Member = { id: string; name: string; color: string | null };

const SELF_COLOR = "#0EA5A4";

function bucketOf(time: string): "morning" | "afternoon" | "evening" {
  const h = Number(time.split(":")[0] ?? 0);
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();
  const [meds, setMeds] = useState<Med[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [todayLog, setTodayLog] = useState<LogRow | null>(null);
  // (adherence is derived below from today's taken/expected slots)
  const [name, setName] = useState("");
  const [todayTaken, setTodayTaken] = useState<Record<string, boolean>>({});
  const [offline, setOffline] = useState<boolean>(!isOnline());
  const [alarmsOn, setAlarmsOn] = useState<boolean>(() => typeof window !== "undefined" ? localStorage.getItem("alarms-enabled") !== "false" : true);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(typeof Notification !== "undefined" ? Notification.permission : "denied");
  const [advice, setAdvice] = useState<string | null>(null);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const fetchAdvice = useServerFn(getPersonalAdvice);

  // online/offline listener
  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  useEffect(() => {
    if (!user) return;
    // Hydrate from local cache first for instant render (and offline support)
    const snap = loadSnapshot();
    if (snap) {
      setMeds((snap.meds as Med[]) ?? []);
      setMembers((snap.members as Member[]) ?? []);
      setTodayLog((snap.todayLog as LogRow) ?? null);
      setTodayTaken(snap.todayTaken ?? {});
    }
    if (!isOnline()) return;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [{ data: profile }, { data: medsData }, { data: logData }, { data: reminders }, { data: fm }] = await Promise.all([
        supabase.from("profiles").select("name,language,onboarded").eq("id", user.id).maybeSingle(),
        supabase.from("medicines").select("*").eq("user_id", user.id).eq("active", true),
        supabase.from("health_logs").select("water_glasses,sleep_hours,mood").eq("user_id", user.id).eq("log_date", today).maybeSingle(),
        supabase.from("reminders").select("medicine_id,scheduled_time,status").eq("user_id", user.id).eq("scheduled_date", today),
        supabase.from("family_members").select("id,name,color").eq("user_id", user.id),
      ]);
      if (profile && !profile.onboarded) { nav({ to: "/onboarding" }); return; }
      if (profile?.name) setName(profile.name);
      if (profile?.language && !localStorage.getItem("lang")) setLanguage(profile.language);
      const allMeds = (medsData ?? []) as Med[];
      setMeds(allMeds);
      setMembers((fm ?? []) as Member[]);
      setTodayLog(logData ?? null);
      const map: Record<string, boolean> = {};
      (reminders ?? []).forEach((r) => { map[`${r.medicine_id}|${r.scheduled_time}`] = r.status === "taken"; });
      setTodayTaken(map);

      saveSnapshot({ date: today, meds: allMeds, members: (fm ?? []) as Member[], todayLog: logData ?? null, todayTaken: map });

      if (alarmsOn && typeof Notification !== "undefined" && Notification.permission === "granted") {
        const items = allMeds.flatMap((m) => m.reminder_times.map((tm) => ({ id: m.id, name: m.name, time: tm, taken: map[`${m.id}|${tm}`] })))
          .filter((it) => !it.taken);
        scheduleAll(items);
      }
    })();
  }, [user, nav, alarmsOn]);

  const loadAdvice = useCallback(async () => {
    setAdviceLoading(true);
    try {
      const res = await fetchAdvice();
      setAdvice(res.advice ?? null);
    } catch { setAdvice(null); }
    finally { setAdviceLoading(false); }
  }, [fetchAdvice]);

  useEffect(() => { if (user) loadAdvice(); }, [user, loadAdvice]);

  const setTakenStatus = async (medId: string, time: string, taken: boolean) => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const key = `${medId}|${time}`;
    const nextMap = { ...todayTaken, [key]: taken };
    setTodayTaken(nextMap);
    // Update local cache immediately so offline reflects change
    saveSnapshot({ date: today, meds, members, todayLog, todayTaken: nextMap });
    if (!isOnline()) {
      toast.success(taken ? t("med.taken") : t("dashboard.undo"));
      return;
    }
    const { error } = await supabase.from("reminders").upsert(
      { user_id: user.id, medicine_id: medId, scheduled_date: today, scheduled_time: time, status: taken ? "taken" : "pending", taken_at: taken ? new Date().toISOString() : null },
      { onConflict: "medicine_id,scheduled_date,scheduled_time" }
    );
    if (error) {
      setTodayTaken((m) => ({ ...m, [key]: !taken }));
      return toast.error(error.message);
    }
    toast.success(taken ? t("med.taken") : t("dashboard.undo"));
  };

  const toggleAlarms = async () => {
    if (alarmsOn) {
      localStorage.setItem("alarms-enabled", "false");
      clearScheduled();
      setAlarmsOn(false);
      toast.success(t("dashboard.alarmsDisabled"));
      return;
    }
    const perm = await ensurePermission();
    setNotifPerm(perm);
    if (perm === "granted") {
      localStorage.setItem("alarms-enabled", "true");
      setAlarmsOn(true);
      const items = meds.flatMap((m) => m.reminder_times.map((tm) => ({ id: m.id, name: m.name, time: tm }))).filter((it) => !todayTaken[`${it.id}|${it.time}`]);
      scheduleAll(items);
      toast.success(t("dashboard.alarmsOn"));
    } else if (perm === "denied") {
      toast.error(t("dashboard.alarmsBlocked"));
    }
  };

  // Today-based adherence: takenSlots / expectedSlots. Null when no meds scheduled (full credit).
  const adherence = useMemo<number | null>(() => {
    const expected = meds.reduce((s, m) => s + m.reminder_times.length, 0);
    if (expected === 0) return null;
    const taken = meds.reduce((s, m) => s + m.reminder_times.filter((tm) => todayTaken[`${m.id}|${tm}`]).length, 0);
    return taken / expected;
  }, [meds, todayTaken]);

  const { score, parts } = useMemo(() => calculateHealthScore({
    adherenceRate: adherence,
    waterGlasses: todayLog?.water_glasses ?? 0,
    sleepHours: todayLog?.sleep_hours ?? 0,
    mood: todayLog?.mood ?? null,
    loggedToday: !!todayLog,
  }), [adherence, todayLog]);

  const colorFor = (med: Med) => {
    if (med.member_id) {
      const m = members.find((x) => x.id === med.member_id);
      if (m?.color) return m.color;
    }
    return med.pill_color ?? SELF_COLOR;
  };

  const todaysItems = meds.flatMap((m) => m.reminder_times.map((tm) => ({ med: m, time: tm })));
  todaysItems.sort((a, b) => a.time.localeCompare(b.time));
  const grouped: Record<"morning" | "afternoon" | "evening", typeof todaysItems> = { morning: [], afternoon: [], evening: [] };
  todaysItems.forEach((it) => grouped[bucketOf(it.time)].push(it));

  const bucketIcon = { morning: Sun, afternoon: Sun, evening: Sunset } as const;

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">{t("dashboard.greeting", { name: name || "👋" })}</h1>
          <p className="mt-1 text-muted-foreground">{new Date().toLocaleDateString(i18n.language === "hi" ? "hi-IN" : i18n.language === "gu" ? "gu-IN" : "en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {offline && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning-foreground">
              <span className="h-2 w-2 rounded-full bg-warning" /> {t("dashboard.offline")}
            </span>
          )}
          <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={toggleAlarms}>
            {alarmsOn && notifPerm === "granted" ? <><Bell className="h-4 w-4 text-primary" />{t("dashboard.alarmsOn")}</> : <><BellOff className="h-4 w-4" />{t("dashboard.alarmsOff")}</>}
          </Button>
        </div>
      </motion.div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <Card className="rounded-2xl p-6 shadow-[var(--shadow-soft)]">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t("dashboard.healthScore")}</h3>
          <div className="mt-4 grid place-items-center">
            <HealthScoreRing score={score} label="/ 100" />
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("dashboard.scoreBreakdown")}</div>
            {parts.map((p) => {
              const pct = Math.round((p.got / p.max) * 100);
              const isLow = pct < 70;
              return (
                <div key={p.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={isLow ? "text-muted-foreground" : "font-medium"}>{t(`dashboard.score.${p.key}`)}</span>
                    <span className={`tabular-nums ${isLow ? "text-destructive" : "text-success"}`}>{p.got}/{p.max}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${isLow ? "bg-destructive/60" : "bg-success/80"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
            <div className="rounded-xl bg-muted/60 p-3">
              <Droplet className="mx-auto h-4 w-4 text-secondary" />
              <div className="mt-1 font-semibold">{todayLog?.water_glasses ?? 0}/8</div>
              <div className="text-xs text-muted-foreground">{t("dashboard.water")}</div>
            </div>
            <div className="rounded-xl bg-muted/60 p-3">
              <Moon className="mx-auto h-4 w-4 text-secondary" />
              <div className="mt-1 font-semibold">{todayLog?.sleep_hours ?? 0}h</div>
              <div className="text-xs text-muted-foreground">{t("dashboard.sleep")}</div>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-6 shadow-[var(--shadow-soft)] lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("dashboard.todayTitle")}</h3>
            <Link to="/medicines"><Button size="sm" variant="ghost" className="gap-1 rounded-xl"><Plus className="h-4 w-4" />{t("dashboard.addMedicine")}</Button></Link>
          </div>
          {todaysItems.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {t("dashboard.noMeds")}
            </div>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {(["morning", "afternoon", "evening"] as const).map((bk) => {
                const Icon = bucketIcon[bk];
                const items = grouped[bk];
                return (
                  <div key={bk} className="rounded-xl border border-border/60 bg-muted/30 p-3">
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-muted-foreground">
                      <Icon className="h-4 w-4" />{t(`dashboard.bucket.${bk}`)}
                    </div>
                    {items.length === 0 ? (
                      <p className="text-xs text-muted-foreground/70 py-2">{t("dashboard.bucketEmpty")}</p>
                    ) : (
                      <ul className="space-y-2">
                        {items.map(({ med, time }) => {
                          const taken = todayTaken[`${med.id}|${time}`];
                          const col = colorFor(med);
                          const owner = med.member_id ? members.find((x) => x.id === med.member_id) : null;
                          return (
                            <li key={`${med.id}-${time}`} className="rounded-lg bg-card p-2.5 border border-border/40">
                              <div className="flex items-start gap-2">
                                <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg" style={{ background: col + "22", color: col }}>
                                  <Pill className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">{med.name}</div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                                    <span className="font-mono">{time}</span>
                                    {owner && (
                                      <span className="inline-flex items-center gap-0.5" style={{ color: col }}>
                                        <User className="h-3 w-3" />{owner.name}
                                      </span>
                                    )}
                                  </div>
                                  {med.meal_timing && med.meal_timing !== "none" && (
                                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground/80 mt-0.5">{t(`med.meal.${med.meal_timing}`)}</div>
                                  )}
                                </div>
                              </div>
                              <div className="mt-2">
                                {taken ? (
                                  <Button size="sm" variant="outline" className="w-full gap-1 h-8 rounded-lg text-xs" onClick={() => setTakenStatus(med.id, time, false)}>
                                    <Undo2 className="h-3 w-3" />{t("dashboard.undo")}
                                  </Button>
                                ) : (
                                  <Button size="sm" className="w-full gap-1 h-8 rounded-lg text-xs bg-[image:var(--gradient-primary)]" onClick={() => setTakenStatus(med.id, time, true)}>
                                    <Check className="h-3 w-3" />{t("med.taken")}
                                  </Button>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6 rounded-2xl p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold"><Sparkles className="h-5 w-5 text-primary" />{t("dashboard.insightsTitle")}</h3>
          <Button size="icon" variant="ghost" onClick={loadAdvice} disabled={adviceLoading} aria-label={t("dashboard.insightsRefresh")}>
            <RefreshCw className={`h-4 w-4 ${adviceLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {adviceLoading ? t("dashboard.insightsLoading") : (advice ?? t("dashboard.insightsEmpty"))}
        </div>
      </Card>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <Link to="/medicines"><Card className="group flex h-full cursor-pointer items-center gap-4 rounded-2xl p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><Pill className="h-6 w-6" /></div>
          <div><div className="font-semibold">{t("dashboard.addMedicine")}</div><div className="text-xs text-muted-foreground">{t("med.title")}</div></div>
        </Card></Link>
        <Link to="/log"><Card className="group flex h-full cursor-pointer items-center gap-4 rounded-2xl p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary/10 text-secondary"><Notebook className="h-6 w-6" /></div>
          <div><div className="font-semibold">{t("dashboard.logHealth")}</div><div className="text-xs text-muted-foreground">{t("log.title")}</div></div>
        </Card></Link>
        <Link to="/symptoms"><Card className="group flex h-full cursor-pointer items-center gap-4 rounded-2xl p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground"><Sparkles className="h-6 w-6" /></div>
          <div><div className="font-semibold">{t("dashboard.askAi")}</div><div className="text-xs text-muted-foreground">{t("symptoms.title")}</div></div>
        </Card></Link>
      </div>
    </AppShell>
  );
}
