import React, { useState, useMemo } from "react";
import type { SrdSpell } from "../types/index.ts";
import spellsRaw from "../data/srd-spells.json";

const spellsData = spellsRaw as SrdSpell[];

const LEVEL_LABELS: string[] = ["Cantrip", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"];
const ALL_CLASSES: string[] = [...new Set(spellsData.flatMap(s => s.classes))].sort();

const SCHOOL_ICONS: Record<string, string> = {
  Abjuration: "shield",
  Conjuration: "auto_fix_high",
  Divination: "visibility",
  Enchantment: "favorite",
  Evocation: "bolt",
  Illusion: "blur_on",
  Necromancy: "skull",
  Transmutation: "swap_horiz",
};

interface SpellListProps {
  Icon: React.FC<{ name: string; size?: number; filled?: boolean; style?: React.CSSProperties }>;
  Ripple: React.FC<React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode; style?: React.CSSProperties; onClick?: React.MouseEventHandler<HTMLDivElement>; disabled?: boolean; className?: string }>;
  Chip: React.FC<{ label: string; selected?: boolean; onClick?: () => void; icon?: string }>;
  selectedSpellId: string | null;
  onSelectSpell: (id: string) => void;
}

export default function SpellList({ Icon, Ripple, Chip, selectedSpellId, onSelectSpell }: SpellListProps): React.ReactElement {
  const [search, setSearch] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  const [classFilter, setClassFilter] = useState<string | null>(null);

  const filtered = useMemo<SrdSpell[]>(() => {
    let list: SrdSpell[] = spellsData;
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
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
        {filtered.map((spell) => (
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
