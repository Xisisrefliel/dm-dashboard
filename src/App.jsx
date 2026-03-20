import { useState, useRef, useEffect, useMemo } from "react";

/* ================================================================
   DM DASHBOARD — Material Design 3 Dark Pastel Edition

   Faithful M3 implementation with dark theme + pastel olive/green:
   - Dynamic color tokens (dark mode pastel palette)
   - M3 elevation via surface tint
   - Large shape scale (generous rounded corners)
   - Navigation Drawer + Tabs + FAB + Chips + Cards
   - Ripple effect, state layers
   ================================================================ */

// ---- SAMPLE CAMPAIGN DATA ----
const SAMPLE = {
  locations: [
    {
      id: "loc-1", title: "Varenhold", icon: "castle",
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

> Fog rolls in from the Ashenmere every evening, thick enough to lose a horse in. Lanterns glow amber through the haze. Somewhere, always, someone is arguing about money.`
    },
    {
      id: "loc-2", title: "The Ashenmere", icon: "water",
      content: `# The Ashenmere

A vast inland sea of dark, still water. The surface reflects nothing — locals say it swallowed the sky centuries ago.

## Properties

The water is safe to drink but tastes faintly of iron. Fish pulled from its depths are pale, eyeless things. Boats that venture to the center rarely return the same day they left — time moves differently out there.

## Notable Features

- **The Drowned Pillars** — Stone columns rising from the water, remnants of a civilization predating Varenhold
- **Fog Bank** — A permanent wall of mist roughly 2 miles from shore
- **The Deep Light** — On moonless nights, a faint green glow pulses beneath the surface

## DM Notes

The Ashenmere is a weak point between planes. The Drowned God isn't a god at all — it's an entity trapped beneath the water. The pillars are its prison bars.`
    },
  ],
  npcs: [
    {
      id: "npc-1", title: "Maren Ashwick", icon: "person",
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

Maren was part of the party that accidentally weakened the Drowned God's prison 30 years ago. She's been watching the water ever since.`
    },
    {
      id: "npc-2", title: "Aldric Voss", icon: "person",
      content: `# Aldric Voss

**Role:** Curator of the Blackquill Archives | **Race:** Half-Elf | **Age:** 134

## Appearance

Impossibly thin, with ink-stained fingers and spectacles perched on a sharp nose. Wears robes so old they've become fashionable again. Smells of old paper and candle wax.

## Personality

Meticulous, paranoid, and deeply unhelpful unless you can offer him something he doesn't already know (which is rare). Speaks in footnotes — will correct your grammar mid-conversation.

## What He Knows

Literally everything about Varenhold's history. The problem is getting him to share it.

## Secret

He's been slowly encoding a warning into the Archive's cataloguing system. Anyone who reads the first letter of every shelf label in order will find a message about the Drowned God's awakening.`
    },
  ],
  sessions: [
    {
      id: "ses-1", title: "Session 0 — The Hook", icon: "menu_book",
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

Maren goes pale when she hears the name. "You need to leave. All of you. Now." — but she won't explain why. Not yet.`
    },
  ],
  rules: [
    {
      id: "rule-1", title: "Combat Quick Ref", icon: "swords",
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
- **Full** — Can't be targeted directly`
    },
    {
      id: "rule-2", title: "Thalassyr's Grasp", icon: "auto_fix_high",
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

*Note: This is a homebrew spell connected to the Drowned God storyline. Only available to PCs who've interacted with the Ashenmere.*`
    },
  ],
};

const ICON_OPTIONS = [
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

const DEFAULT_CATEGORIES = [
  { key: "locations", label: "Locations", icon: "explore" },
  { key: "npcs", label: "NPCs", icon: "groups" },
  { key: "sessions", label: "Sessions", icon: "auto_stories" },
  { key: "rules", label: "Rules & Spells", icon: "auto_fix_high" },
];

const ALL_ITEMS = Object.entries(SAMPLE).flatMap(([category, items]) =>
  items.map(item => ({ ...item, category }))
);

// ---- Utilities ----
const highlightMatch = (text, query) => {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{
        background: "var(--dm-primary)", color: "var(--dm-bg)",
        borderRadius: 3, padding: "0 2px",
      }}>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
};

// ---- Material Symbols Icon ----
const Icon = ({ name, size = 24, filled = false, style = {} }) => (
  <span
    className="material-symbols-outlined"
    style={{
      fontSize: size,
      fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      userSelect: "none",
      lineHeight: 1,
      ...style,
    }}
  >
    {name}
  </span>
);

// ---- M3 Ripple ----
const Ripple = ({ children, style = {}, onClick, disabled, className = "", ...props }) => {
  const ref = useRef(null);
  const handleClick = (e) => {
    if (disabled) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height) * 2;
    Object.assign(ripple.style, {
      position: "absolute",
      left: `${x - size / 2}px`,
      top: `${y - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: "var(--dm-primary)",
      opacity: "0.10",
      transform: "scale(0)",
      animation: "m3ripple 0.5s ease-out forwards",
      pointerEvents: "none",
    });
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
    onClick?.(e);
  };
  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={className}
      style={{
        position: "relative", overflow: "hidden",
        cursor: disabled ? "default" : "pointer",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// ---- M3 Chip ----
const Chip = ({ label, selected, onClick, icon }) => (
  <Ripple
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 16px",
      borderRadius: 8,
      border: selected ? "1px solid transparent" : "1px solid var(--dm-outline-variant)",
      background: selected ? "var(--dm-secondary-container)" : "transparent",
      color: selected ? "var(--dm-on-secondary-container)" : "var(--dm-text-secondary)",
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: 0.1,
      transition: "background 0.2s, color 0.2s, border-color 0.2s",
      whiteSpace: "nowrap",
    }}
  >
    {icon && <Icon name={icon} size={18} filled={selected} style={{ width: 18 }} />}
    {label}
  </Ripple>
);

// ---- Markdown Renderer ----
function renderMarkdown(md) {
  if (!md) return "";
  const lines = md.split("\n");
  let html = "";
  let inTable = false, inBq = false, inList = false;

  const fmt = (s) =>
    s.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="m3code">$1</code>')
      .replace(/\[\[(.*?)\]\]/g, '<span class="m3link">$1</span>');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("|")) {
      if (!inTable) { html += '<table class="m3table">'; inTable = true; }
      if (line.match(/^\|[\s-:|]+\|$/)) continue;
      const cells = line.split("|").filter(c => c.trim());
      const tag = html.includes("</tr>") ? "td" : "th";
      html += "<tr>" + cells.map(c => `<${tag}>${fmt(c.trim())}</${tag}>`).join("") + "</tr>";
      continue;
    } else if (inTable) { html += "</table>"; inTable = false; }

    if (line.startsWith("> ")) {
      if (!inBq) { html += '<blockquote class="m3bq">'; inBq = true; }
      html += fmt(line.slice(2)) + "<br/>"; continue;
    } else if (inBq) { html += "</blockquote>"; inBq = false; }

    if (line.match(/^- /)) {
      if (!inList) { html += '<ul class="m3list">'; inList = true; }
      html += `<li>${fmt(line.slice(2))}</li>`; continue;
    } else if (inList) { html += "</ul>"; inList = false; }

    if (line.match(/^---+$/)) { html += '<hr class="m3hr"/>'; continue; }
    if (line.startsWith("### ")) html += `<h3 class="m3h3">${fmt(line.slice(4))}</h3>`;
    else if (line.startsWith("## ")) html += `<h2 class="m3h2">${fmt(line.slice(3))}</h2>`;
    else if (line.startsWith("# ")) html += `<h1 class="m3h1">${fmt(line.slice(2))}</h1>`;
    else if (line.trim() === "") html += '<div style="height:8px"></div>';
    else html += `<p class="m3body">${fmt(line)}</p>`;
  }
  if (inTable) html += "</table>";
  if (inBq) html += "</blockquote>";
  if (inList) html += "</ul>";
  return html;
}

// ---- Dice Roller ----
function DiceRoller() {
  const [result, setResult] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState([]);
  const dice = [4, 6, 8, 10, 12, 20, 100];

  const roll = (sides) => {
    setRolling(true);
    setTimeout(() => {
      const val = Math.floor(Math.random() * sides) + 1;
      const entry = { sides, val, id: Date.now() };
      setResult(entry);
      setHistory(h => [entry, ...h].slice(0, 12));
      setRolling(false);
    }, 350);
  };

  const isCrit = result && result.sides === 20 && result.val === 20;
  const isFumble = result && result.sides === 20 && result.val === 1;
  const isMax = result && result.val === result.sides && result.sides !== 20;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {dice.map(d => (
          <Ripple
            key={d}
            onClick={() => roll(d)}
            style={{
              minWidth: 48, height: 48,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 12,
              background: "var(--dm-surface-bright)",
              color: "var(--dm-text)",
              fontWeight: 600, fontSize: 14,
              transition: "all 0.2s",
            }}
          >
            d{d}
          </Ripple>
        ))}
      </div>

      {result && (
        <div
          key={result.id}
          style={{
            textAlign: "center", padding: 20,
            background: isCrit ? "var(--dm-primary-container)" : isFumble ? "var(--dm-error-container)" : "var(--dm-surface)",
            borderRadius: 16, marginBottom: 12,
            animation: rolling ? "none" : isFumble ? "fumbleShake 0.5s ease" : "m3pop 0.3s cubic-bezier(0.2, 0, 0, 1)",
          }}
        >
          <div style={{
            fontSize: 48, fontWeight: 700,
            color: isCrit ? "var(--dm-primary-light)" : isFumble ? "var(--dm-error)" : isMax ? "var(--dm-tertiary)" : "var(--dm-text)",
            fontFamily: "'Inter', sans-serif",
            animation: isCrit ? "critGlow 1.5s ease infinite" : "none",
          }}>
            {result.val}
          </div>
          <div style={{ fontSize: 14, color: "var(--dm-text-secondary)", marginTop: 4 }}>
            d{result.sides}
            {isCrit && <span style={{ color: "var(--dm-primary)", marginLeft: 8, fontWeight: 600 }}>CRITICAL HIT!</span>}
            {isFumble && <span style={{ color: "var(--dm-error)", marginLeft: 8, fontWeight: 600 }}>Critical Fail</span>}
            {isMax && <span style={{ color: "var(--dm-tertiary)", marginLeft: 8, fontWeight: 600 }}>Maximum!</span>}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {history.map((h, i) => (
            <span key={h.id} style={{
              fontSize: 12, padding: "3px 8px", borderRadius: 8,
              background: "var(--dm-surface-bright)",
              color: h.val === h.sides ? "var(--dm-primary)" : h.val === 1 ? "var(--dm-error)" : "var(--dm-text-secondary)",
              opacity: Math.max(0.4, 1 - i * 0.06),
            }}>
              d{h.sides}{"\u2192"}{h.val}
            </span>
          ))}
        </div>
      )}

      {!result && (
        <div style={{ padding: 20, textAlign: "center", color: "var(--dm-text-muted)", fontSize: 14 }}>
          <Icon name="casino" size={40} style={{ opacity: 0.2, display: "block", margin: "0 auto 12px" }} />
          Roll the dice
        </div>
      )}
    </div>
  );
}

// ---- Initiative Tracker ----
function InitTracker() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [init, setInit] = useState("");
  const [hp, setHp] = useState("");
  const [active, setActive] = useState(-1);

  const add = () => {
    if (!name.trim()) return;
    setEntries(e =>
      [...e, { name: name.trim(), init: parseInt(init) || 0, hp: hp ? parseInt(hp) : null, id: Date.now() }]
        .sort((a, b) => b.init - a.init)
    );
    setName(""); setInit(""); setHp("");
  };

  const updateHp = (id, delta) => {
    setEntries(e => e.map(x =>
      x.id === id ? { ...x, hp: Math.max(0, (x.hp ?? 0) + delta) } : x
    ));
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        <input placeholder="Character name" value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()}
          className="m3input" style={{ width: "100%" }} />
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="Initiative" type="number" value={init} onChange={e => setInit(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            className="m3input" style={{ flex: 1, minWidth: 0, textAlign: "center" }} />
          <input placeholder="HP" type="number" value={hp} onChange={e => setHp(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            className="m3input" style={{ flex: 1, minWidth: 0, textAlign: "center" }} />
          <Ripple onClick={add} style={{
            width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
            background: "var(--dm-primary)", color: "var(--dm-on-primary)",
            flexShrink: 0,
          }}>
            <Icon name="add" size={20} />
          </Ripple>
        </div>
      </div>

      {entries.map((e, i) => (
        <Ripple key={e.id} onClick={() => {}} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 12px", borderRadius: 12, marginBottom: 4,
          background: i === active ? "var(--dm-secondary-container)" : "transparent",
          transition: "all 0.2s",
        }}>
          <span style={{
            width: 32, height: 32, borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: i === active ? "var(--dm-primary)" : "var(--dm-primary-container)",
            color: i === active ? "var(--dm-on-primary)" : "var(--dm-primary-light)",
            fontWeight: 600, fontSize: 14, flexShrink: 0,
          }}>{e.init}</span>
          <span style={{
            flex: 1, fontWeight: i === active ? 600 : 400, fontSize: 14,
            color: "var(--dm-text)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {i === active && "\u25B8 "}{e.name}
          </span>
          {e.hp !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <span onClick={(ev) => { ev.stopPropagation(); updateHp(e.id, -1); }} style={{
                cursor: "pointer", width: 24, height: 24, borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: "var(--dm-error)", fontWeight: 700,
              }}>{"\u2212"}</span>
              <span style={{
                fontSize: 13, fontWeight: 600, minWidth: 28, textAlign: "center",
                color: e.hp === 0 ? "var(--dm-error)" : "var(--dm-text-secondary)",
              }}>{e.hp}</span>
              <span onClick={(ev) => { ev.stopPropagation(); updateHp(e.id, 1); }} style={{
                cursor: "pointer", width: 24, height: 24, borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: "var(--dm-tertiary)", fontWeight: 700,
              }}>+</span>
            </div>
          )}
          <Ripple onClick={(ev) => { ev.stopPropagation(); setEntries(x => x.filter(z => z.id !== e.id)); }}
            style={{ width: 32, height: 32, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="close" size={16} style={{ color: "var(--dm-text-secondary)" }} />
          </Ripple>
        </Ripple>
      ))}

      {entries.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Ripple onClick={() => setActive(a => entries.length ? (a + 1) % entries.length : -1)} style={{
            flex: 1, padding: "10px 0", borderRadius: 20,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "var(--dm-surface-bright)",
            color: "var(--dm-text)", fontWeight: 500, fontSize: 14,
          }}>
            <Icon name="skip_next" size={20} /> Next Turn
          </Ripple>
          <Ripple onClick={() => { setEntries([]); setActive(-1); }} style={{
            padding: "10px 16px", borderRadius: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "var(--dm-surface-bright)",
            color: "var(--dm-text-secondary)",
          }}>
            <Icon name="delete_sweep" size={20} />
          </Ripple>
        </div>
      )}

      {entries.length === 0 && (
        <div style={{ padding: 24, textAlign: "center", color: "var(--dm-text-secondary)" }}>
          <Icon name="swords" size={40} style={{ opacity: 0.2, display: "block", margin: "0 auto 12px" }} />
          <div style={{ fontSize: 14, marginBottom: 4 }}>No combatants</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Add characters to track initiative</div>
        </div>
      )}
    </div>
  );
}

// ---- Context Menu ----
function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: "fixed", left: x, top: y, zIndex: 200,
      background: "var(--dm-surface-brighter)",
      borderRadius: 12, padding: "6px 0",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
      border: "1px solid var(--dm-outline-variant)",
      minWidth: 180,
      animation: "m3pop 0.12s cubic-bezier(0.2,0,0,1)",
    }}>
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} style={{ height: 1, background: "var(--dm-outline-variant)", margin: "4px 0" }} />
        ) : (
          <Ripple key={i} onClick={() => { item.action(); onClose(); }} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 16px",
            color: item.danger ? "var(--dm-error)" : "var(--dm-text)",
            fontSize: 14,
          }}>
            <Icon name={item.icon} size={18} style={{ color: item.danger ? "var(--dm-error)" : "var(--dm-text-secondary)" }} />
            {item.label}
          </Ripple>
        )
      )}
    </div>
  );
}

// ---- Pinned Panel ----
function PinnedPanel({ pinned, onRemove, onSelect }) {
  if (!pinned.length) return (
    <div style={{ padding: 24, textAlign: "center", color: "var(--dm-text-secondary)" }}>
      <Icon name="push_pin" size={40} style={{ opacity: 0.2, display: "block", margin: "0 auto 12px" }} />
      <div style={{ fontSize: 14, marginBottom: 4 }}>No pinned items</div>
      <div style={{ fontSize: 12, opacity: 0.7 }}>Pin documents for quick reference during sessions</div>
    </div>
  );

  return (
    <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>
      {pinned.map(item => (
        <div key={item.id} style={{
          background: "var(--dm-surface)",
          borderRadius: 12, overflow: "hidden",
        }}>
          <Ripple onClick={() => onSelect(item)} style={{
            padding: "12px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontWeight: 500, fontSize: 14, color: "var(--dm-text)", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name={item.icon} size={16} style={{ color: "var(--dm-primary-dim)" }} />
              {item.title}
            </span>
            <span onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
              style={{ padding: 4, cursor: "pointer", color: "var(--dm-text-secondary)", display: "flex" }}>
              <Icon name="close" size={16} />
            </span>
          </Ripple>
        </div>
      ))}
    </div>
  );
}


// ============ MAIN APP ============
export default function DMDashboard() {
  const [docs, setDocs] = useState(ALL_ITEMS);
  const [cat, setCat] = useState("locations");
  const [doc, setDoc] = useState(ALL_ITEMS[0]);
  const [pinned, setPinned] = useState([]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [rightTab, setRightTab] = useState("dice");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteTitle, setPasteTitle] = useState("");
  const [pasteIcon, setPasteIcon] = useState("description");
  const [pasteContent, setPasteContent] = useState("");
  const searchRef = useRef(null);

  // Context menu
  const [ctxMenu, setCtxMenu] = useState(null); // { x, y, item }

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  // Rename (docs)
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const renameRef = useRef(null);

  // Categories (mutable)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [renamingCat, setRenamingCat] = useState(null);
  const [renameCatValue, setRenameCatValue] = useState("");
  const renameCatRef = useRef(null);

  const catItems = useMemo(() => docs.filter(d => d.category === cat), [docs, cat]);
  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return docs.filter(d =>
      d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q)
    );
  }, [docs, search]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        if (searchOpen) { setSearchOpen(false); setSearch(""); searchRef.current?.blur(); }
        if (ctxMenu) setCtxMenu(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen, ctxMenu]);

  // Focus rename input when it appears
  useEffect(() => {
    if (renamingId && renameRef.current) renameRef.current.focus();
  }, [renamingId]);

  useEffect(() => {
    if (renamingCat && renameCatRef.current) { renameCatRef.current.focus(); renameCatRef.current.select(); }
  }, [renamingCat]);

  const startRenameCat = (c) => {
    setRenamingCat(c.key);
    setRenameCatValue(c.label);
  };

  const commitRenameCat = () => {
    if (renamingCat && renameCatValue.trim()) {
      setCategories(cats => cats.map(c => c.key === renamingCat ? { ...c, label: renameCatValue.trim() } : c));
    }
    setRenamingCat(null);
    setRenameCatValue("");
  };

  const togglePin = (item) =>
    setPinned(p => p.find(x => x.id === item.id) ? p.filter(x => x.id !== item.id) : [...p, item]);
  const isPinned = (id) => pinned.some(x => x.id === id);

  const selectDoc = (item) => {
    setDoc(item);
    setCat(item.category);
    setPasteMode(false);
    setEditing(false);
  };

  const updateDoc = (id, updates) => {
    setDocs(d => d.map(x => x.id === id ? { ...x, ...updates } : x));
    if (doc?.id === id) setDoc(prev => ({ ...prev, ...updates }));
    setPinned(p => p.map(x => x.id === id ? { ...x, ...updates } : x));
  };

  const deleteDoc = (id) => {
    setDocs(d => d.filter(x => x.id !== id));
    setPinned(p => p.filter(x => x.id !== id));
    if (doc?.id === id) setDoc(null);
  };

  const startRename = (item) => {
    setRenamingId(item.id);
    setRenameValue(item.title);
  };

  const commitRename = () => {
    if (renamingId && renameValue.trim()) {
      updateDoc(renamingId, { title: renameValue.trim() });
    }
    setRenamingId(null);
    setRenameValue("");
  };

  const startEdit = () => {
    if (!doc) return;
    setEditContent(doc.content);
    setEditing(true);
  };

  const saveEdit = () => {
    if (doc) updateDoc(doc.id, { content: editContent });
    setEditing(false);
  };

  const addDoc = () => {
    if (!pasteTitle.trim() || !pasteContent.trim()) return;
    const d = {
      id: "c-" + Date.now(), title: pasteTitle.trim(),
      category: cat, icon: pasteIcon, content: pasteContent,
    };
    setDocs(x => [...x, d]);
    setDoc(d);
    setPasteMode(false);
    setPasteTitle("");
    setPasteIcon("description");
    setPasteContent("");
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, item });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        @keyframes m3ripple { to { transform: scale(1); opacity: 0; } }
        @keyframes m3pop { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes m3slideIn { from { transform: translateX(-16px); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes critGlow {
          0%, 100% { text-shadow: 0 0 12px rgba(186, 240, 174, 0.3); }
          50% { text-shadow: 0 0 28px rgba(186, 240, 174, 0.6), 0 0 60px rgba(159, 212, 148, 0.3); }
        }
        @keyframes fumbleShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px) rotate(-2deg); }
          30% { transform: translateX(6px) rotate(2deg); }
          45% { transform: translateX(-4px) rotate(-1deg); }
          60% { transform: translateX(4px) rotate(1deg); }
          75% { transform: translateX(-2px); }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { background: #111611; }

        .m3h1 { font-size: 24px; font-weight: 600; color: var(--dm-text); margin: 0 0 16px; letter-spacing: -0.02em; line-height: 1.3; }
        .m3h2 { font-size: 18px; font-weight: 600; color: var(--dm-text); margin: 28px 0 10px; letter-spacing: -0.01em; line-height: 1.3; }
        .m3h3 { font-size: 15px; font-weight: 600; color: var(--dm-text); margin: 20px 0 8px; line-height: 1.3; }
        .m3body { font-size: 14px; line-height: 1.7; color: var(--dm-text-secondary); margin: 4px 0; }
        .m3code { background: var(--dm-surface-bright); padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: 'SF Mono', 'Cascadia Code', monospace; color: var(--dm-primary); }
        .m3link { color: var(--dm-primary); cursor: pointer; font-weight: 500; }
        .m3hr { border: none; border-top: 1px solid var(--dm-outline-variant); margin: 16px 0; }
        .m3bq { border-left: 3px solid var(--dm-primary); padding: 10px 16px; margin: 12px 0; background: var(--dm-primary-container); border-radius: 0 12px 12px 0; font-style: italic; color: var(--dm-text-secondary); font-size: 14px; line-height: 1.6; }
        .m3list { padding-left: 20px; margin: 8px 0; }
        .m3list li { font-size: 14px; line-height: 1.7; color: var(--dm-text-secondary); margin: 4px 0; }
        .m3list li::marker { color: var(--dm-primary-dim); }
        .m3table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
        .m3table th { text-align: left; padding: 8px 12px; font-weight: 600; color: var(--dm-text); border-bottom: 2px solid var(--dm-outline-variant); }
        .m3table td { padding: 8px 12px; border-bottom: 1px solid var(--dm-surface-bright); color: var(--dm-text-secondary); }
        .m3table tr:hover td { background: rgba(255,255,255,0.03); }
        .m3input { padding: 10px 12px; border: 1px solid var(--dm-outline-variant); border-radius: 12px; background: transparent; color: var(--dm-text); font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .m3input:focus { border-color: var(--dm-primary); border-width: 2px; padding: 9px 11px; box-shadow: 0 0 0 2px rgba(159, 212, 148, 0.1); }
        .m3input::placeholder { color: var(--dm-text-muted); }

        .navitem { transition: all 0.2s cubic-bezier(0.2, 0, 0, 1); }
        .navitem:hover { background: var(--dm-surface-bright) !important; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--dm-outline-variant); border-radius: 3px; }
        ::selection { background: rgba(159, 212, 148, 0.25); }
      `}</style>

      <div style={{
        /* -- M3 Dark Pastel Color Tokens (olive/green tint) -- */
        "--dm-bg": "#111611",
        "--dm-surface": "#1e251e",
        "--dm-surface-bright": "#2a322a",
        "--dm-surface-brighter": "#363e35",
        "--dm-surface-lowest": "#0d110c",
        "--dm-text": "#e2e3dc",
        "--dm-text-secondary": "#c2c9bb",
        "--dm-text-muted": "#8c9386",
        "--dm-primary": "#9fd494",
        "--dm-primary-light": "#baf0ae",
        "--dm-primary-dim": "#5a8a50",
        "--dm-primary-container": "#1f3a1a",
        "--dm-on-primary": "#0a3806",
        "--dm-on-primary-container": "#baf0ae",
        "--dm-secondary-container": "#3c4c38",
        "--dm-on-secondary-container": "#d5e8cc",
        "--dm-tertiary": "#a0cfcc",
        "--dm-tertiary-container": "#1e4e4b",
        "--dm-error": "#ffb4ab",
        "--dm-error-container": "#3a1510",
        "--dm-outline": "#8c9386",
        "--dm-outline-variant": "#424940",

        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--dm-bg)",
        color: "var(--dm-text)",
        overflow: "hidden",
      }}>

        {/* ====== TOP APP BAR ====== */}
        <div style={{
          height: 64, minHeight: 64,
          display: "flex", alignItems: "center",
          padding: "0 16px", gap: 8,
          background: "var(--dm-bg)",
          zIndex: 10,
        }}>
          <Ripple onClick={() => setDrawerOpen(d => !d)} style={{
            width: 48, height: 48, borderRadius: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name={drawerOpen ? "menu_open" : "menu"} />
          </Ripple>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <Icon name="shield_with_house" size={28} filled style={{ color: "var(--dm-primary)" }} />
            <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.3 }}>DM Dashboard</span>
            <span style={{ fontSize: 13, color: "var(--dm-text-secondary)", marginLeft: 4, fontWeight: 400 }}>
              The Gilded Corpse
            </span>
          </div>

          {/* M3 Search Bar */}
          <div style={{ position: "relative" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "0 16px", height: 48,
              background: "var(--dm-surface-bright)",
              borderRadius: 28,
              width: 320, transition: "all 0.3s",
            }}>
              <Icon name="search" size={20} style={{ color: "var(--dm-text-secondary)" }} />
              <input
                ref={searchRef}
                value={search}
                onChange={e => { setSearch(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                placeholder="Search your campaign..."
                style={{
                  border: "none", background: "none", outline: "none",
                  color: "var(--dm-text)", fontSize: 14, width: "100%",
                  fontFamily: "inherit",
                }}
              />
              {search ? (
                <span onClick={() => { setSearch(""); setSearchOpen(false); }}
                  style={{ cursor: "pointer", color: "var(--dm-text-secondary)", display: "flex" }}>
                  <Icon name="close" size={18} />
                </span>
              ) : (
                <kbd style={{
                  fontSize: 11, padding: "2px 6px", borderRadius: 4,
                  background: "var(--dm-surface)", border: "1px solid var(--dm-outline-variant)",
                  color: "var(--dm-text-muted)", fontFamily: "inherit", fontWeight: 500,
                }}>{"\u2318"}K</kbd>
              )}
            </div>
            {searchOpen && results.length > 0 && (
              <div style={{
                position: "absolute", top: 56, right: 0, width: 360,
                background: "var(--dm-surface-brighter)",
                borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                maxHeight: 400, overflow: "auto", zIndex: 100,
                animation: "m3pop 0.2s cubic-bezier(0.2,0,0,1)",
              }}>
                {results.map((item, i) => (
                  <Ripple key={item.id} onClick={() => {
                    selectDoc(item);
                    setSearchOpen(false);
                    setSearch("");
                  }} style={{
                    padding: "14px 18px",
                    display: "flex", alignItems: "center", gap: 12,
                    borderBottom: i < results.length - 1 ? "1px solid var(--dm-outline-variant)" : "none",
                  }}>
                    <Icon name={item.icon} size={20} style={{ color: "var(--dm-text-secondary)" }} />
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{highlightMatch(item.title, search)}</div>
                      <div style={{ fontSize: 12, color: "var(--dm-text-secondary)" }}>
                        {categories.find(c => c.key === item.category)?.label}
                      </div>
                    </div>
                  </Ripple>
                ))}
              </div>
            )}
          </div>

          <Ripple onClick={() => setRightOpen(r => !r)} style={{
            width: 48, height: 48, borderRadius: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name={rightOpen ? "right_panel_close" : "right_panel_open"} />
          </Ripple>
        </div>

        {/* ====== MAIN BODY ====== */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* ====== NAVIGATION DRAWER ====== */}
          <div style={{
            width: drawerOpen ? 280 : 0, minWidth: drawerOpen ? 280 : 0,
            transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
            overflow: "hidden",
            display: "flex", flexDirection: "column",
            background: "var(--dm-bg)",
          }}>
            <div style={{ padding: "0 12px", overflow: "hidden" }}>
              <div style={{ padding: "8px 4px 12px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                {categories.map(c => (
                  renamingCat === c.key ? (
                    <input
                      key={c.key}
                      ref={renameCatRef}
                      value={renameCatValue}
                      onChange={e => setRenameCatValue(e.target.value)}
                      onBlur={commitRenameCat}
                      onKeyDown={e => { if (e.key === "Enter") commitRenameCat(); if (e.key === "Escape") setRenamingCat(null); }}
                      className="m3input"
                      style={{
                        width: 120, fontSize: 14, padding: "5px 12px",
                        borderRadius: 8,
                      }}
                    />
                  ) : (
                    <div key={c.key} onContextMenu={(e) => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, catItem: c }); }}>
                      <Chip label={c.label} icon={c.icon}
                        selected={cat === c.key || ctxMenu?.catItem?.key === c.key}
                        onClick={() => { setCat(c.key); setPasteMode(false); }} />
                    </div>
                  )
                ))}
              </div>
            </div>

            <div style={{ flex: 1, overflow: "auto", padding: "0 12px" }}>
              {catItems.map((item, i) => (
                <Ripple key={item.id}
                  onClick={() => { if (renamingId !== item.id) { setDoc(item); setPasteMode(false); setEditing(false); } }}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                  className="navitem"
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", borderRadius: 28, marginBottom: 2,
                    background: (doc?.id === item.id || ctxMenu?.item?.id === item.id) ? "var(--dm-secondary-container)" : "transparent",
                    color: (doc?.id === item.id || ctxMenu?.item?.id === item.id) ? "var(--dm-on-secondary-container)" : "var(--dm-text-secondary)",
                    animation: `m3slideIn 0.25s cubic-bezier(0.2,0,0,1) ${i * 0.04}s both`,
                  }}>
                  <Icon name={item.icon} size={20} filled={doc?.id === item.id || ctxMenu?.item?.id === item.id} />
                  {renamingId === item.id ? (
                    <input
                      ref={renameRef}
                      value={renameValue}
                      onChange={e => setRenameValue(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={e => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") { setRenamingId(null); } }}
                      onClick={e => e.stopPropagation()}
                      className="m3input"
                      style={{
                        flex: 1, fontSize: 14, padding: "4px 8px",
                        minWidth: 0,
                      }}
                    />
                  ) : (
                    <span style={{
                      fontSize: 14, fontWeight: doc?.id === item.id ? 600 : 400,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{item.title}</span>
                  )}
                </Ripple>
              ))}

              <Ripple onClick={() => setPasteMode(true)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", borderRadius: 28, marginTop: 4,
                color: "var(--dm-text-secondary)",
              }}>
                <Icon name="add" size={20} />
                <span style={{ fontSize: 14 }}>Add document</span>
              </Ripple>
            </div>
          </div>

          {/* ====== MAIN CONTENT (elevated card) ====== */}
          <div style={{
            flex: 1,
            background: "var(--dm-surface)",
            borderRadius: "28px 28px 0 0",
            overflow: "hidden",
            display: "flex", flexDirection: "column",
          }}>
          <div style={{ flex: 1, overflow: "auto" }}>
            {pasteMode ? (
              <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 40px", animation: "m3pop 0.3s ease" }}>
                <h2 className="m3h1">
                  <Icon name="note_add" size={28} style={{ verticalAlign: -6, marginRight: 10, color: "var(--dm-primary)" }} />
                  Add New Document
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <input placeholder="Document title" value={pasteTitle}
                    onChange={e => setPasteTitle(e.target.value)}
                    className="m3input" style={{ fontSize: 16 }} />

                  {/* Icon Picker */}
                  <div>
                    <div style={{
                      fontSize: 12, fontWeight: 500, color: "var(--dm-text-secondary)",
                      marginBottom: 8, letterSpacing: 0.3,
                    }}>Icon</div>
                    <div style={{
                      display: "flex", flexWrap: "wrap", gap: 6,
                      padding: 12, borderRadius: 16,
                      background: "var(--dm-bg)",
                      border: "1px solid var(--dm-outline-variant)",
                    }}>
                      {ICON_OPTIONS.map(opt => (
                        <Ripple
                          key={opt.name + opt.label}
                          onClick={() => setPasteIcon(opt.name)}
                          style={{
                            width: 40, height: 40, borderRadius: 12,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: pasteIcon === opt.name ? "var(--dm-secondary-container)" : "transparent",
                            color: pasteIcon === opt.name ? "var(--dm-on-secondary-container)" : "var(--dm-text-muted)",
                            transition: "all 0.15s ease",
                          }}
                          title={opt.label}
                        >
                          <Icon name={opt.name} size={20} filled={pasteIcon === opt.name} />
                        </Ripple>
                      ))}
                    </div>
                  </div>

                  <textarea placeholder="Paste your markdown here..."
                    value={pasteContent} onChange={e => setPasteContent(e.target.value)}
                    className="m3input" style={{
                      height: 320, resize: "vertical",
                      fontFamily: "'SF Mono', 'Cascadia Code', monospace",
                      fontSize: 13, lineHeight: 1.6,
                    }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <Ripple onClick={addDoc} style={{
                      padding: "10px 24px", borderRadius: 20,
                      background: "var(--dm-primary)",
                      color: "var(--dm-on-primary)",
                      fontWeight: 500, fontSize: 14,
                    }}>Add to {categories.find(c => c.key === cat)?.label}</Ripple>
                    <Ripple onClick={() => setPasteMode(false)} style={{
                      padding: "10px 24px", borderRadius: 20,
                      border: "1px solid var(--dm-outline)",
                      color: "var(--dm-primary)",
                      fontWeight: 500, fontSize: 14,
                    }}>Cancel</Ripple>
                  </div>
                </div>
              </div>
            ) : doc ? (
              <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 48px", animation: "m3pop 0.25s ease" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.8,
                      color: "var(--dm-on-secondary-container)",
                      background: "var(--dm-secondary-container)",
                      padding: "3px 10px", borderRadius: 8,
                    }}>{categories.find(c => c.key === doc.category)?.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Ripple onClick={editing ? saveEdit : startEdit} style={{
                      width: 40, height: 40, borderRadius: 20,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name={editing ? "check" : "edit"} size={20}
                        style={{ color: editing ? "var(--dm-primary)" : "var(--dm-text-secondary)" }} />
                    </Ripple>
                    <Ripple onClick={() => togglePin(doc)} style={{
                      width: 40, height: 40, borderRadius: 20,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name="push_pin" size={20} filled={isPinned(doc.id)}
                        style={{ color: isPinned(doc.id) ? "var(--dm-primary)" : "var(--dm-text-secondary)" }} />
                    </Ripple>
                  </div>
                </div>
                {editing ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="m3input"
                      style={{
                        width: "100%", minHeight: 400, resize: "vertical",
                        fontFamily: "'SF Mono', 'Cascadia Code', monospace",
                        fontSize: 13, lineHeight: 1.6,
                      }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <Ripple onClick={saveEdit} style={{
                        padding: "10px 24px", borderRadius: 20,
                        background: "var(--dm-primary)", color: "var(--dm-on-primary)",
                        fontWeight: 500, fontSize: 14,
                      }}>Save</Ripple>
                      <Ripple onClick={() => setEditing(false)} style={{
                        padding: "10px 24px", borderRadius: 20,
                        border: "1px solid var(--dm-outline)",
                        color: "var(--dm-primary)", fontWeight: 500, fontSize: 14,
                      }}>Cancel</Ripple>
                    </div>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.content) }} />
                )}
              </div>
            ) : (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center", height: "100%",
                color: "var(--dm-text-secondary)",
              }}>
                <div style={{ textAlign: "center" }}>
                  <Icon name="shield_with_house" size={48} style={{ opacity: 0.2, display: "block", margin: "0 auto 12px" }} />
                  <div style={{ fontSize: 14 }}>Select a document to begin</div>
                  <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginTop: 6 }}>Or press {"\u2318"}K to search</div>
                </div>
              </div>
            )}
          </div>
          </div>

          {/* ====== RIGHT PANEL (Tools) ====== */}
          {rightOpen && (
            <div style={{
              width: 300, minWidth: 300,
              background: "var(--dm-bg)",
              display: "flex", flexDirection: "column",
              animation: "m3pop 0.2s ease",
            }}>
              <div style={{
                display: "flex", height: 48,
                borderBottom: "1px solid var(--dm-outline-variant)",
              }}>
                {[
                  { key: "pinned", label: "Pinned", icon: "push_pin" },
                  { key: "dice", label: "Dice", icon: "casino" },
                  { key: "init", label: "Initiative", icon: "swords" },
                ].map(tab => (
                  <Ripple key={tab.key} onClick={() => setRightTab(tab.key)} style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 0,
                    borderBottom: rightTab === tab.key ? `3px solid var(--dm-primary)` : "3px solid transparent",
                    color: rightTab === tab.key ? "var(--dm-primary)" : "var(--dm-text-secondary)",
                    transition: "all 0.2s",
                  }}>
                    <Icon name={tab.icon} size={18} filled={rightTab === tab.key} />
                    <span style={{ fontSize: 11, fontWeight: 500, marginTop: 2 }}>{tab.label}</span>
                  </Ripple>
                ))}
              </div>

              <div style={{ flex: 1, overflow: "auto" }}>
                {rightTab === "pinned" && (
                  <PinnedPanel pinned={pinned}
                    onRemove={(id) => setPinned(p => p.filter(x => x.id !== id))}
                    onSelect={selectDoc} />
                )}
                {rightTab === "dice" && <DiceRoller />}
                {rightTab === "init" && <InitTracker />}
              </div>
            </div>
          )}
        </div>

        {/* ====== FAB ====== */}
        <Ripple onClick={() => setPasteMode(true)} style={{
          position: "fixed", bottom: 24, right: rightOpen ? 324 : 24,
          width: 56, height: 56, borderRadius: 16,
          background: "var(--dm-primary-container)",
          color: "var(--dm-on-primary-container)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 3px 12px rgba(0,0,0,0.25), 0 1px 4px rgba(0,0,0,0.15)",
          transition: "right 0.3s cubic-bezier(0.2,0,0,1)",
          zIndex: 20,
        }}>
          <Icon name="note_add" size={24} />
        </Ripple>

        {/* ====== CONTEXT MENU ====== */}
        {ctxMenu && (
          <ContextMenu
            x={ctxMenu.x}
            y={ctxMenu.y}
            onClose={() => setCtxMenu(null)}
            items={ctxMenu.catItem ? [
              { icon: "edit", label: "Rename category", action: () => startRenameCat(ctxMenu.catItem) },
            ] : [
              { icon: "edit", label: "Rename", action: () => startRename(ctxMenu.item) },
              { icon: "edit_note", label: "Edit content", action: () => { selectDoc(ctxMenu.item); startEdit(); setEditContent(ctxMenu.item.content); setEditing(true); } },
              {
                icon: "push_pin", label: isPinned(ctxMenu.item.id) ? "Unpin" : "Pin",
                action: () => togglePin(ctxMenu.item),
              },
              { divider: true },
              { icon: "delete", label: "Delete", danger: true, action: () => deleteDoc(ctxMenu.item.id) },
            ]}
          />
        )}
      </div>
    </>
  );
}
