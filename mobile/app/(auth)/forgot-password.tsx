import { useState } from "react";
import { Text, ScrollView, Alert } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { Button, Card, Field } from "@/components/UI";
import { Input } from "@/components/Input";
import { colors } from "@/lib/theme";

export default function Forgot() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const send = async () => {
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setBusy(false);
    if (error) return Alert.alert("Reset", error.message);
    Alert.alert("Reset", t("auth.resetSent"));
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: "700", marginTop: 24 }}>{t("auth.forgotTitle")}</Text>
        <Text style={{ color: colors.muted }}>{t("auth.forgotSub")}</Text>
        <Card style={{ gap: 14 }}>
          <Field label={t("auth.email")}><Input value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" /></Field>
          <Button title={t("auth.sendReset")} loading={busy} onPress={send} />
        </Card>
        <Link href="/(auth)/login" style={{ color: colors.primary, textAlign: "center" }}>{t("auth.backToLogin")}</Link>
      </ScrollView>
    </SafeAreaView>
  );
}
