import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pill, Plus, Trash2, Pencil, Clock, Infinity as InfinityIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/medicines")({
  validateSearch: (s: Record<string, unknown>) => ({ memberId: typeof s.memberId === "string" ? s.memberId : undefined }),
  component: () => <RequireAuth><Medicines /></RequireAuth>,
});

type Member = { id: string; name: string; color: string | null; relation: string | null };

type Med = {
  id: string; name: string; medicine_type: string | null; duration_days: number | null;
  reminder_times: string[]; tags: string[]; pill_color: string | null; notes: string | null;
  member_id: string | null; meal_timing: string | null;
};

const SELF_COLOR = "#0EA5A4";
const MEAL_OPTIONS = ["none", "before_breakfast", "after_breakfast", "before_lunch", "after_lunch", "before_dinner", "after_dinner"] as const;

function colorFor(med: Med, members: Member[]): string {
  if (med.member_id) {
    const m = members.find((x) => x.id === med.member_id);
    if (m?.color) return m.color;
  }
  return med.pill_color ?? SELF_COLOR;
}

function Medicines() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const search = useSearch({ from: "/medicines" });
  const [meds, setMeds] = useState<Med[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Med | null>(null);
  const [prefillMember, setPrefillMember] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    const [{ data: m }, { data: fm }] = await Promise.all([
      supabase.from("medicines").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("family_members").select("id,name,color,relation").eq("user_id", user.id).order("created_at"),
    ]);
    setMeds((m ?? []) as Med[]);
    setMembers((fm ?? []) as Member[]);
  };
  useEffect(() => { load(); }, [user]);

  useEffect(() => {
    if (search.memberId) { setEditing(null); setPrefillMember(search.memberId); setOpen(true); }
  }, [search.memberId]);

  const remove = async (id: string) => {
    if (!confirm(t("med.deleteConfirm"))) return;
    const { error } = await supabase.from("medicines").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("med.title")}</h1>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2 rounded-xl bg-[image:var(--gradient-primary)]"><Plus className="h-4 w-4" />{t("med.add")}</Button>
      </div>

      {meds.length === 0 ? (
        <Card className="mt-8 rounded-2xl border-dashed p-16 text-center text-muted-foreground">
          <Pill className="mx-auto h-10 w-10 opacity-40" />
          <p className="mt-4">{t("med.noneYet")}</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {meds.map((m) => {
              const col = colorFor(m, members);
              const owner = m.member_id ? members.find((x) => x.id === m.member_id) : null;
              return (
                <motion.div key={m.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Card className="h-full rounded-2xl p-5 shadow-[var(--shadow-soft)]">
                    <div className="flex items-start gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: col + "22", color: col }}>
                        <Pill className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{m.name}</div>
                        <div className="text-sm capitalize text-muted-foreground flex items-center gap-2 flex-wrap">
                          <span>{m.medicine_type}</span>
                          {owner && (
                            <span className="inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 font-medium" style={{ background: col + "22", color: col }}>
                              <span className="h-2 w-2 rounded-full" style={{ background: col }} />
                              {owner.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => { setEditing(m); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.tags.map((tag) => <Badge key={tag} variant="secondary" className="rounded-lg">{t(`med.${tag}`, tag)}</Badge>)}
                      {m.meal_timing && m.meal_timing !== "none" && (
                        <Badge variant="outline" className="rounded-lg">{t(`med.meal.${m.meal_timing}`)}</Badge>
                      )}
                      {m.duration_days != null ? (
                        <Badge variant="outline" className="gap-1 rounded-lg"><Clock className="h-3 w-3" />{t("med.days", { count: m.duration_days })}</Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 rounded-lg"><InfinityIcon className="h-3 w-3" />{t("med.lifetime")}</Badge>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                      {m.reminder_times.map((tm) => <span key={tm} className="rounded-lg bg-muted px-2 py-1 font-mono">{tm}</span>)}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <MedicineDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setPrefillMember(null); }}
        med={editing} members={members} prefillMember={prefillMember} onSaved={load} />
    </AppShell>
  );
}

function MedicineDialog({ open, onOpenChange, med, members, prefillMember, onSaved }: {
  open: boolean; onOpenChange: (v: boolean) => void; med: Med | null;
  members: Member[]; prefillMember: string | null; onSaved: () => void;
}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [type, setType] = useState("tablet");
  const [duration, setDuration] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [timeMap, setTimeMap] = useState<Record<string, string>>({});
  const [memberId, setMemberId] = useState<string>("self");
  const [mealTiming, setMealTiming] = useState<string>("none");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (med) {
      setName(med.name); setType(med.medicine_type ?? "tablet");
      setDuration(med.duration_days?.toString() ?? "");
      setTags(med.tags);
      const newMap: Record<string, string> = {};
      med.tags.forEach((tag, i) => { if (med.reminder_times[i]) newMap[tag] = med.reminder_times[i]; });
      setTimeMap(newMap);
      setMemberId(med.member_id ?? "self");
      setMealTiming(med.meal_timing ?? "none");
    } else {
      setName(""); setType("tablet"); setDuration(""); setTags([]); setTimeMap({});
      setMemberId(prefillMember ?? "self");
      setMealTiming("none");
    }
  }, [med, open, prefillMember]);

  const toggleTag = (tag: string) => setTags((cur) => cur.includes(tag) ? cur.filter((x) => x !== tag) : [...cur, tag]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const reminder_times = tags.map((tg) => timeMap[tg]).filter(Boolean);
    const ownerColor = memberId === "self" ? SELF_COLOR : members.find((x) => x.id === memberId)?.color ?? SELF_COLOR;
    const payload = {
      user_id: user.id, name, medicine_type: type, tags, reminder_times,
      pill_color: ownerColor, notes: null,
      duration_days: duration ? Number(duration) : null,
      member_id: memberId === "self" ? null : memberId,
      meal_timing: mealTiming === "none" ? null : mealTiming,
    };
    const { error } = med
      ? await supabase.from("medicines").update(payload).eq("id", med.id)
      : await supabase.from("medicines").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onOpenChange(false);
    onSaved();
  };

  const memberOptions = [{ id: "self", name: t("med.self"), color: SELF_COLOR }, ...members.map((m) => ({ id: m.id, name: m.name, color: m.color ?? SELF_COLOR }))];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{med ? t("med.edit") : t("med.add")}</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-4">
          <div>
            <Label>{t("med.name")}</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
          </div>

          <div>
            <Label>{t("med.forMember")}</Label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {memberOptions.map((m) => {
                const active = memberId === m.id;
                return (
                  <button type="button" key={m.id} onClick={() => setMemberId(m.id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${active ? "border-foreground" : "border-border hover:bg-muted/50"}`}
                    style={active ? { background: m.color + "22" } : undefined}>
                    <span className="h-4 w-4 rounded-full ring-2 ring-background" style={{ background: m.color }} />
                    <span className="font-medium">{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("med.type")}</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="syrup">Syrup</SelectItem>
                  <SelectItem value="injection">Injection</SelectItem>
                  <SelectItem value="capsule">Capsule</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("med.duration")}</Label>
              <Input type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder={t("med.durationLifetimePh")} className="mt-1.5 h-11 rounded-xl" />
              <p className="mt-1 text-xs text-muted-foreground">{t("med.durationHint")}</p>
            </div>
          </div>

          <div>
            <Label>{t("med.mealTiming")}</Label>
            <Select value={mealTiming} onValueChange={setMealTiming}>
              <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MEAL_OPTIONS.map((opt) => <SelectItem key={opt} value={opt}>{t(`med.meal.${opt}`)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t("med.times")}</Label>
            <div className="mt-1.5 grid gap-2 grid-cols-3">
              {(["morning", "afternoon", "night"] as const).map((tg) => {
                const active = tags.includes(tg);
                return (
                  <div key={tg} className={`rounded-xl border p-2 transition flex flex-col justify-between ${active ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                    <div className="flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center" onClick={() => toggleTag(tg)}>
                      <div className={`h-4 w-4 rounded-full border flex flex-shrink-0 items-center justify-center ${active ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>
                        {active && <div className="h-2 w-2 rounded-full bg-current" />}
                      </div>
                      <Label className="text-xs font-medium cursor-pointer">{t(`med.${tg}`)}</Label>
                    </div>
                    {active && (
                      <Input type="time" required value={timeMap[tg] || ""} onChange={(e) => setTimeMap((m) => ({ ...m, [tg]: e.target.value }))} className="mt-2 h-8 w-full px-1 text-center text-xs rounded-md bg-background" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => onOpenChange(false)}>{t("med.cancel")}</Button>
            <Button type="submit" disabled={busy} className="flex-1 rounded-xl bg-[image:var(--gradient-primary)]">{busy ? "..." : t("med.save")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
