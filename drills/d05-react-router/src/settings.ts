// Given: "saving preferences". In a real app this might be a PUT to an API.
export interface Settings {
  darkMode: boolean;
}

export const SETTINGS_KEY = "library-settings";

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
