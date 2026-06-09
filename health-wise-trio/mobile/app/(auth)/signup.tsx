import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { setLanguage } from '@/lib/i18n';
import { Colors } from '@/lib/theme';

const LANGS = [{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिंदी' }, { value: 'gu', label: 'ગુજરાતી' }];

export default function SignupScreen() {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLang] = useState(i18n.language || 'en');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name || !email || !password) return Alert.alert('Error', 'Please fill all fields');
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name, language } },
    });
    setBusy(false);
    if (error) return Alert.alert('Error', error.message);
    await setLanguage(language);
    router.replace('/onboarding');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <LinearGradient colors={['#0EA5A4', '#3ABFBE']} style={styles.logoCircle}>
            <Ionicons name="heart" size={28} color="#fff" />
          </LinearGradient>
          <Text style={styles.appName}>HealthMate AI</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{t('auth.signupTitle')}</Text>
          <Text style={styles.sub}>{t('auth.signupSub')}</Text>

          <View style={styles.form}>
            <Text style={styles.label}>{t('auth.name')}</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={Colors.mutedForeground} />

            <Text style={[styles.label, { marginTop: 14 }]}>{t('auth.email')}</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" placeholderTextColor={Colors.mutedForeground} />

            <Text style={[styles.label, { marginTop: 14 }]}>{t('auth.password')}</Text>
            <View style={styles.pwWrap}>
              <TextInput style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]} value={password} onChangeText={setPassword} secureTextEntry={!showPw} placeholder="••••••••" placeholderTextColor={Colors.mutedForeground} />
              <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                <Ionicons name={showPw ? 'eye-off' : 'eye'} size={20} color={Colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { marginTop: 14 }]}>{t('auth.language')}</Text>
            <View style={styles.langRow}>
              {LANGS.map((l) => (
                <TouchableOpacity key={l.value} onPress={() => {
                  setLang(l.value);
                  setLanguage(l.value);
                }}
                  style={[styles.langChip, language === l.value && styles.langChipActive]}>
                  <Text style={[styles.langChipText, language === l.value && styles.langChipTextActive]}>{l.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={submit} disabled={busy} activeOpacity={0.8} style={{ marginTop: 20, borderRadius: 14, overflow: 'hidden' }}>
              <LinearGradient colors={['#0EA5A4', '#3ABFBE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.submitBtn}>
                <Text style={styles.submitText}>{busy ? '...' : t('auth.submitSignup')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.haveAccount')} </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity><Text style={styles.footerLink}>{t('nav.login')}</Text></TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
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
  form: { marginTop: 20 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginBottom: 6 },
  input: { height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, fontSize: 15, color: Colors.foreground, backgroundColor: Colors.background, marginBottom: 4 },
  pwWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background, paddingRight: 12 },
  eyeBtn: { padding: 4 },
  langRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  langChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border },
  langChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  langChipText: { color: Colors.foreground, fontWeight: '600' },
  langChipTextActive: { color: Colors.primary },
  submitBtn: { height: 50, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: Colors.mutedForeground, fontSize: 14 },
  footerLink: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
});
