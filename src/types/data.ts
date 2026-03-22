import type { InventoryItem } from "./character.ts";

export interface Background {
  id: string;
  name: string;
  icon: string;
  skills: string[];
  desc: string;
}

export interface Alignment {
  id: string;
  name: string;
  short: string;
  desc: string;
  icon: string;
  color: string;
}

export interface AlignmentAnswer {
  text: string;
  law: number;
  good: number;
}

export interface AlignmentQuestion {
  q: string;
  answers: AlignmentAnswer[];
}

export interface ClassSpellSlots {
  cantrips: number;
  spells: number;
  castLevel: number;
}

export interface EquipmentOption {
  id: string;
  name: string;
  items: InventoryItem[];
}

export interface EquipmentChoice {
  label: string;
  options: EquipmentOption[];
}

export interface ClassEquipmentConfig {
  choices: EquipmentChoice[];
  guaranteed: InventoryItem[];
}

export interface IconOption {
  name: string;
  label: string;
}
