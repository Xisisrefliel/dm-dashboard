// ---- SAMPLE CAMPAIGN DATA ----
const SAMPLE = {
  locations: [],
  npcs: [],
  sessions: [],
  rules: [],
};

export const ICON_OPTIONS = [
  { name: "person", label: "Character" },
  { name: "groups", label: "Group" },
  { name: "skull", label: "Enemy" },
  { name: "pets", label: "Creature" },
  { name: "castle", label: "Castle" },
  { name: "cottage", label: "House" },
  { name: "forest", label: "Forest" },
  { name: "water", label: "Water" },
  { name: "map", label: "Map" },
  { name: "explore", label: "Compass" },
  { name: "temple_hindu", label: "Temple" },
  { name: "store", label: "Shop" },
  { name: "menu_book", label: "Book" },
  { name: "auto_stories", label: "Story" },
  { name: "description", label: "Note" },
  { name: "swords", label: "Combat" },
  { name: "shield", label: "Shield" },
  { name: "auto_fix_high", label: "Magic" },
  { name: "local_fire_department", label: "Fire" },
  { name: "bolt", label: "Lightning" },
  { name: "diamond", label: "Gem" },
  { name: "key", label: "Key" },
  { name: "lock", label: "Lock" },
  { name: "flag", label: "Flag" },
  { name: "star", label: "Star" },
  { name: "whatshot", label: "Flame" },
  { name: "visibility", label: "Eye" },
  { name: "dark_mode", label: "Moon" },
  { name: "light_mode", label: "Sun" },
  { name: "trophy", label: "Trophy" },
];

export const DEFAULT_CATEGORIES = [
  { key: "locations", label: "Locations", icon: "explore" },
  { key: "npcs", label: "NPCs", icon: "groups" },
  { key: "sessions", label: "Sessions", icon: "auto_stories" },
  { key: "rules", label: "Rules & Spells", icon: "auto_fix_high" },
];

export const SRD_CATEGORIES = [
  { key: "srd-rules", label: "5e Rules", icon: "gavel" },
  { key: "srd-spells", label: "Spellbook", icon: "auto_fix_high" },
  { key: "srd-monsters", label: "Bestiary", icon: "pets" },
  { key: "srd-classes", label: "Classes", icon: "person" },
  { key: "srd-races", label: "Races", icon: "groups" },
];

export const CAMPAIGN_COLORS = [
  "#9fd494",
  "#a0cfcc",
  "#c4a0d0",
  "#d4a07a",
  "#d09090",
  "#90b4d0",
  "#d0c890",
  "#90d0a8",
  "#b0a0d8",
  "#d4908a",
];

export const INITIAL_CAMPAIGNS = [];
