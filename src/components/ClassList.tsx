import React, { useState, useMemo } from "react";
import type { SrdClass } from "../types/index.ts";
import classesRaw from "../data/srd-classes.json";

const classesData = classesRaw as SrdClass[];

const CLASS_ICONS: Record<string, string> = {
  barbarian: "mood",
  bard: "music_note",
  cleric: "church",
  druid: "eco",
  fighter: "swords",
  monk: "self_improvement",
  paladin: "shield",
  ranger: "park",
  rogue: "visibility_off",
  sorcerer: "local_fire_department",
  warlock: "nights_stay",
  wizard: "auto_stories",
};

interface ClassListProps {
  Icon: React.FC<{ name: string; size?: number; filled?: boolean; style?: React.CSSProperties }>;
  Ripple: React.FC<React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode; style?: React.CSSProperties; onClick?: React.MouseEventHandler<HTMLDivElement>; disabled?: boolean; className?: string }>;
  Chip: React.FC<{ label: string; selected?: boolean; onClick?: () => void; icon?: string }>;
  selectedClassId: string | null;
  onSelectClass: (id: string) => void;
}

export default function ClassList({ Icon, Ripple, Chip, selectedClassId, onSelectClass }: ClassListProps): React.ReactElement {
  const [search, setSearch] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filtered = useMemo<SrdClass[]>(() => {
    let list: SrdClass[] = classesData;
    if (typeFilter === "caster") list = list.filter(c => c.spellcasting !== null);
    if (typeFilter === "martial") list = list.filter(c => c.spellcasting === null);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter(c => c.name.toLowerCase().includes(q));
    return list;
  }, [search, typeFilter]);

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
            placeholder="Search classes..."
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

        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
          <Chip label="All" selected={typeFilter === null} onClick={() => setTypeFilter(null)} />
          <Chip label="Casters" selected={typeFilter === "caster"} onClick={() => setTypeFilter(typeFilter === "caster" ? null : "caster")} />
          <Chip label="Martial" selected={typeFilter === "martial"} onClick={() => setTypeFilter(typeFilter === "martial" ? null : "martial")} />
        </div>
      </div>

      <div style={{
        padding: "0 8px 4px 12px", fontSize: 11, color: "var(--dm-text-muted)",
      }}>
        {filtered.length} class{filtered.length !== 1 ? "es" : ""}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "0 12px" }}>
        {filtered.map(cls => (
          <Ripple
            key={cls.id}
            onClick={() => onSelectClass(cls.id)}
            className="navitem"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 28, marginBottom: 1,
              background: selectedClassId === cls.id ? "var(--dm-secondary-container)" : "transparent",
              color: selectedClassId === cls.id ? "var(--dm-on-secondary-container)" : "var(--dm-text-secondary)",
            }}
          >
            <Icon name={CLASS_ICONS[cls.id] || "person"} size={18}
              filled={selectedClassId === cls.id}
              style={{ flexShrink: 0, width: 18 }} />
            <span style={{
              fontSize: 13, flex: 1,
              fontWeight: selectedClassId === cls.id ? 600 : 400,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{cls.name}</span>
            <span style={{
              fontSize: 11, padding: "1px 6px", borderRadius: 6,
              background: "var(--dm-surface-bright)", color: "var(--dm-text-muted)",
              flexShrink: 0,
            }}>d{cls.hitDie}</span>
          </Ripple>
        ))}
      </div>
    </div>
  );
}

export { classesData, CLASS_ICONS };
