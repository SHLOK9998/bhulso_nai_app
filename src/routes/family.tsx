import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Users, Plus, Trash2, Pencil } from "lucide-react";

export const Route = createFileRoute("/family")({ component: () => <RequireAuth><Family /></RequireAuth> });

type Member = { id: string; name: string; relation: string | null; age: number | null; color: string | null };

const COLORS = ["#0EA5A4", "#2563EB", "#F59E0B", "#EC4899", "#8B5CF6", "#10B981"];

function Family() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [promptMember, setPromptMember] = useState<Member | null>(null);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("family_members").select("*").eq("user_id", user.id).order("created_at");
    setMembers((data ?? []) as Member[]);
  };
  useEffect(() => { load(); }, [user]);

  const handleSaved = (m: Member | null, wasNew: boolean) => {
    load();
    if (wasNew && m) setPromptMember(m);
  };

  const remove = async (id: string) => {
    if (!confirm(t("family.deleteConfirm"))) return;
    await supabase.from("family_members").delete().eq("id", id);
    load();
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("family.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("family.sub")}</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2 rounded-xl bg-[image:var(--gradient-primary)]">
          <Plus className="h-4 w-4" />{t("family.add")}
        </Button>
      </div>

      {members.length === 0 ? (
        <Card className="mt-8 rounded-2xl border-dashed p-16 text-center text-muted-foreground">
          <Users className="mx-auto h-10 w-10 opacity-40" />
          <p className="mt-4">{t("family.noneYet")}</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <Card key={m.id} className="rounded-2xl p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl text-lg font-bold text-white" style={{ background: m.color ?? "#0EA5A4" }}>
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-sm text-muted-foreground">{[m.relation, m.age && `${m.age}y`].filter(Boolean).join(" · ")}</div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(m); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <MemberDialog open={open} onOpenChange={setOpen} member={editing} onSaved={handleSaved} />

      <Dialog open={!!promptMember} onOpenChange={(v) => !v && setPromptMember(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t("family.addMedPrompt", { name: promptMember?.name ?? "" })}</DialogTitle>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setPromptMember(null)}>{t("family.addMedNo")}</Button>
            <Button className="rounded-xl bg-[image:var(--gradient-primary)]"
              onClick={() => { const id = promptMember!.id; setPromptMember(null); nav({ to: "/medicines", search: { memberId: id } }); }}>
              {t("family.addMedYes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function MemberDialog({ open, onOpenChange, member, onSaved }: { open: boolean; onOpenChange: (v: boolean) => void; member: Member | null; onSaved: (m: Member | null, wasNew: boolean) => void }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [age, setAge] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (member) { setName(member.name); setRelation(member.relation ?? ""); setAge(member.age?.toString() ?? ""); setColor(member.color ?? COLORS[0]); }
    else { setName(""); setRelation(""); setAge(""); setColor(COLORS[0]); }
  }, [member, open]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const payload = { user_id: user.id, name, relation, age: age ? Number(age) : null, color };
    const wasNew = !member;
    const { data, error } = member
      ? await supabase.from("family_members").update(payload).eq("id", member.id).select().maybeSingle()
      : await supabase.from("family_members").insert(payload).select().maybeSingle();
    setBusy(false);
    if (error) return toast.error(error.message);
    onOpenChange(false);
    onSaved((data as Member) ?? null, wasNew);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader><DialogTitle>{member ? t("family.edit") : t("family.add")}</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-4">
          <div>
            <Label>{t("family.name")}</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("family.relation")}</Label>
              <Input value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Mother, Son..." className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div>
              <Label>{t("family.age")}</Label>
              <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
            </div>
          </div>
          <div>
            <Label>{t("med.color")}</Label>
            <div className="mt-1.5 flex gap-2">
              {COLORS.map((c) => (
                <button type="button" key={c} onClick={() => setColor(c)}
                  className={`h-10 w-10 rounded-xl ring-2 ring-offset-2 ring-offset-background transition ${color === c ? "ring-foreground" : "ring-transparent"}`}
                  style={{ background: c }} aria-label={c} />
              ))}
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
