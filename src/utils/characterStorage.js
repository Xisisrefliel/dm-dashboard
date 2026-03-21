const STORAGE_KEY = "dm-dashboard-character-creator";
const CHARACTERS_KEY = "dm-dashboard-characters";

export function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export function loadCharacters() {
  try {
    const saved = localStorage.getItem(CHARACTERS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

export function saveCharacters(chars) {
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(chars));
}

export { STORAGE_KEY, CHARACTERS_KEY };
