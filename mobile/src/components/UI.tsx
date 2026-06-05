import { Pressable, Text, ActivityIndicator, View, type ViewStyle, type TextStyle, type PressableProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radii, shadows } from "@/lib/theme";

type Props = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  gradient?: readonly [string, string];
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
};

export function Button({ title, loading, variant = "primary", gradient, style, textStyle, icon, disabled, ...rest }: Props) {
  const isGradient = variant === "primary" || !!gradient;
  const grad = gradient ?? colors.gradPrimary;
  const bg =
    variant === "danger" ? colors.danger :
    variant === "secondary" ? colors.cardAlt :
    variant === "outline" ? "transparent" :
    "transparent";
  const fg =
    variant === "ghost" ? colors.primary :
    variant === "secondary" ? colors.text :
    variant === "outline" ? colors.primary :
    "#fff";
  const border = variant === "outline" ? colors.primary : variant === "secondary" ? colors.border : "transparent";

  const inner = (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, paddingHorizontal: 18 }}>
      {loading ? <ActivityIndicator color={fg} /> : (
        <>
          {icon}
          <Text style={[{ color: fg, fontSize: 16, fontWeight: "700", letterSpacing: 0.2 }, textStyle]}>{title}</Text>
        </>
      )}
    </View>
  );

  return (
    <Pressable
      {...rest}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          borderRadius: radii.lg,
          overflow: "hidden",
          opacity: disabled ? 0.5 : pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          backgroundColor: isGradient ? "transparent" : bg,
          borderWidth: variant === "outline" || variant === "secondary" ? 1.5 : 0,
          borderColor: border,
          ...(isGradient || variant === "danger" ? shadows.glow : shadows.sm),
        },
        style as ViewStyle,
      ]}
    >
      {isGradient ? (
        <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          {inner}
        </LinearGradient>
      ) : inner}
    </Pressable>
  );
}

export function Card({ children, style, tint }: { children: React.ReactNode; style?: ViewStyle; tint?: string }) {
  return (
    <View
      style={[
        {
          backgroundColor: tint ?? colors.card,
          borderRadius: radii.xl,
          padding: 18,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadows.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function GradientCard({ children, style, colors: c = colors.gradHero }: { children: React.ReactNode; style?: ViewStyle; colors?: readonly [string, string] }) {
  return (
    <View style={[{ borderRadius: radii.xl, overflow: "hidden", ...shadows.glow }, style]}>
      <LinearGradient colors={c} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 20 }}>
        {children}
      </LinearGradient>
    </View>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: colors.muted, fontSize: 13, fontWeight: "600", letterSpacing: 0.3, textTransform: "uppercase" }}>{label}</Text>
      {children}
    </View>
  );
}

export function StatTile({ label, value, emoji, tint }: { label: string; value: string; emoji: string; tint: readonly [string, string] }) {
  return (
    <View style={{ flex: 1, borderRadius: radii.lg, overflow: "hidden", ...shadows.sm }}>
      <LinearGradient colors={tint} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 14, gap: 4 }}>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>{value}</Text>
        <Text style={{ color: "#ffffffcc", fontSize: 11, fontWeight: "600", letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</Text>
      </LinearGradient>
    </View>
  );
}
