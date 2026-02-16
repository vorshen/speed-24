import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Linking from "expo-linking";
import { parseRuntimeParams, resolveInitialState, transitionState } from "./src/core/navigation";
import { tokens } from "./src/core/theme";
import type { AppState, Params } from "./src/core/types";
import { flowRegistry } from "./src/domain/flow-registry";
import { InMemoryGameConfigRepository, InMemoryPlayerStatsRepository } from "./src/domain/game-config";
import { DifficultyScreen } from "./src/screens/DifficultyScreen";
import { GameScreen } from "./src/screens/GameScreen";
import { HomeScreen } from "./src/screens/HomeScreen";

export default function App() {
  const gameConfigRepository = useMemo(() => new InMemoryGameConfigRepository(), []);
  const playerStatsRepository = useMemo(() => new InMemoryPlayerStatsRepository({ streak: 0, bestStreak: 0 }), []);
  const config = useMemo(() => gameConfigRepository.getConfig(), [gameConfigRepository]);
  const [stats, setStats] = useState(() => playerStatsRepository.getStats());

  const [stack, setStack] = useState<AppState[]>(() => [resolveInitialState(flowRegistry)]);
  const [error, setError] = useState<string | null>(null);
  const currentState = stack[stack.length - 1];

  useEffect(() => {
    const hydrateFromLink = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (!initialUrl) {
        return;
      }
      const parsed = Linking.parse(initialUrl);
      const stateId = typeof parsed.queryParams?.state === "string" ? parsed.queryParams.state : null;
      if (!stateId) {
        return;
      }

      const runtime = parseRuntimeParams(initialUrl);
      const linked = resolveInitialState(flowRegistry, stateId, runtime);
      setStack([linked]);
    };

    hydrateFromLink().catch((cause) => setError((cause as Error).message));
  }, []);

  const transitionTo = (targetStateId: string, runtimeParams?: Params) => {
    try {
      setStack((previous) => [...previous, transitionState(flowRegistry, targetStateId, runtimeParams)]);
    } catch (cause) {
      setError((cause as Error).message);
    }
  };

  const goBack = () => {
    setStack((previous) => (previous.length > 1 ? previous.slice(0, -1) : previous));
  };

  const updateStreak = (nextStreak: number) => {
    const next = playerStatsRepository.updateStreak(nextStreak);
    setStats(next);
  };

  const renderCurrent = () => {
    if (currentState.page === "home") {
      return <HomeScreen transitionTo={transitionTo} />;
    }
    if (currentState.page === "difficulty") {
      return <DifficultyScreen config={config} transitionTo={transitionTo} goBack={goBack} />;
    }
    if (currentState.page === "game") {
      const levelValue = currentState.params.level;
      const level = typeof levelValue === "string" ? levelValue : "medium";
      return (
        <GameScreen
          config={config}
          streak={stats.streak}
          onStreakChange={updateStreak}
          level={level}
          transitionTo={transitionTo}
          goBack={goBack}
        />
      );
    }
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unknown page: {currentState.page}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorLabel}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        renderCurrent()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: tokens.colors.background,
    paddingHorizontal: 24,
  },
  errorLabel: {
    color: tokens.colors.error,
    fontWeight: "700",
    marginBottom: 8,
    fontSize: 20,
  },
  errorText: {
    color: tokens.colors.text.secondary,
    fontSize: 14,
    textAlign: "center",
  },
});
