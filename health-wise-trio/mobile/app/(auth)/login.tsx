import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/lib/theme';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

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
  submitBtn: { height: 50, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  forgotWrap: { alignItems: 'center', marginTop: 14 },
  forgotText: { color: Colors.mutedForeground, fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: Colors.mutedForeground, fontSize: 14 },
  footerLink: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
});
