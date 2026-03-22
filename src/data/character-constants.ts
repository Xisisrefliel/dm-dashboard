import type { Character, AbilityScores, InventoryItem } from "../types/index.ts";
import type { Background, Alignment, AlignmentQuestion, ClassSpellSlots } from "../types/index.ts";

export const STEPS = [
  "Race",
  "Class",
  "Background",
  "Stats",
  "Alignment",
  "Equipment",
  "Spells",
] as const;

export const CLASS_SPELL_SLOTS: Record<string, ClassSpellSlots> = {
  bard:     { cantrips: 2, spells: 4, castLevel: 1 },
  cleric:   { cantrips: 3, spells: 4, castLevel: 1 },
  druid:    { cantrips: 2, spells: 4, castLevel: 1 },
  sorcerer: { cantrips: 4, spells: 2, castLevel: 1 },
  warlock:  { cantrips: 2, spells: 2, castLevel: 1 },
  wizard:   { cantrips: 3, spells: 4, castLevel: 1 },
  paladin:  { cantrips: 0, spells: 2, castLevel: 2 },
  ranger:   { cantrips: 0, spells: 2, castLevel: 2 },
};

export const BACKGROUNDS: Background[] = [
  {
    id: "acolyte",
    name: "Acolyte",
    icon: "temple_hindu",
    skills: ["Insight", "Religion"],
    desc: "You have spent your life in service to a temple, learning sacred rites and providing sacrifices.",
  },
  {
    id: "criminal",
    name: "Criminal",
    icon: "visibility_off",
    skills: ["Deception", "Stealth"],
    desc: "You have a history of breaking the law and surviving by your wits.",
  },
  {
    id: "folk-hero",
    name: "Folk Hero",
    icon: "groups",
    skills: ["Animal Handling", "Survival"],
    desc: "You come from a humble background, but you are destined for much more.",
  },
  {
    id: "noble",
    name: "Noble",
    icon: "diamond",
    skills: ["History", "Persuasion"],
    desc: "You understand wealth, power, and privilege.",
  },
  {
    id: "sage",
    name: "Sage",
    icon: "menu_book",
    skills: ["Arcana", "History"],
    desc: "You spent years learning the lore of the multiverse.",
  },
  {
    id: "soldier",
    name: "Soldier",
    icon: "shield",
    skills: ["Athletics", "Intimidation"],
    desc: "War has been your life for as long as you care to remember.",
  },
  {
    id: "hermit",
    name: "Hermit",
    icon: "forest",
    skills: ["Medicine", "Religion"],
    desc: "You lived in seclusion for a formative part of your life.",
  },
  {
    id: "outlander",
    name: "Outlander",
    icon: "explore",
    skills: ["Athletics", "Survival"],
    desc: "You grew up in the wilds, far from civilization.",
  },
  {
    id: "entertainer",
    name: "Entertainer",
    icon: "music_note",
    skills: ["Acrobatics", "Performance"],
    desc: "You thrive in front of an audience, knowing how to entrance them.",
  },
  {
    id: "guild-artisan",
    name: "Guild Artisan",
    icon: "handyman",
    skills: ["Insight", "Persuasion"],
    desc: "You are a member of an artisan's guild, skilled in a particular craft.",
  },
  {
    id: "sailor",
    name: "Sailor",
    icon: "sailing",
    skills: ["Athletics", "Perception"],
    desc: "You sailed on a seagoing vessel, facing mighty storms and creatures of the deep.",
  },
  {
    id: "urchin",
    name: "Urchin",
    icon: "child_care",
    skills: ["Sleight of Hand", "Stealth"],
    desc: "You grew up on the streets alone, orphaned, and poor.",
  },
];

export const ALIGNMENTS: Alignment[] = [
  {
    id: "lg",
    name: "Lawful Good",
    short: "LG",
    desc: "Acts with compassion and honor, following the law.",
    icon: "verified",
    color: "#7cacf0",
  },
  {
    id: "ng",
    name: "Neutral Good",
    short: "NG",
    desc: "Does the best they can to help others.",
    icon: "favorite",
    color: "#6ecf9a",
  },
  {
    id: "cg",
    name: "Chaotic Good",
    short: "CG",
    desc: "Acts as their conscience directs, with little regard for rules.",
    icon: "local_fire_department",
    color: "#e0c46c",
  },
  {
    id: "ln",
    name: "Lawful Neutral",
    short: "LN",
    desc: "Acts in accordance with law, tradition, or personal codes.",
    icon: "balance",
    color: "#7cacf0",
  },
  {
    id: "tn",
    name: "True Neutral",
    short: "N",
    desc: "Prefers to avoid moral questions and doesn't take sides.",
    icon: "radio_button_unchecked",
    color: "#9a9a9a",
  },
  {
    id: "cn",
    name: "Chaotic Neutral",
    short: "CN",
    desc: "Follows their whims, holding personal freedom above all.",
    icon: "casino",
    color: "#e0c46c",
  },
  {
    id: "le",
    name: "Lawful Evil",
    short: "LE",
    desc: "Takes what they want within a code of tradition or loyalty.",
    icon: "gavel",
    color: "#e07070",
  },
  {
    id: "ne",
    name: "Neutral Evil",
    short: "NE",
    desc: "Does whatever they can get away with, without remorse.",
    icon: "skull",
    color: "#e07070",
  },
  {
    id: "ce",
    name: "Chaotic Evil",
    short: "CE",
    desc: "Acts with violence and cruelty, driven by greed or hatred.",
    icon: "whatshot",
    color: "#e07070",
  },
];

export const ALIGNMENT_QUESTIONS: AlignmentQuestion[] = [
  {
    q: "A dragon has enslaved a village and demands tribute. What do you do?",
    answers: [
      { text: "Rally the townsfolk and challenge the dragon according to the old laws of combat.", law: 1, good: 1 },
      { text: "Sneak into its lair and free the captives while it sleeps.", law: -1, good: 1 },
      { text: "Negotiate a deal — you'll pay the tribute if the dragon grants you a favour.", law: 0, good: -1 },
      { text: "Walk away. It's not your village.", law: 0, good: 0 },
    ],
  },
  {
    q: "You find a powerful cursed sword in a dungeon. A paladin in your party says it must be destroyed.",
    answers: [
      { text: "Agree — cursed items should be destroyed for the greater good.", law: 1, good: 1 },
      { text: "Keep it hidden. Power is power, and you might need it someday.", law: -1, good: -1 },
      { text: "Study it first. Knowledge shouldn't be wasted, then decide.", law: 0, good: 0 },
      { text: "Hand it to the local temple and let the clerics decide.", law: 1, good: 0 },
    ],
  },
  {
    q: "A beggar on the street turns out to be a wanted criminal in disguise. Guards are approaching.",
    answers: [
      { text: "Point him out to the guards. The law is the law.", law: 1, good: 0 },
      { text: "Hide him. Everyone deserves a second chance.", law: -1, good: 1 },
      { text: "Demand payment for your silence.", law: -1, good: -1 },
      { text: "Ignore the situation entirely and keep walking.", law: 0, good: 0 },
    ],
  },
  {
    q: "Your party discovers a tribe of goblins farming peacefully. Your quest says to clear them out.",
    answers: [
      { text: "They're peaceful — refuse the quest and protect them.", law: -1, good: 1 },
      { text: "A contract is a contract. Complete the quest as agreed.", law: 1, good: -1 },
      { text: "Negotiate with both sides to find a compromise.", law: 0, good: 1 },
      { text: "Extort the goblins for gold, then tell the questgiver they fled.", law: -1, good: -1 },
    ],
  },
  {
    q: "A king offers you a title and lands in exchange for assassinating his rival.",
    answers: [
      { text: "Refuse. Murder for politics is beneath you.", law: 1, good: 1 },
      { text: "Accept. Power and land are worth one life.", law: 0, good: -1 },
      { text: "Warn the rival and offer to protect them instead.", law: -1, good: 1 },
      { text: "Play both sides and sell information to the highest bidder.", law: -1, good: -1 },
    ],
  },
  {
    q: "You catch a fellow party member stealing from a merchant while they're distracted.",
    answers: [
      { text: "Confront them immediately and insist they return it.", law: 1, good: 1 },
      { text: "Say nothing — it's their business, not yours.", law: 0, good: 0 },
      { text: "Ask for a cut of the take.", law: -1, good: -1 },
      { text: "Secretly return the item to the merchant yourself.", law: 0, good: 1 },
    ],
  },
  {
    q: "A dying wizard offers you their spellbook, but it's bound by an oath to their arcane order.",
    answers: [
      { text: "Return it to the order. Oaths must be honoured, even after death.", law: 1, good: 0 },
      { text: "Take it. The wizard offered it freely and the dead have no claims.", law: -1, good: 0 },
      { text: "Copy what you need, then return the original.", law: 0, good: 0 },
      { text: "Deliver it to the order and ask for a reward or membership.", law: 1, good: -1 },
    ],
  },
  {
    q: "You stumble upon a ritual that could resurrect a fallen hero — but requires a sacrifice.",
    answers: [
      { text: "No life is worth trading for another. Walk away.", law: 1, good: 1 },
      { text: "Sacrifice a captured enemy. The hero's return will save thousands.", law: 0, good: 0 },
      { text: "Offer yourself if needed — some causes are worth dying for.", law: 0, good: 1 },
      { text: "Use the ritual for your own purposes instead.", law: -1, good: -1 },
    ],
  },
  {
    q: "A town's corrupt mayor has been secretly funding an orphanage with embezzled gold.",
    answers: [
      { text: "Expose the corruption. The law must be upheld regardless.", law: 1, good: 0 },
      { text: "Let it slide. The children benefit, and that's what matters.", law: -1, good: 1 },
      { text: "Blackmail the mayor — if they're skimming, so can you.", law: -1, good: -1 },
      { text: "Convince the mayor to fund the orphanage legitimately.", law: 1, good: 1 },
    ],
  },
  {
    q: "An ancient tome reveals a spell that could end a war — but it would also destroy an entire forest.",
    answers: [
      { text: "Use it. Ending the war saves more lives than the forest.", law: 0, good: 0 },
      { text: "Refuse. The natural world must be preserved at all costs.", law: 0, good: 1 },
      { text: "Sell the knowledge to whichever side pays more.", law: -1, good: -1 },
      { text: "Present the spell to the war council and let them vote.", law: 1, good: 0 },
    ],
  },
];

export const ABILITIES = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;

export const ABILITY_NAMES: Record<string, string> = {
  STR: "Strength",
  DEX: "Dexterity",
  CON: "Constitution",
  INT: "Intelligence",
  WIS: "Wisdom",
  CHA: "Charisma",
};

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;

export const POINT_BUY_COSTS: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

export const POINT_BUY_TOTAL = 27;

export const ABILITY_ICONS: Record<string, string> = {
  STR: "fitness_center", DEX: "speed", CON: "shield",
  INT: "psychology", WIS: "visibility", CHA: "theater_comedy",
};

export const DEFAULT_POINTBUY: AbilityScores = { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 };

export const DEFAULT_MANUAL: AbilityScores = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };

export const RACE_ICONS: Record<string, string> = {
  dragonborn: "local_fire_department",
  dwarf: "hardware",
  elf: "park",
  gnome: "settings",
  halfling: "emoji_nature",
  human: "person",
  "half-elf": "diversity_3",
  "half-orc": "fitness_center",
  tiefling: "whatshot",
};

export const CLASS_ICONS: Record<string, string> = {
  barbarian: "fitness_center",
  bard: "music_note",
  cleric: "church",
  druid: "forest",
  fighter: "swords",
  monk: "self_improvement",
  paladin: "shield",
  ranger: "explore",
  rogue: "visibility_off",
  sorcerer: "bolt",
  warlock: "dark_mode",
  wizard: "auto_fix_high",
};

export const CLASS_DESCRIPTIONS: Record<string, string> = {
  barbarian: "Fierce warriors who channel primal rage to overpower enemies with raw strength and relentless fury.",
  bard: "Masters of artistry and enchantment who weave magic into performances to inspire allies and confound enemies.",
  cleric: "Divine healers and warriors who channel their deity's power to mend wounds, smite foes, and bolster allies.",
  druid: "Guardians of the natural world who wield elemental magic and can shapeshift into beasts.",
  fighter: "Versatile combatants trained in every form of warfare, mastering weapons, armor, and battlefield tactics.",
  monk: "Disciplined martial artists who harness the power of body and spirit to strike with supernatural speed.",
  paladin: "Holy knights bound by sacred oaths, combining divine magic with martial prowess to vanquish evil.",
  ranger: "Skilled hunters and trackers who blend combat expertise with nature magic to protect the wild.",
  rogue: "Cunning tricksters who rely on stealth, guile, and precision strikes to outmaneuver their foes.",
  sorcerer: "Innate spellcasters whose magic flows from a powerful bloodline or cosmic event within their very being.",
  warlock: "Seekers of forbidden knowledge who forge pacts with otherworldly patrons in exchange for arcane power.",
  wizard: "Scholarly mages who study the arcane arts, mastering a vast repertoire of spells through rigorous research.",
};

export const SKILL_DESCRIPTIONS: Record<string, string> = {
  "Acrobatics": "Covers stunts like diving, rolling, and flipping. Used when attempting to stay on your feet or perform acrobatic feats (DEX).",
  "Animal Handling": "Calm a domesticated animal, keep a mount from getting spooked, or intuit an animal's intentions (WIS).",
  "Arcana": "Recall lore about spells, magic items, eldritch symbols, magical traditions, and the planes of existence (INT).",
  "Athletics": "Covers climbing, jumping, and swimming. Used for difficult physical feats of strength (STR).",
  "Deception": "Convincingly hide the truth through words or actions, whether through fast-talking, disguise, or misleading others (CHA).",
  "History": "Recall lore about historical events, legendary people, ancient kingdoms, past disputes, recent wars, and lost civilizations (INT).",
  "Insight": "Determine the true intentions of a creature, such as detecting a lie or predicting someone's next move (WIS).",
  "Intimidation": "Influence someone through overt threats, hostile actions, or physical violence to get what you want (CHA).",
  "Investigation": "Look for clues and make deductions. Deduce the location of a hidden object or determine what kind of weapon dealt a wound (INT).",
  "Medicine": "Stabilize a dying companion, diagnose an illness, or determine cause of death (WIS).",
  "Nature": "Recall lore about terrain, plants, animals, weather, and natural cycles (INT).",
  "Perception": "Spot, hear, or detect the presence of something. Measures general awareness of your surroundings (WIS).",
  "Performance": "Delight an audience with music, dance, acting, storytelling, or some other form of entertainment (CHA).",
  "Persuasion": "Influence someone with tact, social graces, or good nature. Used for acting in good faith (CHA).",
  "Religion": "Recall lore about deities, rites and prayers, religious hierarchies, holy symbols, and the practices of secret cults (INT).",
  "Sleight of Hand": "Conceal an object, plant something on someone, or perform legerdemain and manual trickery (DEX).",
  "Stealth": "Attempt to conceal yourself from enemies, slink past guards, or slip away without being noticed (DEX).",
  "Survival": "Follow tracks, hunt wild game, guide your group through wastelands, predict the weather, or avoid quicksand (WIS).",
};

export const CLASS_PRIMARY_ABILITY: Record<string, string> = {
  barbarian: "Strength", bard: "Charisma", cleric: "Wisdom", druid: "Wisdom",
  fighter: "Strength or Dexterity", monk: "Dexterity & Wisdom", paladin: "Strength & Charisma",
  ranger: "Dexterity & Wisdom", rogue: "Dexterity", sorcerer: "Charisma",
  warlock: "Charisma", wizard: "Intelligence",
};

export const EMPTY_CHAR: Character = {
  name: "",
  race: null,
  class: null,
  background: null,
  level: 1,
  stats: { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 },
  alignment: null,
  equipment: [],
  equipChoices: {},
  cantrips: [],
  spells: [],
  skills: [],
  inventory: [],
  acOverride: null,
};

// Common SRD items for the "Add Item" picker
export const SRD_ITEMS: InventoryItem[] = [
  { id: "potion-healing", name: "Potion of Healing", icon: "local_pharmacy", weight: "0.5 lb", desc: "Regain 2d4+2 hit points when you drink this potion." },
  { id: "rope-50", name: "Rope (50 ft)", icon: "linked_services", weight: "10 lb", desc: "Has 2 hit points and can be burst with a DC 17 Strength check." },
  { id: "torch", name: "Torch", icon: "flashlight_on", weight: "1 lb", desc: "Burns for 1 hour, providing bright light in a 20-ft radius and dim light for an additional 20 ft." },
  { id: "rations", name: "Rations (1 day)", icon: "restaurant", weight: "2 lb", desc: "Dry foods suitable for extended travel, including jerky, dried fruit, hardtack, and nuts." },
  { id: "waterskin", name: "Waterskin", icon: "water_drop", weight: "5 lb (full)", desc: "Holds up to 4 pints of liquid." },
  { id: "bedroll", name: "Bedroll", icon: "hotel", weight: "7 lb", desc: "A simple sleeping pad and blanket for resting outdoors." },
  { id: "tinderbox", name: "Tinderbox", icon: "whatshot", weight: "1 lb", desc: "Flint, fire steel, and tinder used to light fires. Lighting a torch takes an action." },
  { id: "crowbar", name: "Crowbar", icon: "construction", weight: "5 lb", desc: "Grants advantage on Strength checks where leverage can be applied." },
  { id: "grappling-hook", name: "Grappling Hook", icon: "anchor", weight: "4 lb", desc: "An iron hook attached to a rope, used for climbing." },
  { id: "lantern-hooded", name: "Hooded Lantern", icon: "lightbulb", weight: "2 lb", desc: "Casts bright light in a 30-ft radius and dim light for 30 more ft. Burns 6 hours on a pint of oil." },
  { id: "oil-flask", name: "Oil (flask)", icon: "local_gas_station", weight: "1 lb", desc: "Can be used to fuel a lantern or thrown as an improvised weapon. Burns for 2 rounds if lit." },
  { id: "caltrops", name: "Caltrops (bag of 20)", icon: "crisis_alert", weight: "2 lb", desc: "Creatures moving through the area must succeed on a DC 15 DEX save or stop and take 1 piercing damage." },
  { id: "healers-kit", name: "Healer's Kit", icon: "medical_services", weight: "3 lb", desc: "10 uses. Stabilize a creature at 0 HP without a Medicine check." },
  { id: "holy-water", name: "Holy Water (flask)", icon: "water_drop", weight: "1 lb", desc: "As an action, splash on a creature or throw up to 20 ft. Fiends and undead take 2d6 radiant damage." },
  { id: "ink-pen", name: "Ink & Pen", icon: "edit", weight: "—", desc: "A vial of ink and a quill pen for writing." },
  { id: "parchment", name: "Parchment (sheet)", icon: "description", weight: "—", desc: "A single sheet of parchment for writing or drawing." },
  { id: "mirror-steel", name: "Steel Mirror", icon: "filter_vintage", weight: "0.5 lb", desc: "A polished steel mirror useful for looking around corners." },
  { id: "manacles", name: "Manacles", icon: "link", weight: "6 lb", desc: "Bind a Small or Medium creature. Escape DC 20, break DC 26. Comes with a key." },
  { id: "antitoxin", name: "Antitoxin (vial)", icon: "science", weight: "—", desc: "Grants advantage on saving throws against poison for 1 hour." },
  { id: "gold-10", name: "Gold Pieces (10 gp)", icon: "paid", weight: "0.2 lb", desc: "Standard currency in most realms." },
];
