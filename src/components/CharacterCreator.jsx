import { useState, useMemo, useRef } from "react";
import racesData from "../data/srd-races.json";
import classesData from "../data/srd-classes.json";
import Icon from "./ui/Icon.jsx";
import Ripple from "./ui/Ripple.jsx";
import dragonbornImg from "../assets/races/dragonborn.jpg";
import gnomeImg from "../assets/races/gnome.png";
import dwarfImg from "../assets/races/dwarf.jpg";
import tieflingImg from "../assets/races/tiefling.jpg";
import humanImg from "../assets/races/human.jpg";
import halflingImg from "../assets/races/halfling.jpg";
import halfOrcImg from "../assets/races/half-orc.jpg";
import halfElfImg from "../assets/races/half-elf.jpg";
import elfImg from "../assets/races/elf.jpg";
import barbarianImg from "../assets/classes/Barbarian.jpg";
import bardImg from "../assets/classes/Bard.jpg";
import clericImg from "../assets/classes/Cleric.jpg";
import druidImg from "../assets/classes/Druid.jpg";
import fighterImg from "../assets/classes/Fighter.jpg";
import monkImg from "../assets/classes/Monk.jpg";
import paladinImg from "../assets/classes/Paladin.jpg";
import rangerImg from "../assets/classes/Ranger.jpg";
import rogueImg from "../assets/classes/Rogue.jpg";
import sorcererImg from "../assets/classes/Sorcerer.jpg";
import warlockImg from "../assets/classes/Warlock.jpg";
import wizardImg from "../assets/classes/Wizard.jpg";
import acolyteImg from "../assets/backgrounds/acolyte.jpg";
import criminalImg from "../assets/backgrounds/criminal.jpg";
import folkHeroImg from "../assets/backgrounds/folk hero.jpg";
import nobleImg from "../assets/backgrounds/noble.jpg";
import sageImg from "../assets/backgrounds/sage.jpg";
import soldierImg from "../assets/backgrounds/soldier.jpg";
import hermitImg from "../assets/backgrounds/hermit.jpg";
import outlanderImg from "../assets/backgrounds/outlander.jpg";
import entertainerImg from "../assets/backgrounds/entertainer.jpg";
import guildArtisanImg from "../assets/backgrounds/guild-artisan.jpg";
import sailorImg from "../assets/backgrounds/sailor.jpg";
import urchinImg from "../assets/backgrounds/urchin.jpg";

const BG_IMAGES = {
  acolyte: acolyteImg,
  criminal: criminalImg,
  "folk-hero": folkHeroImg,
  noble: nobleImg,
  sage: sageImg,
  soldier: soldierImg,
  hermit: hermitImg,
  outlander: outlanderImg,
  entertainer: entertainerImg,
  "guild-artisan": guildArtisanImg,
  sailor: sailorImg,
  urchin: urchinImg,
};

const CLASS_IMAGES = {
  barbarian: barbarianImg,
  bard: bardImg,
  cleric: clericImg,
  druid: druidImg,
  fighter: fighterImg,
  monk: monkImg,
  paladin: paladinImg,
  ranger: rangerImg,
  rogue: rogueImg,
  sorcerer: sorcererImg,
  warlock: warlockImg,
  wizard: wizardImg,
};

const RACE_IMAGES = {
  dragonborn: dragonbornImg,
  gnome: gnomeImg,
  dwarf: dwarfImg,
  elf: elfImg,
  tiefling: tieflingImg,
  human: humanImg,
  halfling: halflingImg,
  "half-orc": halfOrcImg,
  "half-elf": halfElfImg,
};

const STEPS = [
  "Race",
  "Class",
  "Background",
  "Stats",
  "Alignment",
  "Equipment",
];

const BACKGROUNDS = [
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

const ALIGNMENTS = [
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

const ABILITIES = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
const ABILITY_NAMES = {
  STR: "Strength",
  DEX: "Dexterity",
  CON: "Constitution",
  INT: "Intelligence",
  WIS: "Wisdom",
  CHA: "Charisma",
};
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

const RACE_ICONS = {
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

const CLASS_ICONS = {
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

function TraitChip({ trait }) {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ x: rect.left + rect.width / 2, y: rect.top });
    }
    setHovered(true);
  };

  return (
    <span
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "inline" }}
    >
      <span
        style={{
          fontSize: 12,
          color: "var(--dm-primary)",
          cursor: "default",
          borderBottom: "1px dashed var(--dm-primary-dim)",
        }}
      >
        {trait.name}
      </span>
      {hovered && (
        <div
          style={{
            position: "fixed",
            top: pos.y - 8,
            left: pos.x,
            transform: "translate(-50%, -100%)",
            width: 260,
            padding: 12,
            borderRadius: 12,
            background: "var(--dm-surface-brighter)",
            border: "1px solid var(--dm-outline-variant)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--dm-primary)",
              marginBottom: 4,
            }}
          >
            {trait.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--dm-text-secondary)",
              lineHeight: 1.5,
            }}
          >
            {trait.desc}
          </div>
        </div>
      )}
    </span>
  );
}

function RaceCard({ race, selected, onSelect }) {
  const img = RACE_IMAGES[race.id];
  return (
    <Ripple
      onClick={onSelect}
      style={{
        background: "var(--dm-surface)",
        borderRadius: 16,
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "border-color 0.2s",
        border: selected
          ? "2px solid var(--dm-primary)"
          : "1px solid var(--dm-outline-variant)",
      }}
    >
      <div>
        {img ? (
          <div style={{ width: "100%", aspectRatio: "1", overflow: "hidden" }}>
            <img
              src={img}
              alt={race.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "var(--dm-surface-bright)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "20px 20px 0",
            }}
          >
            <Icon
              name={RACE_ICONS[race.id] || "person"}
              size={32}
              style={{ color: "var(--dm-primary)" }}
            />
          </div>
        )}
      </div>
      <div
        style={{
          padding: "12px 20px 16px",
          borderRadius: 16,
          marginTop: -16,
          position: "relative",
          background: "var(--dm-surface)",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600 }}>{race.name}</div>
        <div style={{ fontSize: 13, color: "var(--dm-text-secondary)" }}>
          {race.abilityBonuses
            .map((b) => `${b.ability} +${b.bonus}`)
            .join(", ")}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--dm-text-secondary)",
            marginBottom: 8,
          }}
        >
          Speed {race.speed} ft · {race.size}
        </div>
        {race.traits?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {race.traits.map((t) => (
              <TraitChip key={t.name} trait={t} />
            ))}
          </div>
        )}
      </div>
    </Ripple>
  );
}

function CharacterCreator({ onBack }) {
  const [step, setStep] = useState(0);
  const [char, setChar] = useState({
    name: "",
    race: null,
    class: null,
    background: null,
    stats: { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 },
    alignment: null,
    equipment: [],
  });

  const update = (key, val) => setChar((c) => ({ ...c, [key]: val }));

  const raceData = useMemo(
    () => (char.race ? racesData.find((r) => r.id === char.race) : null),
    [char.race],
  );
  const classData = useMemo(
    () => (char.class ? classesData.find((c) => c.id === char.class) : null),
    [char.class],
  );

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const selectAndAdvance = (key, val) => {
    update(key, val);
    next();
  };

  // Equipment options derived from class
  const equipmentOptions = useMemo(() => {
    if (!classData) return [];
    const opts = [];
    const profs = classData.proficiencies || [];
    if (profs.some((p) => p.includes("Martial"))) {
      opts.push(
        { id: "longsword", name: "Longsword", icon: "swords" },
        { id: "greataxe", name: "Greataxe", icon: "swords" },
        { id: "greatsword", name: "Greatsword", icon: "swords" },
      );
    }
    if (profs.some((p) => p.includes("Simple"))) {
      opts.push(
        { id: "handaxe", name: "Handaxe (x2)", icon: "carpenter" },
        { id: "javelin", name: "Javelin (x4)", icon: "arrow_upward" },
        { id: "mace", name: "Mace", icon: "hardware" },
        { id: "quarterstaff", name: "Quarterstaff", icon: "pen_size_1" },
        { id: "dagger", name: "Dagger", icon: "cut" },
      );
    }
    if (profs.some((p) => p.includes("Shield"))) {
      opts.push({ id: "shield", name: "Shield (+2 AC)", icon: "shield" });
    }
    if (classData.spellcasting) {
      opts.push(
        { id: "component-pouch", name: "Component Pouch", icon: "backpack" },
        { id: "arcane-focus", name: "Arcane Focus", icon: "auto_fix_high" },
      );
    }
    opts.push(
      { id: "explorers-pack", name: "Explorer's Pack", icon: "backpack" },
      { id: "dungeoneers-pack", name: "Dungeoneer's Pack", icon: "backpack" },
    );
    if (profs.some((p) => p.includes("Light Armor"))) {
      opts.push({
        id: "leather-armor",
        name: "Leather Armor",
        icon: "checkroom",
      });
    }
    if (profs.some((p) => p.includes("Medium Armor"))) {
      opts.push(
        { id: "scale-mail", name: "Scale Mail", icon: "checkroom" },
        { id: "chain-shirt", name: "Chain Shirt", icon: "checkroom" },
      );
    }
    if (profs.some((p) => p.includes("Heavy Armor") || p === "All Armor")) {
      opts.push({ id: "chain-mail", name: "Chain Mail", icon: "checkroom" });
    }
    return opts;
  }, [classData]);

  const toggleEquip = (id) =>
    update(
      "equipment",
      char.equipment.includes(id)
        ? char.equipment.filter((e) => e !== id)
        : [...char.equipment, id],
    );

  // Stat assignment
  const [unassigned, setUnassigned] = useState([...STANDARD_ARRAY]);
  const [assignedStats, setAssignedStats] = useState({});

  const assignStat = (ability, val) => {
    const prev = assignedStats[ability];
    const newUnassigned =
      prev != null ? [...unassigned, prev] : [...unassigned];
    const idx = newUnassigned.indexOf(val);
    if (idx === -1) return;
    newUnassigned.splice(idx, 1);
    setUnassigned(newUnassigned.sort((a, b) => b - a));
    const newAssigned = { ...assignedStats, [ability]: val };
    setAssignedStats(newAssigned);
    update("stats", { ...char.stats, [ability]: val });
  };

  const clearStat = (ability) => {
    const val = assignedStats[ability];
    if (val == null) return;
    setUnassigned((u) => [...u, val].sort((a, b) => b - a));
    setAssignedStats((a) => {
      const n = { ...a };
      delete n[ability];
      return n;
    });
  };

  const getRacialBonus = (ability) => {
    if (!raceData) return 0;
    const b = raceData.abilityBonuses.find((x) => x.ability === ability);
    return b ? b.bonus : 0;
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Race
        return (
          <div>
            <h2 style={styles.stepTitle}>Choose your Race</h2>
            <p style={styles.stepDesc}>
              Your race determines your physical traits, abilities, and cultural
              background.
            </p>
            <div style={styles.cardGrid}>
              {racesData.map((race) => (
                <RaceCard
                  key={race.id}
                  race={race}
                  selected={char.race === race.id}
                  onSelect={() => selectAndAdvance("race", race.id)}
                />
              ))}
            </div>
          </div>
        );

      case 1: // Class
        return (
          <div>
            <h2 style={styles.stepTitle}>Choose your Class</h2>
            <p style={styles.stepDesc}>
              Your class defines your abilities, skills, and role in the party.
            </p>
            <div style={styles.cardGrid}>
              {classesData.map((cls) => {
                const img = CLASS_IMAGES[cls.id];
                return (
                  <Ripple
                    key={cls.id}
                    onClick={() => selectAndAdvance("class", cls.id)}
                    style={{
                      background: "var(--dm-surface)",
                      borderRadius: 16,
                      padding: 0,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      transition: "border-color 0.2s",
                      border:
                        char.class === cls.id
                          ? "2px solid var(--dm-primary)"
                          : "1px solid var(--dm-outline-variant)",
                    }}
                  >
                    {img ? (
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={img}
                          alt={cls.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          ...styles.cardIconWrap,
                          margin: "20px 20px 0",
                        }}
                      >
                        <Icon
                          name={CLASS_ICONS[cls.id] || "person"}
                          size={32}
                          style={{ color: "var(--dm-primary)" }}
                        />
                      </div>
                    )}
                    <div
                      style={{
                        padding: "12px 20px 16px",
                        borderRadius: 16,
                        marginTop: -16,
                        position: "relative",
                        background: "var(--dm-surface)",
                      }}
                    >
                      <div style={styles.cardName}>{cls.name}</div>
                      <div style={styles.cardMeta}>Hit Die: d{cls.hitDie}</div>
                      <div style={styles.cardMeta}>
                        Saves: {cls.savingThrows.join(", ")}
                      </div>
                    </div>
                  </Ripple>
                );
              })}
            </div>
          </div>
        );

      case 2: // Background
        return (
          <div>
            <h2 style={styles.stepTitle}>Choose your Background</h2>
            <p style={styles.stepDesc}>
              Your background reveals where you came from and your place in the
              world.
            </p>
            <div style={styles.cardGrid}>
              {BACKGROUNDS.map((bg) => {
                const img = BG_IMAGES[bg.id];
                return (
                  <Ripple
                    key={bg.id}
                    onClick={() => selectAndAdvance("background", bg.id)}
                    style={{
                      background: "var(--dm-surface)",
                      borderRadius: 16,
                      padding: 0,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      transition: "border-color 0.2s",
                      border:
                        char.background === bg.id
                          ? "2px solid var(--dm-primary)"
                          : "1px solid var(--dm-outline-variant)",
                    }}
                  >
                    {img ? (
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={img}
                          alt={bg.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          ...styles.cardIconWrap,
                          margin: "20px 20px 0",
                        }}
                      >
                        <Icon
                          name={bg.icon}
                          size={32}
                          style={{ color: "var(--dm-primary)" }}
                        />
                      </div>
                    )}
                    <div
                      style={{
                        padding: "12px 20px 16px",
                        borderRadius: 16,
                        marginTop: -16,
                        position: "relative",
                        background: "var(--dm-surface)",
                      }}
                    >
                      <div style={styles.cardName}>{bg.name}</div>
                      <div style={{ ...styles.cardMeta, marginBottom: 6 }}>
                        {bg.skills.join(", ")}
                      </div>
                      <div
                        style={{
                          ...styles.cardMeta,
                          fontSize: 12,
                          lineHeight: 1.4,
                          opacity: 0.7,
                        }}
                      >
                        {bg.desc}
                      </div>
                    </div>
                  </Ripple>
                );
              })}
            </div>
          </div>
        );

      case 3: // Stats
        return (
          <div>
            <h2 style={styles.stepTitle}>Assign Ability Scores</h2>
            <p style={styles.stepDesc}>
              Assign the standard array ({STANDARD_ARRAY.join(", ")}) to your
              abilities.
              {raceData &&
                ` Racial bonuses from ${raceData.name} are added automatically.`}
            </p>

            {unassigned.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 24,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--dm-text-muted)",
                    alignSelf: "center",
                    marginRight: 4,
                  }}
                >
                  Available:
                </span>
                {unassigned.map((val, i) => (
                  <span key={i} style={styles.statBubble}>
                    {val}
                  </span>
                ))}
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 12,
              }}
            >
              {ABILITIES.map((ab) => {
                const assigned = assignedStats[ab];
                const racial = getRacialBonus(ab);
                const total = (assigned ?? 10) + racial;
                const mod = Math.floor((total - 10) / 2);
                return (
                  <div
                    key={ab}
                    style={{
                      background: "var(--dm-surface)",
                      borderRadius: 16,
                      padding: 16,
                      textAlign: "center",
                      border:
                        assigned != null
                          ? "1px solid var(--dm-primary)"
                          : "1px solid var(--dm-outline-variant)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--dm-text-muted)",
                        letterSpacing: 1,
                        marginBottom: 4,
                      }}
                    >
                      {ab}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--dm-text-secondary)",
                        marginBottom: 8,
                      }}
                    >
                      {ABILITY_NAMES[ab]}
                    </div>
                    <div
                      style={{
                        fontSize: 32,
                        fontWeight: 700,
                        color:
                          assigned != null
                            ? "var(--dm-primary)"
                            : "var(--dm-text-muted)",
                      }}
                    >
                      {assigned ?? "—"}
                    </div>
                    {racial > 0 && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--dm-primary)",
                          fontWeight: 500,
                          marginTop: 2,
                        }}
                      >
                        +{racial} racial
                      </div>
                    )}
                    {assigned != null && (
                      <div
                        style={{
                          fontSize: 14,
                          color: "var(--dm-text-secondary)",
                          marginTop: 4,
                        }}
                      >
                        Total: {total} ({mod >= 0 ? "+" : ""}
                        {mod})
                      </div>
                    )}

                    {/* Assign buttons */}
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginTop: 8,
                      }}
                    >
                      {assigned != null ? (
                        <Ripple
                          onClick={() => clearStat(ab)}
                          style={styles.statClear}
                        >
                          <Icon name="close" size={14} /> Clear
                        </Ripple>
                      ) : (
                        unassigned
                          .filter((v, i, a) => a.indexOf(v) === i)
                          .map((val) => (
                            <Ripple
                              key={val}
                              onClick={() => assignStat(ab, val)}
                              style={styles.statAssign}
                            >
                              {val}
                            </Ripple>
                          ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {unassigned.length === 0 && (
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <Ripple onClick={next} style={styles.primaryBtn}>
                  Continue{" "}
                  <Icon
                    name="arrow_forward"
                    size={18}
                    style={{ marginLeft: 4 }}
                  />
                </Ripple>
              </div>
            )}
          </div>
        );

      case 4: // Alignment
        return (
          <div>
            <h2 style={styles.stepTitle}>Choose your Alignment</h2>
            <p style={styles.stepDesc}>
              Alignment represents your character's moral and ethical compass.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
                maxWidth: 520,
                margin: "0 auto",
              }}
            >
              {ALIGNMENTS.map((al) => (
                <Ripple
                  key={al.id}
                  onClick={() => selectAndAdvance("alignment", al.id)}
                  style={{
                    background:
                      char.alignment === al.id
                        ? al.color + "18"
                        : "var(--dm-surface)",
                    borderRadius: 16,
                    padding: 16,
                    textAlign: "center",
                    border:
                      char.alignment === al.id
                        ? `2px solid ${al.color}`
                        : "1px solid var(--dm-outline-variant)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Icon name={al.icon} size={24} style={{ color: al.color }} />
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--dm-text)",
                    }}
                  >
                    {al.short}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--dm-text-secondary)",
                      lineHeight: 1.3,
                    }}
                  >
                    {al.name}
                  </div>
                </Ripple>
              ))}
            </div>
          </div>
        );

      case 5: // Equipment
        return (
          <div>
            <h2 style={styles.stepTitle}>Choose Starting Equipment</h2>
            <p style={styles.stepDesc}>
              Select your gear based on your class proficiencies.
              {classData &&
                ` As a ${classData.name}, you can use the equipment below.`}
            </p>
            <div style={styles.cardGrid}>
              {equipmentOptions.map((eq) => {
                const selected = char.equipment.includes(eq.id);
                return (
                  <Ripple
                    key={eq.id}
                    onClick={() => toggleEquip(eq.id)}
                    style={{
                      ...styles.card,
                      padding: 16,
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                      border: selected
                        ? "2px solid var(--dm-primary)"
                        : "1px solid var(--dm-outline-variant)",
                      background: selected
                        ? "var(--dm-primary-container)"
                        : "var(--dm-surface)",
                    }}
                  >
                    <Icon
                      name={eq.icon}
                      size={22}
                      style={{
                        color: selected
                          ? "var(--dm-primary)"
                          : "var(--dm-text-muted)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: selected
                          ? "var(--dm-on-primary-container)"
                          : "var(--dm-text)",
                      }}
                    >
                      {eq.name}
                    </span>
                    {selected && (
                      <Icon
                        name="check_circle"
                        size={18}
                        style={{
                          color: "var(--dm-primary)",
                          marginLeft: "auto",
                        }}
                      />
                    )}
                  </Ripple>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Summary sidebar
  const bgData = BACKGROUNDS.find((b) => b.id === char.background);
  const alData = ALIGNMENTS.find((a) => a.id === char.alignment);

  return (
    <div style={styles.root}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <Ripple onClick={onBack} style={styles.backBtn}>
          <Icon name="arrow_back" />
        </Ripple>
        <Icon
          name="shield_with_house"
          size={24}
          filled
          style={{ color: "var(--dm-primary)" }}
        />
        <span style={{ fontSize: 18, fontWeight: 500 }}>Character Creator</span>
        <div style={{ flex: 1 }} />
        <input
          placeholder="Character name"
          value={char.name}
          onChange={(e) => update("name", e.target.value)}
          className="m3input"
          style={{ width: 220, fontSize: 14, textAlign: "center" }}
        />
      </div>

      {/* Step indicator */}
      <div style={styles.stepBar}>
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <Ripple
              key={s}
              onClick={() => setStep(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 20,
                background: active
                  ? "var(--dm-secondary-container)"
                  : "transparent",
                color: active
                  ? "var(--dm-on-secondary-container)"
                  : done
                    ? "var(--dm-primary)"
                    : "var(--dm-text-muted)",
                fontWeight: active ? 600 : 400,
                fontSize: 13,
                transition: "all 0.2s",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  background: done
                    ? "var(--dm-primary)"
                    : active
                      ? "var(--dm-on-secondary-container)"
                      : "var(--dm-surface-bright)",
                  color: done
                    ? "var(--dm-on-primary)"
                    : active
                      ? "var(--dm-secondary-container)"
                      : "var(--dm-text-muted)",
                }}
              >
                {done ? <Icon name="check" size={14} /> : i + 1}
              </span>
              {s}
            </Ripple>
          );
        })}
      </div>

      <div style={styles.body}>
        {/* Main content */}
        <div style={styles.main}>
          {renderStep()}

          {/* Nav buttons (always visible except on auto-advance steps) */}
          {(step === 3 || step === 5) && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 24,
                justifyContent: "space-between",
              }}
            >
              <Ripple onClick={prev} style={styles.secondaryBtn}>
                <Icon name="arrow_back" size={18} style={{ marginRight: 4 }} />{" "}
                Back
              </Ripple>
              {step === 5 && (
                <Ripple
                  onClick={() => {
                    /* TODO: save */
                  }}
                  style={styles.primaryBtn}
                >
                  <Icon name="check" size={18} style={{ marginRight: 4 }} />{" "}
                  Finish
                </Ripple>
              )}
            </div>
          )}
        </div>

        {/* Summary panel */}
        <div style={styles.summary}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--dm-text-muted)",
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Summary
          </div>
          {char.name && <SummaryRow label="Name" value={char.name} />}
          {raceData && (
            <SummaryRow
              label="Race"
              value={raceData.name}
              icon={RACE_ICONS[char.race]}
            />
          )}
          {classData && (
            <SummaryRow
              label="Class"
              value={classData.name}
              icon={CLASS_ICONS[char.class]}
            />
          )}
          {bgData && (
            <SummaryRow
              label="Background"
              value={bgData.name}
              icon={bgData.icon}
            />
          )}
          {alData && (
            <SummaryRow
              label="Alignment"
              value={alData.name}
              icon={alData.icon}
            />
          )}
          {Object.keys(assignedStats).length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--dm-text-muted)",
                  fontWeight: 600,
                  marginBottom: 6,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Stats
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 4,
                }}
              >
                {ABILITIES.map((ab) => {
                  const val = assignedStats[ab];
                  if (val == null) return null;
                  const total = val + getRacialBonus(ab);
                  return (
                    <div
                      key={ab}
                      style={{
                        textAlign: "center",
                        padding: 6,
                        borderRadius: 8,
                        background: "var(--dm-surface-bright)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--dm-text-muted)",
                          fontWeight: 600,
                        }}
                      >
                        {ab}
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "var(--dm-primary)",
                        }}
                      >
                        {total}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {char.equipment.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--dm-text-muted)",
                  fontWeight: 600,
                  marginBottom: 6,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Equipment
              </div>
              {char.equipment.map((id) => {
                const eq = equipmentOptions.find((e) => e.id === id);
                return eq ? (
                  <div
                    key={id}
                    style={{
                      fontSize: 13,
                      color: "var(--dm-text-secondary)",
                      padding: "2px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Icon
                      name={eq.icon}
                      size={14}
                      style={{ color: "var(--dm-text-muted)" }}
                    />{" "}
                    {eq.name}
                  </div>
                ) : null;
              })}
            </div>
          )}
          {!char.race && !char.class && !char.name && (
            <div
              style={{
                fontSize: 13,
                color: "var(--dm-text-muted)",
                fontStyle: "italic",
              }}
            >
              Make selections to build your character...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, icon }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 0",
        borderBottom: "1px solid var(--dm-outline-variant)",
      }}
    >
      {icon && (
        <Icon
          name={icon}
          size={16}
          style={{ color: "var(--dm-primary-dim)", flexShrink: 0 }}
        />
      )}
      <div>
        <div style={{ fontSize: 11, color: "var(--dm-text-muted)" }}>
          {label}
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--dm-text)" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    "--dm-bg": "#121214",
    "--dm-surface": "#1c1c1f",
    "--dm-surface-bright": "#26262a",
    "--dm-surface-brighter": "#303035",
    "--dm-text": "#e2e2e6",
    "--dm-text-secondary": "#c2c2c8",
    "--dm-text-muted": "#8a8a92",
    "--dm-primary": "#9fa8da",
    "--dm-primary-light": "#c5cae9",
    "--dm-primary-dim": "#5c6bc0",
    "--dm-primary-container": "#1a237e",
    "--dm-on-primary": "#0d0f2b",
    "--dm-on-primary-container": "#c5cae9",
    "--dm-secondary-container": "#2c2c3a",
    "--dm-on-secondary-container": "#d0d0dc",
    "--dm-outline": "#8a8a92",
    "--dm-outline-variant": "#38383e",
    "--dm-error": "#ffb4ab",
    "--dm-error-container": "#3a1510",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "var(--dm-bg)",
    color: "var(--dm-text)",
    overflow: "hidden",
  },
  topBar: {
    height: 64,
    minHeight: 64,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    gap: 10,
    background: "var(--dm-bg)",
    zIndex: 10,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    padding: "0 16px 12px",
    flexWrap: "wrap",
  },
  body: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
    gap: 0,
  },
  main: {
    flex: 1,
    overflow: "auto",
    padding: "24px 40px 60px",
  },
  summary: {
    width: 260,
    minWidth: 260,
    padding: 20,
    overflowY: "auto",
    background: "var(--dm-surface)",
    borderRadius: "28px 0 0 0",
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 600,
    letterSpacing: "-0.02em",
    margin: "0 0 8px",
  },
  stepDesc: {
    fontSize: 14,
    color: "var(--dm-text-secondary)",
    margin: "0 0 24px",
    lineHeight: 1.5,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 12,
  },
  card: {
    background: "var(--dm-surface)",
    borderRadius: 16,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    transition: "border-color 0.2s, background 0.2s",
  },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    background: "var(--dm-surface-bright)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cardName: { fontSize: 16, fontWeight: 600 },
  cardMeta: { fontSize: 13, color: "var(--dm-text-secondary)" },
  primaryBtn: {
    padding: "10px 24px",
    borderRadius: 20,
    background: "var(--dm-primary)",
    color: "var(--dm-on-primary)",
    fontWeight: 500,
    fontSize: 14,
    display: "inline-flex",
    alignItems: "center",
  },
  secondaryBtn: {
    padding: "10px 24px",
    borderRadius: 20,
    border: "1px solid var(--dm-outline)",
    color: "var(--dm-primary)",
    fontWeight: 500,
    fontSize: 14,
    display: "inline-flex",
    alignItems: "center",
  },
  statBubble: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 12,
    background: "var(--dm-surface-bright)",
    color: "var(--dm-text)",
    fontWeight: 700,
    fontSize: 15,
  },
  statAssign: {
    padding: "4px 10px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    background: "var(--dm-surface-bright)",
    color: "var(--dm-text-secondary)",
  },
  statClear: {
    padding: "4px 10px",
    borderRadius: 8,
    fontSize: 12,
    color: "var(--dm-error)",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
};

export default CharacterCreator;
