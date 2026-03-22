import Icon from "../../ui/Icon.jsx";
import Ripple from "../../ui/Ripple.jsx";
import TraitChip from "./TraitChip.jsx";
import { RACE_IMAGES } from "../../../data/character-images.js";
import { RACE_ICONS } from "../../../data/character-constants.js";

export default function RaceCard({ race, selected, onSelect }) {
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
              loading="lazy"
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
