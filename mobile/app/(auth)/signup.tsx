import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { Button, Card, Field } from "@/components/UI";
import { Input } from "@/components/Input";
import { colors } from "@/lib/theme";

export default function Signup() {
  const { t } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, language: "en" } },
    });
    setBusy(false);
    if (error) return Alert.alert("Sign up", error.message);
    Alert.alert("Check email", "Confirm your email to sign in.");
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: "700", marginTop: 24 }}>{t("auth.signupTitle")}</Text>
        <Text style={{ color: colors.muted }}>{t("auth.signupSub")}</Text>
        <Card style={{ gap: 14, marginTop: 16 }}>
          <Field label={t("auth.name")}><Input value={name} onChangeText={setName} /></Field>
          <Field label={t("auth.email")}><Input value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" /></Field>
          <Field label={t("auth.password")}><Input value={password} onChangeText={setPassword} secureTextEntry /></Field>
          <Button title={t("auth.submitSignup")} loading={busy} onPress={submit} />
        </Card>
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
          <Text style={{ color: colors.muted }}>{t("auth.haveAccount")}</Text>
          <Link href="/(auth)/login" style={{ color: colors.primary, fontWeight: "600" }}>{t("nav.login")}</Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
