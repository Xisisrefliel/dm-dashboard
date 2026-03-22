import { useState, useRef } from "react";
import Icon from "../../ui/Icon.tsx";
import Ripple from "../../ui/Ripple.tsx";
import { useIsMobile } from "../../../hooks/useIsMobile.ts";
import { useTooltipPos } from "../../../hooks/useTooltipPos.ts";
import { CLASS_IMAGES } from "../../../data/character-images.ts";
import { CLASS_ICONS } from "../../../data/character-constants.ts";
import type { SrdClass } from "../../../types/index.ts";

interface Props {
  cls: SrdClass;
  selected: boolean;
  onSelect: () => void;
}

export default function ClassCard({ cls, selected, onSelect }: Props) {
  const mobile = useIsMobile();
  const [hovered, setHovered] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const { tooltipRef, style, calcPos } = useTooltipPos(ref, 300);
  const img = (CLASS_IMAGES as Record<string, string>)[cls.id];
  const lvl1Features = cls.features?.filter((f) => f.level === 1).map((f) => f.name) || [];

  return (
    <div ref={ref} onMouseEnter={mobile ? undefined : () => { setHovered(true); calcPos(); }} onMouseLeave={mobile ? undefined : () => setHovered(false)} style={{ position: "relative" }}>
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
            <img src={img} alt={cls.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
      {!mobile && hovered && (
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
          {!!cls.spellcasting && (
            <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 4 }}>
              <span style={{ color: "var(--dm-text-muted)" }}>Spellcasting: </span>{(cls.spellcasting as { ability: string; level: number }).ability} (from level {(cls.spellcasting as { ability: string; level: number }).level})
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
