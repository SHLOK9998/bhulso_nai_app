import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Platform, Modal } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { dbGetProfile, dbUpdateProfile } from '@/lib/offlineDb';
import { useAuth } from '@/lib/auth';
import { Colors } from '@/lib/theme';
import { GradientButton, OutlineButton, Card } from '@/components/UI';
import { Ionicons } from '@expo/vector-icons';

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

  // Time picker states
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'wake' | 'sleep' | null>(null);
  const [pickerValue, setPickerValue] = useState('07:00');

  useEffect(() => {
    if (!user) return;
    dbGetProfile(user.id).then(({ data }) => {
      if (data?.onboarded) router.replace('/(tabs)/dashboard');
    });
  }, [user]);

  const toggleGoal = (g: string) => setGoals((cur) => cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]);

  const finish = async (skip = false) => {
    if (!user) return;
    setBusy(true);
    const base = { onboarded: true };
    const payload = skip ? base : {
      ...base, age: age ? Number(age) : null, gender,
      conditions: conditions.split(',').map((s) => s.trim()).filter(Boolean),
      goals, wake_time: wake, sleep_time: sleep,
    };
    const { error } = await dbUpdateProfile(user.id, payload);
    setBusy(false);
    if (error) return Alert.alert('Error', error.message);
    router.replace('/(tabs)/dashboard');
  };

  const openTimePicker = (target: 'wake' | 'sleep') => {
    setPickerTarget(target);
    setPickerValue(target === 'wake' ? wake : sleep);
    setPickerVisible(true);
  };

  const handleTimeSelect = (val: string) => {
    if (pickerTarget === 'wake') {
      setWake(val);
    } else if (pickerTarget === 'sleep') {
      setSleep(val);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {/* Icon and Greeting Header */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="heart-outline" size={36} color={Colors.primary} />
        </View>
        <Text style={styles.title}>{t('onboarding.title')}</Text>
        <Text style={styles.sub}>{t('onboarding.sub')}</Text>
      </View>

      <Card style={{ marginTop: 24, padding: 20 }}>
        {/* Age Input */}
        <Text style={styles.label}>{t('onboarding.age')}</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          placeholder="e.g. 28"
          placeholderTextColor={Colors.mutedForeground}
        />

        {/* Gender Choice (Full width row with horizontal chips) */}
        <Text style={[styles.label, { marginTop: 18 }]}>{t('onboarding.gender')}</Text>
        <View style={styles.genderRow}>
          {GENDERS.map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => setGender(g)}
              style={[styles.genderChip, gender === g && styles.genderChipActive]}
            >
              <Text style={[styles.genderChipText, gender === g && styles.genderChipTextActive]}>
                {t(`onboarding.${g}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Existing Conditions */}
        <Text style={[styles.label, { marginTop: 18 }]}>{t('onboarding.conditions')}</Text>
        <TextInput
          style={styles.input}
          value={conditions}
          onChangeText={setConditions}
          placeholder={t('onboarding.conditionsPh')}
          placeholderTextColor={Colors.mutedForeground}
        />

        {/* Goals List */}
        <Text style={[styles.label, { marginTop: 18 }]}>{t('onboarding.goals')}</Text>
        <View style={styles.goalsRow}>
          {GOALS.map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => toggleGoal(g)}
              style={[styles.goalChip, goals.includes(g) && styles.goalChipActive]}
            >
              <Text style={[styles.goalChipText, goals.includes(g) && styles.goalChipTextActive]}>
                {t(`onboarding.goalsList.${g}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Wake and Bedtime Row */}
        <View style={[styles.row, { marginTop: 18 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{t('onboarding.wake')}</Text>
            <TouchableOpacity onPress={() => openTimePicker('wake')} style={styles.timePickerBtn}>
              <Ionicons name="sunny-outline" size={18} color={Colors.primary} />
              <Text style={styles.timePickerText}>{wake}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: 16 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{t('onboarding.sleep')}</Text>
            <TouchableOpacity onPress={() => openTimePicker('sleep')} style={styles.timePickerBtn}>
              <Ionicons name="moon-outline" size={18} color={Colors.primary} />
              <Text style={styles.timePickerText}>{sleep}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Buttons */}
        <View style={[styles.row, { marginTop: 28, gap: 12 }]}>
          <OutlineButton title={t('onboarding.skip')} onPress={() => finish(true)} style={{ flex: 1 }} />
          <GradientButton title={busy ? '...' : t('onboarding.finish')} onPress={() => finish(false)} loading={busy} style={{ flex: 2 }} />
        </View>
      </Card>

      <TimePickerDialog
        visible={pickerVisible}
        value={pickerValue}
        onClose={() => setPickerVisible(false)}
        onSelect={handleTimeSelect}
      />
    </ScrollView>
  );
}

function TimePickerDialog({ visible, value, onClose, onSelect }: { visible: boolean; value: string; onClose: () => void; onSelect: (val: string) => void }) {
  const [h, m] = (value || '07:00').split(':').map(Number);
  const [hour, setHour] = useState(isNaN(h) ? 7 : h);
  const [minute, setMinute] = useState(isNaN(m) ? 0 : m);

  useEffect(() => {
    if (visible) {
      const [currH, currM] = (value || '07:00').split(':').map(Number);
      setHour(isNaN(currH) ? 7 : currH);
      setMinute(isNaN(currM) ? 0 : currM);
    }
  }, [visible, value]);

  const handleSave = () => {
    const hh = String(hour).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');
    onSelect(`${hh}:${mm}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.pickerOverlay}>
        <View style={styles.pickerCard}>
          <Text style={styles.pickerTitle}>Select Time (24h)</Text>
          <View style={styles.clockRow}>
            {/* Hour Column */}
            <View style={styles.pickerColumn}>
              <TouchableOpacity onPress={() => setHour((h) => (h + 1) % 24)} style={styles.arrowBtn}>
                <Ionicons name="chevron-up" size={28} color={Colors.primary} />
              </TouchableOpacity>
              <View style={styles.timeValueBox}>
                <Text style={styles.timeValueText}>{String(hour).padStart(2, '0')}</Text>
              </View>
              <TouchableOpacity onPress={() => setHour((h) => (h - 1 + 24) % 24)} style={styles.arrowBtn}>
                <Ionicons name="chevron-down" size={28} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.colonText}>:</Text>

            {/* Minute Column */}
            <View style={styles.pickerColumn}>
              <TouchableOpacity onPress={() => setMinute((m) => (m + 1) % 60)} style={styles.arrowBtn}>
                <Ionicons name="chevron-up" size={28} color={Colors.primary} />
              </TouchableOpacity>
              <View style={styles.timeValueBox}>
                <Text style={styles.timeValueText}>{String(minute).padStart(2, '0')}</Text>
              </View>
              <TouchableOpacity onPress={() => setMinute((m) => (m - 1 + 60) % 60)} style={styles.arrowBtn}>
                <Ionicons name="chevron-down" size={28} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.pickerActions}>
            <OutlineButton title="Cancel" onPress={onClose} style={{ flex: 1 }} />
            <GradientButton title="Confirm" onPress={handleSave} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: Platform.OS === 'android' ? 60 : 40, paddingBottom: 40 },
  header: { alignItems: 'center', marginTop: 10 },
  iconCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.foreground, textAlign: 'center', letterSpacing: -0.5 },
  sub: { fontSize: 14, color: Colors.mutedForeground, textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginBottom: 6 },
  input: { height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, fontSize: 14, color: Colors.foreground, backgroundColor: Colors.card },
  row: { flexDirection: 'row', alignItems: 'center' },
  genderRow: { flexDirection: 'row', gap: 8, width: '100%' },
  genderChip: { flex: 1, height: 42, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.card },
  genderChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  genderChipText: { color: Colors.foreground, fontWeight: '600', fontSize: 13 },
  genderChipTextActive: { color: Colors.primary },
  goalsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  goalChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.card },
  goalChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  goalChipText: { color: Colors.foreground, fontWeight: '600', fontSize: 12 },
  goalChipTextActive: { color: Colors.primary },
  timePickerBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.card,
  },
  timePickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.foreground,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerCard: {
    width: 280,
    padding: 20,
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: Colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.foreground,
    marginBottom: 20,
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  pickerColumn: {
    alignItems: 'center',
  },
  arrowBtn: {
    padding: 8,
  },
  timeValueBox: {
    width: 70,
    height: 70,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeValueText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.foreground,
  },
  colonText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.foreground,
    marginHorizontal: 12,
    paddingBottom: 4,
  },
  pickerActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
});
