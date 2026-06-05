import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View, Pressable, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/UI";
import { ScoreRing } from "@/components/ScoreRing";
import { calculateHealthScore } from "@/lib/healthScore";
import { ensurePermission, scheduleDailyMedicines } from "@/lib/notifications";
import { colors, radii, shadows } from "@/lib/theme";

type Med = { id: string; name: string; reminder_times: string[]; member_id: string | null; pill_color: string | null; meal_timing: string | null };
type Member = { id: string; name: string; color: string | null };
type Log = { water_glasses: number; sleep_hours: number | null; mood: number | null };

const today = () => new Date().toISOString().slice(0, 10);

function bucket(time: string) {
  const h = Number(time.split(":")[0] ?? 0);
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

const BUCKET_LABEL = { morning: "🌅 Morning", afternoon: "☀️ Afternoon", evening: "🌙 Evening" } as const;

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [meds, setMeds] = useState<Med[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [log, setLog] = useState<Log | null>(null);
  const [taken, setTaken] = useState<Record<string, boolean>>({});
  const [name, setName] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const [{ data: m }, { data: fm }, { data: hl }, { data: rem }, { data: prof }] = await Promise.all([
      supabase.from("medicines").select("id,name,reminder_times,member_id,pill_color,meal_timing").eq("user_id", user.id).eq("active", true),
      supabase.from("family_members").select("id,name,color").eq("user_id", user.id),
      supabase.from("health_logs").select("water_glasses,sleep_hours,mood").eq("user_id", user.id).eq("log_date", today()).maybeSingle(),
      supabase.from("reminders").select("medicine_id,scheduled_time,status").eq("user_id", user.id).eq("scheduled_date", today()),
      supabase.from("profiles").select("name").eq("id", user.id).maybeSingle(),
    ]);
    setMeds((m ?? []) as Med[]);
    setMembers((fm ?? []) as Member[]);
    setLog((hl as Log) ?? null);
    setName(prof?.name ?? "");
    const tk: Record<string, boolean> = {};
    (rem ?? []).forEach((r: any) => { if (r.status === "taken") tk[`${r.medicine_id}|${r.scheduled_time}`] = true; });
    setTaken(tk);
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  useEffect(() => {
    (async () => {
      const ok = await ensurePermission();
      if (!ok) return;
      const items = meds.flatMap((m) => m.reminder_times.map((time) => ({ id: `${m.id}-${time}`, name: m.name, time })));
      await scheduleDailyMedicines(items);
    })();
  }, [meds]);

  const groups = useMemo(() => {
    const out: Record<"morning"|"afternoon"|"evening", { med: Med; time: string; color: string; owner: Member | null }[]> = { morning: [], afternoon: [], evening: [] };
    meds.forEach((m) => {
      const owner = m.member_id ? members.find((x) => x.id === m.member_id) ?? null : null;
      const color = owner?.color || m.pill_color || colors.primary;
      m.reminder_times.forEach((time) => out[bucket(time) as keyof typeof out].push({ med: m, time, color, owner }));
    });
    Object.values(out).forEach((arr) => arr.sort((a, b) => a.time.localeCompare(b.time)));
    return out;
  }, [meds, members]);

  const expected = meds.reduce((n, m) => n + (m.reminder_times?.length ?? 0), 0);
  const takenCount = Object.values(taken).filter(Boolean).length;
  const adherenceRate = expected === 0 ? null : takenCount / expected;
  const { score, parts } = calculateHealthScore({
    adherenceRate,
    waterGlasses: log?.water_glasses ?? 0,
    sleepHours: log?.sleep_hours ?? 0,
    mood: log?.mood ?? null,
    loggedToday: !!log,
  });

  const markTaken = async (medId: string, time: string, next: boolean) => {
    if (!user) return;
    const key = `${medId}|${time}`;
    setTaken((s) => ({ ...s, [key]: next }));
    if (next) {
      await supabase.from("reminders").upsert(
        { user_id: user.id, medicine_id: medId, scheduled_date: today(), scheduled_time: time, status: "taken", taken_at: new Date().toISOString() },
        { onConflict: "medicine_id,scheduled_date,scheduled_time" } as any,
      );
    } else {
      await supabase.from("reminders").upsert(
        { user_id: user.id, medicine_id: medId, scheduled_date: today(), scheduled_time: time, status: "pending", taken_at: null },
        { onConflict: "medicine_id,scheduled_date,scheduled_time" } as any,
      );
    }
  };

  const dateStr = new Date().toLocaleDateString(i18n.language === "hi" ? "hi-IN" : i18n.language === "gu" ? "gu-IN" : "en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
      refreshControl={<RefreshControl tintColor={colors.primary} refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
    >
      {/* Greeting */}
      <View>
        <Text style={{ color: colors.text, fontSize: 26, fontWeight: "800", letterSpacing: -0.5 }}>
          Hi, {name || "👋"}
        </Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>{dateStr}</Text>
      </View>

      {/* Health Score card — mirrors web */}
      <Card style={{ padding: 20 }}>
        <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700", letterSpacing: 1.2 }}>HEALTH SCORE</Text>
        <View style={{ alignItems: "center", marginTop: 12 }}>
          <ScoreRing score={score} />
        </View>
        <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginTop: 14, marginBottom: 6 }}>BREAKDOWN</Text>
        <View style={{ gap: 8 }}>
          {parts.map((p) => {
            const pct = Math.round((p.got / p.max) * 100);
            const low = pct < 70;
            return (
              <View key={p.key} style={{ gap: 4 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: low ? colors.muted : colors.text, fontSize: 12, fontWeight: "600" }}>{p.label}</Text>
                  <Text style={{ color: low ? colors.danger : colors.success, fontSize: 12, fontWeight: "700" }}>{p.got}/{p.max}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: colors.cardAlt, borderRadius: 3, overflow: "hidden" }}>
                  <View style={{ width: `${pct}%`, height: 6, backgroundColor: low ? colors.danger : colors.success, opacity: low ? 0.6 : 0.9 }} />
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
          <View style={{ flex: 1, backgroundColor: colors.cardAlt, borderRadius: radii.md, padding: 12, alignItems: "center" }}>
            <Text style={{ fontSize: 18 }}>💧</Text>
            <Text style={{ color: colors.text, fontWeight: "700", marginTop: 2 }}>{log?.water_glasses ?? 0}/8</Text>
            <Text style={{ color: colors.muted, fontSize: 11 }}>Water</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.cardAlt, borderRadius: radii.md, padding: 12, alignItems: "center" }}>
            <Text style={{ fontSize: 18 }}>🌙</Text>
            <Text style={{ color: colors.text, fontWeight: "700", marginTop: 2 }}>{log?.sleep_hours ?? 0}h</Text>
            <Text style={{ color: colors.muted, fontSize: 11 }}>Sleep</Text>
          </View>
        </View>
      </Card>

      {/* Today's medicines */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800" }}>Today's medicines</Text>
        <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "600" }}>{takenCount}/{expected || 0} taken</Text>
      </View>

      {expected === 0 ? (
        <Card style={{ borderStyle: "dashed", borderWidth: 1.5, alignItems: "center", padding: 32 }}>
          <Text style={{ fontSize: 30 }}>💊</Text>
          <Text style={{ color: colors.muted, marginTop: 10, textAlign: "center" }}>No medicines scheduled yet. Add one from the Meds tab.</Text>
        </Card>
      ) : (
        (["morning", "afternoon", "evening"] as const).map((b) => {
          const items = groups[b];
          return (
            <Card key={b} style={{ padding: 14 }}>
              <Text style={{ color: colors.muted, fontSize: 13, fontWeight: "700", marginBottom: 10 }}>{BUCKET_LABEL[b]}</Text>
              {items.length === 0 ? (
                <Text style={{ color: colors.subtle, fontSize: 12, fontStyle: "italic" }}>Nothing scheduled</Text>
              ) : (
                <View style={{ gap: 8 }}>
                  {items.map(({ med, time, color, owner }) => {
                    const isTaken = !!taken[`${med.id}|${time}`];
                    return (
                      <View key={`${med.id}-${time}`} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: 10, backgroundColor: colors.card }}>
                        <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
                          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: color + "22", alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontSize: 18, color }}>💊</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 }}>{med.name}</Text>
                            <View style={{ flexDirection: "row", gap: 8, marginTop: 2, alignItems: "center", flexWrap: "wrap" }}>
                              <Text style={{ color: colors.muted, fontSize: 12, fontFamily: "monospace" }}>{time}</Text>
                              {owner && <Text style={{ color, fontSize: 12, fontWeight: "600" }}>👤 {owner.name}</Text>}
                            </View>
                            {med.meal_timing && med.meal_timing !== "none" && (
                              <Text style={{ color: colors.muted, fontSize: 10, marginTop: 2, letterSpacing: 0.5, textTransform: "uppercase" }}>
                                {med.meal_timing.replace(/_/g, " ")}
                              </Text>
                            )}
                          </View>
                        </View>
                        <Pressable
                          onPress={() => markTaken(med.id, time, !isTaken)}
                          style={{
                            marginTop: 8, paddingVertical: 8, borderRadius: radii.sm, alignItems: "center",
                            backgroundColor: isTaken ? "transparent" : colors.primary,
                            borderWidth: isTaken ? 1.5 : 0, borderColor: colors.border,
                            ...(!isTaken ? shadows.sm : {}),
                          }}
                        >
                          <Text style={{ color: isTaken ? colors.text : "#fff", fontWeight: "700", fontSize: 13 }}>
                            {isTaken ? "↶  Undo" : "✓  Taken"}
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              )}
            </Card>
          );
        })
      )}
    </ScrollView>
  );
}
