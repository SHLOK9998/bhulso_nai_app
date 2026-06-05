import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { Button, Card, Field } from "@/components/UI";
import { Input } from "@/components/Input";
import { colors, radii, shadows } from "@/lib/theme";
import { LinearGradient } from "expo-linear-gradient";

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return Alert.alert(t("auth.loginTitle"), error.message);
    router.replace("/(app)/dashboard");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingTop: 40 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center", gap: 12, marginTop: 20 }}>
          <LinearGradient colors={colors.gradPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 56, height: 56, borderRadius: radii.md, alignItems: "center", justifyContent: "center", ...shadows.glow }}>
            <Text style={{ fontSize: 28 }}>❤️</Text>
          </LinearGradient>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800", letterSpacing: -0.3 }}>HealthMate AI</Text>
        </View>

        <Card style={{ padding: 24, gap: 16 }}>
          <View>
            <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>{t("auth.loginTitle")}</Text>
            <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>{t("auth.loginSub")}</Text>
          </View>
          <Field label={t("auth.email")}>
            <Input value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
          </Field>
          <Field label={t("auth.password")}>
            <Input value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
          </Field>
          <Button title={t("auth.submitLogin")} loading={busy} onPress={submit} />
          <Link href="/(auth)/forgot-password" style={{ color: colors.muted, textAlign: "center", fontSize: 13 }}>
            {t("auth.forgotLink")}
          </Link>
        </Card>
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
          <Text style={{ color: colors.muted }}>{t("auth.noAccount")}</Text>
          <Link href="/(auth)/signup" style={{ color: colors.primary, fontWeight: "700" }}>
            {t("nav.signup")}
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
