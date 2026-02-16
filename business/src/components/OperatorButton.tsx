import { Pressable, StyleSheet, Text } from "react-native";
import { tokens } from "../core/theme";

interface OperatorButtonProps {
  operator: string;
  selected: boolean;
  onPress: () => void;
}

export function OperatorButton({ operator, selected, onPress }: OperatorButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.base, selected ? styles.selected : styles.default, pressed && styles.pressed]}>
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelDefault]}>{operator}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.full,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  default: {
    backgroundColor: "#27272a",
    borderColor: "#3f3f46",
  },
  selected: {
    backgroundColor: tokens.colors.primary,
    borderColor: "#fb923c",
  },
  label: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: -2,
  },
  labelDefault: {
    color: "#d4d4d8",
  },
  labelSelected: {
    color: "#18181B",
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});
