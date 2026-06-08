import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Notifications from 'expo-notifications';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { setLanguage } from '@/lib/i18n';
import { Colors } from '@/lib/theme';
import { Card, GradientButton, OutlineButton } from '@/components/UI';

const LANGS = [{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिंदी' }, { value: 'gu', label: 'ગુજરાતી' }];

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [language, setLang] = useState(i18n.language || 'en');
  const [busy, setBusy] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('name,language').eq('id', user.id).maybeSingle().then(({ data }) => {
      if (data?.name) setName(data.name);
      if (data?.language) setLang(data.language);
    });
    Notifications.getPermissionsAsync().then(({ status }) => setNotifEnabled(status === 'granted'));
  }, [user]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from('profiles').update({ name, language, updated_at: new Date().toISOString() }).eq('id', user.id);
    setBusy(false);
    if (error) return Alert.alert('Error', error.message);
    await setLanguage(language);
    Alert.alert('✓', t('settings.saved'));
  };

  const updatePassword = async () => {
    if (newPw.length < 6) return Alert.alert('Error', t('auth.passwordTooShort'));
    if (newPw !== confirmPw) return Alert.alert('Error', t('auth.passwordMismatch'));
    setPwBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwBusy(false);
    if (error) return Alert.alert('Error', error.message);
    setNewPw(''); setConfirmPw('');
    Alert.alert('✓', t('auth.passwordUpdated'));
  };

  const requestNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotifEnabled(status === 'granted');
    if (status === 'granted') Alert.alert('✓', t('notifications.enabled'));
    else Alert.alert('Blocked', t('notifications.blocked'));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('settings.title')}</Text>

      {/* Profile */}
      <Card style={{ marginTop: 20 }}>
        <Text style={styles.sectionTitle}>{t('settings.profile')}</Text>
        <Text style={styles.label}>{t('auth.email')}</Text>
        <View style={styles.readonlyInput}>
          <Text style={styles.readonlyText}>{user?.email ?? ''}</Text>
        </View>
        <Text style={styles.hint}>{t('settings.emailReadonly')}</Text>

        <Text style={[styles.label, { marginTop: 14 }]}>{t('auth.name')}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={Colors.mutedForeground} />

        <Text style={[styles.label, { marginTop: 14 }]}>{t('settings.language')}</Text>
        <View style={styles.langRow}>
          {LANGS.map((l) => (
            <TouchableOpacity key={l.value} onPress={() => setLang(l.value)}
              style={[styles.langChip, language === l.value && styles.langChipActive]}>
              <Text style={[styles.langChipText, language === l.value && styles.langChipTextActive]}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <GradientButton title={busy ? '...' : t('settings.save')} onPress={save} disabled={busy} style={{ marginTop: 18 }} />
      </Card>

      {/* Notifications */}
      <Card style={{ marginTop: 14 }}>
        <Text style={styles.sectionTitle}>{t('notifications.title')}</Text>
        <Text style={styles.sectionSub}>{t('notifications.sub')}</Text>
        <View style={styles.notifRow}>
          <View style={styles.notifLeft}>
            <Ionicons name={notifEnabled ? 'notifications' : 'notifications-off-outline'} size={22} color={notifEnabled ? Colors.primary : Colors.mutedForeground} />
            <View>
              <Text style={styles.notifLabel}>{t('notifications.enable')}</Text>
              <Text style={styles.notifStatus}>{notifEnabled ? t('notifications.enabled') : ''}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={requestNotifications} disabled={notifEnabled}
            style={[styles.permBtn, notifEnabled && { opacity: 0.5 }]}>
            <Text style={styles.permBtnText}>{t('notifications.permRequest')}</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Change Password */}
      <Card style={{ marginTop: 14 }}>
        <View style={styles.sectionHeader}>
          <Ionicons name="key-outline" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>{t('auth.updatePassword')}</Text>
        </View>
        <Text style={styles.sectionSub}>{t('auth.updatePasswordSub')}</Text>

        <Text style={[styles.label, { marginTop: 14 }]}>{t('auth.newPassword')}</Text>
        <View style={styles.pwWrap}>
          <TextInput style={[styles.input, { flex: 1, borderWidth: 0 }]} value={newPw} onChangeText={setNewPw} secureTextEntry={!showNewPw} placeholder="••••••••" placeholderTextColor={Colors.mutedForeground} />
          <TouchableOpacity onPress={() => setShowNewPw(!showNewPw)} style={styles.eyeBtn}>
            <Ionicons name={showNewPw ? 'eye-off' : 'eye'} size={20} color={Colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { marginTop: 14 }]}>{t('auth.confirmPassword')}</Text>
        <View style={styles.pwWrap}>
          <TextInput style={[styles.input, { flex: 1, borderWidth: 0 }]} value={confirmPw} onChangeText={setConfirmPw} secureTextEntry={!showConfirmPw} placeholder="••••••••" placeholderTextColor={Colors.mutedForeground} />
          <TouchableOpacity onPress={() => setShowConfirmPw(!showConfirmPw)} style={styles.eyeBtn}>
            <Ionicons name={showConfirmPw ? 'eye-off' : 'eye'} size={20} color={Colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        <GradientButton title={pwBusy ? '...' : t('auth.updatePassword')} onPress={updatePassword} disabled={pwBusy || !newPw} style={{ marginTop: 18 }} />
      </Card>

      {/* Logout */}
      <Card style={{ marginTop: 14 }}>
        <OutlineButton title={t('settings.logout')} onPress={logout} destructive style={{ width: '100%' }} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.foreground, letterSpacing: -0.5 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.foreground, marginBottom: 14 },
  sectionSub: { fontSize: 13, color: Colors.mutedForeground, marginBottom: 14, marginTop: -10 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginBottom: 6 },
  input: { height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, fontSize: 14, color: Colors.foreground, backgroundColor: Colors.background },
  readonlyInput: { height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, justifyContent: 'center', backgroundColor: Colors.muted },
  readonlyText: { fontSize: 14, color: Colors.mutedForeground },
  hint: { fontSize: 12, color: Colors.mutedForeground, marginTop: 4 },
  langRow: { flexDirection: 'row', gap: 10 },
  langChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border },
  langChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  langChipText: { color: Colors.foreground, fontWeight: '600' },
  langChipTextActive: { color: Colors.primary },
  notifRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: Colors.border },
  notifLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifLabel: { fontSize: 14, fontWeight: '600', color: Colors.foreground },
  notifStatus: { fontSize: 12, color: Colors.success, marginTop: 1 },
  permBtn: { backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  permBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  pwWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background, paddingRight: 12 },
  eyeBtn: { padding: 4 },
});
