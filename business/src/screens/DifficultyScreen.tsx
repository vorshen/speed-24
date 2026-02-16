import { Pressable, StyleSheet, Text, View } from "react-native";
import { BackButton } from "../components/BackButton";
import type { GameConfig } from "../domain/game-config";
import { tokens } from "../core/theme";

interface DifficultyScreenProps {
  config: GameConfig;
  transitionTo: (targetStateId: string, runtimeParams?: Record<string, string | number | boolean>) => void;
  goBack: () => void;
}

export function DifficultyScreen({ config, transitionTo, goBack }: DifficultyScreenProps) {
  const difficulties = Object.values(config.difficulties);

  return (
    <View style={styles.container}>
      <BackButton onPress={goBack} />

      <View style={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.title}>CHOOSE</Text>
          <Text style={styles.subtitle}>Select your tempo for this session.</Text>
        </View>

        <View style={styles.options}>
          {difficulties.map((difficulty) => (
            <Pressable
              key={difficulty.id}
              onPress={() => transitionTo("game", { level: difficulty.id })}
              style={({ pressed }) => [styles.optionButton, pressed && styles.pressed]}
            >
              <View>
                <Text style={styles.optionTitle}>{difficulty.label.toUpperCase()}</Text>
                <Text style={styles.optionDesc}>{difficulty.description}</Text>
              </View>
              <Text style={styles.optionTime}>{difficulty.time}s</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    gap: 34,
    marginTop: 42,
  },
  heading: {
    gap: 8,
  },
  title: {
    color: tokens.colors.text.primary,
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  subtitle: {
    color: tokens.colors.text.secondary,
    fontSize: 14,
  },
  options: {
    gap: 14,
  },
  optionButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3f3f46",
    backgroundColor: "#27272a",
    paddingHorizontal: 20,
    paddingVertical: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionTitle: {
    color: tokens.colors.primary,
    fontSize: 22,
    fontWeight: "800",
  },
  optionDesc: {
    color: tokens.colors.text.secondary,
    marginTop: 4,
    fontSize: 11,
    letterSpacing: 0.4,
  },
  optionTime: {
    color: tokens.colors.text.primary,
    fontSize: 30,
    fontWeight: "700",
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
});
