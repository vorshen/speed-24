import { Pressable, StyleSheet, Text } from "react-native";
import { tokens } from "../core/theme";

interface ActionButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onPress: () => void;
}

export function ActionButton({ label, variant = "secondary", disabled = false, onPress }: ActionButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.text, variant === "primary" ? styles.textPrimary : styles.textSecondary]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    height: 48,
    borderRadius: tokens.radius.lg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  primary: {
    backgroundColor: "#ea580c",
    borderColor: "#f97316",
  },
  secondary: {
    backgroundColor: "#27272a",
    borderColor: "#3f3f46",
  },
  text: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  textPrimary: {
    color: tokens.colors.text.primary,
  },
  textSecondary: {
    color: tokens.colors.text.secondary,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
