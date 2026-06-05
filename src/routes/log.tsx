import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplet, Minus, Plus, Download, CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import jsPDF from "jspdf";

export const Route = createFileRoute("/log")({ component: () => <RequireAuth><LogPage /></RequireAuth> });

const MOODS = [
  { v: 1, e: "😔" }, { v: 2, e: "😕" }, { v: 3, e: "😐" }, { v: 4, e: "🙂" }, { v: 5, e: "😄" },
];

type Log = { log_date: string; mood: number | null; sleep_hours: number | null; water_glasses: number; symptoms: string[] };

function monthBounds(month: string) {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 0));
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

function LogPage() {
  const { t } = useTranslation();
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">{t("log.title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("log.today")} · {new Date().toLocaleDateString()}</p>
      <Tabs defaultValue="today" className="mt-6">
        <TabsList className="rounded-xl">
          <TabsTrigger value="today" className="rounded-lg">{t("log.tabToday")}</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg">{t("log.tabHistory")}</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-4"><TodayTab /></TabsContent>
        <TabsContent value="history" className="mt-4"><HistoryTab /></TabsContent>
      </Tabs>
    </AppShell>
  );
}

function TodayTab() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [mood, setMood] = useState<number | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState([7]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase.from("health_logs").select("*").eq("user_id", user.id).eq("log_date", today).maybeSingle();
      if (data) {
        setMood(data.mood);
        setSymptoms((data.symptoms ?? []).join(", "));
        setWater(data.water_glasses);
        setSleep([data.sleep_hours ?? 7]);
      }
    })();
  }, [user]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const today = new Date().toISOString().slice(0, 10);
    const sym = symptoms.split(",").map((s) => s.trim()).filter(Boolean);
    const { error } = await supabase.from("health_logs").upsert(
      { user_id: user.id, log_date: today, mood, symptoms: sym, water_glasses: water, sleep_hours: sleep[0] },
      { onConflict: "user_id,log_date" }
    );
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(t("log.saved"));
  };

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="rounded-2xl p-6 shadow-[var(--shadow-soft)]">
          <Label className="text-base">{t("log.mood")}</Label>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {MOODS.map((m) => (
              <button key={m.v} onClick={() => setMood(m.v)}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition ${mood === m.v ? "border-primary bg-primary/10" : "border-border hover:bg-muted"}`}>
                <span className="text-3xl">{m.e}</span>
                <span className="text-xs text-muted-foreground">{t(`log.moods.${m.v}`)}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl p-6 shadow-[var(--shadow-soft)]">
          <Label className="text-base">{t("log.water")}</Label>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Button size="icon" variant="outline" className="h-12 w-12 rounded-xl" onClick={() => setWater(Math.max(0, water - 1))}><Minus /></Button>
            <div className="flex flex-col items-center">
              <Droplet className="h-10 w-10 text-secondary" fill="currentColor" />
              <div className="mt-1 text-3xl font-bold">{water}</div>
              <div className="text-xs text-muted-foreground">/ 8</div>
            </div>
            <Button size="icon" variant="outline" className="h-12 w-12 rounded-xl" onClick={() => setWater(water + 1)}><Plus /></Button>
          </div>
        </Card>

        <Card className="rounded-2xl p-6 shadow-[var(--shadow-soft)]">
          <Label className="text-base">{t("log.sleep")}: <span className="text-primary">{sleep[0]}h</span></Label>
          <Slider min={0} max={12} step={0.5} value={sleep} onValueChange={setSleep} className="mt-6" />
        </Card>

        <Card className="rounded-2xl p-6 shadow-[var(--shadow-soft)]">
          <Label className="text-base">{t("log.symptoms")}</Label>
          <Input value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder={t("log.symptomsPh")} className="mt-3 h-11 rounded-xl" />
        </Card>
      </div>

      <Button onClick={save} disabled={busy} className="mt-6 h-12 w-full rounded-2xl bg-[image:var(--gradient-primary)] text-base font-semibold md:w-auto md:px-12">
        {busy ? "..." : t("log.save")}
      </Button>
    </>
  );
}

function HistoryTab() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [logs, setLogs] = useState<Log[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!user) return;
    const { start, end } = monthBounds(month);
    supabase.from("health_logs")
      .select("log_date,mood,sleep_hours,water_glasses,symptoms")
      .eq("user_id", user.id).gte("log_date", start).lte("log_date", end)
      .order("log_date", { ascending: false })
      .then(({ data }) => setLogs((data ?? []) as Log[]));
    supabase.from("profiles").select("name").eq("id", user.id).maybeSingle().then(({ data }) => setName(data?.name ?? ""));
  }, [user, month]);

  const stats = useMemo(() => {
    if (logs.length === 0) return null;
    const moods = logs.filter((l) => l.mood != null).map((l) => l.mood as number);
    const sleeps = logs.filter((l) => l.sleep_hours != null).map((l) => l.sleep_hours as number);
    const avg = (a: number[]) => a.length ? +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) : 0;
    return { avgMood: avg(moods), avgSleep: avg(sleeps), avgWater: avg(logs.map((l) => l.water_glasses)), days: logs.length };
  }, [logs]);

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(20); doc.text("HealthMate AI — Monthly Report", 14, 20);
    doc.setFontSize(11); doc.setTextColor(100);
    doc.text(`Patient: ${name || "—"}`, 14, 30);
    doc.text(`Month: ${month}`, 14, 36);
    if (stats) {
      doc.setTextColor(0); doc.setFontSize(13); doc.text("Summary", 14, 48);
      doc.setFontSize(10); doc.setTextColor(60);
      doc.text(`Logged days: ${stats.days}`, 14, 56);
      doc.text(`Avg mood: ${stats.avgMood} / 5`, 14, 62);
      doc.text(`Avg sleep: ${stats.avgSleep} h`, 14, 68);
      doc.text(`Avg water: ${stats.avgWater} glasses`, 14, 74);
    }
    doc.setTextColor(0); doc.setFontSize(13); doc.text("Daily logs", 14, 88);
    let y = 96;
    doc.setFontSize(9);
    logs.forEach((l) => {
      if (y > 280) { doc.addPage(); y = 20; }
      doc.setTextColor(0);
      doc.text(`${l.log_date}`, 14, y);
      doc.setTextColor(80);
      doc.text(`mood ${l.mood ?? "-"} • sleep ${l.sleep_hours ?? "-"}h • water ${l.water_glasses}`, 50, y);
      const extra = l.symptoms?.join(", ") ?? "";
      if (extra) {
        y += 5;
        const wrapped = doc.splitTextToSize(extra, 180);
        doc.text(wrapped, 14, y);
        y += wrapped.length * 4;
      }
      y += 6;
    });
    doc.setFontSize(8); doc.setTextColor(120);
    doc.text("This report is informational and not a medical document.", 14, 290);
    doc.save(`healthmate-${month}.pdf`);
  };

  return (
    <>
      <Card className="rounded-2xl p-5 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label>{t("history.month")}</Label>
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
          </div>
          <Button onClick={exportPdf} disabled={logs.length === 0} className="gap-2 rounded-xl bg-[image:var(--gradient-primary)] ml-auto">
            <Download className="h-4 w-4" />{t("history.export")}
          </Button>
        </div>
      </Card>

      {stats && (
        <Card className="mt-4 rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t("history.summary")}</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label={t("history.loggedDays")} value={`${stats.days}`} />
            <Stat label={t("history.avgMood")} value={`${stats.avgMood}/5`} />
            <Stat label={t("history.avgSleep")} value={`${stats.avgSleep}h`} />
            <Stat label={t("history.avgWater")} value={`${stats.avgWater}`} />
          </div>
        </Card>
      )}

      {logs.length === 0 ? (
        <Card className="mt-6 rounded-2xl border-dashed p-12 text-center text-muted-foreground">
          <CalendarDays className="mx-auto h-10 w-10 opacity-40" />
          <p className="mt-4">{t("history.noLogs")}</p>
        </Card>
      ) : (
        <div className="mt-4 space-y-3">
          {logs.map((l) => (
            <Card key={l.log_date} className="rounded-2xl p-4 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{new Date(l.log_date).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}</div>
                <div className="text-sm text-muted-foreground">mood {l.mood ?? "-"} · sleep {l.sleep_hours ?? "-"}h · water {l.water_glasses}</div>
              </div>
              {l.symptoms?.length ? <p className="mt-2 text-sm text-muted-foreground">{l.symptoms.join(", ")}</p> : null}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-3 text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
