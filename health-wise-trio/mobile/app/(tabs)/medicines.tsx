import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Colors } from '@/lib/theme';
import { Card, GradientButton, OutlineButton, Badge } from '@/components/UI';
import { SwipeLayout } from '@/components/SwipeLayout';

type Member = { id: string; name: string; color: string | null; relation: string | null };
type Med = {
  id: string; name: string; medicine_type: string | null; duration_days: number | null;
  reminder_times: string[]; tags: string[]; pill_color: string | null; notes: string | null;
  member_id: string | null; meal_timing: string | null;
};

const SELF_COLOR = '#0EA5A4';
const MEAL_OPTIONS = ['none', 'before_breakfast', 'after_breakfast', 'before_lunch', 'after_lunch', 'before_dinner', 'after_dinner'];
const MED_TYPES = ['tablet', 'syrup', 'injection', 'capsule'];
const TIME_TAGS = ['morning', 'afternoon', 'night'] as const;

function colorFor(med: Med, members: Member[]) {
  if (med.member_id) { const m = members.find((x) => x.id === med.member_id); if (m?.color) return m.color; }
  return med.pill_color ?? SELF_COLOR;
}

export function formatMealTiming(mealTimingStr: string | null, t: any): string {
  if (!mealTimingStr || mealTimingStr === "none") return "";
  try {
    if (mealTimingStr.startsWith("{")) {
      const obj = JSON.parse(mealTimingStr);
      const parts: string[] = [];
      if (obj.morning && obj.morning !== "none") {
        parts.push(`${t("med.morning")}: ${t(`med.meal.${obj.morning}`)}`);
      }
      if (obj.afternoon && obj.afternoon !== "none") {
        parts.push(`${t("med.afternoon")}: ${t(`med.meal.${obj.afternoon}`)}`);
      }
      if (obj.night && obj.night !== "none") {
        parts.push(`${t("med.night")}: ${t(`med.meal.${obj.night}`)}`);
      }
      return parts.join(", ");
    }
  } catch (e) {}
  return t(`med.meal.${mealTimingStr}`, mealTimingStr);
}

export default function MedicinesScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [meds, setMeds] = useState<Med[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Med | null>(null);

  const load = async () => {
    if (!user) return;
    const [{ data: m }, { data: fm }] = await Promise.all([
      supabase.from('medicines').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('family_members').select('id,name,color,relation').eq('user_id', user.id).order('created_at'),
    ]);
    setMeds((m ?? []) as Med[]);
    setMembers((fm ?? []) as Member[]);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [user])
  );

  const remove = (id: string) => {
    Alert.alert(t('med.deleteConfirm'), '', [
      { text: t('med.cancel'), style: 'cancel' },
      {
        text: t('med.delete'), style: 'destructive', onPress: async () => {
          await supabase.from('medicines').delete().eq('id', id);
          load();
        }
      },
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.primary} size="large" /></View>;

  return (
    <SwipeLayout currentTab="medicines">
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('med.title')}</Text>
        <TouchableOpacity onPress={() => { setEditing(null); setModalOpen(true); }} style={styles.addBtn}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {meds.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="medical-outline" size={40} color={Colors.mutedForeground} style={{ opacity: 0.4, alignSelf: 'center' }} />
            <Text style={styles.emptyText}>{t('med.noneYet')}</Text>
          </Card>
        ) : (
          meds.map((m) => {
            const col = colorFor(m, members);
            const owner = m.member_id ? members.find((x) => x.id === m.member_id) : null;
            return (
              <Card key={m.id} style={[styles.medCard, { backgroundColor: col + '12', elevation: 0, shadowOpacity: 0 }]}>
                <View style={styles.medTop}>
                  <View style={[styles.pillIcon, { backgroundColor: col + '22' }]}>
                    <Ionicons name="medical" size={22} color={col} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.medName}>{m.name}</Text>
                    <Text style={styles.medType}>{m.medicine_type ?? ''}{owner ? ` · ${owner.name}` : ''}</Text>
                  </View>
                  <TouchableOpacity onPress={() => { setEditing(m); setModalOpen(true); }} style={styles.iconBtn}>
                    <Ionicons name="pencil-outline" size={18} color={Colors.mutedForeground} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => remove(m.id)} style={styles.iconBtn}>
                    <Ionicons name="trash-outline" size={18} color={Colors.destructive} />
                  </TouchableOpacity>
                </View>
                <View style={styles.badges}>
                  {m.tags.map((tag) => <Badge key={tag} label={t(`med.${tag}`, tag)} />)}
                  {m.meal_timing && m.meal_timing !== 'none' && <Badge label={formatMealTiming(m.meal_timing, t)} />}
                  {m.duration_days != null
                    ? <Badge label={t('med.days', { count: m.duration_days })} />
                    : <Badge label={t('med.lifetime')} />}
                </View>
                <View style={styles.times}>
                  {m.reminder_times.map((tm) => (
                    <View key={tm} style={styles.timeChip}><Text style={styles.timeText}>{tm}</Text></View>
                  ))}
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>

      <MedicineModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        med={editing}
        members={members}
        onSaved={() => { setModalOpen(false); load(); }}
      />
      </View>
    </SwipeLayout>
  );
}

function MedicineModal({ visible, onClose, med, members, onSaved }: {
  visible: boolean; onClose: () => void; med: Med | null;
  members: Member[]; onSaved: () => void;
}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [type, setType] = useState('tablet');
  const [duration, setDuration] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [timeMap, setTimeMap] = useState<Record<string, string>>({});
  const [memberId, setMemberId] = useState('self');
  const [mealTimingsObj, setMealTimingsObj] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (med) {
      setName(med.name); setType(med.medicine_type ?? 'tablet');
      setDuration(med.duration_days?.toString() ?? ''); setTags(med.tags);
      const newMap: Record<string, string> = {};
      med.tags.forEach((tag, i) => { if (med.reminder_times[i]) newMap[tag] = med.reminder_times[i]; });
      setTimeMap(newMap);
      setMemberId(med.member_id ?? 'self');
      
      if (med.meal_timing) {
        if (med.meal_timing.startsWith('{')) {
          try {
            setMealTimingsObj(JSON.parse(med.meal_timing));
          } catch (e) {
            setMealTimingsObj({});
          }
        } else {
          // Legacy format fallback
          const legacyVal = med.meal_timing;
          const initialMap: Record<string, string> = {};
          if (legacyVal.includes('breakfast')) initialMap.morning = legacyVal;
          else if (legacyVal.includes('lunch')) initialMap.afternoon = legacyVal;
          else if (legacyVal.includes('dinner')) initialMap.night = legacyVal;
          setMealTimingsObj(initialMap);
        }
      } else {
        setMealTimingsObj({});
      }
    } else {
      setName(''); setType('tablet'); setDuration(''); setTags([]); setTimeMap({}); setMemberId('self');
      setMealTimingsObj({});
    }
  }, [med, visible]);

  const toggleTag = (tag: string) => {
    setTags((cur) => {
      const active = cur.includes(tag);
      if (active) {
        const nextTimings = { ...mealTimingsObj };
        delete nextTimings[tag];
        setMealTimingsObj(nextTimings);
        return cur.filter((x) => x !== tag);
      } else {
        return [...cur, tag];
      }
    });
  };

  const save = async () => {
    if (!user || !name.trim()) return Alert.alert('Error', 'Medicine name is required');
    setBusy(true);
    const reminder_times = tags.map((tg) => timeMap[tg]).filter(Boolean);
    const ownerColor = memberId === 'self' ? SELF_COLOR : members.find((x) => x.id === memberId)?.color ?? SELF_COLOR;
    
    // Filter meal timings object to only active tags
    const activeMealTimings: Record<string, string> = {};
    tags.forEach((tg) => {
      if (mealTimingsObj[tg]) activeMealTimings[tg] = mealTimingsObj[tg];
    });

    const payload = {
      user_id: user.id, name: name.trim(), medicine_type: type, tags, reminder_times,
      pill_color: ownerColor, notes: null,
      duration_days: duration ? Number(duration) : null,
      member_id: memberId === 'self' ? null : memberId,
      meal_timing: Object.keys(activeMealTimings).length > 0 ? JSON.stringify(activeMealTimings) : null,
    };
    const { error } = med
      ? await supabase.from('medicines').update(payload).eq('id', med.id)
      : await supabase.from('medicines').insert(payload);
    setBusy(false);
    if (error) return Alert.alert('Error', error.message);
    onSaved();
  };

  const memberOptions = [{ id: 'self', name: t('med.self'), color: SELF_COLOR }, ...members.map((m) => ({ id: m.id, name: m.name, color: m.color ?? SELF_COLOR }))];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ScrollView style={styles.modal} contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{med ? t('med.edit') : t('med.add')}</Text>
          <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={Colors.foreground} /></TouchableOpacity>
        </View>

        <Text style={styles.label}>{t('med.name')}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Paracetamol" placeholderTextColor={Colors.mutedForeground} />

        <Text style={[styles.label, { marginTop: 14 }]}>{t('med.forMember')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {memberOptions.map((m) => (
              <TouchableOpacity key={m.id} onPress={() => setMemberId(m.id)}
                style={[styles.memberChip, memberId === m.id && { borderColor: m.color, backgroundColor: m.color + '18' }]}>
                <View style={[styles.memberDot, { backgroundColor: m.color }]} />
                <Text style={[styles.memberChipText, memberId === m.id && { color: m.color }]}>{m.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { marginTop: 14 }]}>{t('med.type')}</Text>
            <View style={styles.chipRow}>
              {MED_TYPES.map((tp) => (
                <TouchableOpacity key={tp} onPress={() => setType(tp)}
                  style={[styles.chip, type === tp && styles.chipActive]}>
                  <Text style={[styles.chipText, type === tp && styles.chipTextActive]}>{tp}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { marginTop: 14 }]}>{t('med.duration')}</Text>
            <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType="number-pad"
              placeholder={t('med.durationLifetimePh')} placeholderTextColor={Colors.mutedForeground} />
          </View>
        </View>

        <Text style={[styles.label, { marginTop: 14 }]}>{t('med.times')}</Text>
        <View style={styles.timeTagsRow}>
          {TIME_TAGS.map((tg) => {
            const active = tags.includes(tg);
            return (
              <View key={tg} style={[styles.timeTagBox, active && styles.timeTagBoxActive]}>
                <TouchableOpacity onPress={() => toggleTag(tg)} style={styles.timeTagHeader}>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[styles.timeTagLabel, active && { color: Colors.primary }]}>{t(`med.${tg}`)}</Text>
                </TouchableOpacity>
                {active && (
                  <TextInput style={[styles.input, { marginTop: 8 }]} value={timeMap[tg] ?? ''} onChangeText={(v) => setTimeMap((m) => ({ ...m, [tg]: v }))}
                    placeholder="08:00" placeholderTextColor={Colors.mutedForeground} />
                )}
              </View>
            );
          })}
        </View>

        {/* Conditional meal timing options per active tag */}
        {tags.length > 0 && (
          <View style={{ marginTop: 14 }}>
            <Text style={styles.label}>{t('med.mealTiming')}</Text>
            <View style={{ gap: 8 }}>
              {tags.map((tg) => {
                const options = tg === 'morning'
                  ? [{ val: 'none', label: t('med.meal.none') }, { val: 'before_breakfast', label: t('med.meal.before_breakfast') }, { val: 'after_breakfast', label: t('med.meal.after_breakfast') }]
                  : tg === 'afternoon'
                  ? [{ val: 'none', label: t('med.meal.none') }, { val: 'before_lunch', label: t('med.meal.before_lunch') }, { val: 'after_lunch', label: t('med.meal.after_lunch') }]
                  : [{ val: 'none', label: t('med.meal.none') }, { val: 'before_dinner', label: t('med.meal.before_dinner') }, { val: 'after_dinner', label: t('med.meal.after_dinner') }];
                
                const currentVal = mealTimingsObj[tg] || 'none';
                return (
                  <View key={tg} style={{ padding: 10, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.card }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', textTransform: 'uppercase', color: Colors.mutedForeground, marginBottom: 6 }}>{t(`med.${tg}`)}</Text>
                    <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                      {options.map((opt) => (
                        <TouchableOpacity key={opt.val} onPress={() => setMealTimingsObj(prev => ({ ...prev, [tg]: opt.val }))}
                          style={[styles.chip, { paddingVertical: 5, paddingHorizontal: 10 }, currentVal === opt.val && styles.chipActive]}>
                          <Text style={[styles.chipText, { fontSize: 12 }, currentVal === opt.val && styles.chipTextActive]}>{opt.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={[styles.row, { gap: 12, marginTop: 24 }]}>
          <OutlineButton title={t('med.cancel')} onPress={onClose} style={{ flex: 1 }} />
          <GradientButton title={busy ? '...' : t('med.save')} onPress={save} loading={busy} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.background },
  title: { fontSize: 26, fontWeight: '800', color: Colors.foreground, letterSpacing: -0.5 },
  addBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, gap: 12, paddingBottom: 30 },
  emptyCard: { alignItems: 'center', padding: 48, gap: 12 },
  emptyText: { color: Colors.mutedForeground, fontSize: 14, textAlign: 'center' },
  medCard: { marginBottom: 0 },
  medTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  pillIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  medName: { fontSize: 15, fontWeight: '700', color: Colors.foreground },
  medType: { fontSize: 13, color: Colors.mutedForeground, marginTop: 1, textTransform: 'capitalize' },
  iconBtn: { padding: 6 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  times: { flexDirection: 'row', gap: 6 },
  timeChip: { backgroundColor: Colors.muted, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  timeText: { fontSize: 12, fontWeight: '600', color: Colors.foreground, fontVariant: ['tabular-nums'] },
  modal: { flex: 1, backgroundColor: Colors.background },
  modalContent: { padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.foreground },
  label: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginBottom: 6 },
  input: { height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, fontSize: 14, color: Colors.foreground, backgroundColor: Colors.card },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  chipText: { color: Colors.foreground, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: Colors.primary },
  memberChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border },
  memberDot: { width: 10, height: 10, borderRadius: 5 },
  memberChipText: { fontWeight: '600', fontSize: 13, color: Colors.foreground },
  timeTagsRow: { flexDirection: 'row', gap: 10 },
  timeTagBox: { flex: 1, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, padding: 10 },
  timeTagBoxActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  timeTagHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: Colors.primary },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  timeTagLabel: { fontSize: 13, fontWeight: '600', color: Colors.foreground },
});
