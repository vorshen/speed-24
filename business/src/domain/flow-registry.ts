import type { Params } from "../core/types";

export type FlowStateId = "home" | "difficulty" | "game";

export interface FlowStateDefinition {
  id: FlowStateId;
  name: string;
  page: string;
  defaultParams: Params;
}

export interface FlowRegistry {
  initialStateId: FlowStateId;
  states: Record<FlowStateId, FlowStateDefinition>;
}

export const flowRegistry: FlowRegistry = {
  initialStateId: "home",
  states: {
    home: {
      id: "home",
      name: "Home",
      page: "home",
      defaultParams: {},
    },
    difficulty: {
      id: "difficulty",
      name: "Select Difficulty",
      page: "difficulty",
      defaultParams: {},
    },
    game: {
      id: "game",
      name: "Game Flow",
      page: "game",
      defaultParams: {
        level: "medium",
        isGameOver: false,
        isWin: false,
        showSolution: false,
      },
    },
  },
};
