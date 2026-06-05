import { useCallback, useState } from "react";
import { ScrollView, Text, View, Pressable, Modal, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Card, Button, Field } from "@/components/UI";
import { Input } from "@/components/Input";
import { colors, radii, shadows } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";

type Med = { id: string; name: string; dosage: string | null; reminder_times: string[]; member_id: string | null; pill_color: string | null; duration_days: number | null; meal_timing: string | null };
type Member = { id: string; name: string; color: string | null };

const MEALS = ["none", "before_breakfast", "after_breakfast", "before_lunch", "after_lunch", "before_dinner", "after_dinner"] as const;

export default function Medicines() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [meds, setMeds] = useState<Med[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [times, setTimes] = useState("08:00");
  const [memberId, setMemberId] = useState<string | null>(null);
  const [duration, setDuration] = useState("");
  const [meal, setMeal] = useState<typeof MEALS[number]>("none");

  const load = useCallback(async () => {
    if (!user) return;
    const [{ data: m }, { data: fm }] = await Promise.all([
      supabase.from("medicines").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("family_members").select("id,name,color").eq("user_id", user.id),
    ]);
    setMeds((m ?? []) as Med[]);
    setMembers((fm ?? []) as Member[]);
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const reset = () => { setName(""); setDosage(""); setTimes("08:00"); setMemberId(null); setDuration(""); setMeal("none"); };

  const save = async () => {
    if (!user || !name.trim()) return;
    const reminder_times = times.split(",").map((s) => s.trim()).filter(Boolean);
    const color = (memberId && members.find((m) => m.id === memberId)?.color) || colors.primary;
    const { error } = await supabase.from("medicines").insert({
      user_id: user.id,
      name: name.trim(),
      dosage: dosage.trim() || null,
      reminder_times,
      member_id: memberId,
      pill_color: color,
      duration_days: duration ? Number(duration) : null,
      meal_timing: meal === "none" ? null : meal,
      active: true,
    });
    if (error) return Alert.alert(t("med.save"), error.message);
    reset(); setOpen(false); load();
  };

  const remove = (id: string) =>
    Alert.alert(t("med.delete"), t("med.deleteConfirm"), [
      { text: t("med.cancel") },
      { text: t("med.delete"), style: "destructive", onPress: async () => { await supabase.from("medicines").delete().eq("id", id); load(); } },
    ]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Button
        title={t("med.add")}
        icon={<Ionicons name="add" size={20} color="#fff" />}
        onPress={() => setOpen(true)}
      />
      
      {meds.length === 0 && (
        <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 48, gap: 10 }}>
          <Ionicons name="medkit-outline" size={48} color={colors.subtle} />
          <Text style={{ color: colors.muted, textAlign: "center", fontSize: 14 }}>
            {t("med.noneYet")}
          </Text>
        </View>
      )}

      {meds.map((m) => {
        const memberName = m.member_id ? members.find((x) => x.id === m.member_id)?.name : t("med.self");
        return (
          <Card key={m.id} style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: (m.pill_color ?? colors.primary) + "22", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="medkit" size={16} color={m.pill_color ?? colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>{m.name}</Text>
                {m.dosage ? <Text style={{ color: colors.muted, fontSize: 13, marginTop: 1 }}>{m.dosage}</Text> : null}
              </View>
              <Pressable onPress={() => remove(m.id)} style={{ padding: 6 }}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </Pressable>
            </View>

            <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, gap: 4 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="person-outline" size={13} color={colors.muted} />
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  {t("med.forMember")}: <Text style={{ fontWeight: "600", color: colors.text }}>{memberName}</Text>
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="time-outline" size={13} color={colors.muted} />
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  {t("med.times")}: <Text style={{ fontWeight: "600", color: colors.text, fontFamily: "monospace" }}>{m.reminder_times.join(", ")}</Text>
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="calendar-outline" size={13} color={colors.muted} />
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  {t("med.duration")}: <Text style={{ fontWeight: "600", color: colors.text }}>{m.duration_days ? t("med.days", { count: m.duration_days }) : t("med.lifetime")}</Text>
                </Text>
              </View>
              {m.meal_timing ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="restaurant-outline" size={13} color={colors.muted} />
                  <Text style={{ color: colors.muted, fontSize: 12 }}>
                    {t("med.mealTiming")}: <Text style={{ fontWeight: "600", color: colors.text }}>{t(`med.meal.${m.meal_timing}`)}</Text>
                  </Text>
                </View>
              ) : null}
            </View>
          </Card>
        );
      })}

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: "#0008", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.bg, padding: 18, borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 12, maxHeight: "90%" }}>
            <ScrollView contentContainerStyle={{ gap: 12 }} showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Ionicons name="medkit" size={22} color={colors.primary} />
                <Text style={{ color: colors.text, fontSize: 20, fontWeight: "700" }}>{t("med.add")}</Text>
              </View>
              
              <Field label={t("med.name")}><Input value={name} onChangeText={setName} placeholder="e.g. Paracetamol" /></Field>
              <Field label="Dosage"><Input value={dosage} onChangeText={setDosage} placeholder="e.g. 500mg" /></Field>
              <Field label={t("med.times")}><Input value={times} onChangeText={setTimes} placeholder="e.g. 08:00, 20:00" /></Field>
              <Field label="Duration days"><Input value={duration} onChangeText={setDuration} keyboardType="number-pad" placeholder="e.g. 7 (empty = lifetime)" /></Field>
              
              <Field label={t("med.forMember")}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  <Chip label={t("med.self")} active={!memberId} color={colors.primary} onPress={() => setMemberId(null)} />
                  {members.map((m) => (
                    <Chip key={m.id} label={m.name} active={memberId === m.id} color={m.color ?? colors.primary} onPress={() => setMemberId(m.id)} />
                  ))}
                </View>
              </Field>

              <Field label={t("med.mealTiming")}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {MEALS.map((mm) => (
                    <Chip key={mm} label={t(`med.meal.${mm}`)} active={meal === mm} color={colors.accent} onPress={() => setMeal(mm)} />
                  ))}
                </View>
              </Field>

              <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                <Button title={t("med.cancel")} variant="secondary" onPress={() => { reset(); setOpen(false); }} style={{ flex: 1 }} />
                <Button title={t("med.save")} onPress={save} style={{ flex: 2 }} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function Chip({ label, active, color, onPress }: { label: string; active: boolean; color: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: radii.md,
        borderWidth: 1.5,
        borderColor: active ? color : colors.border,
        backgroundColor: active ? color + "15" : colors.surface,
        ...shadows.sm,
      }}
    >
      <Text style={{ color: active ? color : colors.text, fontWeight: active ? "700" : "500", fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}
