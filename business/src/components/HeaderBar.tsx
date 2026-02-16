import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { tokens } from "../core/theme";

interface HeaderBarProps {
  progress: number;
  streak: number;
  timeLeft: number;
}

export function HeaderBar({ progress, streak, timeLeft }: HeaderBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const isCriticalTime = timeLeft <= 5;
  const [trackWidth, setTrackWidth] = useState(0);
  const progressOffset = useRef(new Animated.Value(0)).current;
  const hasInitializedOffset = useRef(false);

  useEffect(() => {
    if (trackWidth <= 0) {
      return;
    }

    const targetOffset = -((100 - clampedProgress) / 100) * trackWidth;

    if (!hasInitializedOffset.current) {
      progressOffset.setValue(targetOffset);
      hasInitializedOffset.current = true;
      return;
    }

    Animated.timing(progressOffset, {
      toValue: targetOffset,
      duration: 210,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [clampedProgress, progressOffset, trackWidth]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>WIN STREAK</Text>
          <Text style={styles.value}>
            <Text style={styles.emphasis}>STREAK:</Text> {streak}
          </Text>
        </View>
        <Text style={styles.target}>TARGET: 24</Text>
      </View>

      <View
        style={styles.progressTrack}
        onLayout={(event) => {
          const nextWidth = event.nativeEvent.layout.width;
          if (nextWidth > 0 && Math.abs(nextWidth - trackWidth) > 0.5) {
            setTrackWidth(nextWidth);
            hasInitializedOffset.current = false;
          }
        }}
      >
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: isCriticalTime ? tokens.colors.error : tokens.colors.primary,
              transform: [{ translateX: progressOffset }],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  label: {
    fontSize: 10,
    color: tokens.colors.text.secondary,
    letterSpacing: 1.8,
    fontWeight: "700",
  },
  value: {
    marginTop: 2,
    color: tokens.colors.text.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  emphasis: {
    color: tokens.colors.primary,
  },
  target: {
    color: tokens.colors.text.secondary,
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "600",
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#3f3f46",
    borderRadius: tokens.radius.full,
    overflow: "hidden",
  },
  progressFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.colors.primary,
  },
});
