import { useState, useRef } from "react";
import Icon from "../../ui/Icon.jsx";
import Ripple from "../../ui/Ripple.jsx";
import { useTooltipPos } from "../../../hooks/useTooltipPos.js";

export default function SpellRow({ spell, selected, disabled, onToggle, isMobile }) {
  const chipRef = useRef(null);
  const { tooltipRef: ttRef, style: ttStyle, calcPos: ttCalc } = useTooltipPos(chipRef, 300);
  const [tipOpen, setTipOpen] = useState(false);
  const spellIcon = spell.school === "Evocation" ? "local_fire_department" :
    spell.school === "Abjuration" ? "shield" :
    spell.school === "Conjuration" ? "auto_awesome" :
    spell.school === "Divination" ? "visibility" :
    spell.school === "Enchantment" ? "psychology" :
    spell.school === "Illusion" ? "blur_on" :
    spell.school === "Necromancy" ? "skull" :
    spell.school === "Transmutation" ? "swap_horiz" : "auto_fix_high";

  return (
    <div
      ref={chipRef}
      onMouseEnter={!isMobile ? () => { setTipOpen(true); ttCalc(); } : undefined}
      onMouseLeave={!isMobile ? () => setTipOpen(false) : undefined}
      style={{ position: "relative" }}
    >
      <Ripple
        onClick={onToggle}
        style={{
          padding: "12px 16px", borderRadius: 12,
          display: "flex", gap: 12, alignItems: "center",
          background: selected ? "var(--dm-primary-container)" : "rgba(28, 28, 31, 0.65)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          border: selected ? "2px solid var(--dm-primary)" : "1px solid rgba(255,255,255,0.08)",
          opacity: disabled && !selected ? 0.5 : 1,
        }}
      >
        <Icon name={spellIcon} size={20} style={{ color: selected ? "var(--dm-primary)" : "var(--dm-text-muted)", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: selected ? "var(--dm-on-primary-container)" : "var(--dm-text)" }}>
            {spell.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--dm-text-muted)" }}>
            {spell.school} · {spell.castingTime}
          </div>
        </div>
        {selected && <Icon name="check_circle" size={18} style={{ color: "var(--dm-primary)", flexShrink: 0 }} />}
      </Ripple>
      {!isMobile && tipOpen && (
        <div ref={ttRef} style={{
          ...ttStyle, padding: 14, borderRadius: 12,
          background: "var(--dm-surface-brighter)", border: "1px solid var(--dm-outline-variant)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)", zIndex: 100, pointerEvents: "none",
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--dm-primary)", marginBottom: 6 }}>{spell.name}</div>
          <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 3 }}>
            <span style={{ color: "var(--dm-text-muted)" }}>School: </span>{spell.school}
          </div>
          <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 3 }}>
            <span style={{ color: "var(--dm-text-muted)" }}>Cast Time: </span>{spell.castingTime}
          </div>
          <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 3 }}>
            <span style={{ color: "var(--dm-text-muted)" }}>Range: </span>{spell.range}
          </div>
          {spell.components && (
            <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 3 }}>
              <span style={{ color: "var(--dm-text-muted)" }}>Components: </span>
              {spell.components.map((c) => c === "V" ? "Verbal" : c === "S" ? "Somatic" : c === "M" ? "Material" : c).join(", ")}
              {spell.material && <span style={{ color: "var(--dm-text-muted)" }}> ({spell.material})</span>}
            </div>
          )}
          <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 3 }}>
            <span style={{ color: "var(--dm-text-muted)" }}>Duration: </span>{spell.duration}{spell.concentration ? " (Concentration)" : ""}
          </div>
          <div style={{ fontSize: 12, color: "var(--dm-text-secondary)", lineHeight: 1.5, marginTop: 6 }}>
            {spell.description.length > 200 ? spell.description.slice(0, 200) + "\u2026" : spell.description}
          </div>
        </div>
      )}
    </div>
  );
}
