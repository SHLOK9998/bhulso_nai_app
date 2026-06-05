import React, { useEffect, useState } from "react";
import { Tabs, Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { colors } from "@/lib/theme";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

function TabIcon({ name, focused }: { name: any; focused: boolean }) {
  return <Ionicons name={focused ? name : `${name}-outline`} size={22} color={focused ? colors.primary : colors.subtle} />;
}

export default function AppLayout() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!user) { setChecking(false); return; }
    supabase.from("profiles").select("onboarded").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (!alive) return;
      setNeedsOnboarding(!data?.onboarded);
      setChecking(false);
    });
    return () => { alive = false; };
  }, [user]);

  if (loading || checking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  if (!user) return <Redirect href="/(auth)/login" />;
  if (needsOnboarding) return <Redirect href="/(app)/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface, shadowColor: "transparent", elevation: 0, borderBottomWidth: 1, borderBottomColor: colors.border },
        headerTitleStyle: { color: colors.text, fontWeight: "800", fontSize: 18 },
        headerTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtle,
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: t("nav.dashboard", "Dashboard"), tabBarLabel: t("nav.dashboard", "Home"), tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} /> }} />
      <Tabs.Screen name="medicines" options={{ title: t("nav.medicines", "Medicines"), tabBarLabel: t("nav.medicines", "Meds"), tabBarIcon: ({ focused }) => <TabIcon name="medkit" focused={focused} /> }} />
      <Tabs.Screen name="log" options={{ title: t("nav.log", "Health Log"), tabBarLabel: t("nav.log", "Log"), tabBarIcon: ({ focused }) => <TabIcon name="clipboard" focused={focused} /> }} />
      <Tabs.Screen name="family" options={{ title: t("nav.family", "Family"), tabBarLabel: t("nav.family", "Family"), tabBarIcon: ({ focused }) => <TabIcon name="people" focused={focused} /> }} />
      <Tabs.Screen name="symptoms" options={{ title: t("nav.symptoms", "AI Symptoms"), tabBarLabel: t("nav.symptoms", "AI"), tabBarIcon: ({ focused }) => <TabIcon name="sparkles" focused={focused} /> }} />
      <Tabs.Screen name="settings" options={{ title: t("nav.settings", "Settings"), tabBarLabel: t("nav.settings", "Settings"), tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} /> }} />
      <Tabs.Screen name="onboarding" options={{ href: null }} />
    </Tabs>
  );
}
