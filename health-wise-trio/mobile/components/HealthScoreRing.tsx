import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { scoreColor } from '@/lib/healthScore';

export function HealthScoreRing({ score }: { score: number }) {
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, score / 100));
  const strokeDashoffset = circumference * (1 - progress);
  const color = scoreColor(score);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#E2E8F0" strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.label}>
        <Text style={[styles.score, { color }]}>{score}</Text>
        <Text style={styles.sub}>/ 100</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
  label: { position: 'absolute', alignItems: 'center' },
  score: { fontSize: 28, fontWeight: '800' },
  sub: { fontSize: 12, color: '#94A3B8', marginTop: -4 },
});
