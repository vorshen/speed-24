export type DifficultyId = "easy" | "medium" | "hard";

export interface DifficultySpec {
  id: DifficultyId;
  time: number;
  label: string;
  description: string;
}

export interface GameConfig {
  difficulties: Record<DifficultyId, DifficultySpec>;
  unsolvableRateByDifficulty: Record<DifficultyId, number>;
  suits: string[];
  ranks: string[];
}

export interface PlayerStats {
  streak: number;
  bestStreak: number;
}

export interface GameConfigRepository {
  getConfig(): GameConfig;
}

export interface PlayerStatsRepository {
  getStats(): PlayerStats;
  updateStreak(streak: number): PlayerStats;
}

const inMemoryConfig: GameConfig = {
  difficulties: {
    easy: { id: "easy", time: 30, label: "Easy", description: "Relaxed focus" },
    medium: { id: "medium", time: 20, label: "Medium", description: "Standard flow" },
    hard: { id: "hard", time: 10, label: "Hard", description: "Peak performance" },
  },
  unsolvableRateByDifficulty: {
    easy: 0.05,
    medium: 0.12,
    hard: 0.2,
  },
  suits: ["spades", "hearts", "diamonds", "clubs"],
  ranks: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
};

export class InMemoryGameConfigRepository implements GameConfigRepository {
  getConfig(): GameConfig {
    return inMemoryConfig;
  }
}

export class InMemoryPlayerStatsRepository implements PlayerStatsRepository {
  private stats: PlayerStats;

  constructor(seed?: Partial<PlayerStats>) {
    this.stats = {
      streak: seed?.streak ?? 0,
      bestStreak: seed?.bestStreak ?? 0,
    };
  }

  getStats(): PlayerStats {
    return this.stats;
  }

  updateStreak(streak: number): PlayerStats {
    this.stats = {
      streak,
      bestStreak: Math.max(this.stats.bestStreak, streak),
    };
    return this.stats;
  }
}
