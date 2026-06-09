import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Colors } from '@/lib/theme';
import { GradientButton, OutlineButton, Card } from '@/components/UI';

const GOALS = ['fitness', 'weight', 'chronic', 'sleep', 'stress'] as const;
const GENDERS = ['male', 'female', 'other'] as const;

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('other');
  const [conditions, setConditions] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [wake, setWake] = useState('07:00');
  const [sleep, setSleep] = useState('23:00');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('onboarded').eq('id', user.id).maybeSingle().then(({ data }) => {
      if (data?.onboarded) router.replace('/(tabs)/dashboard');
    });
  }, [user]);

  const toggleGoal = (g: string) => setGoals((cur) => cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]);

  const finish = async (skip = false) => {
    if (!user) return;
    setBusy(true);
    const base = { onboarded: true, updated_at: new Date().toISOString() };
    const payload = skip ? base : {
      ...base, age: age ? Number(age) : null, gender,
      conditions: conditions.split(',').map((s) => s.trim()).filter(Boolean),
      goals, wake_time: wake, sleep_time: sleep,
    };
    const { error } = await supabase.from('profiles').update(payload).eq('id', user.id);
    setBusy(false);
    if (error) return Alert.alert('Error', error.message);
    router.replace('/(tabs)/dashboard');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{t('onboarding.title')}</Text>
      <Text style={styles.sub}>{t('onboarding.sub')}</Text>

      <Card style={{ marginTop: 20 }}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{t('onboarding.age')}</Text>
            <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="e.g. 28" placeholderTextColor={Colors.mutedForeground} />
          </View>
          <View style={{ width: 14 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{t('onboarding.gender')}</Text>
            <View style={styles.chipRow}>
              {GENDERS.map((g) => (
                <TouchableOpacity key={g} onPress={() => setGender(g)}
                  style={[styles.chip, gender === g && styles.chipActive]}>
                  <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{t(`onboarding.${g}`)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>{t('onboarding.conditions')}</Text>
        <TextInput style={styles.input} value={conditions} onChangeText={setConditions} placeholder={t('onboarding.conditionsPh')} placeholderTextColor={Colors.mutedForeground} />

        <Text style={[styles.label, { marginTop: 16 }]}>{t('onboarding.goals')}</Text>
        <View style={styles.chipRow}>
          {GOALS.map((g) => (
            <TouchableOpacity key={g} onPress={() => toggleGoal(g)}
              style={[styles.chip, goals.includes(g) && styles.chipActive]}>
              <Text style={[styles.chipText, goals.includes(g) && styles.chipTextActive]}>{t(`onboarding.goalsList.${g}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { marginTop: 16 }]}>{t('onboarding.wake')}</Text>
            <TextInput style={styles.input} value={wake} onChangeText={setWake} placeholder="07:00" placeholderTextColor={Colors.mutedForeground} />
          </View>
          <View style={{ width: 14 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { marginTop: 16 }]}>{t('onboarding.sleep')}</Text>
            <TextInput style={styles.input} value={sleep} onChangeText={setSleep} placeholder="23:00" placeholderTextColor={Colors.mutedForeground} />
          </View>
        </View>

        <View style={[styles.row, { marginTop: 24, gap: 12 }]}>
          <OutlineButton title={t('onboarding.skip')} onPress={() => finish(true)} style={{ flex: 1 }} />
          <GradientButton title={busy ? '...' : t('onboarding.finish')} onPress={() => finish(false)} loading={busy} style={{ flex: 2 }} />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.foreground, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: Colors.mutedForeground, marginTop: 4 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginBottom: 6 },
  input: { height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, fontSize: 14, color: Colors.foreground, backgroundColor: Colors.background },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  chipText: { color: Colors.foreground, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: Colors.primary },
});
