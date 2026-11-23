import { useThemeStore } from "./useThemeStore";

export function ThemeToggle() {
  // Two selectors: this component re-renders only when theme (or the action) changes.
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return <button onClick={toggleTheme}>Theme: {theme}</button>;
}
