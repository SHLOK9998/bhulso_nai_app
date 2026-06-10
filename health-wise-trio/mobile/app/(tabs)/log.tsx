import { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Colors } from '@/lib/theme';
import { Card, GradientButton, SectionTitle } from '@/components/UI';
import { SwipeLayout } from '@/components/SwipeLayout';

type Log = { log_date: string; mood: number | null; sleep_hours: number | null; water_glasses: number; symptoms: string[] };

const MOODS = [
  { v: 1, e: '😔' }, { v: 2, e: '😕' }, { v: 3, e: '😐' }, { v: 4, e: '🙂' }, { v: 5, e: '😄' },
];

function monthBounds(month: string) {
  const [y, m] = month.split('-').map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 0));
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

export default function LogScreen() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'today' | 'history'>('today');

  return (
    <SwipeLayout currentTab="log">
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('log.title')}</Text>
        <Text style={styles.sub}>{t('log.today')} · {new Date().toLocaleDateString()}</Text>
      </View>
      <View style={styles.tabs}>
        {(['today', 'history'] as const).map((tb) => (
          <TouchableOpacity key={tb} onPress={() => setTab(tb)} style={[styles.tab, tab === tb && styles.tabActive]}>
            <Text style={[styles.tabText, tab === tb && styles.tabTextActive]}>
              {tb === 'today' ? t('log.tabToday') : t('log.tabHistory')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {tab === 'today' ? <TodayTab /> : <HistoryTab />}
      </View>
    </SwipeLayout>
  );
}

function TodayTab() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [mood, setMood] = useState<number | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(7);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase.from('health_logs').select('*').eq('user_id', user.id).eq('log_date', today).maybeSingle();
      if (data) {
        setMood(data.mood); setSymptoms((data.symptoms ?? []).join(', '));
        setWater(data.water_glasses); setSleep(data.sleep_hours ?? 7);
      }
    })();
  }, [user]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const today = new Date().toISOString().slice(0, 10);
    const sym = symptoms.split(',').map((s) => s.trim()).filter(Boolean);
    const { error } = await supabase.from('health_logs').upsert(
      { user_id: user.id, log_date: today, mood, symptoms: sym, water_glasses: water, sleep_hours: sleep },
      { onConflict: 'user_id,log_date' }
    );
    setBusy(false);
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('✓', t('log.saved'));
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {/* Mood */}
      <Card>
        <Text style={styles.cardLabel}>{t('log.mood')}</Text>
        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <TouchableOpacity key={m.v} onPress={() => setMood(m.v)}
              style={[styles.moodBtn, mood === m.v && styles.moodBtnActive]}>
              <Text style={styles.moodEmoji}>{m.e}</Text>
              <Text style={styles.moodLabel}>{t(`log.moods.${m.v}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Water */}
      <Card style={{ marginTop: 12 }}>
        <Text style={styles.cardLabel}>{t('log.water')}</Text>
        <View style={styles.counterRow}>
          <TouchableOpacity onPress={() => setWater(Math.max(0, water - 1))} style={styles.counterBtn}>
            <Ionicons name="remove" size={22} color={Colors.foreground} />
          </TouchableOpacity>
          <View style={styles.counterCenter}>
            <Ionicons name="water" size={34} color={Colors.secondary} />
            <Text style={styles.counterVal}>{water}</Text>
            <Text style={styles.counterSub}>/ 8 glasses</Text>
          </View>
          <TouchableOpacity onPress={() => setWater(water + 1)} style={styles.counterBtn}>
            <Ionicons name="add" size={22} color={Colors.foreground} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Sleep */}
      <Card style={{ marginTop: 12 }}>
        <Text style={styles.cardLabel}>{t('log.sleep')}: <Text style={{ color: Colors.primary }}>{sleep}h</Text></Text>
        <View style={styles.sleepRow}>
          <TouchableOpacity onPress={() => setSleep(Math.max(0, +(sleep - 0.5).toFixed(1)))} style={styles.counterBtn}>
            <Ionicons name="remove" size={22} color={Colors.foreground} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.sleepVal}>{sleep}h</Text>
            <View style={styles.sleepTrack}>
              <View style={[styles.sleepFill, { width: `${Math.min(100, (sleep / 12) * 100)}%` as any }]} />
            </View>
          </View>
          <TouchableOpacity onPress={() => setSleep(Math.min(12, +(sleep + 0.5).toFixed(1)))} style={styles.counterBtn}>
            <Ionicons name="add" size={22} color={Colors.foreground} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Symptoms */}
      <Card style={{ marginTop: 12 }}>
        <Text style={styles.cardLabel}>{t('log.symptoms')}</Text>
        <TextInput style={styles.input} value={symptoms} onChangeText={setSymptoms}
          placeholder={t('log.symptomsPh')} placeholderTextColor={Colors.mutedForeground} />
      </Card>

      <GradientButton title={busy ? '...' : t('log.save')} onPress={save} loading={busy} style={{ marginTop: 16, borderRadius: 16 }} />
    </ScrollView>
  );
}

function HistoryTab() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const today = new Date();
  const [month, setMonth] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);

  const changeMonth = (delta: number) => {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const { start, end } = monthBounds(month);
    supabase.from('health_logs')
      .select('log_date,mood,sleep_hours,water_glasses,symptoms')
      .eq('user_id', user.id).gte('log_date', start).lte('log_date', end)
      .order('log_date', { ascending: false })
      .then(({ data }) => { setLogs((data ?? []) as Log[]); setLoading(false); });
  }, [user, month]);

  const stats = useMemo(() => {
    if (logs.length === 0) return null;
    const moods = logs.filter((l) => l.mood != null).map((l) => l.mood as number);
    const sleeps = logs.filter((l) => l.sleep_hours != null).map((l) => l.sleep_hours as number);
    const avg = (a: number[]) => a.length ? +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) : 0;
    return { avgMood: avg(moods), avgSleep: avg(sleeps), avgWater: avg(logs.map((l) => l.water_glasses)), days: logs.length };
  }, [logs]);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {/* Month picker */}
      <Card>
        <View style={styles.monthRow}>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthBtn}>
            <Ionicons name="chevron-back" size={20} color={Colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{month}</Text>
          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthBtn}>
            <Ionicons name="chevron-forward" size={20} color={Colors.foreground} />
          </TouchableOpacity>
        </View>
      </Card>

      {stats && (
        <Card style={{ marginTop: 12 }}>
          <SectionTitle title={t('history.summary')} />
          <View style={styles.statsGrid}>
            {[
              { label: t('history.loggedDays'), val: `${stats.days}` },
              { label: t('history.avgMood'), val: `${stats.avgMood}/5` },
              { label: t('history.avgSleep'), val: `${stats.avgSleep}h` },
              { label: t('history.avgWater'), val: `${stats.avgWater}` },
            ].map((s) => (
              <View key={s.label} style={styles.statBox}>
                <Text style={styles.statBoxVal}>{s.val}</Text>
                <Text style={styles.statBoxLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} />
      ) : logs.length === 0 ? (
        <Card style={{ marginTop: 12, alignItems: 'center', padding: 40, gap: 10 }}>
          <Ionicons name="calendar-outline" size={38} color={Colors.mutedForeground} style={{ opacity: 0.4 }} />
          <Text style={{ color: Colors.mutedForeground }}>{t('history.noLogs')}</Text>
        </Card>
      ) : (
        logs.map((l) => (
          <Card key={l.log_date} style={{ marginTop: 10 }}>
            <View style={styles.logRow}>
              <Text style={styles.logDate}>{new Date(l.log_date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
              <Text style={styles.logMeta}>mood {l.mood ?? '-'} · {l.sleep_hours ?? '-'}h · 💧{l.water_glasses}</Text>
            </View>
            {l.symptoms?.length > 0 && <Text style={styles.logSymptoms}>{l.symptoms.join(', ')}</Text>}
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: Colors.background },
  title: { fontSize: 26, fontWeight: '800', color: Colors.foreground, letterSpacing: -0.5 },
  sub: { fontSize: 13, color: Colors.mutedForeground, marginTop: 2 },
  tabs: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 8, backgroundColor: Colors.muted, borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.card, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabText: { fontWeight: '600', fontSize: 14, color: Colors.mutedForeground },
  tabTextActive: { color: Colors.foreground },
  content: { padding: 16, paddingBottom: 30 },
  cardLabel: { fontSize: 15, fontWeight: '700', color: Colors.foreground, marginBottom: 14 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 14, borderWidth: 2, borderColor: Colors.border, marginHorizontal: 2 },
  moodBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '12' },
  moodEmoji: { fontSize: 26 },
  moodLabel: { fontSize: 10, color: Colors.mutedForeground, marginTop: 2 },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  counterBtn: { width: 44, height: 44, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  counterCenter: { alignItems: 'center', gap: 2 },
  counterVal: { fontSize: 28, fontWeight: '800', color: Colors.foreground },
  counterSub: { fontSize: 12, color: Colors.mutedForeground },
  sleepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sleepVal: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  sleepTrack: { height: 8, borderRadius: 4, backgroundColor: Colors.muted, overflow: 'hidden', width: '100%' },
  sleepFill: { height: '100%', borderRadius: 4, backgroundColor: Colors.primary },
  input: { height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, fontSize: 14, color: Colors.foreground, backgroundColor: Colors.card },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthBtn: { padding: 6 },
  monthLabel: { fontSize: 16, fontWeight: '700', color: Colors.foreground },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statBox: { flex: 1, minWidth: '45%', backgroundColor: Colors.muted, borderRadius: 12, padding: 12, alignItems: 'center' },
  statBoxVal: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  statBoxLabel: { fontSize: 11, color: Colors.mutedForeground, marginTop: 2 },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logDate: { fontSize: 14, fontWeight: '700', color: Colors.foreground },
  logMeta: { fontSize: 12, color: Colors.mutedForeground },
  logSymptoms: { fontSize: 12, color: Colors.mutedForeground, marginTop: 6 },
});
