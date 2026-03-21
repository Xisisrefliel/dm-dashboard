import { useState, useRef } from "react";
import Icon from "../../ui/Icon.jsx";
import Ripple from "../../ui/Ripple.jsx";
import { useIsMobile } from "../../../hooks/useIsMobile.js";
import { useTooltipPos } from "../../../hooks/useTooltipPos.js";

export default function EquipmentCard({ eq, selected, disabled, onToggle, radioMode, locked }) {
  const mobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const { tooltipRef, style, calcPos } = useTooltipPos(ref, 280);

  const radioIcon = selected
    ? (locked ? "lock" : "radio_button_checked")
    : "radio_button_unchecked";
  const checkIcon = selected
    ? (locked ? "lock" : "check_circle")
    : null;

  return (
    <div ref={ref} onMouseEnter={mobile ? undefined : () => { setHovered(true); calcPos(); }} onMouseLeave={mobile ? undefined : () => setHovered(false)} style={{ position: "relative" }}>
      <Ripple
        onClick={locked ? undefined : onToggle}
        style={{
          background: selected ? (locked ? "var(--dm-surface-bright)" : "var(--dm-primary-container)") : "rgba(28, 28, 31, 0.65)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          borderRadius: 16, padding: 16,
          display: "flex", flexDirection: "row", gap: 12, alignItems: "center",
          transition: "border-color 0.2s, background 0.2s",
          border: selected ? (locked ? "1px solid rgba(255,255,255,0.08)" : "2px solid var(--dm-primary)") : "1px solid rgba(255,255,255,0.08)",
          opacity: disabled && !selected && !locked ? 0.5 : 1,
          cursor: locked ? "default" : (disabled && !selected ? "default" : "pointer"),
        }}
      >
        {radioMode ? (
          <Icon name={radioIcon} size={20} style={{ color: selected ? "var(--dm-primary)" : "var(--dm-text-muted)", flexShrink: 0 }} />
        ) : null}
        <Icon name={eq.icon} size={22} style={{ color: selected ? (locked ? "var(--dm-text-secondary)" : "var(--dm-primary)") : "var(--dm-text-muted)", flexShrink: 0 }} />
        <span style={{ fontSize: 14, fontWeight: 500, color: selected ? (locked ? "var(--dm-text-secondary)" : "var(--dm-on-primary-container)") : "var(--dm-text)" }}>
          {eq.name}
        </span>
        {!radioMode && checkIcon && <Icon name={checkIcon} size={18} style={{ color: locked ? "var(--dm-text-muted)" : "var(--dm-primary)", marginLeft: "auto" }} />}
      </Ripple>
      {!mobile && hovered && (
        <div ref={tooltipRef} style={{
          ...style, padding: 14, borderRadius: 12,
          background: "var(--dm-surface-brighter)", border: "1px solid var(--dm-outline-variant)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)", zIndex: 100, pointerEvents: "none",
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--dm-primary)", marginBottom: 6 }}>{eq.name}</div>
          {eq.damage && (
            <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 4 }}>
              <span style={{ color: "var(--dm-text-muted)" }}>Damage: </span>{eq.damage}
            </div>
          )}
          {eq.properties && (
            <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 4 }}>
              <span style={{ color: "var(--dm-text-muted)" }}>Properties: </span>{eq.properties}
            </div>
          )}
          {eq.weight && (
            <div style={{ fontSize: 12, color: "var(--dm-text)", marginBottom: 4 }}>
              <span style={{ color: "var(--dm-text-muted)" }}>Weight: </span>{eq.weight}
            </div>
          )}
          {eq.desc && (
            <div style={{ fontSize: 12, color: "var(--dm-text-secondary)", lineHeight: 1.5, marginTop: 6 }}>{eq.desc}</div>
          )}
        </div>
      )}
    </div>
  );
}
