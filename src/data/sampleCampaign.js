// ---- SAMPLE CAMPAIGN DATA ----
const SAMPLE = {
  locations: [
    {
      id: "loc-1",
      title: "Varenhold",
      icon: "castle",
      content: `# Varenhold

A crumbling fortress-city perched on the edge of the Ashenmere Cliffs. Once the seat of the Gilded Lords, now a nest of intrigue, black markets, and desperate nobility clinging to faded grandeur.

## Districts

**The Gilt Quarter** — Upper city. Mansions with peeling gold leaf. The noble houses still hold court here, though half the ballrooms have been converted to gambling dens.

**The Undertow** — Lower city carved into the cliffside. Fishermen, smugglers, and anyone who can't afford sunlight. Connected by a web of rope bridges and ladders.

**The Ashgate** — The main entrance. A massive iron portcullis that hasn't been fully closed in decades. Guards are bribeable. Everyone knows it.

## Key Locations

- **The Gilded Corpse Inn** — Central tavern. Run by *Maren Ashwick*, a retired adventurer. Good ale, better rumors.
- **Temple of the Drowned God** — Half-submerged chapel in the Undertow. The clergy are... unusual.
- **Blackquill Archives** — Restricted library. Contains records of every noble family's sins.

## Atmosphere

> Fog rolls in from the Ashenmere every evening, thick enough to lose a horse in. Lanterns glow amber through the haze. Somewhere, always, someone is arguing about money.`,
    },
    {
      id: "loc-2",
      title: "The Ashenmere",
      icon: "water",
      content: `# The Ashenmere

A vast inland sea of dark, still water. The surface reflects nothing — locals say it swallowed the sky centuries ago.

## Properties

The water is safe to drink but tastes faintly of iron. Fish pulled from its depths are pale, eyeless things. Boats that venture to the center rarely return the same day they left — time moves differently out there.

## Notable Features

- **The Drowned Pillars** — Stone columns rising from the water, remnants of a civilization predating Varenhold
- **Fog Bank** — A permanent wall of mist roughly 2 miles from shore
- **The Deep Light** — On moonless nights, a faint green glow pulses beneath the surface

## DM Notes

The Ashenmere is a weak point between planes. The Drowned God isn't a god at all — it's an entity trapped beneath the water. The pillars are its prison bars.`,
    },
  ],
  npcs: [
    {
      id: "npc-1",
      title: "Maren Ashwick",
      icon: "person",
      content: `# Maren Ashwick

**Role:** Innkeeper of The Gilded Corpse | **Race:** Human | **Age:** 52

## Appearance

Stocky, weathered, with a jagged scar running from her left ear to her collarbone. Keeps her grey hair in a tight braid. Always wears a leather apron and carries a cudgel behind the bar she calls "Last Call."

## Personality

Gruff but fair. Has a soft spot for young adventurers — reminds her of her old party. Will absolutely throw you out a window if you start a fight in her establishment. Has done it before. The window has been replaced six times.

## What She Knows

- The noble houses are buying up mercenary contracts — something is coming
- A hooded figure has been asking about the Blackquill Archives
- The fish from the Ashenmere have been... wrong lately. Too many eyes, or none at all.

## Secret

Maren was part of the party that accidentally weakened the Drowned God's prison 30 years ago. She's been watching the water ever since.`,
    },
    {
      id: "npc-2",
      title: "Aldric Voss",
      icon: "person",
      content: `# Aldric Voss

**Role:** Curator of the Blackquill Archives | **Race:** Half-Elf | **Age:** 134

## Appearance

Impossibly thin, with ink-stained fingers and spectacles perched on a sharp nose. Wears robes so old they've become fashionable again. Smells of old paper and candle wax.

## Personality

Meticulous, paranoid, and deeply unhelpful unless you can offer him something he doesn't already know (which is rare). Speaks in footnotes — will correct your grammar mid-conversation.

## What He Knows

Literally everything about Varenhold's history. The problem is getting him to share it.

## Secret

He's been slowly encoding a warning into the Archive's cataloguing system. Anyone who reads the first letter of every shelf label in order will find a message about the Drowned God's awakening.`,
    },
  ],
  sessions: [
    {
      id: "ses-1",
      title: "Session 0 — The Hook",
      icon: "menu_book",
      content: `# Session 0 — The Hook

## Setup

Players arrive in Varenhold separately. Each has a reason to be here:
- A letter from an unknown benefactor promising payment
- A rumor of a job at The Gilded Corpse
- Fleeing something from their past

## Scene 1: The Gilded Corpse

Maren greets them. The inn is busy — a festival approaches (*The Night of Still Water*). She has a job: investigate why shipments from the Undertow have stopped arriving.

## Scene 2: The Undertow

Rope bridges, cramped tunnels, the sound of dripping water. The shipment workers have barricaded themselves in a warehouse. They say something came out of the water.

## Encounter

**3x Drowned Ones** (reflavored Zombies)
- HP: 22 | AC: 8
- Slow but relentless. Smell of brine and rot.
- On death, they whisper a word in Deep Speech.

## Clue

The whispered words, combined, form a name: *Thalassyr*.

## End Hook

Maren goes pale when she hears the name. "You need to leave. All of you. Now." — but she won't explain why. Not yet.`,
    },
  ],
  rules: [
    {
      id: "rule-1",
      title: "Combat Quick Ref",
      icon: "swords",
      content: `# Combat Quick Reference

## Action Economy

| Action | Examples |
|--------|----------|
| **Action** | Attack, Cast Spell, Dash, Dodge, Help, Hide, Disengage |
| **Bonus Action** | Off-hand attack, some spells, class features |
| **Reaction** | Opportunity attack, *Shield*, *Counterspell* |
| **Free** | Drop item, speak a few words |

## Conditions Cheat Sheet

- **Blinded** — Auto-fail sight checks, attacks have disadvantage, attacks against have advantage
- **Charmed** — Can't attack charmer, charmer has advantage on social checks
- **Frightened** — Disadvantage on checks/attacks while source is visible, can't move closer
- **Grappled** — Speed 0, ends if grappler incapacitated or effect moves target out of reach
- **Stunned** — Incapacitated + can't move + auto-fail STR/DEX saves + attacks have advantage
- **Prone** — Disadvantage on attacks, melee attacks against have advantage, ranged have disadvantage

## Cover

- **Half Cover** — +2 AC, +2 DEX saves
- **Three-quarters** — +5 AC, +5 DEX saves
- **Full** — Can't be targeted directly`,
    },
    {
      id: "rule-2",
      title: "Thalassyr's Grasp",
      icon: "auto_fix_high",
      content: `# Thalassyr's Grasp

*3rd-level evocation*

**Casting Time:** 1 action
**Range:** 60 feet
**Components:** V, S, M (a vial of seawater)
**Duration:** Concentration, up to 1 minute

---

A tendril of dark water erupts from the ground beneath a creature you can see within range. The target must make a **STR saving throw** or be **restrained** as the water coils around them.

**On each subsequent turn**, the restrained creature takes **2d8 cold damage** at the start of its turn and can repeat the saving throw to break free.

**At Higher Levels:** +1d8 damage per slot level above 3rd.

---

*Note: This is a homebrew spell connected to the Drowned God storyline. Only available to PCs who've interacted with the Ashenmere.*`,
    },
  ],
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

const ALL_ITEMS = Object.entries(SAMPLE).flatMap(([category, items]) =>
  items.map((item) => ({ ...item, category })),
);

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

export const INITIAL_CAMPAIGNS = [
  {
    id: "camp-1",
    name: "The Gilded Corpse",
    description:
      "A dark fantasy campaign set in Varenhold, where an ancient entity stirs beneath the Ashenmere.",
    color: "#9fd494",
    docs: ALL_ITEMS,
    categories: [...DEFAULT_CATEGORIES],
  },
];
