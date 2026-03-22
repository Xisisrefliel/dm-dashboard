import React, { useState, useMemo } from "react";
import type { SrdMonster } from "../types/index.ts";
import monstersRaw from "../data/srd-monsters.json";

const monstersData = monstersRaw as unknown as SrdMonster[];

interface CrRange {
  label: string;
  min: number;
  max: number;
}

const CR_RANGES: CrRange[] = [
  { label: "CR 0\u2013\u00BC", min: 0, max: 0.25 },
  { label: "CR \u00BD\u20131", min: 0.5, max: 1 },
  { label: "CR 2\u20135", min: 2, max: 5 },
  { label: "CR 6\u201310", min: 6, max: 10 },
  { label: "CR 11\u201316", min: 11, max: 16 },
  { label: "CR 17+", min: 17, max: 999 },
];

const ALL_TYPES: string[] = [...new Set(monstersData.map(m => m.type))].sort();

function crDisplay(cr: number | string): string {
  if (cr === 0.125) return "\u215B";
  if (cr === 0.25) return "\u00BC";
  if (cr === 0.5) return "\u00BD";
  return String(cr);
}

interface MonsterListProps {
  Icon: React.FC<{ name: string; size?: number; filled?: boolean; style?: React.CSSProperties }>;
  Ripple: React.FC<React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode; style?: React.CSSProperties; onClick?: React.MouseEventHandler<HTMLDivElement>; disabled?: boolean; className?: string }>;
  Chip: React.FC<{ label: string; selected?: boolean; onClick?: () => void; icon?: string }>;
  selectedMonsterId: string | null;
  onSelectMonster: (id: string) => void;
}

export default function MonsterList({ Icon, Ripple, Chip, selectedMonsterId, onSelectMonster }: MonsterListProps): React.ReactElement {
  const [search, setSearch] = useState<string>("");
  const [crFilter, setCrFilter] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filtered = useMemo<SrdMonster[]>(() => {
    let list: SrdMonster[] = monstersData;
    if (crFilter !== null) {
      const range = CR_RANGES[crFilter]!;
      list = list.filter(m => (m.cr as number) >= range.min && (m.cr as number) <= range.max);
    }
    if (typeFilter) list = list.filter(m => m.type === typeFilter);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter(m => m.name.toLowerCase().includes(q));
    return list;
  }, [search, crFilter, typeFilter]);

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
            placeholder="Search monsters..."
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

        {/* CR filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
          <Chip label="All CR" selected={crFilter === null} onClick={() => setCrFilter(null)} />
          {CR_RANGES.map((range, i) => (
            <Chip key={i} label={range.label} selected={crFilter === i}
              onClick={() => setCrFilter(crFilter === i ? null : i)} />
          ))}
        </div>

        {/* Type filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
          {ALL_TYPES.map(type => (
            <Chip key={type} label={type} selected={typeFilter === type}
              onClick={() => setTypeFilter(typeFilter === type ? null : type)} />
          ))}
        </div>
      </div>

      <div style={{
        padding: "0 8px 4px 12px", fontSize: 11, color: "var(--dm-text-muted)",
      }}>
        {filtered.length} creature{filtered.length !== 1 ? "s" : ""}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "0 12px" }}>
        {filtered.map(monster => (
          <Ripple
            key={monster.id}
            onClick={() => onSelectMonster(monster.id)}
            className="navitem"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 28, marginBottom: 1,
              background: selectedMonsterId === monster.id ? "var(--dm-secondary-container)" : "transparent",
              color: selectedMonsterId === monster.id ? "var(--dm-on-secondary-container)" : "var(--dm-text-secondary)",
            }}
          >
            <Icon name="pets" size={18} filled={selectedMonsterId === monster.id}
              style={{ flexShrink: 0, width: 18 }} />
            <span style={{
              fontSize: 13, flex: 1,
              fontWeight: selectedMonsterId === monster.id ? 600 : 400,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{monster.name}</span>
            <span style={{
              fontSize: 11, padding: "1px 6px", borderRadius: 6,
              background: "var(--dm-surface-bright)", color: "var(--dm-text-muted)",
              flexShrink: 0,
            }}>CR {crDisplay(monster.cr)}</span>
          </Ripple>
        ))}
      </div>
    </div>
  );
}

export { monstersData, crDisplay };
