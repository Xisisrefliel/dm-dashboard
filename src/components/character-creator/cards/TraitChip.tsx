import { useState, useRef } from "react";
import Icon from "../../ui/Icon.tsx";
import Ripple from "../../ui/Ripple.tsx";
import { useIsMobile } from "../../../hooks/useIsMobile.ts";
import { useTooltipPos } from "../../../hooks/useTooltipPos.ts";

interface Trait {
  name: string;
  desc: string;
}

interface Props {
  trait: Trait;
  asButton?: boolean;
}

export default function TraitChip({ trait, asButton }: Props) {
  const mobile = useIsMobile();
  const [hovered, setHovered] = useState<boolean>(false);
  const ref = useRef<HTMLSpanElement>(null);
  const { tooltipRef, style, calcPos } = useTooltipPos(ref, 260);

  return (
    <span
      ref={ref}
      onMouseEnter={mobile ? undefined : () => { setHovered(true); calcPos(); }}
      onMouseLeave={mobile ? undefined : () => setHovered(false)}
      style={{ display: "inline-block" }}
    >
      <span
        style={asButton ? {
          fontSize: 12, fontWeight: 500,
          color: "var(--dm-primary)",
          cursor: "default",
          padding: "5px 12px", borderRadius: 16,
          border: "1px solid var(--dm-outline-variant)",
          background: hovered ? "var(--dm-surface-bright)" : "transparent",
          display: "inline-block",
          transition: "background 0.15s",
        } : {
          fontSize: 12,
          color: "var(--dm-primary)",
          cursor: "default",
          borderBottom: "1px dashed var(--dm-primary-dim)",
        }}
      >
        {trait.name}
      </span>
      {!mobile && hovered && (
        <div
          ref={tooltipRef}
          style={{
            ...style,
            padding: 12, borderRadius: 12,
            background: "var(--dm-surface-brighter)",
            border: "1px solid var(--dm-outline-variant)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            zIndex: 100, pointerEvents: "none",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-primary)", marginBottom: 4 }}>
            {trait.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--dm-text-secondary)", lineHeight: 1.5 }}>
            {trait.desc}
          </div>
        </div>
      )}
    </span>
  );
}
