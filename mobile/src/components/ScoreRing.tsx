import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { colors } from "@/lib/theme";

export function ScoreRing({ score, size = 140, label = "/ 100" }: { score: number; size?: number; label?: string }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const offset = c - (pct / 100) * c;
  const color = score >= 80 ? colors.success : score >= 60 ? colors.warn : colors.danger;
  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.cardAlt} strokeWidth={stroke} fill="none" />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={colors.primary}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <SvgText x={size / 2} y={size / 2 + 6} fontSize={36} fontWeight="800" fill={color} textAnchor="middle">
        {score}
      </SvgText>
      <SvgText x={size / 2} y={size / 2 + 26} fontSize={10} fontWeight="600" fill={colors.muted} textAnchor="middle" letterSpacing="1.5">
        {label.toUpperCase()}
      </SvgText>
    </Svg>
  );
}
