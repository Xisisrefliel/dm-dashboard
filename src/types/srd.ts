export interface SrdSpell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string[];
  material: string | null;
  duration: string;
  concentration: boolean;
  ritual: boolean;
  classes: string[];
  description: string;
  higherLevel?: string;
}

export interface MonsterAbility {
  name: string;
  desc: string;
}

export interface SrdMonster {
  id: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  ac: number;
  acType: string | null;
  hp: number;
  hitDice: string;
  speed: Record<string, string>;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  savingThrows: Record<string, number> | null;
  skills: Record<string, number> | null;
  resistances: string | null;
  immunities: string | null;
  conditionImmunities: string | null;
  vulnerabilities: string | null;
  senses: Record<string, string | number> | null;
  languages: string;
  cr: number | string;
  xp: number;
  specialAbilities: MonsterAbility[] | null;
  actions: MonsterAbility[] | null;
  legendaryActions: MonsterAbility[] | null;
  reactions: MonsterAbility[] | null;
}

export interface SrdClassSkills {
  choose: number;
  from: string[];
}

export interface SrdClassFeature {
  level: number;
  name: string;
}

export interface SrdClass {
  id: string;
  name: string;
  hitDie: number;
  savingThrows: string[];
  proficiencies: string[];
  skills: SrdClassSkills;
  subclasses: string[];
  spellcasting: unknown;
  features: SrdClassFeature[];
}

export interface SrdRaceTrait {
  name: string;
  desc: string;
}

export interface SrdAbilityBonus {
  ability: string;
  bonus: number;
}

export interface SrdRace {
  id: string;
  name: string;
  speed: number;
  size: string;
  abilityBonuses: SrdAbilityBonus[];
  languages: string[];
  traits: SrdRaceTrait[];
  subraces: unknown[];
  age: string;
  alignment: string;
  sizeDescription: string;
}

export interface SrdRuleSection {
  id: string;
  name: string;
  content: string;
}

export interface SrdRuleChapter {
  id: string;
  name: string;
  sections: SrdRuleSection[];
}
