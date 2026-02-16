import { Pressable, StyleSheet, Text, View } from "react-native";
import { tokens } from "../core/theme";

const suitIcons: Record<string, string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  neutral: "•",
};

const suitColors: Record<string, string> = {
  spades: tokens.colors.text.primary,
  hearts: tokens.colors.primary,
  diamonds: tokens.colors.primary,
  clubs: tokens.colors.text.primary,
  neutral: tokens.colors.text.primary,
};

interface GameCardProps {
  value: number | string;
  rank: string;
  suit: string;
  isSelected: boolean;
  isUsed: boolean;
  onPress: () => void;
}

export function GameCard({ value, rank, suit, isSelected, isUsed, onPress }: GameCardProps) {
  if (isUsed) {
    return <View style={styles.hiddenCard} />;
  }

  const icon = suitIcons[suit] ?? suitIcons.neutral;
  const suitColor = suitColors[suit] ?? tokens.colors.text.primary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isSelected ? styles.cardSelected : styles.cardDefault,
        pressed && styles.cardPressed,
      ]}
    >
      <Text style={[styles.cornerTop, { color: suitColor }]}>{rank}</Text>
      <Text style={[styles.cornerBottom, { color: suitColor }]}>{icon}</Text>
      <Text style={styles.centerValue}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hiddenCard: {
    width: "100%",
    aspectRatio: 3 / 4,
    opacity: 0,
  },
  card: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: tokens.radius.xl,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cardDefault: {
    backgroundColor: "#27272a",
    borderColor: "#3f3f46",
  },
  cardSelected: {
    backgroundColor: "#3f3f46",
    borderColor: tokens.colors.primary,
    transform: [{ translateY: -6 }],
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
  },
  cornerTop: {
    position: "absolute",
    top: 8,
    left: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  cornerBottom: {
    position: "absolute",
    right: 8,
    bottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  centerValue: {
    color: tokens.colors.text.primary,
    fontSize: 34,
    fontWeight: "800",
  },
});
