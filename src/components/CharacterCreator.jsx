import { useState, useMemo, useRef, useEffect } from "react";
import racesData from "../data/srd-races.json";
import classesData from "../data/srd-classes.json";
import allSpellsData from "../data/srd-spells.json";
import Icon from "./ui/Icon.jsx";
import Ripple from "./ui/Ripple.jsx";
import { syncCharacterToParty } from "../utils/syncParty.js";
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
  "Spells",
];

// Per SRD: cantrips and spells known/prepared at level 1
const CLASS_SPELL_SLOTS = {
  bard:     { cantrips: 2, spells: 4, castLevel: 1 },
  cleric:   { cantrips: 3, spells: 4, castLevel: 1 },
  druid:    { cantrips: 2, spells: 4, castLevel: 1 },
  sorcerer: { cantrips: 4, spells: 2, castLevel: 1 },
  warlock:  { cantrips: 2, spells: 2, castLevel: 1 },
  wizard:   { cantrips: 3, spells: 4, castLevel: 1 },
  paladin:  { cantrips: 0, spells: 2, castLevel: 2 },
  ranger:   { cantrips: 0, spells: 2, castLevel: 2 },
};

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

const ALIGNMENT_QUESTIONS = [
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

const CLASS_DESCRIPTIONS = {
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

const SKILL_DESCRIPTIONS = {
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

const CLASS_PRIMARY_ABILITY = {
  barbarian: "Strength", bard: "Charisma", cleric: "Wisdom", druid: "Wisdom",
  fighter: "Strength or Dexterity", monk: "Dexterity & Wisdom", paladin: "Strength & Charisma",
  ranger: "Dexterity & Wisdom", rogue: "Dexterity", sorcerer: "Charisma",
  warlock: "Charisma", wizard: "Intelligence",
};

function useTooltipPos(ref, tooltipWidth = 280) {
  const tooltipRef = useRef(null);
  const [style, setStyle] = useState({ position: "fixed", visibility: "hidden", top: 0, left: 0 });

  const calcPos = () => {
    if (!ref.current) return;
    // First render with visibility hidden so we can measure
    const rect = ref.current.getBoundingClientRect();
    setStyle({ position: "fixed", visibility: "hidden", top: 0, left: 0, width: tooltipWidth });
    // Use rAF to measure after render
    requestAnimationFrame(() => {
      const ttEl = tooltipRef.current;
      const ttH = ttEl ? ttEl.offsetHeight : 200;
      const half = tooltipWidth / 2;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(vh, rect.bottom);
      const cx = rect.left + rect.width / 2;

      const spaceAbove = visibleTop - 8;
      const spaceBelow = vh - visibleBottom - 8;
      const fitsAbove = spaceAbove >= ttH;
      const fitsBelow = spaceBelow >= ttH;

      // Prefer whichever side has more room; if both fit, pick the one with more space
      if (fitsAbove && (!fitsBelow || spaceAbove >= spaceBelow)) {
        setStyle({
          position: "fixed",
          top: visibleTop - 8 - ttH,
          left: Math.max(8, Math.min(cx - half, vw - tooltipWidth - 8)),
          width: tooltipWidth,
        });
      } else if (fitsBelow) {
        setStyle({
          position: "fixed",
          top: visibleBottom + 8,
          left: Math.max(8, Math.min(cx - half, vw - tooltipWidth - 8)),
          width: tooltipWidth,
        });
      // Try right side
      } else if (rect.right + 8 + tooltipWidth < vw) {
        setStyle({
          position: "fixed",
          top: Math.max(8, Math.min(visibleTop, vh - ttH - 8)),
          left: rect.right + 8,
          width: tooltipWidth,
        });
      // Try left side
      } else if (rect.left - 8 - tooltipWidth > 0) {
        setStyle({
          position: "fixed",
          top: Math.max(8, Math.min(visibleTop, vh - ttH - 8)),
          left: rect.left - 8 - tooltipWidth,
          width: tooltipWidth,
        });
      // Fallback: pin to top of viewport
      } else {
        setStyle({
          position: "fixed",
          top: 8,
          left: Math.max(8, Math.min(cx - half, vw - tooltipWidth - 8)),
          width: tooltipWidth,
        });
      }
    });
  };

  return { tooltipRef, style, calcPos };
}

function TraitChip({ trait, asButton }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const { tooltipRef, style, calcPos } = useTooltipPos(ref, 260);

  return (
    <span
      ref={ref}
      onMouseEnter={() => { setHovered(true); calcPos(); }}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "inline-block" }}
    >
      <span
        style={asButton ? {
          fontSize: 12, fontWeight: 500,
          color: "var(--dm-primary)",
          cursor: "default",
          padding: "5px 12px", borderRadius: 16,
          border: "1px solid var(--dm-outline-variant)",
          background: hovered ? "var(--dm-surface-bright)" : "transparent",
          display: "inline-block",
          transition: "background 0.15s",
        } : {
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
          ref={tooltipRef}
          style={{
            ...style,
            padding: 12, borderRadius: 12,
            background: "var(--dm-surface-brighter)",
            border: "1px solid var(--dm-outline-variant)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            zIndex: 100, pointerEvents: "none",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-primary)", marginBottom: 4 }}>
            {trait.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--dm-text-secondary)", lineHeight: 1.5 }}>
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

function ClassCard({ cls, selected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const { tooltipRef, style, calcPos } = useTooltipPos(ref, 300);
  const img = CLASS_IMAGES[cls.id];
  const lvl1Features = cls.features?.filter((f) => f.level === 1).map((f) => f.name) || [];

  return (
    <div ref={ref} onMouseEnter={() => { setHovered(true); calcPos(); }} onMouseLeave={() => setHovered(false)} style={{ position: "relative" }}>
      <Ripple
        onClick={onSelect}
        style={{
          background: "var(--dm-surface)", borderRadius: 16, padding: 0, overflow: "hidden",
          display: "flex", flexDirection: "column", position: "relative",
          transition: "border-color 0.2s",
          border: selected ? "2px solid var(--dm-primary)" : "1px solid var(--dm-outline-variant)",
        }}
      >
        {img ? (
          <div style={{ width: "100%", aspectRatio: "1", overflow: "hidden" }}>
            <img src={img} alt={cls.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ) : (
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "var(--dm-surface-bright)", display: "flex", alignItems: "center", justifyContent: "center", margin: "20px 20px 0" }}>
            <Icon name={CLASS_ICONS[cls.id] || "person"} size={32} style={{ color: "var(--dm-primary)" }} />
          </div>
        )}
        <div style={{ padding: "12px 20px 16px", borderRadius: 16, marginTop: -16, position: "relative", background: "var(--dm-surface)" }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{cls.name}</div>
          <div style={{ fontSize: 13, color: "var(--dm-text-secondary)" }}>Hit Die: d{cls.hitDie}</div>
          <div style={{ fontSize: 13, color: "var(--dm-text-secondary)" }}>Saves: {cls.savingThrows.join(", ")}</div>
        </div>
      </Ripple>
      {hovered && (
        <div ref={tooltipRef} style={{
          ...style, padding: 14, borderRadius: 12,
          background: "var(--dm-surface-brighter)", border: "1px solid var(--dm-outline-variant)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)", zIndex: 100, pointerEvents: "none",
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--dm-primary)", marginBottom: 8 }}>{cls.name}</div>
          <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 4 }}>
            <span style={{ color: "var(--dm-text-muted)" }}>Hit Die: </span>d{cls.hitDie}
          </div>
          <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 4 }}>
            <span style={{ color: "var(--dm-text-muted)" }}>Saving Throws: </span>{cls.savingThrows.join(", ")}
          </div>
          <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 4 }}>
            <span style={{ color: "var(--dm-text-muted)" }}>Proficiencies: </span>{cls.proficiencies.join(", ")}
          </div>
          <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 4 }}>
            <span style={{ color: "var(--dm-text-muted)" }}>Skills: </span>Choose {cls.skills.choose} from {cls.skills.from.join(", ")}
          </div>
          {cls.spellcasting && (
            <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 4 }}>
              <span style={{ color: "var(--dm-text-muted)" }}>Spellcasting: </span>{cls.spellcasting.ability} (from level {cls.spellcasting.level})
            </div>
          )}
          {lvl1Features.length > 0 && (
            <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 4 }}>
              <span style={{ color: "var(--dm-text-muted)" }}>Level 1 Features: </span>{lvl1Features.join(", ")}
            </div>
          )}
          {cls.subclasses?.length > 0 && (
            <div style={{ fontSize: 12, color: "var(--dm-text)" }}>
              <span style={{ color: "var(--dm-text-muted)" }}>Subclasses: </span>{cls.subclasses.join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EquipmentCard({ eq, selected, disabled, onToggle, radioMode, locked }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const { tooltipRef, style, calcPos } = useTooltipPos(ref, 280);

  const radioIcon = selected
    ? (locked ? "lock" : "radio_button_checked")
    : "radio_button_unchecked";
  const checkIcon = selected
    ? (locked ? "lock" : "check_circle")
    : null;

  return (
    <div ref={ref} onMouseEnter={() => { setHovered(true); calcPos(); }} onMouseLeave={() => setHovered(false)} style={{ position: "relative" }}>
      <Ripple
        onClick={locked ? undefined : onToggle}
        style={{
          background: selected ? (locked ? "var(--dm-surface-bright)" : "var(--dm-primary-container)") : "var(--dm-surface)",
          borderRadius: 16, padding: 16,
          display: "flex", flexDirection: "row", gap: 12, alignItems: "center",
          transition: "border-color 0.2s, background 0.2s",
          border: selected ? (locked ? "1px solid var(--dm-outline-variant)" : "2px solid var(--dm-primary)") : "1px solid var(--dm-outline-variant)",
          opacity: disabled && !selected && !locked ? 0.5 : 1,
          cursor: locked ? "default" : (disabled && !selected ? "default" : "pointer"),
        }}
      >
        {radioMode ? (
          <Icon name={radioIcon} size={20} style={{ color: selected ? "var(--dm-primary)" : "var(--dm-text-muted)", flexShrink: 0 }} />
        ) : null}
        <Icon name={eq.icon} size={22} style={{ color: selected ? (locked ? "var(--dm-text-secondary)" : "var(--dm-primary)") : "var(--dm-text-muted)", flexShrink: 0 }} />
        <span style={{ fontSize: 14, fontWeight: 500, color: selected ? (locked ? "var(--dm-text-secondary)" : "var(--dm-on-primary-container)") : "var(--dm-text)" }}>
          {eq.name}
        </span>
        {!radioMode && checkIcon && <Icon name={checkIcon} size={18} style={{ color: locked ? "var(--dm-text-muted)" : "var(--dm-primary)", marginLeft: "auto" }} />}
      </Ripple>
      {hovered && (
        <div ref={tooltipRef} style={{
          ...style, padding: 14, borderRadius: 12,
          background: "var(--dm-surface-brighter)", border: "1px solid var(--dm-outline-variant)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)", zIndex: 100, pointerEvents: "none",
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--dm-primary)", marginBottom: 6 }}>{eq.name}</div>
          {eq.damage && (
            <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 4 }}>
              <span style={{ color: "var(--dm-text-muted)" }}>Damage: </span>{eq.damage}
            </div>
          )}
          {eq.properties && (
            <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 4 }}>
              <span style={{ color: "var(--dm-text-muted)" }}>Properties: </span>{eq.properties}
            </div>
          )}
          {eq.weight && (
            <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 4 }}>
              <span style={{ color: "var(--dm-text-muted)" }}>Weight: </span>{eq.weight}
            </div>
          )}
          {eq.desc && (
            <div style={{ fontSize: 12, color: "var(--dm-text-secondary)", lineHeight: 1.5, marginTop: 6 }}>{eq.desc}</div>
          )}
        </div>
      )}
    </div>
  );
}

const STORAGE_KEY = "dm-dashboard-character-creator";
const CHARACTERS_KEY = "dm-dashboard-characters";

function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function loadCharacters() {
  try {
    const saved = localStorage.getItem(CHARACTERS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

function saveCharacters(chars) {
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(chars));
}

const EMPTY_CHAR = {
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
const SRD_ITEMS = [
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

// 5e SRD Starting Equipment per class
const CLASS_STARTING_EQUIPMENT = {
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

// Character list screen
function CharacterList({ onBack, onNewCharacter, onEditCharacter }) {
  const [characters, setCharacters] = useState(() => loadCharacters());

  const deleteCharacter = (id) => {
    const updated = characters.filter((c) => c.id !== id);
    setCharacters(updated);
    saveCharacters(updated);
  };

  return (
    <div style={{
      "--dm-bg": "#121214", "--dm-surface": "#1c1c1f", "--dm-surface-bright": "#26262a",
      "--dm-text": "#e2e2e6", "--dm-text-secondary": "#c2c2c8", "--dm-text-muted": "#8a8a92",
      "--dm-primary": "#9fa8da", "--dm-on-primary": "#0d0f2b",
      "--dm-outline-variant": "#38383e", "--dm-primary-container": "#1a237e",
      "--dm-on-primary-container": "#c5cae9", "--dm-secondary-container": "#2c2c3a",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      minHeight: "100vh", background: "var(--dm-bg)", color: "var(--dm-text)",
    }}>
      <div style={{
        height: 64, minHeight: 64, display: "flex", alignItems: "center",
        padding: "0 16px", gap: 12, borderBottom: "1px solid var(--dm-outline-variant)",
      }}>
        <Ripple onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="arrow_back" />
        </Ripple>
        <Icon name="group" size={24} filled style={{ color: "var(--dm-primary)" }} />
        <span style={{ fontSize: 16, fontWeight: 600 }}>My Characters</span>
        <div style={{ flex: 1 }} />
        <Ripple onClick={() => {
          localStorage.removeItem(STORAGE_KEY);
          onNewCharacter();
        }} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 20px", borderRadius: 20,
          background: "var(--dm-primary)", color: "var(--dm-on-primary)",
          fontWeight: 500, fontSize: 14,
        }}>
          <Icon name="add" size={18} /> New Character
        </Ripple>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
        {characters.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: "var(--dm-text-muted)",
          }}>
            <Icon name="person_off" size={56} style={{ marginBottom: 16, opacity: 0.4 }} />
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No characters yet</div>
            <div style={{ fontSize: 14, marginBottom: 24 }}>Create your first adventurer to get started.</div>
            <Ripple onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              onNewCharacter();
            }} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "10px 24px", borderRadius: 20,
              background: "var(--dm-primary)", color: "var(--dm-on-primary)",
              fontWeight: 500, fontSize: 14,
            }}>
              <Icon name="add" size={18} /> Create Character
            </Ripple>
          </div>
        ) : (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16,
          }}>
            {characters.map((ch) => {
              const rd = racesData.find((r) => r.id === ch.race);
              const cd = classesData.find((c) => c.id === ch.class);
              const img = ch.class ? CLASS_IMAGES[ch.class] : (ch.race ? RACE_IMAGES[ch.race] : null);
              return (
                <div key={ch.id} style={{
                  background: "var(--dm-surface)", borderRadius: 16, overflow: "hidden",
                  border: "1px solid var(--dm-outline-variant)", position: "relative",
                }}>
                  <Ripple onClick={() => onEditCharacter(ch.id)} style={{
                    display: "flex", flexDirection: "column", width: "100%",
                  }}>
                    {img && (
                      <div style={{ width: "100%", height: 160, overflow: "hidden" }}>
                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                      </div>
                    )}
                    <div style={{ padding: "14px 18px" }}>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{ch.name || "Unnamed"}</div>
                      <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", marginTop: 2 }}>
                        Level {ch.level} {rd?.name || ""} {cd?.name || ""}
                      </div>
                    </div>
                  </Ripple>
                  <Ripple
                    onClick={() => deleteCharacter(ch.id)}
                    style={{
                      position: "absolute", top: 8, right: 8,
                      width: 32, height: 32, borderRadius: 16,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "rgba(0,0,0,0.6)", border: "1px solid var(--dm-outline-variant)",
                    }}
                  >
                    <Icon name="delete" size={16} style={{ color: "var(--dm-error, #ffb4ab)" }} />
                  </Ripple>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CharacterCreator({ onBack, listMode, onNewCharacter, onEditCharacter, editId }) {
  // If list mode, show the character list
  if (listMode) {
    return <CharacterList onBack={onBack} onNewCharacter={onNewCharacter} onEditCharacter={onEditCharacter} />;
  }

  // Load existing character if editing
  const editChar = useMemo(() => {
    if (!editId) return null;
    const chars = loadCharacters();
    return chars.find((c) => c.id === editId) || null;
  }, [editId]);

  const saved = useMemo(() => editChar ? null : loadSavedState(), [editId]);
  const [step, setStep] = useState(editChar ? 6 : (saved?.step ?? 0));
  const [finished, setFinished] = useState(!!editChar || (saved?.finished ?? false));
  const [char, setChar] = useState(editChar || saved?.char || { ...EMPTY_CHAR });
  const [previewClass, setPreviewClass] = useState(null);
  const classCarouselRef = useRef(null);
  const [previewRace, setPreviewRace] = useState(null);
  const raceCarouselRef = useRef(null);
  const [previewBg, setPreviewBg] = useState(null);
  const bgCarouselRef = useRef(null);

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
  };

  const spellSlots = char.class ? CLASS_SPELL_SLOTS[char.class] : null;
  const hasSpellcasting = spellSlots && char.level >= spellSlots.castLevel;

  const stepComplete = (i) => {
    switch (i) {
      case 0: return char.race != null;
      case 1: {
        if (!char.class) return false;
        const cd = classesData.find((c) => c.id === char.class);
        return cd ? char.skills.length === cd.skills.choose : false;
      }
      case 2: return char.background != null;
      case 3: return Object.keys(assignedStats).length === 6;
      case 4: return char.alignment != null;
      case 5: {
        if (!classEquipConfig) return false;
        const choices = char.equipChoices || {};
        return classEquipConfig.choices.every((_, idx) => choices[idx] != null);
      }
      case 6: // Spells — complete if non-caster or if they've picked their cantrips/spells
        if (!hasSpellcasting) return true;
        const needCantrips = spellSlots.cantrips > 0;
        const needSpells = spellSlots.spells > 0;
        return (!needCantrips || char.cantrips.length === spellSlots.cantrips) &&
               (!needSpells || char.spells.length === spellSlots.spells);
      default: return false;
    }
  };

  // Class starting equipment config
  const classEquipConfig = useMemo(() => {
    if (!char.class) return null;
    return CLASS_STARTING_EQUIPMENT[char.class] || null;
  }, [char.class]);

  // Compute flat equipment list from choices + guaranteed
  const computedEquipment = useMemo(() => {
    if (!classEquipConfig) return [];
    const items = [];
    // Add items from each selected choice
    classEquipConfig.choices.forEach((choiceGroup, idx) => {
      const selectedOptionId = (char.equipChoices || {})[idx];
      if (selectedOptionId != null) {
        const option = choiceGroup.options.find((o) => o.id === selectedOptionId);
        if (option) items.push(...option.items);
      }
    });
    // Add guaranteed items
    items.push(...classEquipConfig.guaranteed);
    return items;
  }, [classEquipConfig, char.equipChoices]);

  // Legacy: keep char.equipment in sync for save/load compatibility
  // (we derive the display from computedEquipment, but store choice indices)
  const selectEquipChoice = (choiceIdx, optionId) => {
    setChar((c) => ({
      ...c,
      equipChoices: { ...(c.equipChoices || {}), [choiceIdx]: optionId },
    }));
  };

  // Alignment quiz
  const [quizQuestions] = useState(() => {
    const shuffled = [...ALIGNMENT_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  });
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizDone, setQuizDone] = useState(false);
  const [suggestedAlignment, setSuggestedAlignment] = useState(null);

  const answerQuiz = (answer) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    if (newAnswers.length >= 2) {
      const totalLaw = newAnswers.reduce((s, a) => s + a.law, 0);
      const totalGood = newAnswers.reduce((s, a) => s + a.good, 0);
      const lawAxis = totalLaw > 0 ? "l" : totalLaw < 0 ? "c" : "n"; // second char for ln/tn/cn
      const goodAxis = totalGood > 0 ? "g" : totalGood < 0 ? "e" : "n";
      // Map to alignment id: lg, ng, cg, ln, tn, cn, le, ne, ce
      let id;
      if (lawAxis === "n" && goodAxis === "n") id = "tn";
      else if (lawAxis === "n") id = "n" + goodAxis;
      else if (goodAxis === "n") id = lawAxis + "n";
      else id = lawAxis + goodAxis;
      setSuggestedAlignment(id);
      setQuizDone(true);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers([]);
    setQuizDone(false);
    setSuggestedAlignment(null);
  };

  // Stat assignment
  const [unassigned, setUnassigned] = useState(editChar?.assignedStats ? [] : (saved?.unassigned ?? [...STANDARD_ARRAY]));
  const [assignedStats, setAssignedStats] = useState(editChar?.assignedStats || saved?.assignedStats || {});

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      step, char, assignedStats, unassigned, finished,
    }));
  }, [step, char, assignedStats, unassigned, finished]);

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

  const rollStats = () => {
    const roll4d6 = () => {
      const dice = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
      dice.sort((a, b) => a - b);
      return dice[1] + dice[2] + dice[3]; // drop lowest
    };
    const rolled = Array.from({ length: 6 }, roll4d6).sort((a, b) => b - a);
    setUnassigned(rolled);
    setAssignedStats({});
  };

  const resetToStandard = () => {
    setUnassigned([...STANDARD_ARRAY]);
    setAssignedStats({});
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

  // Restore preview when navigating back to a step with a selection
  useEffect(() => {
    if (step === 0 && char.race) setPreviewRace(char.race);
    if (step === 1 && char.class) setPreviewClass(char.class);
    if (step === 2 && char.background) setPreviewBg(char.background);
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case 0: { // Race
        const pRace = previewRace ? racesData.find((r) => r.id === previewRace) : null;
        const pRaceImg = previewRace ? RACE_IMAGES[previewRace] : null;

        const openRacePreview = (id) => {
          update("race", id);
          setPreviewRace(id);
        };

        if (pRace) {
          return (
            <div>
              <h2 style={styles.stepTitle}>Choose your Race</h2>

              {/* Detail card */}
              <div style={{
                display: "flex", gap: 0, background: "var(--dm-surface)", borderRadius: 20,
                overflow: "hidden", border: "1px solid var(--dm-outline-variant)", marginBottom: 24,
                height: 420,
              }}>
                {pRaceImg && (
                  <div style={{ width: 240, minWidth: 240, flexShrink: 0, position: "relative" }}>
                    <img src={pRaceImg} alt={pRace.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                  </div>
                )}

                <div style={{ flex: 1, padding: "20px 28px", minWidth: 260, overflowY: "auto" }}>
                  <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", letterSpacing: "0.02em", textTransform: "uppercase" }}>
                    {pRace.name}
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--dm-text-secondary)", lineHeight: 1.5, margin: "0 0 12px" }}>
                    {pRace.age}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px", fontSize: 13, marginBottom: 12 }}>
                    <div>
                      <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Ability Bonuses: </span>
                      {pRace.abilityBonuses.map((b) => `${ABILITY_NAMES[b.ability] || b.ability} +${b.bonus}`).join(", ")}
                    </div>
                    <div>
                      <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Speed: </span>
                      {pRace.speed} ft
                    </div>
                    <div>
                      <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Size: </span>
                      {pRace.size}
                    </div>
                    <div>
                      <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Languages: </span>
                      {pRace.languages.join(", ")}
                    </div>
                  </div>

                  {/* Traits */}
                  {pRace.traits?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", fontSize: 13 }}>
                      <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Racial Traits:</span>
                      {pRace.traits.map((t) => (
                        <TraitChip key={t.name} trait={t} asButton />
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                    <Ripple onClick={() => setPreviewRace(null)} style={{ ...styles.secondaryBtn, gap: 6 }}>
                      <Icon name="arrow_back" size={16} /> Back
                    </Ripple>
                    <Ripple onClick={() => { setPreviewRace(null); next(); }} style={{ ...styles.primaryBtn, gap: 6 }}>
                      <Icon name="check" size={16} /> Confirm {pRace.name}
                    </Ripple>
                  </div>
                </div>
              </div>

              {/* Mini race carousel */}
              <div style={{ position: "relative" }}>
                <Ripple
                  onClick={() => raceCarouselRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
                  style={{
                    position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", zIndex: 2,
                    width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--dm-surface-brighter)", border: "1px solid var(--dm-outline-variant)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  <Icon name="chevron_left" size={22} />
                </Ripple>
                <div
                  ref={raceCarouselRef}
                  style={{
                    display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8,
                    scrollbarWidth: "none", msOverflowStyle: "none",
                    scrollSnapType: "x mandatory",
                  }}
                >
                  {racesData.map((race) => {
                    const img = RACE_IMAGES[race.id];
                    const active = race.id === previewRace;
                    return (
                      <Ripple
                        key={race.id}
                        onClick={() => openRacePreview(race.id)}
                        style={{
                          flexShrink: 0, width: 100, borderRadius: 12, overflow: "hidden",
                          border: active ? "2px solid var(--dm-primary)" : "1px solid var(--dm-outline-variant)",
                          background: "var(--dm-surface)", display: "flex", flexDirection: "column",
                          opacity: active ? 1 : 0.7, transition: "all 0.15s",
                          scrollSnapAlign: "start",
                        }}
                      >
                        {img && <img src={img} alt={race.name} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />}
                        <div style={{ padding: "6px 0", textAlign: "center", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                          {race.name}
                        </div>
                      </Ripple>
                    );
                  })}
                </div>
                <Ripple
                  onClick={() => raceCarouselRef.current?.scrollBy({ left: 240, behavior: "smooth" })}
                  style={{
                    position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", zIndex: 2,
                    width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--dm-surface-brighter)", border: "1px solid var(--dm-outline-variant)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  <Icon name="chevron_right" size={22} />
                </Ripple>
              </div>
            </div>
          );
        }

        // Grid view
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
                  onSelect={() => openRacePreview(race.id)}
                />
              ))}
            </div>
          </div>
        );
      }

      case 1: { // Class
        const pCls = previewClass ? classesData.find((c) => c.id === previewClass) : null;
        const pImg = previewClass ? CLASS_IMAGES[previewClass] : null;
        const pSkillsFrom = pCls ? pCls.skills.from : [];
        const pSkillsChoose = pCls ? pCls.skills.choose : 0;
        const selectedSkills = char.skills;

        const openPreview = (id) => {
          if (id !== char.class) {
            // Switching class resets skills and equipment choices
            update("class", id);
            update("skills", []);
            update("equipChoices", {});
          }
          setPreviewClass(id);
        };

        const toggleSkill = (skill) => {
          if (selectedSkills.includes(skill)) {
            update("skills", selectedSkills.filter((s) => s !== skill));
          } else if (selectedSkills.length < pSkillsChoose) {
            update("skills", [...selectedSkills, skill]);
          }
        };

        const confirmClass = () => {
          setPreviewClass(null);
          next();
        };

        if (pCls) {
          // Detail view
          return (
            <div>
              <h2 style={styles.stepTitle}>Choose your Class</h2>

              {/* Detail card */}
              <div style={{
                display: "flex", gap: 0, background: "var(--dm-surface)", borderRadius: 20,
                overflow: "hidden", border: "1px solid var(--dm-outline-variant)", marginBottom: 24,
                flexWrap: "wrap",
              }}>
                {/* Image */}
                {pImg && (
                  <div style={{ width: 280, minWidth: 280, flexShrink: 0 }}>
                    <img src={pImg} alt={pCls.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                )}

                {/* Info */}
                <div style={{ flex: 1, padding: "28px 32px", minWidth: 260 }}>
                  <h3 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px", letterSpacing: "0.02em", textTransform: "uppercase" }}>
                    {pCls.name}
                  </h3>
                  <p style={{ fontSize: 15, color: "var(--dm-text-secondary)", lineHeight: 1.6, margin: "0 0 20px" }}>
                    {CLASS_DESCRIPTIONS[pCls.id]}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 14 }}>
                      <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Primary Ability: </span>
                      {CLASS_PRIMARY_ABILITY[pCls.id]}
                    </div>
                    <div style={{ fontSize: 14 }}>
                      <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Hit Die: </span>
                      d{pCls.hitDie}
                    </div>
                    <div style={{ fontSize: 14 }}>
                      <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Saving Throws: </span>
                      {pCls.savingThrows.map((s) => ABILITY_NAMES[s] || s).join(", ")}
                    </div>

                    {/* Skill selection */}
                    <div style={{ fontSize: 14, marginTop: 8 }}>
                      <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>
                        Skills <span style={{ fontWeight: 400, color: "var(--dm-text-muted)" }}>(choose {pSkillsChoose})</span>:
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                        {pSkillsFrom.map((skill) => {
                          const picked = selectedSkills.includes(skill);
                          const disabled = !picked && selectedSkills.length >= pSkillsChoose;
                          return (
                            <Ripple
                              key={skill}
                              onClick={() => toggleSkill(skill)}
                              style={{
                                padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                                background: picked ? "var(--dm-primary)" : "var(--dm-surface-bright)",
                                color: picked ? "var(--dm-on-primary)" : disabled ? "var(--dm-text-muted)" : "var(--dm-text)",
                                border: picked ? "1px solid var(--dm-primary)" : "1px solid var(--dm-outline-variant)",
                                opacity: disabled ? 0.5 : 1,
                                transition: "all 0.15s",
                              }}
                            >
                              {picked && <Icon name="check" size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />}
                              {skill}
                            </Ripple>
                          );
                        })}
                      </div>
                      {selectedSkills.length > 0 && selectedSkills.length < pSkillsChoose && (
                        <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginTop: 6 }}>
                          {pSkillsChoose - selectedSkills.length} more to choose
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                    <Ripple onClick={() => setPreviewClass(null)} style={{ ...styles.secondaryBtn, gap: 6 }}>
                      <Icon name="arrow_back" size={16} /> Back
                    </Ripple>
                    <Ripple
                      onClick={selectedSkills.length >= pSkillsChoose ? confirmClass : undefined}
                      style={{
                        ...styles.primaryBtn, gap: 6,
                        opacity: selectedSkills.length >= pSkillsChoose ? 1 : 0.4,
                        cursor: selectedSkills.length >= pSkillsChoose ? "pointer" : "default",
                      }}
                    >
                      <Icon name="check" size={16} /> Confirm {pCls.name}
                    </Ripple>
                  </div>
                </div>
              </div>

              {/* Mini class carousel */}
              <div style={{ position: "relative" }}>
                <Ripple
                  onClick={() => classCarouselRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
                  style={{
                    position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", zIndex: 2,
                    width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--dm-surface-brighter)", border: "1px solid var(--dm-outline-variant)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  <Icon name="chevron_left" size={22} />
                </Ripple>
                <div
                  ref={classCarouselRef}
                  style={{
                    display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8,
                    scrollbarWidth: "none", msOverflowStyle: "none",
                    scrollSnapType: "x mandatory",
                  }}
                >
                  {classesData.map((cls) => {
                    const img = CLASS_IMAGES[cls.id];
                    const active = cls.id === previewClass;
                    return (
                      <Ripple
                        key={cls.id}
                        onClick={() => openPreview(cls.id)}
                        style={{
                          flexShrink: 0, width: 100, borderRadius: 12, overflow: "hidden",
                          border: active ? "2px solid var(--dm-primary)" : "1px solid var(--dm-outline-variant)",
                          background: "var(--dm-surface)", display: "flex", flexDirection: "column",
                          opacity: active ? 1 : 0.7, transition: "all 0.15s",
                          scrollSnapAlign: "start",
                        }}
                      >
                        {img && <img src={img} alt={cls.name} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />}
                        <div style={{ padding: "6px 0", textAlign: "center", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                          {cls.name}
                        </div>
                      </Ripple>
                    );
                  })}
                </div>
                <Ripple
                  onClick={() => classCarouselRef.current?.scrollBy({ left: 240, behavior: "smooth" })}
                  style={{
                    position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", zIndex: 2,
                    width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--dm-surface-brighter)", border: "1px solid var(--dm-outline-variant)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  <Icon name="chevron_right" size={22} />
                </Ripple>
              </div>
            </div>
          );
        }

        // Grid view (no class previewed)
        return (
          <div>
            <h2 style={styles.stepTitle}>Choose your Class</h2>
            <p style={styles.stepDesc}>
              Your class defines your abilities, skills, and role in the party.
            </p>
            <div style={styles.cardGrid}>
              {classesData.map((cls) => (
                <ClassCard
                  key={cls.id}
                  cls={cls}
                  selected={char.class === cls.id}
                  onSelect={() => openPreview(cls.id)}
                />
              ))}
            </div>
          </div>
        );
      }

      case 2: { // Background
        const pBg = previewBg ? BACKGROUNDS.find((b) => b.id === previewBg) : null;
        const pBgImg = previewBg ? BG_IMAGES[previewBg] : null;

        const openBgPreview = (id) => {
          update("background", id);
          setPreviewBg(id);
        };

        if (pBg) {
          return (
            <div>
              <h2 style={styles.stepTitle}>Choose your Background</h2>

              {/* Detail card */}
              <div style={{
                display: "flex", gap: 0, background: "var(--dm-surface)", borderRadius: 20,
                overflow: "hidden", border: "1px solid var(--dm-outline-variant)", marginBottom: 24,
                height: 360,
              }}>
                {pBgImg && (
                  <div style={{ width: 240, minWidth: 240, flexShrink: 0 }}>
                    <img src={pBgImg} alt={pBg.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                  </div>
                )}

                <div style={{ flex: 1, padding: "20px 28px", minWidth: 260, overflowY: "auto" }}>
                  <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", letterSpacing: "0.02em", textTransform: "uppercase" }}>
                    {pBg.name}
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--dm-text-secondary)", lineHeight: 1.6, margin: "0 0 16px" }}>
                    {pBg.desc}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", fontSize: 13 }}>
                    <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Skill Proficiencies:</span>
                    {pBg.skills.map((skill) => (
                      <TraitChip key={skill} trait={{ name: skill, desc: SKILL_DESCRIPTIONS[skill] || skill }} asButton />
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <Ripple onClick={() => setPreviewBg(null)} style={{ ...styles.secondaryBtn, gap: 6 }}>
                      <Icon name="arrow_back" size={16} /> Back
                    </Ripple>
                    <Ripple onClick={() => { setPreviewBg(null); next(); }} style={{ ...styles.primaryBtn, gap: 6 }}>
                      <Icon name="check" size={16} /> Confirm {pBg.name}
                    </Ripple>
                  </div>
                </div>
              </div>

              {/* Mini background carousel */}
              <div style={{ position: "relative" }}>
                <Ripple
                  onClick={() => bgCarouselRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
                  style={{
                    position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", zIndex: 2,
                    width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--dm-surface-brighter)", border: "1px solid var(--dm-outline-variant)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  <Icon name="chevron_left" size={22} />
                </Ripple>
                <div
                  ref={bgCarouselRef}
                  style={{
                    display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8,
                    scrollbarWidth: "none", msOverflowStyle: "none",
                    scrollSnapType: "x mandatory",
                  }}
                >
                  {BACKGROUNDS.map((bg) => {
                    const img = BG_IMAGES[bg.id];
                    const active = bg.id === previewBg;
                    return (
                      <Ripple
                        key={bg.id}
                        onClick={() => openBgPreview(bg.id)}
                        style={{
                          flexShrink: 0, width: 100, borderRadius: 12, overflow: "hidden",
                          border: active ? "2px solid var(--dm-primary)" : "1px solid var(--dm-outline-variant)",
                          background: "var(--dm-surface)", display: "flex", flexDirection: "column",
                          opacity: active ? 1 : 0.7, transition: "all 0.15s",
                          scrollSnapAlign: "start",
                        }}
                      >
                        {img ? (
                          <img src={img} alt={bg.name} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                        ) : (
                          <div style={{ width: "100%", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--dm-surface-bright)" }}>
                            <Icon name={bg.icon} size={28} style={{ color: "var(--dm-primary)" }} />
                          </div>
                        )}
                        <div style={{ padding: "6px 0", textAlign: "center", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>
                          {bg.name}
                        </div>
                      </Ripple>
                    );
                  })}
                </div>
                <Ripple
                  onClick={() => bgCarouselRef.current?.scrollBy({ left: 240, behavior: "smooth" })}
                  style={{
                    position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", zIndex: 2,
                    width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--dm-surface-brighter)", border: "1px solid var(--dm-outline-variant)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  <Icon name="chevron_right" size={22} />
                </Ripple>
              </div>
            </div>
          );
        }

        // Grid view
        return (
          <div>
            <h2 style={styles.stepTitle}>Choose your Background</h2>
            <p style={styles.stepDesc}>
              Your background reveals where you came from and your place in the world.
            </p>
            <div style={styles.cardGrid}>
              {BACKGROUNDS.map((bg) => {
                const img = BG_IMAGES[bg.id];
                return (
                  <Ripple
                    key={bg.id}
                    onClick={() => openBgPreview(bg.id)}
                    style={{
                      background: "var(--dm-surface)", borderRadius: 16, padding: 0, overflow: "hidden",
                      display: "flex", flexDirection: "column", position: "relative",
                      transition: "border-color 0.2s",
                      border: char.background === bg.id ? "2px solid var(--dm-primary)" : "1px solid var(--dm-outline-variant)",
                    }}
                  >
                    {img ? (
                      <div style={{ width: "100%", aspectRatio: "1", overflow: "hidden" }}>
                        <img src={img} alt={bg.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </div>
                    ) : (
                      <div style={{ ...styles.cardIconWrap, margin: "20px 20px 0" }}>
                        <Icon name={bg.icon} size={32} style={{ color: "var(--dm-primary)" }} />
                      </div>
                    )}
                    <div style={{ padding: "12px 20px 16px", borderRadius: 16, marginTop: -16, position: "relative", background: "var(--dm-surface)" }}>
                      <div style={styles.cardName}>{bg.name}</div>
                      <div style={{ ...styles.cardMeta, marginBottom: 6 }}>{bg.skills.join(", ")}</div>
                      <div style={{ ...styles.cardMeta, fontSize: 12, lineHeight: 1.4, opacity: 0.7 }}>{bg.desc}</div>
                    </div>
                  </Ripple>
                );
              })}
            </div>
          </div>
        );
      }

      case 3: // Stats
        return (
          <div>
            <h2 style={styles.stepTitle}>Assign Ability Scores</h2>
            <p style={styles.stepDesc}>
              Assign scores to your abilities.
              {raceData &&
                ` Racial bonuses from ${raceData.name} are added automatically.`}
            </p>

            {/* Level selector */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
              background: "var(--dm-surface)", borderRadius: 16, padding: "12px 20px",
              border: "1px solid var(--dm-outline-variant)", flexWrap: "wrap",
            }}>
              <Icon name="military_tech" size={22} style={{ color: "var(--dm-primary)" }} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Starting Level</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Ripple
                  onClick={() => update("level", Math.max(1, char.level - 1))}
                  style={{
                    width: 32, height: 32, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                  }}
                >
                  <Icon name="remove" size={18} />
                </Ripple>
                <span style={{
                  fontSize: 22, fontWeight: 700, color: "var(--dm-primary)",
                  minWidth: 36, textAlign: "center",
                }}>
                  {char.level}
                </span>
                <Ripple
                  onClick={() => update("level", Math.min(20, char.level + 1))}
                  style={{
                    width: 32, height: 32, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                  }}
                >
                  <Icon name="add" size={18} />
                </Ripple>
              </div>
              <span style={{ fontSize: 12, color: "var(--dm-text-muted)" }}>
                HP: {classData ? classData.hitDie + (char.level - 1) * (Math.floor(classData.hitDie / 2) + 1) : "—"}
              </span>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <Ripple onClick={rollStats} style={{ ...styles.secondaryBtn, gap: 6 }}>
                <Icon name="casino" size={18} /> Roll 4d6
              </Ripple>
              <Ripple onClick={resetToStandard} style={{ ...styles.secondaryBtn, gap: 6 }}>
                <Icon name="restart_alt" size={18} /> Standard Array
              </Ripple>
            </div>

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
        const currentQ = quizQuestions[quizAnswers.length];
        const suggested = suggestedAlignment ? ALIGNMENTS.find((a) => a.id === suggestedAlignment) : null;
        return (
          <div>
            <h2 style={styles.stepTitle}>Discover your Alignment</h2>
            <p style={styles.stepDesc}>
              Answer these questions to reveal your character's moral compass — or pick one directly below.
            </p>

            {/* Quiz section */}
            {!quizDone && currentQ && (
              <div style={{
                background: "var(--dm-surface)", borderRadius: 16, padding: 24,
                marginBottom: 24, border: "1px solid var(--dm-outline-variant)",
              }}>
                <div style={{ fontSize: 13, color: "var(--dm-text-muted)", marginBottom: 8 }}>
                  Question {quizAnswers.length + 1} of 2
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, lineHeight: 1.5 }}>
                  {currentQ.q}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {currentQ.answers.map((ans, i) => (
                    <Ripple
                      key={i}
                      onClick={() => answerQuiz(ans)}
                      style={{
                        padding: "14px 16px", borderRadius: 12,
                        background: "var(--dm-surface-bright)",
                        border: "1px solid var(--dm-outline-variant)",
                        fontSize: 14, lineHeight: 1.5, textAlign: "left",
                        color: "var(--dm-text)",
                      }}
                    >
                      {ans.text}
                    </Ripple>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz result */}
            {quizDone && suggested && (
              <div style={{
                background: suggested.color + "12", borderRadius: 16, padding: 24,
                marginBottom: 24, border: `1px solid ${suggested.color}40`,
                textAlign: "center",
              }}>
                <Icon name={suggested.icon} size={36} style={{ color: suggested.color, marginBottom: 8 }} />
                <div style={{ fontSize: 20, fontWeight: 700, color: suggested.color, marginBottom: 4 }}>
                  {suggested.name}
                </div>
                <div style={{ fontSize: 14, color: "var(--dm-text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>
                  {suggested.desc}
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  <Ripple
                    onClick={() => { selectAndAdvance("alignment", suggested.id); next(); }}
                    style={{ ...styles.primaryBtn, gap: 6 }}
                  >
                    <Icon name="check" size={18} /> Accept {suggested.short}
                  </Ripple>
                  <Ripple onClick={resetQuiz} style={{ ...styles.secondaryBtn, gap: 6 }}>
                    <Icon name="restart_alt" size={18} /> Retake Quiz
                  </Ripple>
                </div>
              </div>
            )}

            {/* Manual grid always visible */}
            <div style={{ fontSize: 13, color: "var(--dm-text-muted)", marginBottom: 10 }}>
              {quizDone ? "Or pick a different alignment:" : "Or choose directly:"}
            </div>
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
                  onClick={() => { selectAndAdvance("alignment", al.id); next(); }}
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
                        : suggestedAlignment === al.id
                          ? `2px solid ${al.color}80`
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
              {classData
                ? `As a ${classData.name}, select one option from each choice below. Guaranteed items are included automatically.`
                : "Select a class first to see equipment options."}
            </p>

            {classEquipConfig && (
              <>
                {/* Choice groups */}
                {classEquipConfig.choices.map((choiceGroup, idx) => {
                  const selectedId = (char.equipChoices || {})[idx];
                  return (
                    <div key={idx} style={{ marginBottom: 24 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 700, color: "var(--dm-primary)",
                        textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10,
                        display: "flex", alignItems: "center", gap: 8,
                      }}>
                        <span style={{
                          width: 22, height: 22, borderRadius: 11,
                          background: selectedId != null ? "var(--dm-primary)" : "var(--dm-surface-bright)",
                          color: selectedId != null ? "var(--dm-on-primary)" : "var(--dm-text-muted)",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700,
                        }}>
                          {selectedId != null ? <Icon name="check" size={14} /> : idx + 1}
                        </span>
                        {choiceGroup.label}
                      </div>
                      <div style={styles.cardGrid}>
                        {choiceGroup.options.map((option) => (
                          <EquipmentCard
                            key={option.id}
                            eq={{
                              id: option.id,
                              name: option.name,
                              icon: option.items[0]?.icon || "inventory_2",
                              damage: option.items.length === 1 ? option.items[0].damage : undefined,
                              weight: option.items.length === 1 ? option.items[0].weight : undefined,
                              properties: option.items.length === 1 ? option.items[0].properties : undefined,
                              desc: option.items.length === 1
                                ? option.items[0].desc
                                : "Includes: " + option.items.map((it) => it.name).join(", "),
                            }}
                            selected={selectedId === option.id}
                            disabled={false}
                            onToggle={() => selectEquipChoice(idx, selectedId === option.id ? undefined : option.id)}
                            radioMode
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Guaranteed items */}
                {classEquipConfig.guaranteed.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700, color: "var(--dm-text-muted)",
                      textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10,
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <Icon name="lock" size={16} style={{ color: "var(--dm-text-muted)" }} />
                      Guaranteed Items
                    </div>
                    <div style={styles.cardGrid}>
                      {classEquipConfig.guaranteed.map((item) => (
                        <EquipmentCard
                          key={item.id}
                          eq={item}
                          selected={true}
                          disabled={true}
                          onToggle={() => {}}
                          locked
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 6: { // Spells
        const className = char.class ? char.class.charAt(0).toUpperCase() + char.class.slice(1) : "";
        const slots = spellSlots;

        if (!hasSpellcasting) {
          return (
            <div>
              <h2 style={styles.stepTitle}>Spells</h2>
              <div style={{
                background: "var(--dm-surface)", borderRadius: 16, padding: 32,
                textAlign: "center", border: "1px solid var(--dm-outline-variant)",
              }}>
                <Icon name="block" size={48} style={{ color: "var(--dm-text-muted)", marginBottom: 12 }} />
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                  {char.class ? `${className} doesn't have spellcasting at level ${char.level}` : "Select a class first"}
                </div>
                <div style={{ fontSize: 13, color: "var(--dm-text-secondary)" }}>
                  {char.class && slots ? `${className} gains spellcasting at level ${slots.castLevel}.` : "Choose a class to see available spells."}
                </div>
              </div>
            </div>
          );
        }

        const availableCantrips = allSpellsData.filter(
          (s) => s.level === 0 && s.classes.map((c) => c.toLowerCase()).includes(char.class)
        );
        const availableSpells = allSpellsData.filter(
          (s) => s.level === 1 && s.classes.map((c) => c.toLowerCase()).includes(char.class)
        );

        const toggleCantrip = (id) => {
          if (char.cantrips.includes(id)) {
            update("cantrips", char.cantrips.filter((c) => c !== id));
          } else if (char.cantrips.length < slots.cantrips) {
            update("cantrips", [...char.cantrips, id]);
          }
        };
        const toggleSpell = (id) => {
          if (char.spells.includes(id)) {
            update("spells", char.spells.filter((s) => s !== id));
          } else if (char.spells.length < slots.spells) {
            update("spells", [...char.spells, id]);
          }
        };

        const SpellRow = ({ spell, selected, disabled, onToggle }) => {
          const chipRef = useRef(null);
          const { tooltipRef: ttRef, style: ttStyle, calcPos: ttCalc } = useTooltipPos(chipRef, 300);
          const [tipOpen, setTipOpen] = useState(false);
          return (
            <div ref={chipRef} onMouseEnter={() => { setTipOpen(true); ttCalc(); }} onMouseLeave={() => setTipOpen(false)} style={{ position: "relative" }}>
              <Ripple
                onClick={onToggle}
                style={{
                  padding: "12px 16px", borderRadius: 12,
                  display: "flex", gap: 12, alignItems: "center",
                  background: selected ? "var(--dm-primary-container)" : "var(--dm-surface)",
                  border: selected ? "2px solid var(--dm-primary)" : "1px solid var(--dm-outline-variant)",
                  opacity: disabled && !selected ? 0.5 : 1,
                }}
              >
                <Icon
                  name={spell.school === "Evocation" ? "local_fire_department" :
                    spell.school === "Abjuration" ? "shield" :
                    spell.school === "Conjuration" ? "auto_awesome" :
                    spell.school === "Divination" ? "visibility" :
                    spell.school === "Enchantment" ? "psychology" :
                    spell.school === "Illusion" ? "blur_on" :
                    spell.school === "Necromancy" ? "skull" :
                    spell.school === "Transmutation" ? "swap_horiz" : "auto_fix_high"}
                  size={20}
                  style={{ color: selected ? "var(--dm-primary)" : "var(--dm-text-muted)", flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: selected ? "var(--dm-on-primary-container)" : "var(--dm-text)" }}>
                    {spell.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--dm-text-muted)" }}>
                    {spell.school} · {spell.castingTime}
                  </div>
                </div>
                {selected && <Icon name="check_circle" size={18} style={{ color: "var(--dm-primary)", flexShrink: 0 }} />}
              </Ripple>
              {tipOpen && (
                <div ref={ttRef} style={{
                  ...ttStyle, padding: 14, borderRadius: 12,
                  background: "var(--dm-surface-brighter)", border: "1px solid var(--dm-outline-variant)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)", zIndex: 100, pointerEvents: "none",
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--dm-primary)", marginBottom: 6 }}>{spell.name}</div>
                  <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 3 }}>
                    <span style={{ color: "var(--dm-text-muted)" }}>School: </span>{spell.school}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 3 }}>
                    <span style={{ color: "var(--dm-text-muted)" }}>Cast Time: </span>{spell.castingTime}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 3 }}>
                    <span style={{ color: "var(--dm-text-muted)" }}>Range: </span>{spell.range}
                  </div>
                  {spell.components && (
                    <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 3 }}>
                      <span style={{ color: "var(--dm-text-muted)" }}>Components: </span>
                      {spell.components.map((c) => c === "V" ? "Verbal" : c === "S" ? "Somatic" : c === "M" ? "Material" : c).join(", ")}
                      {spell.material && <span style={{ color: "var(--dm-text-muted)" }}> ({spell.material})</span>}
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 3 }}>
                    <span style={{ color: "var(--dm-text-muted)" }}>Duration: </span>{spell.duration}{spell.concentration ? " (Concentration)" : ""}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--dm-text-secondary)", lineHeight: 1.5, marginTop: 6 }}>
                    {spell.description.length > 200 ? spell.description.slice(0, 200) + "…" : spell.description}
                  </div>
                </div>
              )}
            </div>
          );
        };

        return (
          <div>
            <h2 style={styles.stepTitle}>Choose Spells</h2>
            <p style={styles.stepDesc}>
              As a {className}, select your known cantrips and spells.
              {slots.cantrips > 0 && ` You know ${slots.cantrips} cantrip${slots.cantrips > 1 ? "s" : ""}.`}
              {slots.spells > 0 && ` You know ${slots.spells} 1st-level spell${slots.spells > 1 ? "s" : ""}.`}
            </p>

            {/* Cantrips */}
            {slots.cantrips > 0 && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                    <Icon name="auto_fix_high" size={18} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--dm-primary)" }} />
                    Cantrips
                  </h3>
                  <span style={{ fontSize: 13, fontWeight: 500, color: char.cantrips.length >= slots.cantrips ? "var(--dm-primary)" : "var(--dm-text-muted)" }}>
                    {char.cantrips.length} / {slots.cantrips}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 8, marginBottom: 28 }}>
                  {availableCantrips.map((sp) => (
                    <SpellRow
                      key={sp.id}
                      spell={sp}
                      selected={char.cantrips.includes(sp.id)}
                      disabled={char.cantrips.length >= slots.cantrips}
                      onToggle={() => toggleCantrip(sp.id)}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Level 1 Spells */}
            {slots.spells > 0 && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                    <Icon name="menu_book" size={18} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--dm-primary)" }} />
                    1st-Level Spells
                  </h3>
                  <span style={{ fontSize: 13, fontWeight: 500, color: char.spells.length >= slots.spells ? "var(--dm-primary)" : "var(--dm-text-muted)" }}>
                    {char.spells.length} / {slots.spells}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 8 }}>
                  {availableSpells.map((sp) => (
                    <SpellRow
                      key={sp.id}
                      spell={sp}
                      selected={char.spells.includes(sp.id)}
                      disabled={char.spells.length >= slots.spells}
                      onToggle={() => toggleSpell(sp.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  // Summary sidebar
  const bgData = BACKGROUNDS.find((b) => b.id === char.background);
  const alData = ALIGNMENTS.find((a) => a.id === char.alignment);

  // Toggle body scroll for the finished character sheet
  useEffect(() => {
    if (finished) {
      document.body.style.overflow = "auto";
      return () => { document.body.style.overflow = ""; };
    }
  }, [finished]);

  const [editing, setEditing] = useState(false);
  const [attackRoll, setAttackRoll] = useState(null); // { name, dice, rolls, total, type, hit? }
  const [openPanel, setOpenPanel] = useState(null);
  const [spellFilter, setSpellFilter] = useState("all");
  const [spellSearch, setSpellSearch] = useState("");
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [invView, setInvView] = useState("list"); // "list" | "add" | "custom"
  const [invSearch, setInvSearch] = useState("");
  const [customItem, setCustomItem] = useState({ name: "", icon: "inventory_2", weight: "", desc: "" });

  const saveEdits = () => {
    const chars = loadCharacters();
    const charToSave = { ...char, assignedStats, id: editId || char.id || Date.now().toString() };
    const idx = chars.findIndex((c) => c.id === charToSave.id);
    if (idx >= 0) chars[idx] = charToSave;
    else chars.push(charToSave);
    saveCharacters(chars);
    syncCharacterToParty(charToSave);
    setEditing(false);
  };

  if (finished) {
    const rImg = char.race ? RACE_IMAGES[char.race] : null;
    const cImg = char.class ? CLASS_IMAGES[char.class] : null;
    const hp = classData ? classData.hitDie + (char.level - 1) * (Math.floor(classData.hitDie / 2) + 1) : 0;
    const profBonus = Math.ceil(char.level / 4) + 1;

    const inputStyle = {
      background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
      borderRadius: 10, padding: "6px 10px", color: "var(--dm-text)", fontSize: 14,
      outline: "none", width: "100%",
    };

    return (
      <div style={{ ...styles.root, height: "auto", minHeight: "100vh", overflow: "visible" }}>
        <div style={styles.topBar}>
          <Ripple onClick={onBack} style={styles.backBtn}>
            <Icon name="arrow_back" />
          </Ripple>
          <Icon name="shield_with_house" size={24} filled style={{ color: "var(--dm-primary)" }} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>Character Sheet</span>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px" }}>
          {/* Hero section */}
          <div style={{
            display: "flex", gap: 0, background: "var(--dm-surface)", borderRadius: 20,
            overflow: "hidden", border: "1px solid var(--dm-outline-variant)", marginBottom: 24,
          }}>
            {(cImg || rImg) && (
              <div style={{ width: 240, minWidth: 240, flexShrink: 0 }}>
                <img src={cImg || rImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
              </div>
            )}
            <div style={{ flex: 1, padding: "24px 28px" }}>
              {editing ? (
                <input
                  value={char.name}
                  onChange={(e) => update("name", e.target.value)}
                  style={{ ...inputStyle, fontSize: 28, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}
                  placeholder="Character name"
                />
              ) : (
                <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                  {char.name || "Unnamed Hero"}
                </h2>
              )}

              {editing ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 14, color: "var(--dm-text-muted)" }}>Level</span>
                  <Ripple onClick={() => update("level", Math.max(1, char.level - 1))} style={{
                    width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                  }}>
                    <Icon name="remove" size={16} />
                  </Ripple>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "var(--dm-primary)", minWidth: 24, textAlign: "center" }}>{char.level}</span>
                  <Ripple onClick={() => update("level", Math.min(20, char.level + 1))} style={{
                    width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                  }}>
                    <Icon name="add" size={16} />
                  </Ripple>
                  <span style={{ fontSize: 13, color: "var(--dm-text-secondary)", marginLeft: 8 }}>
                    {raceData?.name} {classData?.name}{bgData ? ` · ${bgData.name}` : ""}
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: 15, color: "var(--dm-text-secondary)", marginBottom: 16 }}>
                  Level {char.level} {raceData?.name} {classData?.name}
                  {bgData && ` · ${bgData.name}`}
                </div>
              )}

              {(() => {
                // Calculate AC from equipment
                const dexScore = (assignedStats.DEX ?? 10) + getRacialBonus("DEX");
                const dexMod = Math.floor((dexScore - 10) / 2);
                let baseAC = 10 + dexMod; // unarmored
                let hasShield = false;
                computedEquipment.forEach((it) => {
                  const props = it.properties || "";
                  if (props.includes("+2 Armor Class")) { hasShield = true; return; }
                  const acMatch = props.match(/AC (\d+)/);
                  if (acMatch) {
                    const armorAC = parseInt(acMatch[1]);
                    if (props.includes("max 2")) baseAC = armorAC + Math.min(dexMod, 2);
                    else if (props.includes("Dex modifier")) baseAC = armorAC + dexMod;
                    else baseAC = armorAC; // heavy armor, no dex
                  }
                });
                if (hasShield) baseAC += 2;
                // Monk/Barbarian unarmored defense
                const hasArmor = computedEquipment.some((it) => (it.properties || "").match(/AC \d+/));
                if (!hasArmor && char.class === "barbarian") {
                  const conScore = (assignedStats.CON ?? 10) + getRacialBonus("CON");
                  const conMod = Math.floor((conScore - 10) / 2);
                  baseAC = 10 + dexMod + conMod + (hasShield ? 2 : 0);
                } else if (!hasArmor && char.class === "monk") {
                  const wisScore = (assignedStats.WIS ?? 10) + getRacialBonus("WIS");
                  const wisMod = Math.floor((wisScore - 10) / 2);
                  baseAC = 10 + dexMod + wisMod;
                }
                const ac = char.acOverride != null ? char.acOverride : baseAC;

                return (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", fontSize: 14 }}>
                    <div>
                      <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>AC: </span>
                      {editing ? (
                        <input
                          type="number"
                          value={char.acOverride != null ? char.acOverride : baseAC}
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            update("acOverride", isNaN(v) || v === baseAC ? null : v);
                          }}
                          style={{ ...inputStyle, width: 48, padding: "2px 6px", fontSize: 14, display: "inline-block" }}
                        />
                      ) : (
                        <span style={{ fontWeight: 700 }}>{ac}</span>
                      )}
                    </div>
                    <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>HP: </span>{hp}</div>
                    <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Hit Die: </span>d{classData?.hitDie}</div>
                    <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Proficiency: </span>+{profBonus}</div>
                    <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Speed: </span>{raceData?.speed} ft</div>
                    {alData && <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Alignment: </span>{alData.name}</div>}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Ability Scores */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 24,
          }}>
            {ABILITIES.map((ab) => {
              const base = assignedStats[ab] ?? 10;
              const racial = getRacialBonus(ab);
              const total = base + racial;
              const mod = Math.floor((total - 10) / 2);
              return (
                <div key={ab} style={{
                  background: "var(--dm-surface)", borderRadius: 16, padding: 16, textAlign: "center",
                  border: "1px solid var(--dm-outline-variant)",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--dm-text-muted)", letterSpacing: 1, marginBottom: 4 }}>{ab}</div>
                  {editing ? (
                    <input
                      type="number"
                      value={base}
                      onChange={(e) => {
                        const v = parseInt(e.target.value) || 0;
                        setAssignedStats((s) => ({ ...s, [ab]: Math.max(1, Math.min(30, v)) }));
                      }}
                      style={{
                        ...inputStyle, width: 52, fontSize: 22, fontWeight: 700, textAlign: "center",
                        padding: "4px", color: "var(--dm-primary)",
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: 28, fontWeight: 700, color: "var(--dm-primary)" }}>{total}</div>
                  )}
                  <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", marginTop: 2 }}>
                    {editing && racial > 0 ? `+${racial} racial = ${total} · ` : ""}
                    {mod >= 0 ? "+" : ""}{mod}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attack Options */}
          {(() => {
            // Gather weapons from equipment + inventory
            const allEquip = [
              ...computedEquipment,
              ...(char.inventory || []),
            ];
            const weapons = allEquip.filter((it) => it.damage);

            // Gather damage-dealing spells (cantrips + known spells)
            const attackSpells = [...char.cantrips, ...char.spells]
              .map((id) => allSpellsData.find((s) => s.id === id))
              .filter((sp) => sp && /\d+d\d+/.test(sp.description));

            // Parse dice string like "1d6", "2d8", "3d10"
            const parseDice = (str) => {
              const m = str.match(/(\d+)d(\d+)/);
              if (!m) return null;
              return { count: parseInt(m[1]), sides: parseInt(m[2]) };
            };

            const rollDice = (count, sides) => {
              return Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
            };

            const doAttack = (name, diceStr, type, isSpell) => {
              const d = parseDice(diceStr);
              if (!d) return;
              // Roll to hit (d20 + modifier)
              const profBonus2 = Math.ceil(char.level / 4) + 1;
              let abilityMod = 0;
              if (isSpell) {
                const castAb = classData?.spellcasting?.ability;
                const abScore = (assignedStats[castAb] ?? 10) + getRacialBonus(castAb || "");
                abilityMod = Math.floor((abScore - 10) / 2);
              } else {
                // Use STR for melee, DEX for finesse/ranged
                const strScore = (assignedStats.STR ?? 10) + getRacialBonus("STR");
                const dexScore = (assignedStats.DEX ?? 10) + getRacialBonus("DEX");
                const strMod = Math.floor((strScore - 10) / 2);
                const dexMod = Math.floor((dexScore - 10) / 2);
                abilityMod = type.includes("finesse") || type.includes("ranged") ? Math.max(strMod, dexMod) : strMod;
              }
              const hitRoll = Math.floor(Math.random() * 20) + 1;
              const hitTotal = hitRoll + abilityMod + profBonus2;
              const isCrit = hitRoll === 20;
              // Roll damage
              const dmgRolls = rollDice(isCrit ? d.count * 2 : d.count, d.sides);
              const dmgTotal = dmgRolls.reduce((s, v) => s + v, 0) + (isSpell ? 0 : abilityMod);
              setAttackRoll({
                name, dice: diceStr, type, isSpell,
                hitRoll, hitTotal, isCrit, hitMiss: hitRoll === 1,
                abilityMod, profBonus: profBonus2,
                dmgRolls, dmgTotal,
              });
            };

            // Extract damage info from spell description
            const getSpellDamage = (sp) => {
              const m = sp.description.match(/(\d+d\d+)\s+(\w+)\s+damage/i);
              return m ? { dice: m[1], type: m[2].toLowerCase() } : null;
            };

            if (weapons.length === 0 && attackSpells.length === 0) return null;

            return (
              <div style={{
                background: "var(--dm-surface)", borderRadius: 16, padding: 20, marginBottom: 24,
                border: "1px solid var(--dm-outline-variant)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 }}>
                  Attack Options
                </div>

                {/* Attack roll result */}
                {attackRoll && (
                  <div style={{
                    background: attackRoll.isCrit ? "#1a237e" : attackRoll.hitMiss ? "#3a1510" : "var(--dm-surface-bright)",
                    borderRadius: 14, padding: 16, marginBottom: 16,
                    border: attackRoll.isCrit ? "1px solid #7c4dff" : attackRoll.hitMiss ? "1px solid var(--dm-error, #ffb4ab)" : "1px solid var(--dm-outline-variant)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 16, fontWeight: 700 }}>{attackRoll.name}</span>
                      {attackRoll.isCrit && <span style={{ fontSize: 12, fontWeight: 700, color: "#7c4dff", background: "#7c4dff22", padding: "2px 10px", borderRadius: 8 }}>CRITICAL HIT!</span>}
                      {attackRoll.hitMiss && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--dm-error, #ffb4ab)", background: "#ffb4ab22", padding: "2px 10px", borderRadius: 8 }}>NATURAL 1</span>}
                    </div>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--dm-text-muted)", marginBottom: 2 }}>To Hit</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--dm-primary)" }}>
                          {attackRoll.hitTotal}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--dm-text-muted)" }}>
                          d20({attackRoll.hitRoll}) + {attackRoll.abilityMod} + {attackRoll.profBonus}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--dm-text-muted)", marginBottom: 2 }}>Damage</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: attackRoll.isCrit ? "#7c4dff" : "var(--dm-primary)" }}>
                          {attackRoll.dmgTotal}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--dm-text-muted)" }}>
                          [{attackRoll.dmgRolls.join(", ")}]{!attackRoll.isSpell && attackRoll.abilityMod !== 0 ? ` + ${attackRoll.abilityMod}` : ""} {attackRoll.type}
                        </div>
                      </div>
                    </div>
                    <Ripple onClick={() => setAttackRoll(null)} style={{
                      fontSize: 12, color: "var(--dm-text-muted)", marginTop: 10,
                      display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 10,
                    }}>
                      <Icon name="close" size={14} /> Dismiss
                    </Ripple>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: weapons.length > 0 && attackSpells.length > 0 ? "1fr 1fr" : "1fr", gap: 16 }}>
                  {/* Weapons */}
                  {weapons.length > 0 && (
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                        <Icon name="swords" size={16} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--dm-primary)" }} />
                        Weapons
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {weapons.map((w, i) => (
                          <Ripple key={w.id + "-" + i} onClick={() => doAttack(w.name, w.damage.split(" ")[0], w.damage.split(" ").slice(1).join(" "), false)} style={{
                            padding: "10px 14px", borderRadius: 12,
                            border: "1px dashed var(--dm-outline-variant)",
                            background: "transparent", cursor: "pointer",
                          }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{w.name}</div>
                            <div style={{ fontSize: 12, color: "var(--dm-text-muted)" }}>{w.damage}</div>
                          </Ripple>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Spell attacks */}
                  {attackSpells.length > 0 && (
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                        <Icon name="auto_fix_high" size={16} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--dm-primary)" }} />
                        Spells
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {attackSpells.map((sp) => {
                          const dmg = getSpellDamage(sp);
                          if (!dmg) return null;
                          return (
                            <Ripple key={sp.id} onClick={() => doAttack(sp.name, dmg.dice, dmg.type, true)} style={{
                              padding: "10px 14px", borderRadius: 12,
                              border: "1px dashed var(--dm-outline-variant)",
                              background: "transparent", cursor: "pointer",
                            }}>
                              <div style={{ fontSize: 14, fontWeight: 600 }}>{sp.name}</div>
                              <div style={{ fontSize: 12, color: "var(--dm-text-muted)" }}>{dmg.dice} {dmg.type}</div>
                            </Ripple>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Skills & Saving Throws */}
          {(() => {
            const SKILLS_TABLE = [
              { name: "Acrobatics", ability: "DEX" },
              { name: "Animal Handling", ability: "WIS" },
              { name: "Arcana", ability: "INT" },
              { name: "Athletics", ability: "STR" },
              { name: "Deception", ability: "CHA" },
              { name: "History", ability: "INT" },
              { name: "Insight", ability: "WIS" },
              { name: "Intimidation", ability: "CHA" },
              { name: "Investigation", ability: "INT" },
              { name: "Medicine", ability: "WIS" },
              { name: "Nature", ability: "INT" },
              { name: "Perception", ability: "WIS" },
              { name: "Performance", ability: "CHA" },
              { name: "Persuasion", ability: "CHA" },
              { name: "Religion", ability: "INT" },
              { name: "Sleight of Hand", ability: "DEX" },
              { name: "Stealth", ability: "DEX" },
              { name: "Survival", ability: "WIS" },
            ];
            const proficientSkills = new Set([...char.skills, ...(bgData?.skills || [])]);
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div style={{
                  background: "var(--dm-surface)", borderRadius: 16, padding: 20,
                  border: "1px solid var(--dm-outline-variant)",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 }}>
                    Skills
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", padding: "6px 10px",
                    fontSize: 11, fontWeight: 600, color: "var(--dm-text-muted)",
                    borderBottom: "1px solid var(--dm-outline-variant)", marginBottom: 2,
                  }}>
                    <span style={{ width: 28 }}>Prof.</span>
                    <span style={{ width: 42, textAlign: "center" }}>Attr.</span>
                    <span style={{ flex: 1, marginLeft: 8 }}>Skill</span>
                    <span style={{ width: 40, textAlign: "right" }}>Mod.</span>
                  </div>
                  {SKILLS_TABLE.map((skill, i) => {
                    const isProficient = proficientSkills.has(skill.name);
                    const abScore = (assignedStats[skill.ability] ?? 10) + getRacialBonus(skill.ability);
                    const abMod = Math.floor((abScore - 10) / 2);
                    const totalMod = isProficient ? abMod + profBonus : abMod;
                    const modStr = (totalMod >= 0 ? "+" : "") + totalMod;
                    return (
                      <div key={skill.name} style={{
                        display: "flex", alignItems: "center", padding: "7px 10px",
                        borderRadius: 8,
                        background: i % 2 === 0 ? "var(--dm-surface-bright)" : "transparent",
                      }}>
                        <span style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{
                            width: 8, height: 8, borderRadius: 4,
                            background: isProficient ? "var(--dm-primary)" : "transparent",
                            border: isProficient ? "none" : "1.5px solid var(--dm-text-muted)",
                          }} />
                        </span>
                        <span style={{
                          width: 42, textAlign: "center",
                          fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                          color: "var(--dm-text-secondary)",
                          background: "var(--dm-surface)", borderRadius: 6, padding: "2px 6px",
                          border: "1px solid var(--dm-outline-variant)",
                        }}>
                          {skill.ability}
                        </span>
                        <span style={{
                          flex: 1, marginLeft: 8, fontSize: 14,
                          fontWeight: isProficient ? 600 : 400,
                          color: isProficient ? "var(--dm-primary)" : "var(--dm-text)",
                        }}>
                          {skill.name}
                        </span>
                        <span style={{
                          width: 40, textAlign: "right",
                          fontSize: 14, fontWeight: 700,
                          color: isProficient ? "var(--dm-primary)" : "var(--dm-text)",
                        }}>
                          {modStr}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ alignSelf: "start", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{
                  background: "var(--dm-surface)", borderRadius: 16, padding: 20,
                  border: "1px solid var(--dm-outline-variant)",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 }}>
                    Saving Throws
                  </div>
                  {(() => {
                    const saveProficient = new Set(classData?.savingThrows || []);
                    return ABILITIES.map((ab, i) => {
                      const isProf = saveProficient.has(ab);
                      const abScore = (assignedStats[ab] ?? 10) + getRacialBonus(ab);
                      const abMod = Math.floor((abScore - 10) / 2);
                      const totalMod = isProf ? abMod + profBonus : abMod;
                      const modStr = (totalMod >= 0 ? "+" : "") + totalMod;
                      return (
                        <div key={ab} style={{
                          display: "flex", alignItems: "center", padding: "8px 10px",
                          borderRadius: 8,
                          background: i % 2 === 0 ? "var(--dm-surface-bright)" : "transparent",
                        }}>
                          <span style={{ width: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{
                              width: 8, height: 8, borderRadius: 4,
                              background: isProf ? "var(--dm-primary)" : "transparent",
                              border: isProf ? "none" : "1.5px solid var(--dm-text-muted)",
                            }} />
                          </span>
                          <span style={{
                            flex: 1, fontSize: 14,
                            fontWeight: isProf ? 600 : 400,
                            color: isProf ? "var(--dm-primary)" : "var(--dm-text)",
                          }}>
                            {ABILITY_NAMES[ab]}
                          </span>
                          <span style={{
                            fontSize: 14, fontWeight: 700,
                            color: isProf ? "var(--dm-primary)" : "var(--dm-text)",
                          }}>
                            {modStr}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>

                {computedEquipment.length > 0 && (
                  <div style={{
                    background: "var(--dm-surface)", borderRadius: 16, padding: 20,
                    border: "1px solid var(--dm-outline-variant)",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
                      Equipment
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {computedEquipment.map((eq, i) => (
                        <span key={eq.id + "-" + i} style={{
                          padding: "6px 14px", borderRadius: 16, fontSize: 13,
                          background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                          display: "inline-flex", alignItems: "center", gap: 6,
                        }}>
                          <Icon name={eq.icon} size={16} style={{ color: "var(--dm-primary)" }} />
                          {eq.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(char.cantrips.length > 0 || char.spells.length > 0) && (
                  <div style={{
                    background: "var(--dm-surface)", borderRadius: 16, padding: 20,
                    border: "1px solid var(--dm-outline-variant)",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
                      Spells
                    </div>
                    {char.cantrips.length > 0 && (
                      <div style={{ marginBottom: char.spells.length > 0 ? 12 : 0 }}>
                        <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginBottom: 6 }}>Cantrips</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {char.cantrips.map((id) => {
                            const sp = allSpellsData.find((s) => s.id === id);
                            return sp ? (
                              <Ripple key={id} onClick={() => { setSelectedSpell(sp); setOpenPanel("spellbook"); }} style={{
                                padding: "5px 12px", borderRadius: 16, fontSize: 12,
                                background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                                color: "var(--dm-primary)", cursor: "pointer",
                              }}>
                                {sp.name}
                              </Ripple>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                    {char.spells.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginBottom: 6 }}>1st Level</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {char.spells.map((id) => {
                            const sp = allSpellsData.find((s) => s.id === id);
                            return sp ? (
                              <Ripple key={id} onClick={() => { setSelectedSpell(sp); setOpenPanel("spellbook"); }} style={{
                                padding: "5px 12px", borderRadius: 16, fontSize: 12,
                                background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                                color: "var(--dm-primary)", cursor: "pointer",
                              }}>
                                {sp.name}
                              </Ripple>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {raceData?.traits?.length > 0 && (
                  <div style={{
                    background: "var(--dm-surface)", borderRadius: 16, padding: 20,
                    border: "1px solid var(--dm-outline-variant)",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
                      Racial Traits
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {raceData.traits.map((t) => (
                        <TraitChip key={t.name} trait={t} asButton />
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </div>
            );
          })()}



          {/* Actions */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 8, paddingBottom: 80 }}>
            {editing ? (
              <>
                <Ripple onClick={() => setEditing(false)} style={{ ...styles.secondaryBtn, gap: 6 }}>
                  <Icon name="close" size={16} /> Cancel
                </Ripple>
                <Ripple onClick={saveEdits} style={{ ...styles.primaryBtn, gap: 6 }}>
                  <Icon name="save" size={16} /> Save Changes
                </Ripple>
              </>
            ) : (
              <>
                <Ripple onClick={() => setEditing(true)} style={{ ...styles.secondaryBtn, gap: 6 }}>
                  <Icon name="edit" size={16} /> Edit Character
                </Ripple>
                <Ripple onClick={() => onBack()} style={{ ...styles.primaryBtn, gap: 6 }}>
                  <Icon name="check" size={16} /> Done
                </Ripple>
              </>
            )}
          </div>
        </div>

        {/* Bottom action bar */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", justifyContent: "center", gap: 12, padding: "12px 20px",
          background: "linear-gradient(transparent, var(--dm-bg) 30%)",
          pointerEvents: "none",
        }}>
          <Ripple
            onClick={() => setOpenPanel(openPanel === "inventory" ? null : "inventory")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 24px", borderRadius: 24,
              background: openPanel === "inventory" ? "var(--dm-primary)" : "var(--dm-surface)",
              color: openPanel === "inventory" ? "var(--dm-on-primary)" : "var(--dm-text)",
              border: "1px solid var(--dm-outline-variant)",
              fontWeight: 600, fontSize: 14, pointerEvents: "auto",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            <Icon name="backpack" size={20} /> Inventory
          </Ripple>
          <Ripple
            onClick={() => { setOpenPanel(openPanel === "spellbook" ? null : "spellbook"); setSpellFilter("my"); setSpellSearch(""); setSelectedSpell(null); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 24px", borderRadius: 24,
              background: openPanel === "spellbook" ? "var(--dm-primary)" : "var(--dm-surface)",
              color: openPanel === "spellbook" ? "var(--dm-on-primary)" : "var(--dm-text)",
              border: "1px solid var(--dm-outline-variant)",
              fontWeight: 600, fontSize: 14, pointerEvents: "auto",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            <Icon name="auto_stories" size={20} /> Spellbook
          </Ripple>
        </div>

        {/* Modal overlay */}
        {openPanel && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 60,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)",
          }}>
            {/* Backdrop click */}
            <div onClick={() => setOpenPanel(null)} style={{ position: "absolute", inset: 0 }} />
            {/* Modal */}
            <div style={{
              position: "relative", width: "90%", maxWidth: 700,
              maxHeight: "80vh", background: "var(--dm-surface)",
              borderRadius: 20, display: "flex", flexDirection: "column",
              overflow: "hidden", border: "1px solid var(--dm-outline-variant)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            }}>
              {/* Panel header */}
              <div style={{
                display: "flex", alignItems: "center", padding: "16px 20px", gap: 12,
                borderBottom: "1px solid var(--dm-outline-variant)", flexShrink: 0,
              }}>
                <Icon
                  name={openPanel === "inventory" ? "backpack" : "auto_stories"}
                  size={24} style={{ color: "var(--dm-primary)" }}
                />
                <span style={{ fontSize: 18, fontWeight: 700, flex: 1 }}>
                  {openPanel === "inventory" ? "Inventory" : "Spellbook"}
                </span>
                <Ripple onClick={() => setOpenPanel(null)} style={{
                  width: 36, height: 36, borderRadius: 18,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "var(--dm-surface-bright)",
                }}>
                  <Icon name="close" size={20} />
                </Ripple>
              </div>

              {/* Panel content */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
                {openPanel === "inventory" && (() => {
                  // Merge equipment (from creation) + inventory (added later)
                  const allItems = [
                    ...computedEquipment.map((eq) => ({ ...eq, source: "equipment" })),
                    ...(char.inventory || []).map((it) => ({ ...it, source: "inventory" })),
                  ];

                  const removeItem = (idx) => {
                    const inv = [...(char.inventory || [])];
                    inv.splice(idx, 1);
                    update("inventory", inv);
                  };

                  const addSrdItem = (item) => {
                    update("inventory", [...(char.inventory || []), { ...item, id: item.id + "-" + Date.now() }]);
                    setInvView("list");
                    setInvSearch("");
                  };

                  const addCustomItem = () => {
                    if (!customItem.name.trim()) return;
                    update("inventory", [...(char.inventory || []), {
                      id: "custom-" + Date.now(),
                      name: customItem.name.trim(),
                      icon: customItem.icon || "inventory_2",
                      weight: customItem.weight || undefined,
                      desc: customItem.desc || undefined,
                      custom: true,
                    }]);
                    setCustomItem({ name: "", icon: "inventory_2", weight: "", desc: "" });
                    setInvView("list");
                  };

                  // Add item view
                  if (invView === "add") {
                    const q = invSearch.toLowerCase();
                    const filtered = SRD_ITEMS.filter((it) =>
                      it.name.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)
                    );
                    return (
                      <div>
                        <Ripple onClick={() => { setInvView("list"); setInvSearch(""); }} style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "6px 14px", borderRadius: 16, fontSize: 13,
                          color: "var(--dm-text-muted)", marginBottom: 12,
                        }}>
                          <Icon name="arrow_back" size={16} /> Back to inventory
                        </Ripple>
                        <input
                          value={invSearch}
                          onChange={(e) => setInvSearch(e.target.value)}
                          placeholder="Search items..."
                          className="m3input"
                          style={{ width: "100%", fontSize: 14, marginBottom: 12, boxSizing: "border-box" }}
                        />
                        <Ripple onClick={() => setInvView("custom")} style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                          background: "var(--dm-surface-bright)", borderRadius: 12,
                          border: "1px dashed var(--dm-outline-variant)", marginBottom: 12,
                          fontSize: 14, fontWeight: 500, color: "var(--dm-primary)",
                        }}>
                          <Icon name="add_circle" size={22} /> Create Custom Item
                        </Ripple>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {filtered.map((item) => (
                            <Ripple key={item.id} onClick={() => addSrdItem(item)} style={{
                              display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                              background: "var(--dm-surface-bright)", borderRadius: 12,
                              border: "1px solid var(--dm-outline-variant)",
                            }}>
                              <Icon name={item.icon} size={20} style={{ color: "var(--dm-primary)", flexShrink: 0 }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
                                <div style={{ fontSize: 11, color: "var(--dm-text-muted)" }}>{item.weight}{item.weight ? " · " : ""}{item.desc}</div>
                              </div>
                              <Icon name="add" size={18} style={{ color: "var(--dm-primary)", flexShrink: 0 }} />
                            </Ripple>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // Custom item form
                  if (invView === "custom") {
                    const fieldStyle = {
                      width: "100%", boxSizing: "border-box", fontSize: 14,
                      padding: "10px 12px", borderRadius: 12,
                      background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                      color: "var(--dm-text)", outline: "none",
                    };
                    return (
                      <div>
                        <Ripple onClick={() => setInvView("add")} style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "6px 14px", borderRadius: 16, fontSize: 13,
                          color: "var(--dm-text-muted)", marginBottom: 16,
                        }}>
                          <Icon name="arrow_back" size={16} /> Back
                        </Ripple>
                        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Create Custom Item</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          <div>
                            <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginBottom: 4 }}>Item Name *</div>
                            <input value={customItem.name} onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                              placeholder="e.g. Mysterious Amulet" style={fieldStyle} />
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginBottom: 4 }}>Weight</div>
                            <input value={customItem.weight} onChange={(e) => setCustomItem({ ...customItem, weight: e.target.value })}
                              placeholder="e.g. 1 lb" style={fieldStyle} />
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginBottom: 4 }}>Description</div>
                            <textarea value={customItem.desc} onChange={(e) => setCustomItem({ ...customItem, desc: e.target.value })}
                              placeholder="Describe the item..." rows={3}
                              style={{ ...fieldStyle, resize: "vertical", fontFamily: "inherit" }} />
                          </div>
                          <Ripple
                            onClick={addCustomItem}
                            style={{
                              padding: "10px 24px", borderRadius: 20, fontWeight: 500, fontSize: 14,
                              background: customItem.name.trim() ? "var(--dm-primary)" : "var(--dm-surface-bright)",
                              color: customItem.name.trim() ? "var(--dm-on-primary)" : "var(--dm-text-muted)",
                              display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start",
                            }}
                          >
                            <Icon name="add" size={18} /> Add Item
                          </Ripple>
                        </div>
                      </div>
                    );
                  }

                  // List view
                  return (
                    <div>
                      <Ripple onClick={() => setInvView("add")} style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
                        background: "var(--dm-surface-bright)", borderRadius: 12,
                        border: "1px dashed var(--dm-outline-variant)", marginBottom: 16,
                        fontSize: 14, fontWeight: 500, color: "var(--dm-primary)", justifyContent: "center",
                      }}>
                        <Icon name="add" size={20} /> Add Item
                      </Ripple>

                      {allItems.length === 0 ? (
                        <div style={{ textAlign: "center", padding: 40, color: "var(--dm-text-muted)" }}>
                          <Icon name="inventory_2" size={48} style={{ opacity: 0.4, marginBottom: 12 }} />
                          <div style={{ fontSize: 15 }}>No items in inventory</div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {allItems.map((item, i) => (
                            <div key={item.id + "-" + i} style={{
                              display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px",
                              background: "var(--dm-surface-bright)", borderRadius: 14,
                              border: "1px solid var(--dm-outline-variant)",
                            }}>
                              <Icon name={item.icon || "inventory_2"} size={24} style={{ color: "var(--dm-primary)", marginTop: 2, flexShrink: 0 }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 15, fontWeight: 600 }}>{item.name}</div>
                                {item.damage && <div style={{ fontSize: 12, color: "var(--dm-text-secondary)", marginTop: 2 }}>Damage: {item.damage}</div>}
                                {item.properties && <div style={{ fontSize: 12, color: "var(--dm-text-secondary)" }}>Properties: {item.properties}</div>}
                                {item.weight && <div style={{ fontSize: 12, color: "var(--dm-text-muted)" }}>Weight: {item.weight}</div>}
                                {item.desc && <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginTop: 4, lineHeight: 1.4 }}>{item.desc}</div>}
                              </div>
                              {item.source === "inventory" ? (
                                <Ripple onClick={() => {
                                  removeItem(i - computedEquipment.length);
                                }} style={{
                                  width: 32, height: 32, borderRadius: 10,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  flexShrink: 0,
                                }}>
                                  <Icon name="delete" size={18} style={{ color: "var(--dm-error, #ffb4ab)" }} />
                                </Ripple>
                              ) : (
                                <Icon name="lock" size={16} style={{ color: "var(--dm-text-muted)", flexShrink: 0, opacity: 0.5 }} />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {openPanel === "spellbook" && (() => {
                  // Spell detail view
                  if (selectedSpell) {
                    const sp = selectedSpell;
                    const known = [...char.cantrips, ...char.spells].includes(sp.id);
                    const schoolIcon = sp.school === "Evocation" ? "local_fire_department" :
                      sp.school === "Abjuration" ? "shield" :
                      sp.school === "Conjuration" ? "auto_awesome" :
                      sp.school === "Divination" ? "visibility" :
                      sp.school === "Enchantment" ? "psychology" :
                      sp.school === "Illusion" ? "blur_on" :
                      sp.school === "Necromancy" ? "skull" :
                      sp.school === "Transmutation" ? "swap_horiz" : "auto_fix_high";
                    return (
                      <div>
                        <Ripple onClick={() => setSelectedSpell(null)} style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "6px 14px", borderRadius: 16, fontSize: 13,
                          color: "var(--dm-text-muted)", marginBottom: 16,
                        }}>
                          <Icon name="arrow_back" size={16} /> Back to spells
                        </Ripple>

                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                          <div style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: "var(--dm-surface-bright)", display: "flex",
                            alignItems: "center", justifyContent: "center",
                          }}>
                            <Icon name={schoolIcon} size={28} style={{ color: "var(--dm-primary)" }} />
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 22, fontWeight: 700 }}>{sp.name}</span>
                              {known && <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 8, background: "var(--dm-primary)", color: "var(--dm-on-primary)", fontWeight: 600 }}>KNOWN</span>}
                            </div>
                            <div style={{ fontSize: 13, color: "var(--dm-text-muted)" }}>
                              {sp.level === 0 ? "Cantrip" : `Level ${sp.level}`} · {sp.school}
                            </div>
                          </div>
                        </div>

                        <div style={{
                          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px",
                          background: "var(--dm-surface-bright)", borderRadius: 14, padding: 16, marginBottom: 16,
                          fontSize: 13,
                        }}>
                          <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Casting Time: </span>{sp.castingTime}</div>
                          <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Range: </span>{sp.range}</div>
                          <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Duration: </span>{sp.duration}{sp.concentration ? " (Concentration)" : ""}</div>
                          <div>
                            <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Components: </span>
                            {sp.components ? sp.components.map((c) => c === "V" ? "Verbal" : c === "S" ? "Somatic" : c === "M" ? "Material" : c).join(", ") : "—"}
                          </div>
                          {sp.material && (
                            <div style={{ gridColumn: "1 / -1" }}>
                              <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Material: </span>{sp.material}
                            </div>
                          )}
                          {sp.ritual && (
                            <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Ritual: </span>Yes</div>
                          )}
                          <div style={{ gridColumn: "1 / -1" }}>
                            <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Classes: </span>{sp.classes.join(", ")}
                          </div>
                        </div>

                        <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--dm-text-secondary)" }}>
                          {sp.description}
                        </div>

                        {sp.higherLevel && (
                          <div style={{
                            marginTop: 16, padding: 14, borderRadius: 12,
                            background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                          }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-primary)", marginBottom: 4 }}>At Higher Levels</div>
                            <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", lineHeight: 1.5 }}>{sp.higherLevel}</div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  const className = char.class ? char.class.charAt(0).toUpperCase() + char.class.slice(1) : "";
                  const classSpells = char.class
                    ? allSpellsData.filter((s) => s.classes.map((c) => c.toLowerCase()).includes(char.class))
                    : [];
                  const mySpellIds = new Set([...char.cantrips, ...char.spells]);
                  const maxSpellLevel = Math.min(9, char.level >= 17 ? 9 : char.level >= 15 ? 8 : char.level >= 13 ? 7 :
                    char.level >= 11 ? 6 : char.level >= 9 ? 5 : char.level >= 7 ? 4 :
                    char.level >= 5 ? 3 : char.level >= 3 ? 2 : 1);
                  const availableLevels = [...new Set(classSpells.map((s) => s.level))].sort((a, b) => a - b);

                  let filtered = classSpells;
                  if (spellFilter === "my") {
                    filtered = allSpellsData.filter((s) => mySpellIds.has(s.id));
                  } else if (spellFilter !== "all") {
                    filtered = classSpells.filter((s) => s.level === spellFilter);
                  }
                  if (spellSearch) {
                    const q = spellSearch.toLowerCase();
                    filtered = filtered.filter((s) =>
                      s.name.toLowerCase().includes(q) ||
                      s.school.toLowerCase().includes(q) ||
                      s.description.toLowerCase().includes(q)
                    );
                  }

                  // Group by level
                  const grouped = {};
                  filtered.forEach((s) => {
                    const lbl = s.level === 0 ? "Cantrips" : `Level ${s.level}`;
                    if (!grouped[lbl]) grouped[lbl] = [];
                    grouped[lbl].push(s);
                  });
                  const sortedGroups = Object.keys(grouped).sort((a, b) => {
                    const la = a === "Cantrips" ? -1 : parseInt(a.split(" ")[1]);
                    const lb = b === "Cantrips" ? -1 : parseInt(b.split(" ")[1]);
                    return la - lb;
                  });

                  return (
                    <div>
                      {/* Search */}
                      <input
                        value={spellSearch}
                        onChange={(e) => setSpellSearch(e.target.value)}
                        placeholder="Search spells..."
                        className="m3input"
                        style={{ width: "100%", fontSize: 14, marginBottom: 12, boxSizing: "border-box" }}
                      />

                      {/* Filters */}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                        {[
                          { key: "my", label: `My Spells (${mySpellIds.size})` },
                          { key: "all", label: `All ${className}` },
                          ...availableLevels.map((l) => ({ key: l, label: l === 0 ? "Cantrips" : `Level ${l}` })),
                        ].map((f) => (
                          <Ripple
                            key={f.key}
                            onClick={() => setSpellFilter(f.key)}
                            style={{
                              padding: "6px 14px", borderRadius: 16, fontSize: 12, fontWeight: 500,
                              background: spellFilter === f.key ? "var(--dm-primary)" : "var(--dm-surface)",
                              color: spellFilter === f.key ? "var(--dm-on-primary)" : "var(--dm-text)",
                              border: "1px solid var(--dm-outline-variant)",
                            }}
                          >
                            {f.label}
                          </Ripple>
                        ))}
                      </div>

                      {/* Spell list */}
                      {sortedGroups.length === 0 ? (
                        <div style={{ textAlign: "center", padding: 40, color: "var(--dm-text-muted)" }}>
                          <Icon name="search_off" size={48} style={{ opacity: 0.4, marginBottom: 12 }} />
                          <div style={{ fontSize: 15 }}>No spells found</div>
                        </div>
                      ) : (
                        sortedGroups.map((group) => (
                          <div key={group} style={{ marginBottom: 20 }}>
                            <div style={{
                              fontSize: 13, fontWeight: 600, color: "var(--dm-text-muted)",
                              textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8,
                            }}>
                              {group}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {grouped[group].map((sp) => {
                                const known = mySpellIds.has(sp.id);
                                const tooHigh = sp.level > maxSpellLevel && sp.level > 0;
                                return (
                                  <Ripple key={sp.id} onClick={() => setSelectedSpell(sp)} style={{
                                    display: "flex", gap: 12, padding: "12px 14px",
                                    background: known ? "var(--dm-primary-container)" : "var(--dm-surface-bright)",
                                    borderRadius: 12, border: known ? "1px solid var(--dm-primary)" : "1px solid var(--dm-outline-variant)",
                                    opacity: tooHigh ? 0.5 : 1, cursor: "pointer",
                                  }}>
                                    <Icon
                                      name={sp.school === "Evocation" ? "local_fire_department" :
                                        sp.school === "Abjuration" ? "shield" :
                                        sp.school === "Conjuration" ? "auto_awesome" :
                                        sp.school === "Divination" ? "visibility" :
                                        sp.school === "Enchantment" ? "psychology" :
                                        sp.school === "Illusion" ? "blur_on" :
                                        sp.school === "Necromancy" ? "skull" :
                                        sp.school === "Transmutation" ? "swap_horiz" : "auto_fix_high"}
                                      size={20}
                                      style={{ color: known ? "var(--dm-primary)" : "var(--dm-text-muted)", marginTop: 2, flexShrink: 0 }}
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: known ? "var(--dm-on-primary-container)" : "var(--dm-text)" }}>
                                          {sp.name}
                                        </span>
                                        {known && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "var(--dm-primary)", color: "var(--dm-on-primary)", fontWeight: 600 }}>KNOWN</span>}
                                        {tooHigh && <span style={{ fontSize: 10, color: "var(--dm-text-muted)" }}>Lvl {sp.level} required</span>}
                                      </div>
                                      <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginTop: 2 }}>
                                        {sp.school} · {sp.castingTime} · {sp.range}
                                        {sp.concentration ? " · Concentration" : ""}
                                      </div>
                                      <div style={{ fontSize: 12, color: "var(--dm-text-secondary)", marginTop: 4, lineHeight: 1.4 }}>
                                        {sp.description.length > 150 ? sp.description.slice(0, 150) + "…" : sp.description}
                                      </div>
                                    </div>
                                  </Ripple>
                                );
                              })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

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
          const done = stepComplete(i);
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

          {/* Nav buttons */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 24,
              justifyContent: "space-between",
            }}
          >
            {step > 0 ? (
              <Ripple onClick={prev} style={styles.secondaryBtn}>
                <Icon name="arrow_back" size={18} style={{ marginRight: 4 }} />{" "}
                Back
              </Ripple>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <Ripple onClick={next} style={styles.secondaryBtn}>
                Next{" "}
                <Icon name="arrow_forward" size={18} style={{ marginLeft: 4 }} />
              </Ripple>
            ) : (
              <Ripple
                onClick={() => {
                  if (!char.name.trim()) return;
                  const chars = loadCharacters();
                  const charToSave = { ...char, assignedStats, id: editId || char.id || Date.now().toString() };
                  const existing = chars.findIndex((c) => c.id === charToSave.id);
                  if (existing >= 0) {
                    chars[existing] = charToSave;
                  } else {
                    chars.push(charToSave);
                  }
                  saveCharacters(chars);
                  syncCharacterToParty(charToSave);
                  localStorage.removeItem(STORAGE_KEY);
                  setFinished(true);
                }}
                style={{
                  ...styles.primaryBtn,
                  opacity: char.name.trim() ? 1 : 0.4,
                  cursor: char.name.trim() ? "pointer" : "default",
                }}
              >
                <Icon name="check" size={18} style={{ marginRight: 4 }} />{" "}
                Finish
              </Ripple>
            )}
          </div>
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
              value={`${classData.name} (Lvl ${char.level})`}
              icon={CLASS_ICONS[char.class]}
              sub={char.skills.length > 0 ? `Skills: ${char.skills.join(", ")}` : null}
            />
          )}
          {bgData && (
            <SummaryRow
              label="Background"
              value={bgData.name}
              icon={bgData.icon}
              sub={bgData.skills.join(", ")}
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
            <div style={{ marginTop: 10 }}>
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
          {computedEquipment.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--dm-text-muted)",
                  fontWeight: 600,
                  marginBottom: 4,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Equipment
              </div>
              {computedEquipment.map((eq, i) => (
                <div
                  key={eq.id + "-" + i}
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
              ))}
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

function SummaryRow({ label, value, icon, sub }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: "8px 0",
        borderBottom: "1px solid var(--dm-outline-variant)",
      }}
    >
      {icon && (
        <Icon
          name={icon}
          size={16}
          style={{ color: "var(--dm-primary-dim)", flexShrink: 0, marginTop: 2 }}
        />
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "var(--dm-text-muted)", lineHeight: 1.2 }}>
          {label}
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--dm-text)", lineHeight: 1.3 }}>
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: 11, color: "var(--dm-text-muted)", marginTop: 2, lineHeight: 1.3 }}>
            {sub}
          </div>
        )}
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
