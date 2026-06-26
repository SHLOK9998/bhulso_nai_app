import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { dbGetFamilyMembers, dbSaveFamilyMember, dbDeleteFamilyMember } from '@/lib/offlineDb';
import { useAuth } from '@/lib/auth';
import { Colors } from '@/lib/theme';
import { Card, GradientButton, OutlineButton } from '@/components/UI';
import { SwipeLayout } from '@/components/SwipeLayout';

type Member = { id: string; name: string; relation: string | null; age: number | null; color: string | null };

const COLORS = ['#0EA5A4', '#2563EB', '#F59E0B', '#EC4899', '#8B5CF6', '#10B981'];

export default function FamilyScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [promptMember, setPromptMember] = useState<Member | null>(null);

  const load = async () => {
    if (!user) return;
    const { data } = await dbGetFamilyMembers(user.id);
    setMembers((data ?? []) as Member[]);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [user])
  );

  const remove = (id: string) => {
    Alert.alert(t('family.deleteConfirm'), '', [
      { text: t('med.cancel'), style: 'cancel' },
      { text: t('med.delete'), style: 'destructive', onPress: async () => { if (user) { await dbDeleteFamilyMember(user.id, id); load(); } } },
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.primary} size="large" /></View>;

  return (
    <SwipeLayout currentTab="family">
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('family.title')}</Text>
          <Text style={styles.sub}>{t('family.sub')}</Text>
        </View>
        <TouchableOpacity onPress={() => { setEditing(null); setModalOpen(true); }} style={styles.addBtn}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {members.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="people-outline" size={40} color={Colors.mutedForeground} style={{ opacity: 0.4, alignSelf: 'center' }} />
            <Text style={styles.emptyText}>{t('family.noneYet')}</Text>
          </Card>
        ) : (
          members.map((m) => (
            <Card key={m.id} style={styles.memberCard}>
              <View style={styles.memberRow}>
                <View style={[styles.avatar, { backgroundColor: m.color ?? Colors.primary }]}>
                  <Text style={styles.avatarText}>{m.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>{m.name}</Text>
                  <Text style={styles.memberSub}>{[m.relation, m.age && `${m.age}y`].filter(Boolean).join(' · ')}</Text>
                </View>
                <TouchableOpacity onPress={() => { setEditing(m); setModalOpen(true); }} style={styles.iconBtn}>
                  <Ionicons name="pencil-outline" size={18} color={Colors.mutedForeground} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => remove(m.id)} style={styles.iconBtn}>
                  <Ionicons name="trash-outline" size={18} color={Colors.destructive} />
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      <MemberModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        member={editing}
        onSaved={(saved, wasNew) => {
          setModalOpen(false);
          load();
          if (wasNew && saved) setPromptMember(saved);
        }}
      />

      {/* Add medicine prompt */}
      <Modal visible={!!promptMember} transparent animationType="fade" onRequestClose={() => setPromptMember(null)}>
        <View style={styles.overlay}>
          <Card style={styles.promptCard}>
            <Text style={styles.promptTitle}>{t('family.addMedPrompt', { name: promptMember?.name ?? '' })}</Text>
            <View style={styles.promptBtns}>
              <OutlineButton title={t('family.addMedNo')} onPress={() => setPromptMember(null)} style={{ flex: 1 }} />
              <GradientButton title={t('family.addMedYes')} onPress={() => {
                const id = promptMember!.id;
                setPromptMember(null);
                router.push('/(tabs)/medicines');
              }} style={{ flex: 1 }} />
            </View>
          </Card>
        </View>
      </Modal>
      </View>
    </SwipeLayout>
  );
}

function MemberModal({ visible, onClose, member, onSaved }: {
  visible: boolean; onClose: () => void; member: Member | null;
  onSaved: (m: Member | null, wasNew: boolean) => void;
}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [age, setAge] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (member) { setName(member.name); setRelation(member.relation ?? ''); setAge(member.age?.toString() ?? ''); setColor(member.color ?? COLORS[0]); }
    else { setName(''); setRelation(''); setAge(''); setColor(COLORS[0]); }
  }, [member, visible]);

  const save = async () => {
    if (!user || !name.trim()) return Alert.alert('Error', 'Name is required');
    setBusy(true);
    const payload = { name: name.trim(), relation, age: age ? Number(age) : null, color };
    const wasNew = !member;
    const { data, error } = await dbSaveFamilyMember(user.id, payload, member?.id);
    setBusy(false);
    if (error) return Alert.alert('Error', error.message);
    onSaved((data as Member) ?? null, wasNew);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ScrollView style={styles.modal} contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{member ? t('family.edit') : t('family.add')}</Text>
          <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={Colors.foreground} /></TouchableOpacity>
        </View>

        <Text style={styles.label}>{t('family.name')}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Mom" placeholderTextColor={Colors.mutedForeground} />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { marginTop: 14 }]}>{t('family.relation')}</Text>
            <TextInput style={styles.input} value={relation} onChangeText={setRelation} placeholder="Mother, Son..." placeholderTextColor={Colors.mutedForeground} />
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { marginTop: 14 }]}>{t('family.age')}</Text>
            <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="e.g. 55" placeholderTextColor={Colors.mutedForeground} />
          </View>
        </View>

        <Text style={[styles.label, { marginTop: 14 }]}>{t('med.color')}</Text>
        <View style={styles.colorRow}>
          {COLORS.map((c) => (
            <TouchableOpacity key={c} onPress={() => setColor(c)}
              style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotActive]} />
          ))}
        </View>

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
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', backgroundColor: Colors.background },
  title: { fontSize: 26, fontWeight: '800', color: Colors.foreground, letterSpacing: -0.5 },
  sub: { fontSize: 13, color: Colors.mutedForeground, marginTop: 2 },
  addBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  list: { padding: 16, gap: 12, paddingBottom: 30 },
  emptyCard: { alignItems: 'center', padding: 48, gap: 12 },
  emptyText: { color: Colors.mutedForeground, fontSize: 14, textAlign: 'center' },
  memberCard: { marginBottom: 0 },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  memberName: { fontSize: 15, fontWeight: '700', color: Colors.foreground },
  memberSub: { fontSize: 13, color: Colors.mutedForeground, marginTop: 1 },
  iconBtn: { padding: 6 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  promptCard: { width: '100%' },
  promptTitle: { fontSize: 16, fontWeight: '700', color: Colors.foreground, marginBottom: 18, textAlign: 'center' },
  promptBtns: { flexDirection: 'row', gap: 12 },
  modal: { flex: 1, backgroundColor: Colors.background },
  modalContent: {
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 48 : 24,
    paddingBottom: 40,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.foreground },
  label: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginBottom: 6 },
  input: { height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, fontSize: 14, color: Colors.foreground, backgroundColor: Colors.card },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  colorRow: { flexDirection: 'row', gap: 10 },
  colorDot: { width: 38, height: 38, borderRadius: 12 },
  colorDotActive: { borderWidth: 3, borderColor: Colors.foreground },
});
