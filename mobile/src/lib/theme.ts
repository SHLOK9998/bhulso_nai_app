// Energetic healthcare palette — mirrors the web app (teal primary, blue secondary, vibrant accents)
export const colors = {
  // Surfaces — bright, clean, hospital-fresh
  bg: "#F4F8FB",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  cardAlt: "#F1F6FA",
  border: "#E3EAF2",

  // Text
  text: "#0F172A",
  textOnPrimary: "#FFFFFF",
  muted: "#64748B",
  subtle: "#94A3B8",

  // Brand
  primary: "#0EA5A4",          // teal
  primaryGlow: "#22D3D1",
  primaryDark: "#0B8585",
  secondary: "#2563EB",        // blue
  secondaryGlow: "#60A5FA",
  accent: "#7C3AED",           // purple
  accentGlow: "#A78BFA",
  pink: "#EC4899",
  coral: "#F97066",
  warn: "#F59E0B",
  warnGlow: "#FBBF24",
  danger: "#EF4444",
  success: "#10B981",
  successGlow: "#34D399",

  // Gradients (use with expo-linear-gradient)
  gradPrimary: ["#0EA5A4", "#22D3D1"] as const,
  gradHero: ["#0EA5A4", "#2563EB"] as const,
  gradAccent: ["#7C3AED", "#EC4899"] as const,
  gradSunset: ["#F97066", "#F59E0B"] as const,
  gradOcean: ["#2563EB", "#0EA5A4"] as const,
  gradMint: ["#10B981", "#22D3D1"] as const,

  // Shadows
  shadow: "#0F172A",
};

export const radii = { sm: 10, md: 14, lg: 18, xl: 24, pill: 999 };
export const spacing = (n: number) => n * 4;

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  glow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
};
