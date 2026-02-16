import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tokens } from "../core/theme";

interface BackButtonProps {
  onPress: () => void;
  showLabel?: boolean;
}

export function BackButton({ onPress, showLabel = true }: BackButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <View style={styles.iconWrap}>
        <Ionicons name="chevron-back" size={15} color={tokens.colors.text.primary} />
      </View>
      {showLabel ? <Text style={styles.label}>BACK</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 10,
    paddingVertical: 2,
  },
  iconWrap: {
    width: 18,
    alignItems: "flex-start",
  },
  label: {
    color: tokens.colors.text.secondary,
    fontSize: 11,
    letterSpacing: 1.8,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },
});
