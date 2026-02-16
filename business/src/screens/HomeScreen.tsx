import { Pressable, StyleSheet, Text, View } from "react-native";
import { tokens } from "../core/theme";

interface HomeScreenProps {
  transitionTo: (targetStateId: string, runtimeParams?: Record<string, string | number | boolean>) => void;
}

export function HomeScreen({ transitionTo }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <Text style={styles.title}>
          FLOW <Text style={styles.titleAccent}>24</Text>
        </Text>
        <Text style={styles.subtitle}>MINIMALIST BRAIN FITNESS</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable onPress={() => transitionTo("difficulty")} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
          <Text style={styles.primaryButtonLabel}>SINGLE PLAYER</Text>
        </Pressable>

        <View style={styles.disabledButton}>
          <Text style={styles.disabledLabel}>MULTIPLAYER</Text>
          <Text style={styles.disabledBadge}>SOON</Text>
        </View>
      </View>

      <Text style={styles.footnote}>Aneway Design v1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 56,
  },
  titleGroup: {
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: tokens.colors.text.primary,
    fontSize: 56,
    fontWeight: "800",
    letterSpacing: -1.2,
  },
  titleAccent: {
    color: tokens.colors.primary,
  },
  subtitle: {
    color: tokens.colors.text.secondary,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2.4,
  },
  buttons: {
    width: "100%",
    maxWidth: 340,
    gap: 16,
  },
  primaryButton: {
    height: 58,
    borderRadius: tokens.radius.xl,
    backgroundColor: "#27272a",
    borderWidth: 1,
    borderColor: "#3f3f46",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonLabel: {
    color: tokens.colors.text.primary,
    fontSize: 19,
    fontWeight: "700",
  },
  disabledButton: {
    height: 58,
    borderRadius: tokens.radius.xl,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  disabledLabel: {
    color: "#52525b",
    fontSize: 19,
    fontWeight: "700",
  },
  disabledBadge: {
    fontSize: 10,
    color: "#71717a",
    backgroundColor: "#27272a",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: tokens.radius.lg,
    overflow: "hidden",
    fontWeight: "600",
  },
  footnote: {
    position: "absolute",
    bottom: 28,
    color: "#71717a",
    fontSize: 10,
    letterSpacing: 1.6,
    fontWeight: "600",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
