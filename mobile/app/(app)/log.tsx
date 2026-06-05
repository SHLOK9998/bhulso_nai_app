import { useCallback, useState } from "react";
import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Card, Button, Field } from "@/components/UI";
import { Input } from "@/components/Input";
import { colors, radii, shadows } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";

type Log = { id: string; log_date: string; water_glasses: number; sleep_hours: number | null; mood: number | null; symptoms: string[] };

const MOODS = [
  { v: 1, e: "😔" },
  { v: 2, e: "😕" },
  { v: 3, e: "😐" },
  { v: 4, e: "🙂" },
  { v: 5, e: "😄" },
] as const;

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
    if (error) return Alert.alert(t("med.save"), error.message);
    Alert.alert(t("log.saved"), t("log.saved"));
    load();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 32 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800" }}>{t("log.title")}</Text>
          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>{t("log.today")} · {new Date().toLocaleDateString()}</Text>
        </View>
        <Ionicons name="create-outline" size={26} color={colors.primary} />
      </View>

      <View style={{ flexDirection: "row", gap: 4, backgroundColor: colors.cardAlt, padding: 4, borderRadius: radii.md, ...shadows.sm }}>
        {(["today", "history"] as const).map((k) => (
          <Pressable key={k} onPress={() => setTab(k)} style={{ flex: 1, paddingVertical: 10, borderRadius: radii.sm, backgroundColor: tab === k ? colors.surface : "transparent" }}>
            <Text style={{ color: tab === k ? colors.text : colors.muted, textAlign: "center", fontWeight: "700", fontSize: 13 }}>
              {k === "today" ? t("log.tabToday") : t("log.tabHistory")}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === "today" ? (
        <>
          {/* Mood */}
          <Card style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="happy-outline" size={18} color={colors.primary} />
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700" }}>{t("log.mood")}</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
              {MOODS.map((m) => {
                const active = mood === m.v;
                return (
                  <Pressable
                    key={m.v}
                    onPress={() => setMood(m.v)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: radii.md,
                      alignItems: "center",
                      borderWidth: 1.5,
                      borderColor: active ? colors.primary : colors.border,
                      backgroundColor: active ? colors.primary + "15" : colors.surface,
                      ...shadows.sm,
                    }}
                  >
                    <Text style={{ fontSize: 26 }}>{m.e}</Text>
                    <Text style={{ color: active ? colors.primary : colors.muted, fontSize: 10, marginTop: 4, fontWeight: active ? "700" : "500" }}>
                      {t(`log.moods.${m.v}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          {/* Water */}
          <Card style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="water-outline" size={18} color={colors.primary} />
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700" }}>{t("log.water")}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 32, marginTop: 8 }}>
              <Pressable
                onPress={() => setWater(Math.max(0, water - 1))}
                style={{
                  width: 44, height: 44, borderRadius: radii.md, borderWidth: 1.5, borderColor: colors.border,
                  alignItems: "center", justifyContent: "center", backgroundColor: colors.surface, ...shadows.sm
                }}
              >
                <Ionicons name="remove" size={24} color={colors.text} />
              </Pressable>
              
              <View style={{ alignItems: "center" }}>
                <Ionicons name="water" size={32} color={colors.secondary} />
                <Text style={{ color: colors.text, fontSize: 28, fontWeight: "800", marginTop: 4 }}>{water}</Text>
                <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "600" }}>{t("dashboard.water").toUpperCase()}</Text>
              </View>
              
              <Pressable
                onPress={() => setWater(water + 1)}
                style={{
                  width: 44, height: 44, borderRadius: radii.md, borderWidth: 1.5, borderColor: colors.border,
                  alignItems: "center", justifyContent: "center", backgroundColor: colors.surface, ...shadows.sm
                }}
              >
                <Ionicons name="add" size={24} color={colors.text} />
              </Pressable>
            </View>
          </Card>

          {/* Sleep */}
          <Card style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="moon-outline" size={18} color={colors.primary} />
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700" }}>{t("log.sleep")}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Input value={sleep} onChangeText={setSleep} keyboardType="decimal-pad" style={{ flex: 1 }} />
              <Text style={{ color: colors.muted, fontWeight: "700", fontSize: 13 }}>{t("dashboard.sleep").toLowerCase()}</Text>
            </View>
          </Card>

          {/* Symptoms */}
          <Card style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="pulse-outline" size={18} color={colors.primary} />
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700" }}>{t("log.symptoms")}</Text>
            </View>
            <Input value={symptoms} onChangeText={setSymptoms} placeholder={t("log.symptomsPh")} style={{ marginTop: 4 }} />
          </Card>

          <Button title={t("log.save")} loading={busy} onPress={save} />
        </>
      ) : (
        <View style={{ gap: 10 }}>
          {history.length === 0 && <Text style={{ color: colors.muted, textAlign: "center", marginTop: 20 }}>{t("history.noLogs")}</Text>}
          {history.map((h) => (
            <Card key={h.id} style={{ gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 }}>
                  {new Date(h.log_date).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
                </Text>
                {h.mood ? (
                  <View style={{ backgroundColor: colors.cardAlt, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.sm }}>
                    <Text style={{ fontSize: 12 }}>{MOODS.find((m) => m.v === h.mood)?.e} {t(`log.moods.${h.mood}`)}</Text>
                  </View>
                ) : null}
              </View>
              
              <View style={{ flexDirection: "row", gap: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="water" size={14} color={colors.secondary} />
                  <Text style={{ color: colors.muted, fontSize: 12 }}>{t("dashboard.glasses", { count: h.water_glasses })}</Text>
                </View>
                {h.sleep_hours != null ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Ionicons name="moon" size={14} color={colors.secondary} />
                    <Text style={{ color: colors.muted, fontSize: 12 }}>{t("dashboard.hours", { count: h.sleep_hours })}</Text>
                  </View>
                ) : null}
              </View>
              {h.symptoms?.length ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="pulse" size={14} color={colors.danger} />
                  <Text style={{ color: colors.muted, fontSize: 12, flex: 1 }}>{h.symptoms.join(", ")}</Text>
                </View>
              ) : null}
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
