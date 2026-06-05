import { useState } from "react";
import { ScrollView, Text, View, Alert, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Card, Button, Field } from "@/components/UI";
import { Input } from "@/components/Input";
import { colors, radii, shadows } from "@/lib/theme";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type AIResp = {
  summary?: string;
  causes?: string[];
  suggestions?: string[];
  ayurveda?: string[];
  urgency?: "low" | "medium" | "high";
  error?: string;
};

export default function Symptoms() {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [resp, setResp] = useState<AIResp | null>(null);

  const analyze = async () => {
    if (!text.trim()) return;
    setBusy(true); setResp(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("https://bhulso-nai.lovable.app/api/analyze-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token ?? ""}` },
        body: JSON.stringify({ input: text }),
      });
      const data = (await res.json()) as AIResp;
      if (!res.ok || data.error) Alert.alert("Error", data.error ?? "Failed");
      else setResp(data);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  };

  const urgencyBg = resp?.urgency === "high" ? colors.danger : resp?.urgency === "medium" ? colors.warn : colors.success;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 32 }}>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <LinearGradient colors={colors.gradPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 48, height: 48, borderRadius: radii.md, alignItems: "center", justifyContent: "center", ...shadows.glow }}>
          <Ionicons name="sparkles" size={24} color="#fff" />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>{t("symptoms.title")}</Text>
          <Text style={{ color: colors.muted, fontSize: 13 }}>{t("symptoms.sub")}</Text>
        </View>
      </View>

      <Card style={{ gap: 12 }}>
        <Field label={t("symptoms.title")}>
          <Input value={text} onChangeText={setText} multiline numberOfLines={5} placeholder={t("symptoms.placeholder")} style={{ minHeight: 120, textAlignVertical: "top" }} />
        </Field>
        <Button title={busy ? t("symptoms.thinking") : t("symptoms.send")} loading={busy} onPress={analyze} />
      </Card>

      {resp && (
        <>
          {resp.summary && (
            <Card>
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                <Text style={{ color: colors.text, fontSize: 15, fontWeight: "600", flex: 1, lineHeight: 22 }}>{resp.summary}</Text>
                {resp.urgency && (
                  <View style={{ backgroundColor: urgencyBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill, flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Ionicons name="warning" size={12} color="#fff" />
                    <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700", textTransform: "uppercase" }}>{t(`symptoms.${resp.urgency}`)}</Text>
                  </View>
                )}
              </View>
            </Card>
          )}

          {resp.causes && resp.causes.length > 0 && (
            <Card>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Ionicons name="heart" size={16} color={colors.primary} />
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 }}>{t("symptoms.causes")}</Text>
              </View>
              {resp.causes.map((c, i) => (
                <Text key={i} style={{ color: colors.text, fontSize: 13, marginTop: 4 }}>
                  <Text style={{ color: colors.primary }}>•  </Text>{c}
                </Text>
              ))}
            </Card>
          )}

          {resp.suggestions && resp.suggestions.length > 0 && (
            <Card>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 }}>{t("symptoms.suggestions")}</Text>
              </View>
              {resp.suggestions.map((c, i) => (
                <Text key={i} style={{ color: colors.text, fontSize: 13, marginTop: 4 }}>
                  <Text style={{ color: colors.primary }}>✓  </Text>{c}
                </Text>
              ))}
            </Card>
          )}

          {resp.ayurveda && resp.ayurveda.length > 0 && (
            <Card style={{ borderColor: colors.success + "55", backgroundColor: colors.success + "0d" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Ionicons name="leaf" size={16} color={colors.success} />
                <Text style={{ color: colors.success, fontWeight: "700", fontSize: 14 }}>{t("symptoms.ayurveda")}</Text>
              </View>
              {resp.ayurveda.map((c, i) => (
                <Text key={i} style={{ color: colors.text, fontSize: 13, marginTop: 4 }}>🌿  {c}</Text>
              ))}
              <Text style={{ color: colors.muted, fontSize: 11, fontStyle: "italic", marginTop: 10 }}>{t("symptoms.ayurDisclaimer")}</Text>
            </Card>
          )}

          <View style={{ backgroundColor: colors.warn + "1a", borderColor: colors.warn + "55", borderWidth: 1, borderRadius: radii.md, padding: 12, flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
            <Ionicons name="alert-circle" size={18} color={colors.warn} style={{ marginTop: 1 }} />
            <Text style={{ color: colors.text, fontSize: 12, flex: 1, lineHeight: 18 }}>{t("symptoms.disclaimer")}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}
