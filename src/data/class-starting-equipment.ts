import type { ClassEquipmentConfig } from "../types/index.ts";

// 5e SRD Starting Equipment per class
export const CLASS_STARTING_EQUIPMENT: Record<string, ClassEquipmentConfig> = {
  barbarian: {
    choices: [
      {
        label: "Primary Weapon",
        options: [
          { id: "barb-1a", name: "Greataxe", items: [{ id: "greataxe", name: "Greataxe", icon: "swords", damage: "1d12 slashing", weight: "7 lb", properties: "Heavy, Two-Handed", desc: "A massive axe that cleaves through armor and bone alike." }] },
          { id: "barb-1b", name: "Longsword", items: [{ id: "longsword", name: "Longsword", icon: "swords", damage: "1d8 slashing", weight: "3 lb", properties: "Versatile (1d10)", desc: "A classic one-handed blade favoured by knights and seasoned warriors." }] },
          { id: "barb-1c", name: "Battleaxe", items: [{ id: "battleaxe", name: "Battleaxe", icon: "swords", damage: "1d8 slashing", weight: "4 lb", properties: "Versatile (1d10)", desc: "A sturdy axe balanced for one- or two-handed combat." }] },
          { id: "barb-1d", name: "Warhammer", items: [{ id: "warhammer", name: "Warhammer", icon: "hardware", damage: "1d8 bludgeoning", weight: "2 lb", properties: "Versatile (1d10)", desc: "A heavy hammer that delivers crushing blows to armored foes." }] },
        ],
      },
      {
        label: "Secondary Weapon",
        options: [
          { id: "barb-2a", name: "Two Handaxes", items: [{ id: "handaxe-1", name: "Handaxe", icon: "carpenter", damage: "1d6 slashing", weight: "2 lb", properties: "Light, Thrown (20/60)", desc: "A small throwing axe, deadly at close range." }, { id: "handaxe-2", name: "Handaxe", icon: "carpenter", damage: "1d6 slashing", weight: "2 lb", properties: "Light, Thrown (20/60)", desc: "A small throwing axe, deadly at close range." }] },
          { id: "barb-2b", name: "Javelin", items: [{ id: "javelin-single", name: "Javelin", icon: "arrow_upward", damage: "1d6 piercing", weight: "2 lb", properties: "Thrown (30/120)", desc: "A light spear designed for throwing." }] },
          { id: "barb-2c", name: "Mace", items: [{ id: "mace", name: "Mace", icon: "hardware", damage: "1d6 bludgeoning", weight: "4 lb", properties: "Simple", desc: "A heavy metal head on a sturdy shaft." }] },
          { id: "barb-2d", name: "Light Hammer", items: [{ id: "light-hammer", name: "Light Hammer", icon: "hardware", damage: "1d4 bludgeoning", weight: "2 lb", properties: "Light, Thrown (20/60)", desc: "A small hammer that can be thrown." }] },
        ],
      },
    ],
    guaranteed: [
      { id: "explorers-pack", name: "Explorer's Pack", icon: "backpack", weight: "59 lb", properties: "Adventuring Gear", desc: "Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days rations, waterskin, and 50 ft of rope." },
      { id: "javelin-4", name: "Javelins (x4)", icon: "arrow_upward", damage: "1d6 piercing", weight: "2 lb each", properties: "Thrown (30/120)", desc: "Four light spears designed for throwing at enemies from a distance." },
    ],
  },
  bard: {
    choices: [
      {
        label: "Primary Weapon",
        options: [
          { id: "bard-1a", name: "Rapier", items: [{ id: "rapier", name: "Rapier", icon: "swords", damage: "1d8 piercing", weight: "2 lb", properties: "Finesse", desc: "A slender, sharply pointed sword for thrusting attacks." }] },
          { id: "bard-1b", name: "Longsword", items: [{ id: "longsword", name: "Longsword", icon: "swords", damage: "1d8 slashing", weight: "3 lb", properties: "Versatile (1d10)", desc: "A classic one-handed blade favoured by knights and seasoned warriors." }] },
          { id: "bard-1c", name: "Dagger", items: [{ id: "dagger", name: "Dagger", icon: "cut", damage: "1d4 piercing", weight: "1 lb", properties: "Finesse, Light, Thrown (20/60)", desc: "A small, concealable blade useful for close combat and throwing." }] },
          { id: "bard-1d", name: "Quarterstaff", items: [{ id: "quarterstaff", name: "Quarterstaff", icon: "pen_size_1", damage: "1d6 bludgeoning", weight: "4 lb", properties: "Versatile (1d8)", desc: "A simple wooden staff, versatile in combat." }] },
        ],
      },
      {
        label: "Equipment Pack",
        options: [
          { id: "bard-2a", name: "Diplomat's Pack", items: [{ id: "diplomats-pack", name: "Diplomat's Pack", icon: "backpack", weight: "46 lb", properties: "Adventuring Gear", desc: "Chest, 2 cases for maps/scrolls, fine clothes, ink, pen, lamp, 2 flasks of oil, 5 sheets of paper, vial of perfume, sealing wax, soap." }] },
          { id: "bard-2b", name: "Entertainer's Pack", items: [{ id: "entertainers-pack", name: "Entertainer's Pack", icon: "backpack", weight: "38 lb", properties: "Adventuring Gear", desc: "Backpack, bedroll, 2 costumes, 5 candles, 5 days rations, waterskin, disguise kit." }] },
        ],
      },
    ],
    guaranteed: [
      { id: "lute", name: "Lute", icon: "music_note", weight: "2 lb", properties: "Musical Instrument", desc: "A stringed instrument used as a bardic spellcasting focus." },
      { id: "leather-armor", name: "Leather Armor", icon: "checkroom", weight: "10 lb", properties: "AC 11 + Dex modifier", desc: "Supple leather molded to the wearer's body, offering light protection." },
      { id: "dagger-g", name: "Dagger", icon: "cut", damage: "1d4 piercing", weight: "1 lb", properties: "Finesse, Light, Thrown (20/60)", desc: "A small, concealable blade useful for close combat and throwing." },
    ],
  },
  cleric: {
    choices: [
      {
        label: "Primary Weapon",
        options: [
          { id: "cleric-1a", name: "Mace", items: [{ id: "mace", name: "Mace", icon: "hardware", damage: "1d6 bludgeoning", weight: "4 lb", properties: "Simple", desc: "A heavy metal head on a sturdy shaft." }] },
          { id: "cleric-1b", name: "Warhammer", items: [{ id: "warhammer", name: "Warhammer", icon: "hardware", damage: "1d8 bludgeoning", weight: "2 lb", properties: "Versatile (1d10)", desc: "A heavy hammer that delivers crushing blows." }] },
        ],
      },
      {
        label: "Armor",
        options: [
          { id: "cleric-2a", name: "Scale Mail", items: [{ id: "scale-mail", name: "Scale Mail", icon: "checkroom", weight: "45 lb", properties: "AC 14 + Dex (max 2), Stealth Disadvantage", desc: "A coat of overlapping metal scales." }] },
          { id: "cleric-2b", name: "Leather Armor", items: [{ id: "leather-armor", name: "Leather Armor", icon: "checkroom", weight: "10 lb", properties: "AC 11 + Dex modifier", desc: "Supple leather offering light protection." }] },
          { id: "cleric-2c", name: "Chain Mail", items: [{ id: "chain-mail", name: "Chain Mail", icon: "checkroom", weight: "55 lb", properties: "AC 16, Stealth Disadvantage, Str 13 required", desc: "Heavy interlocking metal rings covering the entire body." }] },
        ],
      },
      {
        label: "Ranged / Simple Weapon",
        options: [
          { id: "cleric-3a", name: "Light Crossbow + 20 Bolts", items: [{ id: "light-crossbow", name: "Light Crossbow", icon: "swords", damage: "1d8 piercing", weight: "5 lb", properties: "Ammunition, Loading, Range (80/320), Two-Handed", desc: "A mechanical ranged weapon." }, { id: "bolts-20", name: "Bolts (x20)", icon: "arrow_upward", weight: "1.5 lb", desc: "Twenty crossbow bolts." }] },
          { id: "cleric-3b", name: "Mace", items: [{ id: "mace-alt", name: "Mace", icon: "hardware", damage: "1d6 bludgeoning", weight: "4 lb", properties: "Simple", desc: "A heavy metal head on a sturdy shaft." }] },
          { id: "cleric-3c", name: "Javelin", items: [{ id: "javelin-single", name: "Javelin", icon: "arrow_upward", damage: "1d6 piercing", weight: "2 lb", properties: "Thrown (30/120)", desc: "A light spear designed for throwing." }] },
          { id: "cleric-3d", name: "Handaxe", items: [{ id: "handaxe", name: "Handaxe", icon: "carpenter", damage: "1d6 slashing", weight: "2 lb", properties: "Light, Thrown (20/60)", desc: "A small throwing axe." }] },
        ],
      },
    ],
    guaranteed: [
      { id: "shield", name: "Shield (+2 AC)", icon: "shield", weight: "6 lb", properties: "+2 Armor Class", desc: "A sturdy shield providing solid defense." },
      { id: "holy-symbol", name: "Holy Symbol", icon: "church", weight: "1 lb", properties: "Spellcasting Focus", desc: "A sacred symbol used as a divine spellcasting focus." },
      { id: "priests-pack", name: "Priest's Pack", icon: "backpack", weight: "24 lb", properties: "Adventuring Gear", desc: "Backpack, blanket, 10 candles, tinderbox, alms box, 2 blocks of incense, censer, vestments, 2 days rations, waterskin." },
    ],
  },
  druid: {
    choices: [
      {
        label: "Shield or Simple Weapon",
        options: [
          { id: "druid-1a", name: "Wooden Shield", items: [{ id: "wooden-shield", name: "Wooden Shield (+2 AC)", icon: "shield", weight: "6 lb", properties: "+2 Armor Class", desc: "A shield crafted from sturdy wood." }] },
          { id: "druid-1b", name: "Quarterstaff", items: [{ id: "quarterstaff", name: "Quarterstaff", icon: "pen_size_1", damage: "1d6 bludgeoning", weight: "4 lb", properties: "Versatile (1d8)", desc: "A simple wooden staff." }] },
          { id: "druid-1c", name: "Dagger", items: [{ id: "dagger", name: "Dagger", icon: "cut", damage: "1d4 piercing", weight: "1 lb", properties: "Finesse, Light, Thrown (20/60)", desc: "A small blade for close combat." }] },
          { id: "druid-1d", name: "Mace", items: [{ id: "mace", name: "Mace", icon: "hardware", damage: "1d6 bludgeoning", weight: "4 lb", properties: "Simple", desc: "A heavy metal head on a sturdy shaft." }] },
        ],
      },
      {
        label: "Melee Weapon",
        options: [
          { id: "druid-2a", name: "Scimitar", items: [{ id: "scimitar", name: "Scimitar", icon: "swords", damage: "1d6 slashing", weight: "3 lb", properties: "Finesse, Light", desc: "A curved blade favoured for its speed." }] },
          { id: "druid-2b", name: "Club", items: [{ id: "club", name: "Club", icon: "hardware", damage: "1d4 bludgeoning", weight: "2 lb", properties: "Light", desc: "A simple wooden bludgeon." }] },
          { id: "druid-2c", name: "Quarterstaff", items: [{ id: "quarterstaff-2", name: "Quarterstaff", icon: "pen_size_1", damage: "1d6 bludgeoning", weight: "4 lb", properties: "Versatile (1d8)", desc: "A simple wooden staff." }] },
          { id: "druid-2d", name: "Handaxe", items: [{ id: "handaxe", name: "Handaxe", icon: "carpenter", damage: "1d6 slashing", weight: "2 lb", properties: "Light, Thrown (20/60)", desc: "A small throwing axe." }] },
        ],
      },
    ],
    guaranteed: [
      { id: "leather-armor", name: "Leather Armor", icon: "checkroom", weight: "10 lb", properties: "AC 11 + Dex modifier", desc: "Supple leather offering light protection." },
      { id: "explorers-pack", name: "Explorer's Pack", icon: "backpack", weight: "59 lb", properties: "Adventuring Gear", desc: "Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days rations, waterskin, and 50 ft of rope." },
      { id: "druidic-focus", name: "Druidic Focus", icon: "eco", weight: "—", properties: "Spellcasting Focus", desc: "A sprig of mistletoe, totem, or wooden staff used as a druidic focus." },
    ],
  },
  fighter: {
    choices: [
      {
        label: "Armor",
        options: [
          { id: "fighter-1a", name: "Chain Mail", items: [{ id: "chain-mail", name: "Chain Mail", icon: "checkroom", weight: "55 lb", properties: "AC 16, Stealth Disadvantage, Str 13 required", desc: "Heavy interlocking metal rings covering the entire body." }] },
          { id: "fighter-1b", name: "Leather Armor + Longbow + 20 Arrows", items: [{ id: "leather-armor", name: "Leather Armor", icon: "checkroom", weight: "10 lb", properties: "AC 11 + Dex modifier", desc: "Supple leather offering light protection." }, { id: "longbow", name: "Longbow", icon: "swords", damage: "1d8 piercing", weight: "2 lb", properties: "Ammunition, Heavy, Range (150/600), Two-Handed", desc: "A tall bow for long-range attacks." }, { id: "arrows-20", name: "Arrows (x20)", icon: "arrow_upward", weight: "1 lb", desc: "Twenty arrows for a bow." }] },
        ],
      },
      {
        label: "Weapon Setup",
        options: [
          { id: "fighter-2a", name: "Longsword + Shield", items: [{ id: "longsword", name: "Longsword", icon: "swords", damage: "1d8 slashing", weight: "3 lb", properties: "Versatile (1d10)", desc: "A classic one-handed blade." }, { id: "shield", name: "Shield (+2 AC)", icon: "shield", weight: "6 lb", properties: "+2 Armor Class", desc: "A sturdy shield for defense." }] },
          { id: "fighter-2b", name: "Battleaxe + Shield", items: [{ id: "battleaxe", name: "Battleaxe", icon: "swords", damage: "1d8 slashing", weight: "4 lb", properties: "Versatile (1d10)", desc: "A sturdy axe balanced for combat." }, { id: "shield", name: "Shield (+2 AC)", icon: "shield", weight: "6 lb", properties: "+2 Armor Class", desc: "A sturdy shield for defense." }] },
          { id: "fighter-2c", name: "Warhammer + Shield", items: [{ id: "warhammer", name: "Warhammer", icon: "hardware", damage: "1d8 bludgeoning", weight: "2 lb", properties: "Versatile (1d10)", desc: "A heavy hammer for crushing blows." }, { id: "shield", name: "Shield (+2 AC)", icon: "shield", weight: "6 lb", properties: "+2 Armor Class", desc: "A sturdy shield for defense." }] },
          { id: "fighter-2d", name: "Two Longswords", items: [{ id: "longsword-1", name: "Longsword", icon: "swords", damage: "1d8 slashing", weight: "3 lb", properties: "Versatile (1d10)", desc: "A classic one-handed blade." }, { id: "longsword-2", name: "Longsword", icon: "swords", damage: "1d8 slashing", weight: "3 lb", properties: "Versatile (1d10)", desc: "A classic one-handed blade." }] },
          { id: "fighter-2e", name: "Longsword + Battleaxe", items: [{ id: "longsword", name: "Longsword", icon: "swords", damage: "1d8 slashing", weight: "3 lb", properties: "Versatile (1d10)", desc: "A classic one-handed blade." }, { id: "battleaxe", name: "Battleaxe", icon: "swords", damage: "1d8 slashing", weight: "4 lb", properties: "Versatile (1d10)", desc: "A sturdy axe." }] },
        ],
      },
      {
        label: "Ranged Weapon",
        options: [
          { id: "fighter-3a", name: "Light Crossbow + 20 Bolts", items: [{ id: "light-crossbow", name: "Light Crossbow", icon: "swords", damage: "1d8 piercing", weight: "5 lb", properties: "Ammunition, Loading, Range (80/320), Two-Handed", desc: "A mechanical ranged weapon." }, { id: "bolts-20", name: "Bolts (x20)", icon: "arrow_upward", weight: "1.5 lb", desc: "Twenty crossbow bolts." }] },
          { id: "fighter-3b", name: "Two Handaxes", items: [{ id: "handaxe-1", name: "Handaxe", icon: "carpenter", damage: "1d6 slashing", weight: "2 lb", properties: "Light, Thrown (20/60)", desc: "A small throwing axe." }, { id: "handaxe-2", name: "Handaxe", icon: "carpenter", damage: "1d6 slashing", weight: "2 lb", properties: "Light, Thrown (20/60)", desc: "A small throwing axe." }] },
        ],
      },
      {
        label: "Equipment Pack",
        options: [
          { id: "fighter-4a", name: "Dungeoneer's Pack", items: [{ id: "dungeoneers-pack", name: "Dungeoneer's Pack", icon: "backpack", weight: "61.5 lb", properties: "Adventuring Gear", desc: "Backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days rations, waterskin, and 50 ft of rope." }] },
          { id: "fighter-4b", name: "Explorer's Pack", items: [{ id: "explorers-pack", name: "Explorer's Pack", icon: "backpack", weight: "59 lb", properties: "Adventuring Gear", desc: "Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days rations, waterskin, and 50 ft of rope." }] },
        ],
      },
    ],
    guaranteed: [],
  },
  monk: {
    choices: [
      {
        label: "Primary Weapon",
        options: [
          { id: "monk-1a", name: "Shortsword", items: [{ id: "shortsword", name: "Shortsword", icon: "swords", damage: "1d6 piercing", weight: "2 lb", properties: "Finesse, Light", desc: "A small, nimble blade for quick strikes." }] },
          { id: "monk-1b", name: "Handaxe", items: [{ id: "handaxe", name: "Handaxe", icon: "carpenter", damage: "1d6 slashing", weight: "2 lb", properties: "Light, Thrown (20/60)", desc: "A small throwing axe." }] },
          { id: "monk-1c", name: "Javelin", items: [{ id: "javelin-single", name: "Javelin", icon: "arrow_upward", damage: "1d6 piercing", weight: "2 lb", properties: "Thrown (30/120)", desc: "A light spear designed for throwing." }] },
          { id: "monk-1d", name: "Quarterstaff", items: [{ id: "quarterstaff", name: "Quarterstaff", icon: "pen_size_1", damage: "1d6 bludgeoning", weight: "4 lb", properties: "Versatile (1d8)", desc: "A simple wooden staff." }] },
        ],
      },
      {
        label: "Equipment Pack",
        options: [
          { id: "monk-2a", name: "Dungeoneer's Pack", items: [{ id: "dungeoneers-pack", name: "Dungeoneer's Pack", icon: "backpack", weight: "61.5 lb", properties: "Adventuring Gear", desc: "Backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days rations, waterskin, and 50 ft of rope." }] },
          { id: "monk-2b", name: "Explorer's Pack", items: [{ id: "explorers-pack", name: "Explorer's Pack", icon: "backpack", weight: "59 lb", properties: "Adventuring Gear", desc: "Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days rations, waterskin, and 50 ft of rope." }] },
        ],
      },
    ],
    guaranteed: [
      { id: "darts-10", name: "Darts (x10)", icon: "arrow_upward", damage: "1d4 piercing", weight: "0.25 lb each", properties: "Finesse, Thrown (20/60)", desc: "Ten small throwing darts." },
    ],
  },
  paladin: {
    choices: [
      {
        label: "Weapon Setup",
        options: [
          { id: "paladin-1a", name: "Longsword + Shield", items: [{ id: "longsword", name: "Longsword", icon: "swords", damage: "1d8 slashing", weight: "3 lb", properties: "Versatile (1d10)", desc: "A classic one-handed blade." }, { id: "shield", name: "Shield (+2 AC)", icon: "shield", weight: "6 lb", properties: "+2 Armor Class", desc: "A sturdy shield for defense." }] },
          { id: "paladin-1b", name: "Battleaxe + Shield", items: [{ id: "battleaxe", name: "Battleaxe", icon: "swords", damage: "1d8 slashing", weight: "4 lb", properties: "Versatile (1d10)", desc: "A sturdy axe." }, { id: "shield", name: "Shield (+2 AC)", icon: "shield", weight: "6 lb", properties: "+2 Armor Class", desc: "A sturdy shield." }] },
          { id: "paladin-1c", name: "Warhammer + Shield", items: [{ id: "warhammer", name: "Warhammer", icon: "hardware", damage: "1d8 bludgeoning", weight: "2 lb", properties: "Versatile (1d10)", desc: "A heavy hammer for crushing blows." }, { id: "shield", name: "Shield (+2 AC)", icon: "shield", weight: "6 lb", properties: "+2 Armor Class", desc: "A sturdy shield." }] },
          { id: "paladin-1d", name: "Two Longswords", items: [{ id: "longsword-1", name: "Longsword", icon: "swords", damage: "1d8 slashing", weight: "3 lb", properties: "Versatile (1d10)", desc: "A classic one-handed blade." }, { id: "longsword-2", name: "Longsword", icon: "swords", damage: "1d8 slashing", weight: "3 lb", properties: "Versatile (1d10)", desc: "A classic one-handed blade." }] },
        ],
      },
      {
        label: "Secondary Weapon",
        options: [
          { id: "paladin-2a", name: "Five Javelins", items: [{ id: "javelins-5", name: "Javelins (x5)", icon: "arrow_upward", damage: "1d6 piercing", weight: "2 lb each", properties: "Thrown (30/120)", desc: "Five throwing spears." }] },
          { id: "paladin-2b", name: "Mace", items: [{ id: "mace", name: "Mace", icon: "hardware", damage: "1d6 bludgeoning", weight: "4 lb", properties: "Simple", desc: "A heavy metal head on a sturdy shaft." }] },
          { id: "paladin-2c", name: "Handaxe", items: [{ id: "handaxe", name: "Handaxe", icon: "carpenter", damage: "1d6 slashing", weight: "2 lb", properties: "Light, Thrown (20/60)", desc: "A small throwing axe." }] },
        ],
      },
    ],
    guaranteed: [
      { id: "chain-mail", name: "Chain Mail", icon: "checkroom", weight: "55 lb", properties: "AC 16, Stealth Disadvantage, Str 13 required", desc: "Heavy interlocking metal rings covering the entire body." },
      { id: "holy-symbol", name: "Holy Symbol", icon: "church", weight: "1 lb", properties: "Spellcasting Focus", desc: "A sacred symbol used as a divine spellcasting focus." },
      { id: "priests-pack", name: "Priest's Pack", icon: "backpack", weight: "24 lb", properties: "Adventuring Gear", desc: "Backpack, blanket, 10 candles, tinderbox, alms box, 2 blocks of incense, censer, vestments, 2 days rations, waterskin." },
    ],
  },
  ranger: {
    choices: [
      {
        label: "Armor",
        options: [
          { id: "ranger-1a", name: "Scale Mail", items: [{ id: "scale-mail", name: "Scale Mail", icon: "checkroom", weight: "45 lb", properties: "AC 14 + Dex (max 2), Stealth Disadvantage", desc: "A coat of overlapping metal scales." }] },
          { id: "ranger-1b", name: "Leather Armor", items: [{ id: "leather-armor", name: "Leather Armor", icon: "checkroom", weight: "10 lb", properties: "AC 11 + Dex modifier", desc: "Supple leather offering light protection." }] },
        ],
      },
      {
        label: "Melee Weapons",
        options: [
          { id: "ranger-2a", name: "Two Shortswords", items: [{ id: "shortsword-1", name: "Shortsword", icon: "swords", damage: "1d6 piercing", weight: "2 lb", properties: "Finesse, Light", desc: "A small, nimble blade." }, { id: "shortsword-2", name: "Shortsword", icon: "swords", damage: "1d6 piercing", weight: "2 lb", properties: "Finesse, Light", desc: "A small, nimble blade." }] },
          { id: "ranger-2b", name: "Two Handaxes", items: [{ id: "handaxe-1", name: "Handaxe", icon: "carpenter", damage: "1d6 slashing", weight: "2 lb", properties: "Light, Thrown (20/60)", desc: "A small throwing axe." }, { id: "handaxe-2", name: "Handaxe", icon: "carpenter", damage: "1d6 slashing", weight: "2 lb", properties: "Light, Thrown (20/60)", desc: "A small throwing axe." }] },
          { id: "ranger-2c", name: "Handaxe + Dagger", items: [{ id: "handaxe", name: "Handaxe", icon: "carpenter", damage: "1d6 slashing", weight: "2 lb", properties: "Light, Thrown (20/60)", desc: "A small throwing axe." }, { id: "dagger", name: "Dagger", icon: "cut", damage: "1d4 piercing", weight: "1 lb", properties: "Finesse, Light, Thrown (20/60)", desc: "A small blade for close combat." }] },
        ],
      },
      {
        label: "Equipment Pack",
        options: [
          { id: "ranger-3a", name: "Dungeoneer's Pack", items: [{ id: "dungeoneers-pack", name: "Dungeoneer's Pack", icon: "backpack", weight: "61.5 lb", properties: "Adventuring Gear", desc: "Backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days rations, waterskin, and 50 ft of rope." }] },
          { id: "ranger-3b", name: "Explorer's Pack", items: [{ id: "explorers-pack", name: "Explorer's Pack", icon: "backpack", weight: "59 lb", properties: "Adventuring Gear", desc: "Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days rations, waterskin, and 50 ft of rope." }] },
        ],
      },
    ],
    guaranteed: [
      { id: "longbow", name: "Longbow", icon: "swords", damage: "1d8 piercing", weight: "2 lb", properties: "Ammunition, Heavy, Range (150/600), Two-Handed", desc: "A tall bow for long-range attacks." },
      { id: "quiver-20", name: "Quiver of 20 Arrows", icon: "arrow_upward", weight: "1 lb", desc: "A quiver containing twenty arrows." },
    ],
  },
  rogue: {
    choices: [
      {
        label: "Primary Weapon",
        options: [
          { id: "rogue-1a", name: "Rapier", items: [{ id: "rapier", name: "Rapier", icon: "swords", damage: "1d8 piercing", weight: "2 lb", properties: "Finesse", desc: "A slender, sharply pointed sword." }] },
          { id: "rogue-1b", name: "Shortsword", items: [{ id: "shortsword", name: "Shortsword", icon: "swords", damage: "1d6 piercing", weight: "2 lb", properties: "Finesse, Light", desc: "A small, nimble blade." }] },
        ],
      },
      {
        label: "Ranged / Secondary Weapon",
        options: [
          { id: "rogue-2a", name: "Shortbow + 20 Arrows", items: [{ id: "shortbow", name: "Shortbow", icon: "swords", damage: "1d6 piercing", weight: "2 lb", properties: "Ammunition, Range (80/320), Two-Handed", desc: "A compact bow for ranged attacks." }, { id: "arrows-20", name: "Arrows (x20)", icon: "arrow_upward", weight: "1 lb", desc: "Twenty arrows for a bow." }] },
          { id: "rogue-2b", name: "Shortsword", items: [{ id: "shortsword-2", name: "Shortsword", icon: "swords", damage: "1d6 piercing", weight: "2 lb", properties: "Finesse, Light", desc: "A small, nimble blade." }] },
        ],
      },
      {
        label: "Equipment Pack",
        options: [
          { id: "rogue-3a", name: "Burglar's Pack", items: [{ id: "burglars-pack", name: "Burglar's Pack", icon: "backpack", weight: "44.5 lb", properties: "Adventuring Gear", desc: "Backpack, bag of 1000 ball bearings, 10 ft string, bell, 5 candles, crowbar, hammer, 10 pitons, hooded lantern, 2 flasks of oil, 5 days rations, tinderbox, waterskin." }] },
          { id: "rogue-3b", name: "Dungeoneer's Pack", items: [{ id: "dungeoneers-pack", name: "Dungeoneer's Pack", icon: "backpack", weight: "61.5 lb", properties: "Adventuring Gear", desc: "Backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days rations, waterskin, and 50 ft of rope." }] },
          { id: "rogue-3c", name: "Explorer's Pack", items: [{ id: "explorers-pack", name: "Explorer's Pack", icon: "backpack", weight: "59 lb", properties: "Adventuring Gear", desc: "Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days rations, waterskin, and 50 ft of rope." }] },
        ],
      },
    ],
    guaranteed: [
      { id: "leather-armor", name: "Leather Armor", icon: "checkroom", weight: "10 lb", properties: "AC 11 + Dex modifier", desc: "Supple leather offering light protection." },
      { id: "dagger-1", name: "Dagger", icon: "cut", damage: "1d4 piercing", weight: "1 lb", properties: "Finesse, Light, Thrown (20/60)", desc: "A small blade for close combat." },
      { id: "dagger-2", name: "Dagger", icon: "cut", damage: "1d4 piercing", weight: "1 lb", properties: "Finesse, Light, Thrown (20/60)", desc: "A small blade for close combat." },
      { id: "thieves-tools", name: "Thieves' Tools", icon: "lock_open", weight: "1 lb", properties: "Tool", desc: "A set of lockpicks, a small mirror, narrow-bladed scissors, and a pair of pliers." },
    ],
  },
  sorcerer: {
    choices: [
      {
        label: "Weapon",
        options: [
          { id: "sorc-1a", name: "Light Crossbow + 20 Bolts", items: [{ id: "light-crossbow", name: "Light Crossbow", icon: "swords", damage: "1d8 piercing", weight: "5 lb", properties: "Ammunition, Loading, Range (80/320), Two-Handed", desc: "A mechanical ranged weapon." }, { id: "bolts-20", name: "Bolts (x20)", icon: "arrow_upward", weight: "1.5 lb", desc: "Twenty crossbow bolts." }] },
          { id: "sorc-1b", name: "Quarterstaff", items: [{ id: "quarterstaff", name: "Quarterstaff", icon: "pen_size_1", damage: "1d6 bludgeoning", weight: "4 lb", properties: "Versatile (1d8)", desc: "A simple wooden staff." }] },
          { id: "sorc-1c", name: "Dagger", items: [{ id: "dagger", name: "Dagger", icon: "cut", damage: "1d4 piercing", weight: "1 lb", properties: "Finesse, Light, Thrown (20/60)", desc: "A small blade for close combat." }] },
          { id: "sorc-1d", name: "Handaxe", items: [{ id: "handaxe", name: "Handaxe", icon: "carpenter", damage: "1d6 slashing", weight: "2 lb", properties: "Light, Thrown (20/60)", desc: "A small throwing axe." }] },
        ],
      },
      {
        label: "Arcane Focus",
        options: [
          { id: "sorc-2a", name: "Component Pouch", items: [{ id: "component-pouch", name: "Component Pouch", icon: "backpack", weight: "2 lb", properties: "Spellcasting Focus", desc: "A small belt pouch containing material components for spells." }] },
          { id: "sorc-2b", name: "Arcane Focus", items: [{ id: "arcane-focus", name: "Arcane Focus", icon: "auto_fix_high", weight: "1 lb", properties: "Spellcasting Focus", desc: "A crystal, orb, or wand that channels arcane energy." }] },
        ],
      },
    ],
    guaranteed: [
      { id: "dungeoneers-pack", name: "Dungeoneer's Pack", icon: "backpack", weight: "61.5 lb", properties: "Adventuring Gear", desc: "Backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days rations, waterskin, and 50 ft of rope." },
      { id: "dagger-1", name: "Dagger", icon: "cut", damage: "1d4 piercing", weight: "1 lb", properties: "Finesse, Light, Thrown (20/60)", desc: "A small blade for close combat." },
      { id: "dagger-2", name: "Dagger", icon: "cut", damage: "1d4 piercing", weight: "1 lb", properties: "Finesse, Light, Thrown (20/60)", desc: "A small blade for close combat." },
    ],
  },
  warlock: {
    choices: [
      {
        label: "Weapon",
        options: [
          { id: "lock-1a", name: "Light Crossbow + 20 Bolts", items: [{ id: "light-crossbow", name: "Light Crossbow", icon: "swords", damage: "1d8 piercing", weight: "5 lb", properties: "Ammunition, Loading, Range (80/320), Two-Handed", desc: "A mechanical ranged weapon." }, { id: "bolts-20", name: "Bolts (x20)", icon: "arrow_upward", weight: "1.5 lb", desc: "Twenty crossbow bolts." }] },
          { id: "lock-1b", name: "Quarterstaff", items: [{ id: "quarterstaff", name: "Quarterstaff", icon: "pen_size_1", damage: "1d6 bludgeoning", weight: "4 lb", properties: "Versatile (1d8)", desc: "A simple wooden staff." }] },
          { id: "lock-1c", name: "Dagger", items: [{ id: "dagger", name: "Dagger", icon: "cut", damage: "1d4 piercing", weight: "1 lb", properties: "Finesse, Light, Thrown (20/60)", desc: "A small blade for close combat." }] },
        ],
      },
      {
        label: "Arcane Focus",
        options: [
          { id: "lock-2a", name: "Component Pouch", items: [{ id: "component-pouch", name: "Component Pouch", icon: "backpack", weight: "2 lb", properties: "Spellcasting Focus", desc: "A small belt pouch containing material components for spells." }] },
          { id: "lock-2b", name: "Arcane Focus", items: [{ id: "arcane-focus", name: "Arcane Focus", icon: "auto_fix_high", weight: "1 lb", properties: "Spellcasting Focus", desc: "A crystal, orb, or wand that channels arcane energy." }] },
        ],
      },
    ],
    guaranteed: [
      { id: "leather-armor", name: "Leather Armor", icon: "checkroom", weight: "10 lb", properties: "AC 11 + Dex modifier", desc: "Supple leather offering light protection." },
      { id: "dagger-simple", name: "Dagger", icon: "cut", damage: "1d4 piercing", weight: "1 lb", properties: "Finesse, Light, Thrown (20/60)", desc: "A simple weapon included with starting equipment." },
      { id: "dagger-1", name: "Dagger", icon: "cut", damage: "1d4 piercing", weight: "1 lb", properties: "Finesse, Light, Thrown (20/60)", desc: "A small blade for close combat." },
      { id: "dagger-2", name: "Dagger", icon: "cut", damage: "1d4 piercing", weight: "1 lb", properties: "Finesse, Light, Thrown (20/60)", desc: "A small blade for close combat." },
      { id: "scholars-pack", name: "Scholar's Pack", icon: "backpack", weight: "10 lb", properties: "Adventuring Gear", desc: "Backpack, book of lore, ink, pen, 10 sheets of parchment, little bag of sand, small knife." },
    ],
  },
  wizard: {
    choices: [
      {
        label: "Weapon",
        options: [
          { id: "wiz-1a", name: "Quarterstaff", items: [{ id: "quarterstaff", name: "Quarterstaff", icon: "pen_size_1", damage: "1d6 bludgeoning", weight: "4 lb", properties: "Versatile (1d8)", desc: "A simple wooden staff." }] },
          { id: "wiz-1b", name: "Dagger", items: [{ id: "dagger", name: "Dagger", icon: "cut", damage: "1d4 piercing", weight: "1 lb", properties: "Finesse, Light, Thrown (20/60)", desc: "A small blade for close combat." }] },
        ],
      },
      {
        label: "Arcane Focus",
        options: [
          { id: "wiz-2a", name: "Component Pouch", items: [{ id: "component-pouch", name: "Component Pouch", icon: "backpack", weight: "2 lb", properties: "Spellcasting Focus", desc: "A small belt pouch containing material components for spells." }] },
          { id: "wiz-2b", name: "Arcane Focus", items: [{ id: "arcane-focus", name: "Arcane Focus", icon: "auto_fix_high", weight: "1 lb", properties: "Spellcasting Focus", desc: "A crystal, orb, or wand that channels arcane energy." }] },
        ],
      },
      {
        label: "Equipment Pack",
        options: [
          { id: "wiz-3a", name: "Scholar's Pack", items: [{ id: "scholars-pack", name: "Scholar's Pack", icon: "backpack", weight: "10 lb", properties: "Adventuring Gear", desc: "Backpack, book of lore, ink, pen, 10 sheets of parchment, little bag of sand, small knife." }] },
          { id: "wiz-3b", name: "Explorer's Pack", items: [{ id: "explorers-pack", name: "Explorer's Pack", icon: "backpack", weight: "59 lb", properties: "Adventuring Gear", desc: "Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days rations, waterskin, and 50 ft of rope." }] },
        ],
      },
    ],
    guaranteed: [
      { id: "spellbook", name: "Spellbook", icon: "auto_stories", weight: "3 lb", properties: "Arcane Focus", desc: "Essential for a wizard. Contains the spells you have learned and can prepare each day." },
    ],
  },
};
