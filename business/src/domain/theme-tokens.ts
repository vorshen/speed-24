export interface ThemeTokens {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: {
      primary: string;
      secondary: string;
    };
    error: string;
    success: string;
  };
  radius: {
    lg: number;
    xl: number;
    full: number;
  };
  animation: {
    spring: {
      stiffness: number;
      damping: number;
    };
  };
}

export const themeTokens: ThemeTokens = {
  colors: {
    background: "#18181B",
    surface: "#27272A",
    primary: "#F97316",
    secondary: "#6366F1",
    text: {
      primary: "#F4F4F5",
      secondary: "#A1A1AA",
    },
    error: "#EF4444",
    success: "#10B981",
  },
  radius: {
    lg: 8,
    xl: 12,
    full: 9999,
  },
  animation: {
    spring: {
      stiffness: 400,
      damping: 30,
    },
  },
};
