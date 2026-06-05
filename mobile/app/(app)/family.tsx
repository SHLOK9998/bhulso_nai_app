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

type Member = { id: string; name: string; relation: string | null; age: number | null; color: string | null };

const PALETTE = ["#0EA5A4", "#7C3AED", "#F59E0B", "#EF4444", "#10B981", "#3B82F6", "#EC4899", "#84CC16"];

export default function Family() {
  const { t } = useTranslation();
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
    if (error) return Alert.alert(t("med.save"), error.message);
    setName(""); setRelation(""); setAge(""); setColor(PALETTE[0]); setOpen(false); load();
  };

  const remove = (id: string) =>
    Alert.alert(t("med.delete"), t("family.deleteConfirm"), [
      { text: t("med.cancel") },
      { text: t("med.delete"), style: "destructive", onPress: async () => { await supabase.from("family_members").delete().eq("id", id); load(); } },
    ]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 32 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800" }}>{t("family.title")}</Text>
          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>{t("family.sub")}</Text>
        </View>
        <Ionicons name="people-outline" size={26} color={colors.primary} />
      </View>

      <Button
        title={t("family.add")}
        icon={<Ionicons name="person-add" size={20} color="#fff" />}
        onPress={() => setOpen(true)}
      />
      
      {members.length === 0 && (
        <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 48, gap: 10 }}>
          <Ionicons name="people-outline" size={48} color={colors.subtle} />
          <Text style={{ color: colors.muted, textAlign: "center", fontSize: 14 }}>
            {t("family.noneYet")}
          </Text>
        </View>
      )}

      {members.map((m) => (
        <Card key={m.id} style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: m.color ?? colors.primary, alignItems: "center", justifyContent: "center", ...shadows.sm }}>
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>{m.name[0]?.toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>{m.name}</Text>
              <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>{[m.relation, m.age ? `${m.age}y` : null].filter(Boolean).join(" • ")}</Text>
            </View>
            <Pressable onPress={() => remove(m.id)} style={{ padding: 6 }}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </Pressable>
          </View>
        </Card>
      ))}

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: "#0008", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.bg, padding: 18, borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Ionicons name="person-add" size={22} color={colors.primary} />
              <Text style={{ color: colors.text, fontSize: 20, fontWeight: "700" }}>{t("family.add")}</Text>
            </View>
            
            <Field label={t("family.name")}><Input value={name} onChangeText={setName} placeholder="e.g. John Doe" /></Field>
            <Field label={t("family.relation")}><Input value={relation} onChangeText={setRelation} placeholder="e.g. mother" /></Field>
            <Field label={t("family.age")}><Input value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="e.g. 52" /></Field>
            
            <Field label="Avatar Color">
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
                {PALETTE.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setColor(c)}
                    style={{
                      width: 36, height: 36, borderRadius: 18, backgroundColor: c,
                      alignItems: "center", justifyContent: "center", ...shadows.sm
                    }}
                  >
                    {color === c && <Ionicons name="checkmark" size={18} color="#fff" />}
                  </Pressable>
                ))}
              </View>
            </Field>

            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <Button title={t("med.cancel")} variant="secondary" onPress={() => setOpen(false)} style={{ flex: 1 }} />
              <Button title={t("med.save")} onPress={save} style={{ flex: 2 }} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
