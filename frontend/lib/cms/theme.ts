import client from "./strapi";

const theme = client.collection("theme");

export type ThemeData = {
  primary?: string;
  primaryForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
};

export async function getThemeData(): Promise<ThemeData | null> {
  try {
    const themeData = await theme.find({
      populate: "*",
    });

    if (!themeData.data) return null;

    return themeData.data as ThemeData;
  } catch (error) {
    console.error("Error fetching theme:", error);
    return null;
  }
}

// Default green theme
export const DEFAULT_THEME: ThemeData = {
  primary: "#4CAF50",
  primaryForeground: "#FFFFFF",
  secondary: "#45A049",
  secondaryForeground: "#FFFFFF",
};

// Available themes
export const AVAILABLE_THEMES: Record<string, ThemeData> = {
  green: {
    primary: "#4CAF50",
    primaryForeground: "#FFFFFF",
    secondary: "#45A049",
    secondaryForeground: "#FFFFFF",
  },
  blue: {
    primary: "#2196F3",
    primaryForeground: "#FFFFFF",
    secondary: "#1976D2",
    secondaryForeground: "#FFFFFF",
  },
  purple: {
    primary: "#9C27B0",
    primaryForeground: "#FFFFFF",
    secondary: "#7B1FA2",
    secondaryForeground: "#FFFFFF",
  },
  orange: {
    primary: "#FF9800",
    primaryForeground: "#FFFFFF",
    secondary: "#F57C00",
    secondaryForeground: "#FFFFFF",
  },
};

export function applyTheme(themeData: ThemeData) {
  const root = document.documentElement;
  if (themeData.primary) {
    root.style.setProperty("--color-primary", themeData.primary);
  }
  if (themeData.primaryForeground) {
    root.style.setProperty("--color-primary-foreground", themeData.primaryForeground);
  }
  if (themeData.secondary) {
    root.style.setProperty("--color-secondary", themeData.secondary);
  }
  if (themeData.secondaryForeground) {
    root.style.setProperty("--color-secondary-foreground", themeData.secondaryForeground);
  }
}
