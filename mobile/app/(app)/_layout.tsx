import { Tabs, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { colors } from "@/lib/theme";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.55 }}>{label}</Text>;
}

export default function AppLayout() {
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
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard", tabBarLabel: "Home", tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} /> }} />
      <Tabs.Screen name="medicines" options={{ title: "Medicines", tabBarLabel: "Meds", tabBarIcon: ({ focused }) => <TabIcon label="💊" focused={focused} /> }} />
      <Tabs.Screen name="log" options={{ title: "Health Log", tabBarLabel: "Log", tabBarIcon: ({ focused }) => <TabIcon label="📝" focused={focused} /> }} />
      <Tabs.Screen name="family" options={{ title: "Family", tabBarIcon: ({ focused }) => <TabIcon label="👨‍👩‍👧" focused={focused} /> }} />
      <Tabs.Screen name="symptoms" options={{ title: "AI Symptoms", tabBarLabel: "AI", tabBarIcon: ({ focused }) => <TabIcon label="✨" focused={focused} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ focused }) => <TabIcon label="⚙️" focused={focused} /> }} />
      <Tabs.Screen name="onboarding" options={{ href: null }} />
    </Tabs>
  );
}
