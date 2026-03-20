import { useState, useMemo } from "react";
import spellsData from "../data/srd-spells.json";

const LEVEL_LABELS = ["Cantrip", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"];
const ALL_CLASSES = [...new Set(spellsData.flatMap(s => s.classes))].sort();

const SCHOOL_ICONS = {
  Abjuration: "shield",
  Conjuration: "auto_fix_high",
  Divination: "visibility",
  Enchantment: "favorite",
  Evocation: "bolt",
  Illusion: "blur_on",
  Necromancy: "skull",
  Transmutation: "swap_horiz",
};

export default function SpellList({ Icon, Ripple, Chip, selectedSpellId, onSelectSpell }) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState(null); // null = all
  const [classFilter, setClassFilter] = useState(null);

  const filtered = useMemo(() => {
    let list = spellsData;
    if (levelFilter !== null) list = list.filter(s => s.level === levelFilter);
    if (classFilter) list = list.filter(s => s.classes.includes(classFilter));
    const q = search.trim().toLowerCase();
    if (q) list = list.filter(s => s.name.toLowerCase().includes(q));
    return list;
  }, [search, levelFilter, classFilter]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "8px 12px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "0 12px", height: 40,
          background: "var(--dm-surface-bright)",
          borderRadius: 20, marginBottom: 8,
        }}>
          <Icon name="search" size={18} style={{ color: "var(--dm-text-muted)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search spells..."
            style={{
              border: "none", background: "none", outline: "none",
              color: "var(--dm-text)", fontSize: 13, width: "100%",
              fontFamily: "inherit",
            }}
          />
          {search && (
            <span onClick={() => setSearch("")} style={{ cursor: "pointer", display: "flex", color: "var(--dm-text-muted)" }}>
              <Icon name="close" size={16} />
            </span>
          )}
        </div>

        {/* Level filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
          <Chip label="All" selected={levelFilter === null} onClick={() => setLevelFilter(null)} />
          {LEVEL_LABELS.map((label, i) => (
            <Chip key={i} label={label} selected={levelFilter === i} onClick={() => setLevelFilter(levelFilter === i ? null : i)} />
          ))}
        </div>

        {/* Class filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
          {ALL_CLASSES.map(cls => (
            <Chip key={cls} label={cls} selected={classFilter === cls}
              onClick={() => setClassFilter(classFilter === cls ? null : cls)} />
          ))}
        </div>
      </div>

      <div style={{
        padding: "0 8px 4px 12px", fontSize: 11, color: "var(--dm-text-muted)",
      }}>
        {filtered.length} spell{filtered.length !== 1 ? "s" : ""}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "0 12px" }}>
        {filtered.map((spell, i) => (
          <Ripple
            key={spell.id}
            onClick={() => onSelectSpell(spell.id)}
            className="navitem"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 28, marginBottom: 1,
              background: selectedSpellId === spell.id ? "var(--dm-secondary-container)" : "transparent",
              color: selectedSpellId === spell.id ? "var(--dm-on-secondary-container)" : "var(--dm-text-secondary)",
            }}
          >
            <Icon name={SCHOOL_ICONS[spell.school] || "auto_fix_high"} size={18}
              filled={selectedSpellId === spell.id}
              style={{ flexShrink: 0, width: 18 }}
            />
            <span style={{
              fontSize: 13, flex: 1,
              fontWeight: selectedSpellId === spell.id ? 600 : 400,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{spell.name}</span>
            <span style={{
              fontSize: 11, color: "var(--dm-text-muted)", flexShrink: 0,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              {spell.concentration && <Icon name="all_inclusive" size={12} style={{ color: "var(--dm-tertiary)" }} />}
              {spell.level === 0 ? "C" : spell.level}
            </span>
          </Ripple>
        ))}
      </div>
    </div>
  );
}

export { spellsData, LEVEL_LABELS, SCHOOL_ICONS };
