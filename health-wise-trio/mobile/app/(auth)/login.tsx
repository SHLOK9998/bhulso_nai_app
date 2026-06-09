import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert, Modal } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/lib/theme';
import { setLanguage } from '@/lib/i18n';

const LANGS = [{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिंदी' }, { value: 'gu', label: 'ગુજરાતી' }];

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);

  const currentLang = i18n.language || 'en';

  const submit = async () => {
    if (!email || !password) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) Alert.alert('Error', error.message);
    else router.replace('/(tabs)/dashboard');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Language Settings Button */}
        <TouchableOpacity style={styles.langSettingsBtn} onPress={() => setLangModalVisible(true)} activeOpacity={0.7}>
          <Ionicons name="globe-outline" size={22} color={Colors.mutedForeground} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoWrap}>
          <LinearGradient colors={['#0EA5A4', '#3ABFBE']} style={styles.logoCircle}>
            <Ionicons name="heart" size={28} color="#fff" />
          </LinearGradient>
          <Text style={styles.appName}>HealthMate AI</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{t('auth.loginTitle')}</Text>
          <Text style={styles.sub}>{t('auth.loginSub')}</Text>

          <View style={styles.form}>
            <Text style={styles.label}>{t('auth.email')}</Text>
            <TextInput
              style={styles.input} value={email} onChangeText={setEmail}
              keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
              placeholder="you@example.com" placeholderTextColor={Colors.mutedForeground}
            />

            <Text style={[styles.label, { marginTop: 14 }]}>{t('auth.password')}</Text>
            <View style={styles.pwWrap}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
                value={password} onChangeText={setPassword}
                secureTextEntry={!showPw} placeholder="••••••••"
                placeholderTextColor={Colors.mutedForeground}
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                <Ionicons name={showPw ? 'eye-off' : 'eye'} size={20} color={Colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={submit} disabled={busy} activeOpacity={0.8} style={{ marginTop: 20, borderRadius: 14, overflow: 'hidden' }}>
              <LinearGradient colors={['#0EA5A4', '#3ABFBE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.submitBtn}>
                <Text style={styles.submitText}>{busy ? '...' : t('auth.submitLogin')}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity style={styles.forgotWrap}>
                <Text style={styles.forgotText}>{t('auth.forgotLink')}</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.noAccount')} </Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity><Text style={styles.footerLink}>{t('nav.signup')}</Text></TouchableOpacity>
          </Link>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal visible={langModalVisible} transparent animationType="slide" onRequestClose={() => setLangModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setLangModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('auth.selectLanguage', 'Select Language')}</Text>
              <TouchableOpacity onPress={() => setLangModalVisible(false)} style={{ padding: 4 }}>
                <Ionicons name="close" size={24} color={Colors.foreground} />
              </TouchableOpacity>
            </View>
            {LANGS.map((l) => (
              <TouchableOpacity key={l.value} onPress={() => {
                setLanguage(l.value);
                setLangModalVisible(false);
              }} style={[styles.langOption, currentLang === l.value && styles.langOptionActive]}>
                <Text style={[styles.langOptionText, currentLang === l.value && styles.langOptionTextActive]}>{l.label}</Text>
                {currentLang === l.value && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logoCircle: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  appName: { fontSize: 22, fontWeight: '800', color: Colors.foreground, letterSpacing: -0.5 },
  card: { backgroundColor: Colors.card, borderRadius: 22, padding: 24, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 3 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.foreground, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: Colors.mutedForeground, marginTop: 4 },
  langSettingsBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    right: 24,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.foreground,
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.background,
  },
  langOptionActive: {
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  langOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground,
  },
  langOptionTextActive: {
    color: Colors.primary,
  },
  form: { marginTop: 10 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginBottom: 6 },
  input: { height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, fontSize: 15, color: Colors.foreground, backgroundColor: Colors.background, marginBottom: 4 },
  pwWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background, paddingRight: 12 },
  eyeBtn: { padding: 4 },
  submitBtn: { height: 50, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  forgotWrap: { alignItems: 'center', marginTop: 14 },
  forgotText: { color: Colors.mutedForeground, fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: Colors.mutedForeground, fontSize: 14 },
  footerLink: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
});
