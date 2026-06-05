import { useState } from "react";
import { Text, ScrollView, View, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Button, Card, Field } from "@/components/UI";
import { Input } from "@/components/Input";
import { colors, radii } from "@/lib/theme";

const GOALS = ["fitness", "weight", "chronic", "sleep", "stress"];

export default function Onboarding() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("other");
  const [conditions, setConditions] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const toggle = (g: string) => setGoals((c) => (c.includes(g) ? c.filter((x) => x !== g) : [...c, g]));

  const save = async (skip = false) => {
    if (!user) return;
    setBusy(true);
    const payload: Record<string, unknown> = { onboarded: true, updated_at: new Date().toISOString() };
    if (!skip) {
      payload.age = age ? Number(age) : null;
      payload.gender = gender;
      payload.conditions = conditions.split(",").map((s) => s.trim()).filter(Boolean);
      payload.goals = goals;
    }
    const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
    setBusy(false);
    if (error) return Alert.alert("Save", error.message);
    router.replace("/(app)/dashboard");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, gap: 16 }}>
      <Text style={{ color: colors.text, fontSize: 26, fontWeight: "700" }}>{t("onboarding.title")}</Text>
      <Text style={{ color: colors.muted }}>{t("onboarding.sub")}</Text>
      <Card style={{ gap: 14 }}>
        <Field label={t("onboarding.age")}><Input value={age} onChangeText={setAge} keyboardType="number-pad" /></Field>
        <Field label={t("onboarding.gender")}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {["male", "female", "other"].map((g) => (
              <Pressable key={g} onPress={() => setGender(g)} style={{ flex: 1, padding: 12, borderRadius: radii.md, borderWidth: 1, borderColor: gender === g ? colors.primary : colors.border, backgroundColor: gender === g ? colors.primary + "22" : "transparent" }}>
                <Text style={{ color: colors.text, textAlign: "center", textTransform: "capitalize" }}>{g}</Text>
              </Pressable>
            ))}
          </View>
        </Field>
        <Field label={t("onboarding.conditions")}><Input value={conditions} onChangeText={setConditions} placeholder={t("onboarding.conditionsPh") ?? ""} /></Field>
        <Field label={t("onboarding.goals")}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {GOALS.map((g) => {
              const on = goals.includes(g);
              return (
                <Pressable key={g} onPress={() => toggle(g)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: radii.md, borderWidth: 1, borderColor: on ? colors.primary : colors.border, backgroundColor: on ? colors.primary + "22" : "transparent" }}>
                  <Text style={{ color: colors.text }}>{t(`onboarding.goalsList.${g}`)}</Text>
                </Pressable>
              );
            })}
          </View>
        </Field>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button title={t("onboarding.skip")} variant="secondary" onPress={() => save(true)} style={{ flex: 1 }} />
          <Button title={t("onboarding.finish")} loading={busy} onPress={() => save(false)} style={{ flex: 2 }} />
        </View>
      </Card>
    </ScrollView>
  );
}
