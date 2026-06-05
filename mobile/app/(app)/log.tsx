import { useCallback, useState } from "react";
import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Card, Button, Field } from "@/components/UI";
import { Input } from "@/components/Input";
import { colors, radii } from "@/lib/theme";

type Log = { id: string; log_date: string; water_glasses: number; sleep_hours: number | null; mood: number | null; symptoms: string[] };

const MOODS = [
  { v: 1, e: "😔", l: "Bad" },
  { v: 2, e: "😕", l: "Low" },
  { v: 3, e: "😐", l: "Okay" },
  { v: 4, e: "🙂", l: "Good" },
  { v: 5, e: "😄", l: "Great" },
];

const today = () => new Date().toISOString().slice(0, 10);

export default function LogScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tab, setTab] = useState<"today" | "history">("today");
  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState("7");
  const [mood, setMood] = useState<number | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [history, setHistory] = useState<Log[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("health_logs").select("*").eq("user_id", user.id).order("log_date", { ascending: false }).limit(60);
    setHistory((data ?? []) as Log[]);
    const t0 = (data ?? []).find((d: any) => d.log_date === today());
    if (t0) {
      setWater(t0.water_glasses ?? 0);
      setSleep(t0.sleep_hours != null ? String(t0.sleep_hours) : "7");
      setMood(t0.mood ?? null);
      setSymptoms((t0.symptoms ?? []).join(", "));
    }
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const payload = {
      user_id: user.id,
      log_date: today(),
      water_glasses: water,
      sleep_hours: sleep ? Number(sleep) : null,
      mood,
      symptoms: symptoms.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const { error } = await supabase.from("health_logs").upsert(payload, { onConflict: "user_id,log_date" } as any);
    setBusy(false);
    if (error) return Alert.alert("Save", error.message);
    Alert.alert("Saved", t("log.saved"));
    load();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 32 }}>
      <View>
        <Text style={{ color: colors.text, fontSize: 26, fontWeight: "800" }}>{t("log.title")}</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>{t("log.today")} · {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 4, backgroundColor: colors.cardAlt, padding: 4, borderRadius: radii.md }}>
        {(["today", "history"] as const).map((k) => (
          <Pressable key={k} onPress={() => setTab(k)} style={{ flex: 1, paddingVertical: 10, borderRadius: radii.sm, backgroundColor: tab === k ? colors.surface : "transparent" }}>
            <Text style={{ color: tab === k ? colors.text : colors.muted, textAlign: "center", fontWeight: "700", textTransform: "capitalize" }}>
              {k === "today" ? t("log.tabToday") : t("log.tabHistory")}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === "today" ? (
        <>
          {/* Mood */}
          <Card>
            <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700" }}>{t("log.mood")}</Text>
            <View style={{ flexDirection: "row", gap: 6, marginTop: 12 }}>
              {MOODS.map((m) => {
                const active = mood === m.v;
                return (
                  <Pressable key={m.v} onPress={() => setMood(m.v)} style={{ flex: 1, padding: 10, borderRadius: radii.md, alignItems: "center", borderWidth: 2, borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary + "11" : colors.surface }}>
                    <Text style={{ fontSize: 26 }}>{m.e}</Text>
                    <Text style={{ color: colors.muted, fontSize: 10, marginTop: 2 }}>{m.l}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          {/* Water */}
          <Card>
            <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700" }}>{t("log.water")}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 14 }}>
              <Pressable onPress={() => setWater(Math.max(0, water - 1))} style={{ width: 44, height: 44, borderRadius: radii.md, borderWidth: 1.5, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 22, color: colors.text }}>−</Text>
              </Pressable>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 32 }}>💧</Text>
                <Text style={{ color: colors.text, fontSize: 26, fontWeight: "800" }}>{water}</Text>
                <Text style={{ color: colors.muted, fontSize: 11 }}>/ 8 glasses</Text>
              </View>
              <Pressable onPress={() => setWater(water + 1)} style={{ width: 44, height: 44, borderRadius: radii.md, borderWidth: 1.5, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 22, color: colors.text }}>+</Text>
              </Pressable>
            </View>
          </Card>

          {/* Sleep */}
          <Card>
            <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700" }}>{t("log.sleep")}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 }}>
              <Input value={sleep} onChangeText={setSleep} keyboardType="decimal-pad" style={{ flex: 1 }} />
              <Text style={{ color: colors.muted, fontWeight: "700" }}>hours</Text>
            </View>
          </Card>

          {/* Symptoms */}
          <Card>
            <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700" }}>{t("log.symptoms")}</Text>
            <Input value={symptoms} onChangeText={setSymptoms} placeholder="e.g. headache, sore throat" style={{ marginTop: 12 }} />
          </Card>

          <Button title={t("log.save")} loading={busy} onPress={save} />
        </>
      ) : (
        <View style={{ gap: 10 }}>
          {history.length === 0 && <Text style={{ color: colors.muted, textAlign: "center", marginTop: 20 }}>{t("history.noLogs")}</Text>}
          {history.map((h) => (
            <Card key={h.id}>
              <Text style={{ color: colors.text, fontWeight: "700" }}>
                {new Date(h.log_date).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
              </Text>
              <Text style={{ color: colors.muted, marginTop: 4, fontSize: 13 }}>
                💧 {h.water_glasses}   🌙 {h.sleep_hours ?? "—"}h   😊 {h.mood ?? "—"}/5
              </Text>
              {h.symptoms?.length ? <Text style={{ color: colors.muted, marginTop: 4, fontSize: 12 }}>{h.symptoms.join(", ")}</Text> : null}
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
