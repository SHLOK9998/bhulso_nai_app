import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/lib/theme';
import { Card } from '@/components/UI';
import { supabase } from '@/lib/supabase';

type AIResp = {
  language?: string; summary?: string; causes?: string[];
  suggestions?: string[]; ayurveda?: string[];
  urgency?: 'low' | 'medium' | 'high'; error?: string;
};

const SUPABASE_URL = 'https://qnscenrjpufcuwioglrc.supabase.co';

const SYS = `You are HealthMate AI, a careful trilingual (English/Hindi/Gujarati) wellness companion.
You NEVER diagnose. You provide safe, general self-care guidance and clearly flag when professional care is needed.
Detect the user's input language and respond ENTIRELY in that same language (en, hi, or gu).
Return STRICT JSON only — no markdown, no prose around it.

JSON shape:
{
  "language": "en"|"hi"|"gu",
  "summary": string,                 // 1 short sentence rephrasing what the user said
  "causes": string[],                // 2-4 plain possible causes
  "suggestions": string[],           // 2-5 safe self-care actions (rest, hydration, OTC categories)
  "ayurveda": string[],              // 2-4 traditional Indian home remedies (e.g., tulsi tea, haldi milk, ginger, ajwain)
  "urgency": "low"|"medium"|"high"   // high = seek urgent care
}

Rules:
- Never name prescription drugs or doses.
- If symptoms suggest emergency (chest pain, stroke signs, heavy bleeding, breathing trouble), set urgency "high" and tell them to seek immediate care.
- Keep each list item short (max ~12 words).`;

export default function SymptomsScreen() {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [resp, setResp] = useState<AIResp | null>(null);

  const send = async () => {
    if (!input.trim()) return;
    setBusy(true);
    setResp(null);
    try {
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://bhulso-nai-app.vercel.app';
      const url = `${backendUrl}/api/analyze-symptoms`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: `${input}\nPreferred Language: ${i18n.language}`
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Gemini mobile screen error:", errorText);
        throw new Error("Gemini API call failed");
      }

      const rawData = await res.json();
      const textResponse = rawData.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
      const data: AIResp = JSON.parse(textResponse);

      if (data.error) Alert.alert('Error', data.error ?? 'Failed');
      else setResp(data);
    } catch (e) {
      console.error("Symptoms send error:", e);
      Alert.alert('Error', t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  const urgencyColor = resp?.urgency === 'high' ? Colors.destructive : resp?.urgency === 'medium' ? Colors.warning : Colors.success;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.headerRow}>
        <LinearGradient colors={['#0EA5A4', '#2563EB']} style={styles.headerIcon}>
          <Ionicons name="sparkles" size={24} color="#fff" />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t('symptoms.title')}</Text>
          <Text style={styles.sub}>{t('symptoms.sub')}</Text>
        </View>
      </View>

      {/* Input */}
      <View style={styles.inputCard}>
        <TextInput
          style={styles.textarea}
          value={input}
          onChangeText={setInput}
          placeholder={t('symptoms.placeholder')}
          placeholderTextColor={Colors.mutedForeground}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
        <TouchableOpacity
          onPress={send}
          disabled={busy || !input.trim()}
          activeOpacity={0.8}
          style={[styles.sendBtn, (!input.trim() || busy) && { opacity: 0.5 }]}>
          <LinearGradient colors={['#0EA5A4', '#2563EB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sendGradient}>
            {busy
              ? <ActivityIndicator color="#fff" size="small" />
              : <><Text style={styles.sendText}>{t('symptoms.send')}</Text><Ionicons name="send" size={16} color="#fff" /></>
            }
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {resp && (
        <>
          <Card style={{ marginTop: 16 }}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>{resp.summary}</Text>
              {resp.urgency && (
                <View style={[styles.urgencyBadge, { backgroundColor: urgencyColor + '22' }]}>
                  <Ionicons name="warning-outline" size={13} color={urgencyColor} />
                  <Text style={[styles.urgencyText, { color: urgencyColor }]}>{t(`symptoms.${resp.urgency}`)}</Text>
                </View>
              )}
            </View>
          </Card>

          {resp.causes && resp.causes.length > 0 && (
            <Card style={{ marginTop: 12 }}>
              <View style={styles.sectionHeader}>
                <Ionicons name="heart-outline" size={18} color={Colors.primary} />
                <Text style={styles.sectionTitle}>{t('symptoms.causes')}</Text>
              </View>
              {resp.causes.map((c, i) => (
                <Text key={i} style={styles.bulletItem}><Text style={{ color: Colors.primary }}>• </Text>{c}</Text>
              ))}
            </Card>
          )}

          {resp.suggestions && resp.suggestions.length > 0 && (
            <Card style={{ marginTop: 12 }}>
              <Text style={styles.sectionTitle}>{t('symptoms.suggestions')}</Text>
              {resp.suggestions.map((c, i) => (
                <Text key={i} style={styles.bulletItem}><Text style={{ color: Colors.success }}>✓ </Text>{c}</Text>
              ))}
            </Card>
          )}

          {resp.ayurveda && resp.ayurveda.length > 0 && (
            <Card style={[styles.ayurCard, { marginTop: 12 }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="leaf-outline" size={18} color={Colors.success} />
                <Text style={[styles.sectionTitle, { color: Colors.success }]}>{t('symptoms.ayurveda')}</Text>
              </View>
              {resp.ayurveda.map((c, i) => (
                <Text key={i} style={styles.bulletItem}>🌿 {c}</Text>
              ))}
              <Text style={styles.ayurDisclaimer}>{t('symptoms.ayurDisclaimer')}</Text>
            </Card>
          )}

          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>⚠️ {t('symptoms.disclaimer')}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 30 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  headerIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: Colors.foreground, letterSpacing: -0.4 },
  sub: { fontSize: 13, color: Colors.mutedForeground, marginTop: 2 },
  inputCard: { backgroundColor: Colors.card, borderRadius: 18, borderWidth: 1.5, borderColor: Colors.border, overflow: 'hidden', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  textarea: { minHeight: 130, padding: 16, fontSize: 15, color: Colors.foreground, textAlignVertical: 'top' },
  sendBtn: { margin: 10, marginTop: 0, borderRadius: 14, overflow: 'hidden' },
  sendGradient: { flexDirection: 'row', height: 46, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 20 },
  sendText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  summaryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  summaryText: { flex: 1, fontSize: 14, fontWeight: '500', color: Colors.foreground, lineHeight: 20 },
  urgencyBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  urgencyText: { fontSize: 12, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.foreground },
  bulletItem: { fontSize: 14, color: Colors.foreground, lineHeight: 22, marginBottom: 4 },
  ayurCard: { borderWidth: 1, borderColor: Colors.success + '44', backgroundColor: Colors.success + '08' },
  ayurDisclaimer: { fontSize: 11, color: Colors.mutedForeground, fontStyle: 'italic', marginTop: 10 },
  disclaimerBox: { marginTop: 14, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: Colors.warning + '55', backgroundColor: Colors.warning + '12' },
  disclaimerText: { fontSize: 13, color: Colors.foreground, lineHeight: 19 },
});
