import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/lib/theme';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!email) return;
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setBusy(false);
    if (error) Alert.alert('Error', error.message);
    else setSent(true);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.foreground} />
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>{t('auth.forgotTitle')}</Text>
          <Text style={styles.sub}>{sent ? t('auth.resetSent') : t('auth.forgotSub')}</Text>

          {!sent && (
            <View style={styles.form}>
              <Text style={styles.label}>{t('auth.email')}</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" placeholderTextColor={Colors.mutedForeground} />
              <TouchableOpacity onPress={submit} disabled={busy} activeOpacity={0.8} style={{ marginTop: 20, borderRadius: 14, overflow: 'hidden' }}>
                <LinearGradient colors={['#0EA5A4', '#3ABFBE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.submitBtn}>
                  <Text style={styles.submitText}>{busy ? '...' : t('auth.sendReset')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity onPress={() => router.replace('/(auth)/login')} style={styles.backLink}>
            <Text style={styles.backText}>{t('auth.backToLogin')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, padding: 24, paddingTop: 60, justifyContent: 'center' },
  back: { position: 'absolute', top: 16, left: 24, padding: 8 },
  card: { backgroundColor: Colors.card, borderRadius: 22, padding: 24, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 3 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.foreground, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: Colors.mutedForeground, marginTop: 4 },
  form: { marginTop: 20 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginBottom: 6 },
  input: { height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, fontSize: 15, color: Colors.foreground, backgroundColor: Colors.background },
  submitBtn: { height: 50, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  backLink: { alignItems: 'center', marginTop: 20 },
  backText: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
});
