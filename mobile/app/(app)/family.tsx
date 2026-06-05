import { useCallback, useState } from "react";
import { ScrollView, Text, View, Pressable, Modal, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Card, Button, Field } from "@/components/UI";
import { Input } from "@/components/Input";
import { colors, radii } from "@/lib/theme";

type Member = { id: string; name: string; relation: string | null; age: number | null; color: string | null };

const PALETTE = ["#0EA5A4", "#7C3AED", "#F59E0B", "#EF4444", "#10B981", "#3B82F6", "#EC4899", "#84CC16"];

export default function Family() {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [age, setAge] = useState("");
  const [color, setColor] = useState(PALETTE[0]);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("family_members").select("*").eq("user_id", user.id).order("created_at");
    setMembers((data ?? []) as Member[]);
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    if (!user || !name.trim()) return;
    const { error } = await supabase.from("family_members").insert({
      user_id: user.id, name: name.trim(), relation: relation.trim() || null, age: age ? Number(age) : null, color,
    });
    if (error) return Alert.alert("Save", error.message);
    setName(""); setRelation(""); setAge(""); setColor(PALETTE[0]); setOpen(false); load();
  };

  const remove = (id: string) =>
    Alert.alert("Delete", "Remove this family member?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await supabase.from("family_members").delete().eq("id", id); load(); } },
    ]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Button title="+ Add family member" onPress={() => setOpen(true)} />
      {members.length === 0 && <Text style={{ color: colors.muted, textAlign: "center", marginTop: 24 }}>No family members yet</Text>}
      {members.map((m) => (
        <Card key={m.id}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: m.color ?? colors.primary, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>{m.name[0]?.toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>{m.name}</Text>
              <Text style={{ color: colors.muted, fontSize: 13 }}>{[m.relation, m.age ? `${m.age}y` : null].filter(Boolean).join(" • ")}</Text>
            </View>
            <Pressable onPress={() => remove(m.id)}><Text style={{ color: colors.danger }}>Delete</Text></Pressable>
          </View>
        </Card>
      ))}

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: "#0008", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.bg, padding: 18, borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 12 }}>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: "700" }}>New family member</Text>
            <Field label="Name"><Input value={name} onChangeText={setName} /></Field>
            <Field label="Relation (e.g. mother)"><Input value={relation} onChangeText={setRelation} /></Field>
            <Field label="Age"><Input value={age} onChangeText={setAge} keyboardType="number-pad" /></Field>
            <Field label="Color">
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {PALETTE.map((c) => (
                  <Pressable key={c} onPress={() => setColor(c)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c, borderWidth: color === c ? 3 : 0, borderColor: colors.text }} />
                ))}
              </View>
            </Field>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Button title="Cancel" variant="secondary" onPress={() => setOpen(false)} style={{ flex: 1 }} />
              <Button title="Save" onPress={save} style={{ flex: 2 }} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
