import { useState } from "react";
import { View, TextInput, Pressable, type TextInputProps } from "react-native";
import { colors, radii, shadows } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";

export function Input(props: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.secureTextEntry;

  if (isPassword) {
    return (
      <View
        style={[
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1.5,
            borderRadius: radii.md,
            flexDirection: "row",
            alignItems: "center",
            paddingRight: 14,
            ...shadows.sm,
          },
          props.style,
        ]}
      >
        <TextInput
          placeholderTextColor={colors.subtle}
          {...props}
          secureTextEntry={!showPassword}
          style={{
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: colors.text,
            fontSize: 16,
          }}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={colors.muted}
          />
        </Pressable>
      </View>
    );
  }

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
