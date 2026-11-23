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
  toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  setTheme: (theme) => set({ theme }),
}));
