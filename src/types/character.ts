export type AbilityKey = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

export interface AbilityScores {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  weight?: string;
  damage?: string;
  properties?: string;
  desc: string;
}

export interface Character {
  id?: string;
  name: string;
  race: string | null;
  class: string | null;
  background: string | null;
  level: number;
  stats: AbilityScores;
  assignedStats?: AbilityScores;
  alignment: string | null;
  equipment: InventoryItem[];
  equipChoices: Record<string, string>;
  cantrips: string[];
  spells: string[];
  skills: string[];
  inventory: InventoryItem[];
  acOverride: number | null;
}

export interface PartySnapshot {
  localId: string | undefined;
  name: string;
  race: string | null;
  class: string | null;
  level: number;
  hp: number;
  ac: number;
  stats: AbilityScores | Partial<AbilityScores>;
}
