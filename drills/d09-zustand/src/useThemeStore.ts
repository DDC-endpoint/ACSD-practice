import { create } from "zustand";

export type Theme = "light" | "dark";

export interface ThemeState {
  theme: Theme;
  menuOpen: boolean; // another piece of UI state in the same store (used by the selector test)
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// create<State>()(...) gives back a Hook: useThemeStore. No Provider is needed.
export const useThemeStore = create<ThemeState>()((set) => ({
  theme: "light",
  menuOpen: false,
  // TODO d09-1: write both actions with set(...):
  //   - toggleTheme: flip "light" <-> "dark" (use the set((state) => ({ ... })) form,
  //     because the new value depends on the old one)
  //   - setTheme: set theme to the value passed in (set({ ... }) is enough)
  toggleTheme: () => {
    throw new Error("TODO d09-1");
  },
  setTheme: () => {
    throw new Error("TODO d09-1");
  },
}));
