import { useState, useMemo } from "react";
import racesData from "../data/srd-races.json";

const RACE_ICONS = {
  dragonborn: "whatshot",
  dwarf: "hardware",
  elf: "spa",
  gnome: "build",
  "half-elf": "diversity_3",
  "half-orc": "fitness_center",
  halfling: "emoji_nature",
  human: "person",
  tiefling: "local_fire_department",
};

const SIZE_OPTIONS = ["Small", "Medium"];

export default function RaceList({ Icon, Ripple, Chip, selectedRaceId, onSelectRace }) {
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState(null);

  const filtered = useMemo(() => {
    let list = racesData;
    if (sizeFilter) list = list.filter(r => r.size === sizeFilter);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter(r => r.name.toLowerCase().includes(q));
    return list;
  }, [search, sizeFilter]);

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
            placeholder="Search races..."
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
          <Chip label="All" selected={sizeFilter === null} onClick={() => setSizeFilter(null)} />
          {SIZE_OPTIONS.map(size => (
            <Chip key={size} label={size} selected={sizeFilter === size}
              onClick={() => setSizeFilter(sizeFilter === size ? null : size)} />
          ))}
        </div>
      </div>

      <div style={{
        padding: "0 8px 4px 12px", fontSize: 11, color: "var(--dm-text-muted)",
      }}>
        {filtered.length} race{filtered.length !== 1 ? "s" : ""}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "0 12px" }}>
        {filtered.map(race => (
          <Ripple
            key={race.id}
            onClick={() => onSelectRace(race.id)}
            className="navitem"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 28, marginBottom: 1,
              background: selectedRaceId === race.id ? "var(--dm-secondary-container)" : "transparent",
              color: selectedRaceId === race.id ? "var(--dm-on-secondary-container)" : "var(--dm-text-secondary)",
            }}
          >
            <Icon name={RACE_ICONS[race.id] || "person"} size={18}
              filled={selectedRaceId === race.id}
              style={{ flexShrink: 0, width: 18 }} />
            <span style={{
              fontSize: 13, flex: 1,
              fontWeight: selectedRaceId === race.id ? 600 : 400,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{race.name}</span>
            <span style={{
              fontSize: 11, padding: "1px 6px", borderRadius: 6,
              background: "var(--dm-surface-bright)", color: "var(--dm-text-muted)",
              flexShrink: 0,
            }}>{race.size}</span>
          </Ripple>
        ))}
      </div>
    </div>
  );
}

export { racesData, RACE_ICONS };
