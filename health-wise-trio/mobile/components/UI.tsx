import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, type ViewStyle, type TextStyle, type StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '@/lib/theme';

// Card
export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// GradientButton
export function GradientButton({
  onPress, title, disabled, loading, style, textStyle,
}: { onPress: () => void; title: string; disabled?: boolean; loading?: boolean; style?: StyleProp<ViewStyle>; textStyle?: StyleProp<TextStyle> }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8} style={[{ borderRadius: 14, overflow: 'hidden' }, style, (disabled || loading) && { opacity: 0.6 }]}>
      <LinearGradient colors={['#0EA5A4', '#3ABFBE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientBtn}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.gradientBtnText, textStyle]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

// OutlineButton
export function OutlineButton({
  onPress, title, style, textStyle, destructive,
}: { onPress: () => void; title: string; style?: StyleProp<ViewStyle>; textStyle?: StyleProp<TextStyle>; destructive?: boolean }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.outlineBtn, style]}>
      <Text style={[styles.outlineBtnText, destructive && { color: Colors.destructive }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

// Badge
export function Badge({ label, color }: { label: string; color?: string }) {
  const bg = color ? color + '22' : Colors.muted;
  const fg = color ?? Colors.mutedForeground;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: fg }]}>{label}</Text>
    </View>
  );
}

// SectionTitle
export function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    ...Shadows.soft,
    marginBottom: 4,
  },
  gradientBtn: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  gradientBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  outlineBtn: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.card,
  },
  outlineBtnText: { color: Colors.foreground, fontWeight: '600', fontSize: 15 },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.mutedForeground,
    marginBottom: 8,
  },
});
