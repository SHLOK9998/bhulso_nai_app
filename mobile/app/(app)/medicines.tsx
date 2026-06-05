import { useCallback, useState } from "react";
import { ScrollView, Text, View, Pressable, Modal, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Card, Button, Field } from "@/components/UI";
import { Input } from "@/components/Input";
import { colors, radii } from "@/lib/theme";

type Med = { id: string; name: string; dosage: string | null; reminder_times: string[]; member_id: string | null; pill_color: string | null; duration_days: number | null; meal_timing: string | null };
type Member = { id: string; name: string; color: string | null };

const MEALS = ["none", "before_breakfast", "after_breakfast", "before_lunch", "after_lunch", "before_dinner", "after_dinner"];

export default function Medicines() {
  const { user } = useAuth();
  const [meds, setMeds] = useState<Med[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [times, setTimes] = useState("08:00");
  const [memberId, setMemberId] = useState<string | null>(null);
  const [duration, setDuration] = useState("");
  const [meal, setMeal] = useState("none");

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
    if (error) return Alert.alert("Save", error.message);
    reset(); setOpen(false); load();
  };

  const remove = (id: string) =>
    Alert.alert("Delete", "Remove this medicine?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await supabase.from("medicines").delete().eq("id", id); load(); } },
    ]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Button title="+ Add medicine" onPress={() => setOpen(true)} />
      {meds.length === 0 && <Text style={{ color: colors.muted, textAlign: "center", marginTop: 24 }}>No medicines yet</Text>}
      {meds.map((m) => {
        const memberName = m.member_id ? members.find((x) => x.id === m.member_id)?.name : "Self";
        return (
          <Card key={m.id}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: m.pill_color ?? colors.primary }} />
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700", flex: 1 }}>{m.name}</Text>
              <Pressable onPress={() => remove(m.id)}><Text style={{ color: colors.danger }}>Delete</Text></Pressable>
            </View>
            {m.dosage ? <Text style={{ color: colors.muted, marginTop: 4 }}>{m.dosage}</Text> : null}
            <Text style={{ color: colors.muted, marginTop: 6 }}>For: {memberName}</Text>
            <Text style={{ color: colors.muted }}>Times: {m.reminder_times.join(", ")}</Text>
            <Text style={{ color: colors.muted }}>Duration: {m.duration_days ? `${m.duration_days} days` : "Lifetime"}</Text>
            {m.meal_timing ? <Text style={{ color: colors.muted }}>Meal: {m.meal_timing.replace("_", " ")}</Text> : null}
          </Card>
        );
      })}

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: "#0008", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.bg, padding: 18, borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 12, maxHeight: "90%" }}>
            <ScrollView contentContainerStyle={{ gap: 12 }}>
              <Text style={{ color: colors.text, fontSize: 20, fontWeight: "700" }}>New medicine</Text>
              <Field label="Name"><Input value={name} onChangeText={setName} /></Field>
              <Field label="Dosage (e.g. 500mg)"><Input value={dosage} onChangeText={setDosage} /></Field>
              <Field label="Reminder times (comma-separated 24h, e.g. 08:00,20:00)"><Input value={times} onChangeText={setTimes} /></Field>
              <Field label="Duration days (empty = lifetime)"><Input value={duration} onChangeText={setDuration} keyboardType="number-pad" /></Field>
              <Field label="For whom">
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  <Chip label="Self" active={!memberId} color={colors.primary} onPress={() => setMemberId(null)} />
                  {members.map((m) => (
                    <Chip key={m.id} label={m.name} active={memberId === m.id} color={m.color ?? colors.primary} onPress={() => setMemberId(m.id)} />
                  ))}
                </View>
              </Field>
              <Field label="Meal timing">
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {MEALS.map((mm) => <Chip key={mm} label={mm.replace("_", " ")} active={meal === mm} color={colors.accent} onPress={() => setMeal(mm)} />)}
                </View>
              </Field>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Button title="Cancel" variant="secondary" onPress={() => { reset(); setOpen(false); }} style={{ flex: 1 }} />
                <Button title="Save" onPress={save} style={{ flex: 2 }} />
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
    <Pressable onPress={onPress} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: radii.md, borderWidth: 1, borderColor: active ? color : colors.border, backgroundColor: active ? color + "22" : "transparent" }}>
      <Text style={{ color: colors.text, textTransform: "capitalize" }}>{label}</Text>
    </Pressable>
  );
}
