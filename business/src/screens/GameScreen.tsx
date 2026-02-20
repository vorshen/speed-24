import { useEffect, useMemo, useRef, useState } from "react";
import { Audio } from "expo-av";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { BackButton } from "../components/BackButton";
import { GameCard } from "../components/GameCard";
import { HeaderBar } from "../components/HeaderBar";
import { OperatorButton } from "../components/OperatorButton";
import { tokens } from "../core/theme";
import type { DifficultyId, GameConfig } from "../domain/game-config";

type GameState = "playing" | "win" | "lose";
type RoundMode = "solvable" | "unsolvable";

interface Card {
  id: string;
  rank: string;
  value: number;
  suit: string;
  isUsed: boolean;
}

interface GameScreenProps {
  config: GameConfig;
  streak: number;
  onStreakChange: (nextStreak: number) => void;
  level: string;
  transitionTo: (targetStateId: string, runtimeParams?: Record<string, string | number | boolean>) => void;
  goBack: () => void;
}

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const solve24 = (numbers: number[]): string | null => {
  const backtrack = (items: Array<{ val: number; expr: string }>): string | null => {
    if (items.length === 1) {
      if (Math.abs(items[0].val - 24) < 0.001) {
        return items[0].expr;
      }
      return null;
    }

    for (let i = 0; i < items.length; i += 1) {
      for (let j = 0; j < items.length; j += 1) {
        if (i === j) {
          continue;
        }
        const a = items[i];
        const b = items[j];
        const rest = items.filter((_, idx) => idx !== i && idx !== j);

        const ops = [
          { val: a.val + b.val, expr: `(${a.expr}+${b.expr})` },
          { val: a.val - b.val, expr: `(${a.expr}-${b.expr})` },
          { val: a.val * b.val, expr: `(${a.expr}*${b.expr})` },
        ];
        if (Math.abs(b.val) > 0.0001) {
          ops.push({ val: a.val / b.val, expr: `(${a.expr}/${b.expr})` });
        }

        for (const op of ops) {
          const result = backtrack([...rest, op]);
          if (result) {
            return result;
          }
        }
      }
    }
    return null;
  };

  return backtrack(numbers.map((value) => ({ val: value, expr: String(value) })));
};

const rankValues: Record<string, number> = {
  A: 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
};

const MAX_GENERATION_ATTEMPTS = 4000;
const TIMER_TICK_MS = 200;

const generateRandomCards = (config: GameConfig): Card[] =>
  Array.from({ length: 4 }, () => {
    const rank = config.ranks[getRandomInt(0, config.ranks.length - 1)];
    return {
      id: Math.random().toString(36).slice(2, 11),
      rank,
      value: rankValues[rank],
      suit: config.suits[getRandomInt(0, config.suits.length - 1)],
      isUsed: false,
    };
  });

const generateGame = (config: GameConfig, mode: RoundMode): { cards: Card[]; modeUsed: RoundMode } => {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const cards = generateRandomCards(config);
    const hasSolution = Boolean(solve24(cards.map((card) => card.value)));
    if ((mode === "solvable" && hasSolution) || (mode === "unsolvable" && !hasSolution)) {
      return { cards, modeUsed: mode };
    }
  }

  // If unsolvable generation is too rare, fall back to a solvable round.
  if (mode === "unsolvable") {
    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
      const cards = generateRandomCards(config);
      if (solve24(cards.map((card) => card.value))) {
        return { cards, modeUsed: "solvable" };
      }
    }
  }

  throw new Error("Failed to generate a valid game round");
};

export function GameScreen({ config, streak, onStreakChange, level, transitionTo, goBack }: GameScreenProps) {
  const timeLimit = useMemo(() => {
    const difficulty = config.difficulties[level as keyof typeof config.difficulties];
    return difficulty?.time ?? config.difficulties.medium.time;
  }, [config.difficulties, level]);

  const [cards, setCards] = useState<Card[]>([]);
  const [initialCards, setInitialCards] = useState<Card[]>([]);
  const [history, setHistory] = useState<Card[][]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [currentExpression, setCurrentExpression] = useState<string>("");
  const [gameState, setGameState] = useState<GameState>("playing");
  const [hint, setHint] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const roundDeadlineRef = useRef<number | null>(null);
  const successSoundRef = useRef<Audio.Sound | null>(null);
  const checkSoundRef = useRef<Audio.Sound | null>(null);
  const cardsRef = useRef<Card[]>([]);
  const roundsPlayedRef = useRef(0);
  const previousRoundWasUnsolvableRef = useRef(false);

  const playSound = async (sound: Audio.Sound | null) => {
    if (!sound) {
      return;
    }
    try {
      await sound.replayAsync();
    } catch (error) {
      console.warn("Unable to play sound effect", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadSounds = async () => {
      try {
        const [{ sound: successSound }, { sound: checkSound }] = await Promise.all([
          Audio.Sound.createAsync(require("../resource/xiao_er_ke.mp3")),
          Audio.Sound.createAsync(require("../resource/wo_yao_yan_pai.mp3")),
        ]);

        if (!isMounted) {
          await Promise.all([successSound.unloadAsync(), checkSound.unloadAsync()]);
          return;
        }

        successSoundRef.current = successSound;
        checkSoundRef.current = checkSound;
      } catch (error) {
        console.warn("Unable to load sound effects", error);
      }
    };

    void loadSounds();

    return () => {
      isMounted = false;
      const sounds = [successSoundRef.current, checkSoundRef.current];
      successSoundRef.current = null;
      checkSoundRef.current = null;
      void Promise.all(
        sounds.map(async (sound) => {
          if (sound) {
            try {
              await sound.unloadAsync();
            } catch (error) {
              console.warn("Unable to unload sound effect", error);
            }
          }
        }),
      );
    };
  }, []);

  const initializeGame = () => {
    const difficultyId: DifficultyId = config.difficulties[level as DifficultyId] ? (level as DifficultyId) : "medium";
    const unsolvableRate = config.unsolvableRateByDifficulty[difficultyId] ?? 0;
    const canSpawnUnsolvableRound = roundsPlayedRef.current >= 3 && !previousRoundWasUnsolvableRef.current;
    const requestedMode: RoundMode =
      canSpawnUnsolvableRound && Math.random() < unsolvableRate ? "unsolvable" : "solvable";
    const { cards: gameCards, modeUsed } = generateGame(config, requestedMode);

    roundsPlayedRef.current += 1;
    previousRoundWasUnsolvableRef.current = modeUsed === "unsolvable";

    setCards(gameCards);
    setInitialCards(gameCards);
    setHistory([]);
    setSelectedIndex(null);
    setSelectedOperator(null);
    setCurrentExpression("");
    setGameState("playing");
    setTimeLeft(timeLimit);
    setHint(null);
  };

  useEffect(() => {
    initializeGame();
  }, [config, timeLimit]);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      roundDeadlineRef.current = null;
      return;
    }

    roundDeadlineRef.current = Date.now() + timeLimit * 1000;
    timerRef.current = setInterval(() => {
      if (!roundDeadlineRef.current) {
        return;
      }

      const remainingSeconds = Math.max(0, (roundDeadlineRef.current - Date.now()) / 1000);
      if (remainingSeconds <= 0) {
        const activeValues = cardsRef.current.filter((card) => !card.isUsed).map((card) => card.value);
        const timeoutSolution = solve24(activeValues);
        if (timeoutSolution) {
          setHint(timeoutSolution);
        }
        setTimeLeft(0);
        setGameState("lose");
        return;
      }

      setTimeLeft(remainingSeconds);
    }, TIMER_TICK_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState]);

  const onCardPress = (idx: number) => {
    if (gameState !== "playing" || cards[idx].isUsed) {
      return;
    }

    if (selectedIndex === null) {
      setSelectedIndex(idx);
      return;
    }

    if (selectedIndex === idx) {
      setSelectedIndex(null);
      setSelectedOperator(null);
      return;
    }

    if (!selectedOperator) {
      setSelectedIndex(idx);
      return;
    }

    const valueA = cards[selectedIndex].value;
    const valueB = cards[idx].value;
    let result = 0;
    if (selectedOperator === "+") {
      result = valueA + valueB;
    } else if (selectedOperator === "-") {
      result = valueA - valueB;
    } else if (selectedOperator === "x") {
      result = valueA * valueB;
    } else if (selectedOperator === "/") {
      if (valueB === 0) {
        return;
      }
      result = valueA / valueB;
    }

    setHistory((previous) => [...previous, [...cards]]);

    const nextCards = [...cards];
    nextCards[selectedIndex] = { ...nextCards[selectedIndex], isUsed: true };
    nextCards[idx] = {
      ...nextCards[idx],
      value: Number(result.toFixed(2)),
      rank: Number.isInteger(result) ? String(result) : result.toFixed(1),
      suit: "neutral",
    };

    setCards(nextCards);
    // Auto-select the newly merged card to support chained calculations.
    setSelectedIndex(idx);
    setSelectedOperator(null);
    setCurrentExpression(`${valueA} ${selectedOperator} ${valueB} = ${nextCards[idx].rank}`);

    const active = nextCards.filter((card) => !card.isUsed);
    if (active.length === 1) {
      if (Math.abs(active[0].value - 24) < 0.001) {
        void playSound(successSoundRef.current);
        setGameState("win");
        onStreakChange(streak + 1);
      } else {
        setGameState("lose");
      }
    }
  };

  const undo = () => {
    if (history.length === 0) {
      return;
    }

    const previousState = history[history.length - 1];
    setCards(previousState);
    setHistory((previous) => previous.slice(0, -1));
    setSelectedIndex(null);
    setSelectedOperator(null);
    setCurrentExpression("");
  };

  const reset = () => {
    setCards(initialCards);
    setHistory([]);
    setSelectedIndex(null);
    setSelectedOperator(null);
    setCurrentExpression("");
    setGameState("playing");
    setTimeLeft(timeLimit);
    setHint(null);
  };

  const checkSolution = () => {
    void playSound(checkSoundRef.current);
    const activeValues = cards.filter((card) => !card.isUsed).map((card) => card.value);
    const solution = solve24(activeValues);
    if (solution) {
      setHint(solution);
      setGameState("lose");
      return;
    }

    setGameState("win");
    onStreakChange(streak + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <BackButton onPress={goBack} showLabel={false} />
        <View style={styles.headerWrap}>
          <HeaderBar progress={(timeLeft / timeLimit) * 100} streak={streak} timeLeft={timeLeft} />
        </View>
      </View>

      <View style={styles.expressionArea}>
        <Text style={currentExpression ? styles.expression : styles.expressionPlaceholder}>
          {currentExpression || "Express Flow"}
        </Text>
      </View>

      <View style={styles.cardsArea}>
        <View style={styles.cardsGrid}>
          {cards.map((card, index) => (
            <View key={card.id} style={styles.cardCell}>
              <GameCard
                value={card.value}
                rank={card.rank}
                suit={card.suit}
                isSelected={selectedIndex === index}
                isUsed={card.isUsed}
                onPress={() => onCardPress(index)}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomArea}>
        <View style={styles.operatorRow}>
          {["+", "-", "x", "/"].map((operator) => (
            <OperatorButton
              key={operator}
              operator={operator}
              selected={selectedOperator === operator}
              onPress={() => {
                if (selectedIndex !== null) {
                  setSelectedOperator(operator);
                }
              }}
            />
          ))}
        </View>

        <View style={styles.actionRow}>
          <ActionButton label="Check!" variant="primary" onPress={checkSolution} />
          <ActionButton label="Reset" onPress={reset} />
          <ActionButton label="Undo" onPress={undo} />
        </View>
      </View>

      {gameState !== "playing" && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            {gameState === "win" ? (
              <>
                <Text style={styles.overlayIcon}>✓</Text>
                <Text style={styles.overlayTitle}>TARGET REACHED</Text>
                <Text style={styles.overlaySubTitle}>Flow maintained. Streak: {streak}</Text>
              </>
            ) : (
              <>
                <Text style={styles.overlayIcon}>✕</Text>
                <Text style={styles.overlayTitle}>ROUND FAILED</Text>
                <Text style={styles.overlaySubTitle}>No valid 24 expression was completed in time.</Text>
                {hint && (
                  <View style={styles.hintWrap}>
                    <Text style={styles.hintLabel}>SOLUTION FOUND</Text>
                    <Text style={styles.hintValue}>{hint}</Text>
                  </View>
                )}
              </>
            )}

            <View style={styles.overlayButtons}>
              <Pressable onPress={initializeGame} style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}>
                <Text style={styles.nextButtonText}>NEXT LEVEL</Text>
              </Pressable>
              <Pressable onPress={() => transitionTo("home")} style={({ pressed }) => [styles.quitButton, pressed && styles.pressed]}>
                <Text style={styles.quitButtonText}>QUIT TO MENU</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 22,
  },
  topRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
    marginBottom: 30,
  },
  headerWrap: {
    flex: 1,
  },
  expressionArea: {
    minHeight: 84,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#3f3f46",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  expression: {
    color: tokens.colors.text.primary,
    fontSize: 30,
    fontWeight: "700",
  },
  expressionPlaceholder: {
    color: "#71717a",
    fontSize: 22,
    fontStyle: "italic",
  },
  cardsArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardsGrid: {
    width: "100%",
    maxWidth: 350,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 12,
  },
  cardCell: {
    width: "50%",
    paddingHorizontal: 6,
  },
  bottomArea: {
    marginTop: 22,
    gap: 20,
  },
  operatorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(24,24,27,0.92)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  overlayCard: {
    width: "100%",
    maxWidth: 370,
    backgroundColor: "#27272a",
    borderWidth: 1,
    borderColor: "#3f3f46",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    gap: 8,
  },
  overlayIcon: {
    color: tokens.colors.primary,
    fontSize: 64,
    marginBottom: 6,
  },
  overlayTitle: {
    color: tokens.colors.text.primary,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.8,
    textAlign: "center",
  },
  overlaySubTitle: {
    color: tokens.colors.text.secondary,
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  hintWrap: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#52525b",
    borderRadius: 12,
    backgroundColor: "#18181b",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    marginBottom: 4,
  },
  hintLabel: {
    color: "#71717a",
    fontSize: 10,
    letterSpacing: 1.4,
    marginBottom: 6,
    textAlign: "center",
    fontWeight: "700",
  },
  hintValue: {
    color: tokens.colors.primary,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "700",
  },
  overlayButtons: {
    width: "100%",
    gap: 10,
    marginTop: 12,
  },
  nextButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: tokens.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "#18181b",
    fontSize: 16,
    fontWeight: "800",
  },
  quitButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#3f3f46",
    justifyContent: "center",
    alignItems: "center",
  },
  quitButtonText: {
    color: tokens.colors.text.secondary,
    fontSize: 16,
    fontWeight: "700",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
