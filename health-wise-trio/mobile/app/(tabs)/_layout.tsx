import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { FloatingChatbot } from '@/components/FloatingChatbot';

export default function TabsLayout() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace('/(auth)/login');
  }, [user, loading]);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.mutedForeground,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            paddingBottom: Platform.OS === 'ios' ? 24 : 14,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 84 : 72,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tabs.Screen name="dashboard" options={{ title: t('nav.dashboard'), tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={24} color={color} /> }} />
        <Tabs.Screen name="medicines" options={{ title: t('nav.medicines'), tabBarIcon: ({ color }) => <Ionicons name="medical-outline" size={24} color={color} /> }} />
        <Tabs.Screen name="log" options={{ title: t('nav.log'), tabBarIcon: ({ color }) => <Ionicons name="journal-outline" size={24} color={color} /> }} />
        <Tabs.Screen name="family" options={{ title: t('nav.family'), tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={24} color={color} /> }} />
        <Tabs.Screen name="symptoms" options={{ href: null }} />
        <Tabs.Screen name="settings" options={{ title: t('nav.settings'), tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} /> }} />
      </Tabs>
      <FloatingChatbot />
    </>
  );
}
