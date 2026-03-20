/**
 * One-time script to transform raw 5e SRD JSON into lean app-specific shapes.
 * Run: bun run scripts/prepare-srd-data.ts
 */

const RAW = "src/data/raw";
const OUT = "src/data";

// ---- Spells ----
const rawSpells = await Bun.file(`${RAW}/5e-SRD-Spells.json`).json();
const spells = rawSpells
  .map((s: any) => ({
    id: s.index,
    name: s.name,
    level: s.level,
    school: s.school.name,
    castingTime: s.casting_time,
    range: s.range,
    components: s.components,
    material: s.material || null,
    duration: s.duration,
    concentration: s.concentration,
    ritual: s.ritual,
    classes: s.classes.map((c: any) => c.name),
    description: s.desc.join("\n\n"),
    higherLevel: s.higher_level?.join("\n\n") || null,
  }))
  .sort((a: any, b: any) => a.name.localeCompare(b.name));

await Bun.write(`${OUT}/srd-spells.json`, JSON.stringify(spells));
console.log(`✓ Spells: ${spells.length} entries`);

// ---- Monsters ----
const rawMonsters = await Bun.file(`${RAW}/5e-SRD-Monsters.json`).json();
const monsters = rawMonsters
  .map((m: any) => {
    const saves: Record<string, number> = {};
    const skills: Record<string, number> = {};
    for (const p of m.proficiencies || []) {
      const name = p.proficiency.name;
      if (name.startsWith("Saving Throw: ")) {
        saves[name.replace("Saving Throw: ", "")] = p.value;
      } else if (name.startsWith("Skill: ")) {
        skills[name.replace("Skill: ", "")] = p.value;
      }
    }

    const speed: Record<string, string> = {};
    for (const [k, v] of Object.entries(m.speed || {})) {
      speed[k] = v as string;
    }

    return {
      id: m.index,
      name: m.name,
      size: m.size,
      type: m.type,
      alignment: m.alignment,
      ac: m.armor_class[0]?.value ?? m.armor_class,
      acType: m.armor_class[0]?.type || null,
      hp: m.hit_points,
      hitDice: m.hit_points_roll || m.hit_dice,
      speed,
      str: m.strength,
      dex: m.dexterity,
      con: m.constitution,
      int: m.intelligence,
      wis: m.wisdom,
      cha: m.charisma,
      savingThrows: Object.keys(saves).length ? saves : null,
      skills: Object.keys(skills).length ? skills : null,
      resistances: m.damage_resistances.length ? m.damage_resistances : null,
      immunities: m.damage_immunities.length ? m.damage_immunities : null,
      conditionImmunities: m.condition_immunities.length
        ? m.condition_immunities.map((c: any) => c.name)
        : null,
      vulnerabilities: m.damage_vulnerabilities.length ? m.damage_vulnerabilities : null,
      senses: m.senses,
      languages: m.languages || "",
      cr: m.challenge_rating,
      xp: m.xp,
      specialAbilities: m.special_abilities?.length ? m.special_abilities.map((a: any) => ({ name: a.name, desc: a.desc })) : null,
      actions: m.actions?.length ? m.actions.map((a: any) => ({ name: a.name, desc: a.desc })) : null,
      legendaryActions: m.legendary_actions?.length ? m.legendary_actions.map((a: any) => ({ name: a.name, desc: a.desc })) : null,
      reactions: m.reactions?.length ? m.reactions.map((a: any) => ({ name: a.name, desc: a.desc })) : null,
    };
  })
  .sort((a: any, b: any) => a.name.localeCompare(b.name));

await Bun.write(`${OUT}/srd-monsters.json`, JSON.stringify(monsters));
console.log(`✓ Monsters: ${monsters.length} entries`);

// ---- Rules ----
const rawRules = await Bun.file(`${RAW}/5e-SRD-Rules.json`).json();
const rawSections = await Bun.file(`${RAW}/5e-SRD-Rule-Sections.json`).json();

const sectionMap = new Map(rawSections.map((s: any) => [s.index, s]));

const rules = rawRules.map((r: any) => ({
  id: r.index,
  name: r.name,
  sections: (r.subsections || []).map((sub: any) => {
    const full = sectionMap.get(sub.index);
    return {
      id: sub.index,
      name: sub.name,
      content: full?.desc || "",
    };
  }),
}));

await Bun.write(`${OUT}/srd-rules.json`, JSON.stringify(rules));
console.log(`✓ Rules: ${rules.length} categories, ${rules.reduce((s: number, r: any) => s + r.sections.length, 0)} sections`);

// ---- Size check ----
const spellSize = Bun.file(`${OUT}/srd-spells.json`).size;
const monsterSize = Bun.file(`${OUT}/srd-monsters.json`).size;
const rulesSize = Bun.file(`${OUT}/srd-rules.json`).size;
const total = spellSize + monsterSize + rulesSize;
console.log(`\nTotal output: ${(total / 1024).toFixed(0)} KB (spells: ${(spellSize/1024).toFixed(0)}, monsters: ${(monsterSize/1024).toFixed(0)}, rules: ${(rulesSize/1024).toFixed(0)})`);
