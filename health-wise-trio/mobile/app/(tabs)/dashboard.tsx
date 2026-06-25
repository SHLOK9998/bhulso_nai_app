import { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { calculateHealthScore } from '@/lib/healthScore';
import { Colors } from '@/lib/theme';
import { Card, SectionTitle } from '@/components/UI';
import { HealthScoreRing } from '@/components/HealthScoreRing';
import { SwipeLayout } from '@/components/SwipeLayout';

type Med = { id: string; name: string; pill_color: string | null; reminder_times: string[]; tags: string[]; member_id: string | null; meal_timing: string | null };
type LogRow = { water_glasses: number; sleep_hours: number | null; mood: number | null };
type Member = { id: string; name: string; color: string | null };

const SELF_COLOR = '#0EA5A4';

export function getMealTimingForBucket(mealTimingStr: string | null, bucket: 'morning' | 'afternoon' | 'evening'): string | null {
  if (!mealTimingStr || mealTimingStr === "none") return null;
  try {
    if (mealTimingStr.startsWith("{")) {
      const obj = JSON.parse(mealTimingStr);
      const key = bucket === "evening" ? "night" : bucket;
      const val = obj[key];
      return val && val !== "none" ? val : null;
    }
  } catch (e) { }
  if (bucket === "morning" && (mealTimingStr.includes("breakfast") || mealTimingStr === "anytime")) return mealTimingStr;
  if (bucket === "afternoon" && (mealTimingStr.includes("lunch") || mealTimingStr === "anytime")) return mealTimingStr;
  if (bucket === "evening" && (mealTimingStr.includes("dinner") || mealTimingStr === "anytime")) return mealTimingStr;
  return null;
}

function bucketOf(time: string): 'morning' | 'afternoon' | 'evening' {
  const h = Number(time.split(':')[0] ?? 0);
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

export default function DashboardScreen() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [meds, setMeds] = useState<Med[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [todayLog, setTodayLog] = useState<LogRow | null>(null);
  const [name, setName] = useState('');
  const [todayTaken, setTodayTaken] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [adviceLoading, setAdviceLoading] = useState(false);

  const loadAdvice = async () => {
    if (!user) return;
    setAdviceLoading(true);
    try {
      const since = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
      const [{ data: profile }, { data: logs }, { data: medsData }] = await Promise.all([
        supabase.from('profiles').select('name,age,gender,conditions,goals,wake_time,sleep_time,language').eq('id', user.id).maybeSingle(),
        supabase.from('health_logs').select('log_date,mood,sleep_hours,water_glasses,symptoms').eq('user_id', user.id).gte('log_date', since).order('log_date', { ascending: false }),
        supabase.from('medicines').select('name,reminder_times,tags').eq('user_id', user.id).eq('active', true),
      ]);

      const lang = profile?.language || i18n.language || 'en';
      const langName = lang === 'hi' ? 'Hindi' : lang === 'gu' ? 'Gujarati' : 'English';
      const prompt = `You are a friendly health coach. Based on the user's recent data, give ONE short personalized tip (max 3 sentences) in ${langName}. Be warm, specific, and reference at least one concrete data point. No medical diagnoses.\n\nProfile: ${JSON.stringify(profile)}\nActive medicines: ${JSON.stringify(medsData)}\nLast 14 days of logs: ${JSON.stringify(logs)}`;

      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://bhulso-nai-app.vercel.app';
      const url = `${backendUrl}/api/health-coach`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) throw new Error('Failed to get advice');
      const data = await res.json();
      setAdvice(data.text);
    } catch (e) {
      console.error("Dashboard advice error:", e);
      setAdvice(null);
    } finally {
      setAdviceLoading(false);
    }
  };

  const load = async () => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const [{ data: profile }, { data: medsData }, { data: logData }, { data: reminders }, { data: fm }] = await Promise.all([
      supabase.from('profiles').select('name,language,onboarded').eq('id', user.id).maybeSingle(),
      supabase.from('medicines').select('*').eq('user_id', user.id).eq('active', true),
      supabase.from('health_logs').select('water_glasses,sleep_hours,mood').eq('user_id', user.id).eq('log_date', today).maybeSingle(),
      supabase.from('reminders').select('medicine_id,scheduled_time,status').eq('user_id', user.id).eq('scheduled_date', today),
      supabase.from('family_members').select('id,name,color').eq('user_id', user.id),
    ]);
    if (profile && !profile.onboarded) { router.replace('/onboarding'); return; }
    if (profile?.name) setName(profile.name);
    setMeds((medsData ?? []) as Med[]);
    setMembers((fm ?? []) as Member[]);
    setTodayLog(logData ?? null);
    const map: Record<string, boolean> = {};
    (reminders ?? []).forEach((r: any) => { map[`${r.medicine_id}|${r.scheduled_time}`] = r.status === 'taken'; });
    setTodayTaken(map);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [user])
  );

  useEffect(() => {
    loadAdvice();
  }, [user]);

  const onRefresh = async () => { setRefreshing(true); await Promise.all([load(), loadAdvice()]); setRefreshing(false); };

  const setTakenStatus = async (medId: string, time: string, taken: boolean) => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const key = `${medId}|${time}`;
    setTodayTaken((m) => ({ ...m, [key]: taken }));
    await supabase.from('reminders').upsert(
      { user_id: user.id, medicine_id: medId, scheduled_date: today, scheduled_time: time, status: taken ? 'taken' : 'pending', taken_at: taken ? new Date().toISOString() : null },
      { onConflict: 'medicine_id,scheduled_date,scheduled_time' }
    );
  };

  const adherence = useMemo<number | null>(() => {
    const expected = meds.reduce((s, m) => s + m.reminder_times.length, 0);
    if (expected === 0) return null;
    const taken = meds.reduce((s, m) => s + m.reminder_times.filter((tm) => todayTaken[`${m.id}|${tm}`]).length, 0);
    return taken / expected;
  }, [meds, todayTaken]);

  const { score, parts } = useMemo(() => calculateHealthScore({
    adherenceRate: adherence, waterGlasses: todayLog?.water_glasses ?? 0,
    sleepHours: todayLog?.sleep_hours ?? 0, mood: todayLog?.mood ?? null, loggedToday: !!todayLog,
  }), [adherence, todayLog]);

  const colorFor = (med: Med) => {
    if (med.member_id) { const m = members.find((x) => x.id === med.member_id); if (m?.color) return m.color; }
    return med.pill_color ?? SELF_COLOR;
  };

  const todaysItems = meds.flatMap((m) => m.reminder_times.map((tm) => ({ med: m, time: tm }))).sort((a, b) => a.time.localeCompare(b.time));
  const grouped: Record<'morning' | 'afternoon' | 'evening', typeof todaysItems> = { morning: [], afternoon: [], evening: [] };
  todaysItems.forEach((it) => grouped[bucketOf(it.time)].push(it));

  const scorePartLabels: Record<string, string> = {
    med: t('dashboard.score.med'), water: t('dashboard.score.water'),
    sleep: t('dashboard.score.sleep'), mood: t('dashboard.score.mood'), log: t('dashboard.score.log'),
  };

  return (
    <SwipeLayout currentTab="dashboard">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Header */}
      <LinearGradient colors={['#0EA5A4', '#2563EB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <Text style={styles.greeting}>{t('dashboard.greeting', { name: name || '👋' })}</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
      </LinearGradient>

      {/* Health Score */}
      <Card style={styles.scoreCard}>
        <SectionTitle title={t('dashboard.healthScore')} />
        <View style={styles.scoreRow}>
          <HealthScoreRing score={score} />
          <View style={{ flex: 1, marginLeft: 16 }}>
            {parts.map((p) => {
              const pct = Math.round((p.got / p.max) * 100);
              return (
                <View key={p.key} style={{ marginBottom: 7 }}>
                  <View style={styles.scorePartRow}>
                    <Text style={styles.scorePartLabel}>{scorePartLabels[p.key]}</Text>
                    <Text style={[styles.scorePartVal, { color: pct < 70 ? Colors.destructive : Colors.success }]}>{p.got}/{p.max}</Text>
                  </View>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFg, { width: `${pct}%` as any, backgroundColor: pct < 70 ? Colors.destructive + 'AA' : Colors.success + 'CC' }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Ionicons name="water-outline" size={18} color={Colors.secondary} />
            <Text style={styles.statVal}>{todayLog?.water_glasses ?? 0}/8</Text>
            <Text style={styles.statLabel}>{t('dashboard.water')}</Text>
          </View>
          <View style={styles.statChip}>
            <Ionicons name="moon-outline" size={18} color={Colors.secondary} />
            <Text style={styles.statVal}>{todayLog?.sleep_hours ?? 0}h</Text>
            <Text style={styles.statLabel}>{t('dashboard.sleep')}</Text>
          </View>
        </View>
      </Card>

      {/* AI Health Insights */}
      <Card style={{ margin: 16, marginTop: 14, marginBottom: 0 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="sparkles" size={18} color={Colors.primary} />
            <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.foreground }}>{t('dashboard.insightsTitle')}</Text>
          </View>
          <TouchableOpacity onPress={loadAdvice} disabled={adviceLoading} style={{ padding: 4 }}>
            {adviceLoading ? (
              <ActivityIndicator size="small" color={Colors.mutedForeground} />
            ) : (
              <Ionicons name="refresh" size={18} color={Colors.mutedForeground} />
            )}
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 13, color: Colors.mutedForeground, marginTop: 8, lineHeight: 18 }}>
          {adviceLoading ? t('dashboard.insightsLoading') : (advice ?? t('dashboard.insightsEmpty'))}
        </Text>
      </Card>

      {/* Today's Plan */}
      <Card style={{ marginHorizontal: 16, marginTop: 14, marginBottom: 16 }}>
        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>{t('dashboard.todayTitle')}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/medicines')}>
            <Text style={styles.addLink}>+ {t('dashboard.addMedicine')}</Text>
          </TouchableOpacity>
        </View>

        {todaysItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="medical-outline" size={32} color={Colors.mutedForeground} style={{ opacity: 0.4 }} />
            <Text style={styles.emptyText}>{t('dashboard.noMeds')}</Text>
          </View>
        ) : (
          (['morning', 'afternoon', 'evening'] as const).map((bk) => {
            const items = grouped[bk];
            if (items.length === 0) return null;
            const icon = bk === 'morning' ? 'sunny-outline' : bk === 'afternoon' ? 'partly-sunny-outline' : 'moon-outline';
            return (
              <View key={bk} style={styles.bucket}>
                <View style={styles.bucketHeader}>
                  <Ionicons name={icon as any} size={15} color={Colors.mutedForeground} />
                  <Text style={styles.bucketLabel}>{t(`dashboard.bucket.${bk}`)}</Text>
                </View>
                {items.map(({ med, time }) => {
                  const taken = todayTaken[`${med.id}|${time}`];
                  const col = colorFor(med);
                  const owner = med.member_id ? members.find((x) => x.id === med.member_id) : null;
                  return (
                    <View key={`${med.id}-${time}`} style={[styles.medRow, { backgroundColor: col + '10', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 6, borderBottomWidth: 0 }]}>
                      <View style={[styles.pillIcon, { backgroundColor: col + '22' }]}>
                        <Ionicons name="medical" size={18} color={col} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.medName}>{med.name}</Text>
                        <Text style={styles.medSub}>{time}{owner ? ` · ${owner.name}` : ''}</Text>
                        {getMealTimingForBucket(med.meal_timing, bk) && (
                          <Text style={styles.mealLabel}>{t(`med.meal.${getMealTimingForBucket(med.meal_timing, bk)}`)}</Text>
                        )}
                      </View>
                      <TouchableOpacity onPress={() => setTakenStatus(med.id, time, !taken)} style={styles.takenBtn}>
                        <Ionicons name={taken ? 'checkmark-circle' : 'ellipse-outline'} size={28} color={taken ? Colors.success : Colors.mutedForeground} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            );
          })
        )}
      </Card>
    </ScrollView>
    </SwipeLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 30 },
  header: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginHorizontal: 16,
    borderRadius: 18,
  },
  greeting: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  date: { fontSize: 13, color: 'rgba(255,255,255,0.82)', marginTop: 4 },
  scoreCard: { margin: 16, marginBottom: 0 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  scorePartRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  scorePartLabel: { fontSize: 11, color: Colors.mutedForeground },
  scorePartVal: { fontSize: 11, fontWeight: '700' },
  progressBg: { height: 5, borderRadius: 4, backgroundColor: Colors.muted, overflow: 'hidden' },
  progressFg: { height: '100%', borderRadius: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  statChip: { flex: 1, backgroundColor: Colors.muted, borderRadius: 12, padding: 12, alignItems: 'center', gap: 3 },
  statVal: { fontSize: 16, fontWeight: '700', color: Colors.foreground },
  statLabel: { fontSize: 11, color: Colors.mutedForeground },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  planTitle: { fontSize: 17, fontWeight: '700', color: Colors.foreground },
  addLink: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  emptyBox: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.border, borderRadius: 14, padding: 32, alignItems: 'center', gap: 8 },
  emptyText: { color: Colors.mutedForeground, fontSize: 14 },
  bucket: { marginBottom: 10 },
  bucketHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  bucketLabel: { fontSize: 12, fontWeight: '700', color: Colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.5 },
  medRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  pillIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  medName: { fontSize: 14, fontWeight: '600', color: Colors.foreground },
  medSub: { fontSize: 12, color: Colors.mutedForeground, marginTop: 1 },
  mealLabel: { fontSize: 10, color: Colors.mutedForeground, marginTop: 1, textTransform: 'uppercase', letterSpacing: 0.4 },
  takenBtn: { padding: 4 },
});
