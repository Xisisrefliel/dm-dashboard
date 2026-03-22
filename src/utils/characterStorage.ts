import type { Character } from "../types/index.ts";

const STORAGE_KEY = "dm-dashboard-character-creator";
const CHARACTERS_KEY = "dm-dashboard-characters";

interface SavedCreatorState {
  step?: number;
  finished?: boolean;
  char?: Character;
  [key: string]: unknown;
}

export function loadSavedState(): SavedCreatorState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as SavedCreatorState;
  } catch {}
  return null;
}

export function loadCharacters(): Character[] {
  try {
    const saved = localStorage.getItem(CHARACTERS_KEY);
    if (saved) return JSON.parse(saved) as Character[];
  } catch {}
  return [];
}

export function saveCharacters(chars: Character[]): void {
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(chars));
}

export { STORAGE_KEY, CHARACTERS_KEY };
