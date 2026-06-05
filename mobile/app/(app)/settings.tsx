import { useEffect, useState } from "react";
import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { setLanguage } from "@/lib/i18n";
import { Card, Button, Field } from "@/components/UI";
import { Input } from "@/components/Input";
import { colors, radii } from "@/lib/theme";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [alarms, setAlarms] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("alarms").then((v) => setAlarms(v !== "false"));
    if (user) supabase.from("profiles").select("name").eq("id", user.id).maybeSingle().then(({ data }) => setName(data?.name ?? ""));
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").update({ name, language: i18n.language, updated_at: new Date().toISOString() }).eq("id", user.id);
    setSavingProfile(false);
    if (error) return Alert.alert("Profile", error.message);
    Alert.alert("Profile", t("settings.saved"));
  };

  const setLang = (lng: string) => { setLanguage(lng); };

  const updatePassword = async () => {
    if (pw.length < 6) return Alert.alert("Password", "Min 6 characters");
    if (pw !== pw2) return Alert.alert("Password", "Passwords don't match");
    setPwBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setPwBusy(false);
    if (error) return Alert.alert("Update", error.message);
    setPw(""); setPw2("");
    Alert.alert("Password", t("auth.passwordUpdated"));
  };

  const toggleAlarms = async () => {
    const next = !alarms;
    setAlarms(next);
    await AsyncStorage.setItem("alarms", String(next));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 32 }}>
      <Text style={{ color: colors.text, fontSize: 26, fontWeight: "800" }}>{t("settings.title")}</Text>

      {/* Profile */}
      <Card style={{ gap: 14 }}>
        <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{t("settings.profile")}</Text>
        <Field label={t("auth.email")}>
          <Input value={user?.email ?? ""} editable={false} style={{ backgroundColor: colors.cardAlt, color: colors.muted }} />
        </Field>
        <Field label={t("auth.name")}>
          <Input value={name} onChangeText={setName} />
        </Field>
        <Field label={t("settings.language") ?? "Language"}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[{ k: "en", l: "English" }, { k: "hi", l: "हिंदी" }, { k: "gu", l: "ગુજરાતી" }].map((x) => (
              <Pressable key={x.k} onPress={() => setLang(x.k)} style={{ flex: 1, padding: 12, borderRadius: radii.md, backgroundColor: i18n.language === x.k ? colors.primary : colors.surface, borderWidth: 1, borderColor: i18n.language === x.k ? colors.primary : colors.border }}>
                <Text style={{ color: i18n.language === x.k ? "#fff" : colors.text, textAlign: "center", fontWeight: "600", fontSize: 13 }}>{x.l}</Text>
              </Pressable>
            ))}
          </View>
        </Field>
        <Button title={t("settings.save")} loading={savingProfile} onPress={saveProfile} />
      </Card>

      {/* Notifications */}
      <Card>
        <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{t("notifications.title")}</Text>
        <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>{t("notifications.sub")}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14, padding: 12, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 }}>{t("notifications.enable")}</Text>
            <Text style={{ color: colors.muted, fontSize: 12 }}>Daily medicine reminders</Text>
          </View>
          <Pressable onPress={toggleAlarms} style={{ width: 52, height: 30, borderRadius: 15, backgroundColor: alarms ? colors.primary : colors.border, justifyContent: "center", paddingHorizontal: 3 }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#fff", alignSelf: alarms ? "flex-end" : "flex-start" }} />
          </Pressable>
        </View>
      </Card>

      {/* Password */}
      <Card style={{ gap: 12 }}>
        <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>🔑 {t("auth.updatePassword")}</Text>
        <Text style={{ color: colors.muted, fontSize: 13 }}>{t("auth.updatePasswordSub")}</Text>
        <Field label={t("auth.newPassword")}><Input value={pw} onChangeText={setPw} secureTextEntry /></Field>
        <Field label={t("auth.confirmPassword")}><Input value={pw2} onChangeText={setPw2} secureTextEntry /></Field>
        <Button title={t("auth.updatePassword")} loading={pwBusy} onPress={updatePassword} />
      </Card>

      <Card>
        <Button title={t("settings.logout") ?? "Sign out"} variant="outline" onPress={() => supabase.auth.signOut()} />
      </Card>
    </ScrollView>
  );
}
