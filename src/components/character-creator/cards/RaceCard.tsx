import Icon from "../../ui/Icon.tsx";
import Ripple from "../../ui/Ripple.tsx";
import { RACE_IMAGES } from "../../../data/character-images.ts";
import { RACE_ICONS } from "../../../data/character-constants.ts";
import type { SrdRace } from "../../../types/index.ts";

interface Props {
  race: SrdRace;
  selected: boolean;
  onSelect: () => void;
}

export default function RaceCard({ race, selected, onSelect }: Props) {
  const img = (RACE_IMAGES as Record<string, string>)[race.id];
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
        border: "1px solid var(--dm-outline-variant)",
        outline: selected ? "2px solid var(--dm-primary)" : "2px solid transparent",
        outlineOffset: -2,
        transition: "outline-color 200ms var(--ease-out-strong), border-color 200ms var(--ease-out-strong)",
      }}
    >
      <div>
        {img ? (
          <div
            className="cc-card-img-wrap"
            style={{ width: "100%", aspectRatio: "1", overflow: "hidden", position: "relative" }}
          >
            <img
              src={img}
              alt={race.name}
              loading="lazy"
              className="cc-card-img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                outline: "1px solid rgba(255,255,255,0.1)",
                outlineOffset: -1,
                transition: "transform 380ms var(--ease-out-strong)",
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
        <div style={{ fontSize: 16, fontWeight: 600, textWrap: "balance" }}>{race.name}</div>
        <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", fontVariantNumeric: "tabular-nums" }}>
          {race.abilityBonuses
            .map((b) => `${b.ability} +${b.bonus}`)
            .join(", ")}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--dm-text-secondary)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Speed {race.speed} ft · {race.size}
        </div>
      </div>
    </Ripple>
  );
}
