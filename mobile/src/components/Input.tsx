import { TextInput, type TextInputProps } from "react-native";
import { colors, radii, shadows } from "@/lib/theme";

export function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.subtle}
      {...props}
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1.5,
          borderRadius: radii.md,
          paddingHorizontal: 16,
          paddingVertical: 14,
          color: colors.text,
          fontSize: 16,
          ...shadows.sm,
        },
        props.style,
      ]}
    />
  );
}
