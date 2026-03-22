import React from "react";
import type { SrdSpell } from "../types/index.ts";
import { spellsData, LEVEL_LABELS, SCHOOL_ICONS } from "./SpellList.tsx";

interface PinData {
  id: string;
  title: string;
  icon: string;
  category: string;
  srdType: string;
  level?: number;
  school?: string;
}

interface SpellCardProps {
  spellId: string | null;
  Icon: React.FC<{ name: string; size?: number; filled?: boolean; style?: React.CSSProperties }>;
  Ripple: React.FC<React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode; style?: React.CSSProperties; onClick?: React.MouseEventHandler<HTMLDivElement>; disabled?: boolean; className?: string }>;
  renderMarkdown: (md: string) => string;
  onPin: (data: PinData) => void;
  isPinned: (id: string) => boolean;
}

export default function SpellCard({ spellId, Icon, Ripple, renderMarkdown, onPin, isPinned }: SpellCardProps): React.ReactElement {
  const spell: SrdSpell | undefined = spellsData.find(s => s.id === spellId);
  if (!spell) return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", height: "100%",
      color: "var(--dm-text-secondary)",
    }}>
      <div style={{ textAlign: "center" }}>
        <Icon name="auto_fix_high" size={48} style={{ opacity: 0.2, display: "block", margin: "0 auto 12px" }} />
        <div style={{ fontSize: 14 }}>Select a spell</div>
        <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginTop: 6 }}>
          Browse the 5e SRD spellbook
        </div>
      </div>
    </div>
  );

  const levelText: string = spell.level === 0
    ? `${spell.school} cantrip`
    : `${LEVEL_LABELS[spell.level]}-level ${spell.school.toLowerCase()}`;

  const pinId: string = `srd-spell-${spell.id}`;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 48px", animation: "m3pop 0.25s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{
          fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.8,
          color: "var(--dm-on-secondary-container)",
          background: "var(--dm-secondary-container)",
          padding: "3px 10px", borderRadius: 8,
        }}>5e Spell</span>
        <Ripple onClick={() => onPin({
          id: pinId,
          title: spell.name,
          icon: SCHOOL_ICONS[spell.school] || "auto_fix_high",
          category: "srd-spells",
          srdType: "spell",
          level: spell.level,
          school: spell.school,
        })} style={{
          width: 40, height: 40, borderRadius: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="push_pin" size={20}
            filled={isPinned(pinId)}
            style={{ color: isPinned(pinId) ? "var(--dm-primary)" : "var(--dm-text-secondary)" }}
          />
        </Ripple>
      </div>

      {/* Spell name */}
      <h1 className="m3h1" style={{ marginBottom: 4 }}>{spell.name}</h1>
      <div style={{ fontSize: 14, color: "var(--dm-text-secondary)", fontStyle: "italic", marginBottom: 20 }}>
        {levelText}{spell.ritual ? " (ritual)" : ""}
      </div>

      {/* Metadata grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px",
        padding: 16, borderRadius: 16,
        background: "var(--dm-surface-bright)",
        marginBottom: 20, fontSize: 14,
      }}>
        <span style={{ color: "var(--dm-text-muted)", fontWeight: 500 }}>Casting Time</span>
        <span style={{ color: "var(--dm-text)" }}>{spell.castingTime}</span>
        <span style={{ color: "var(--dm-text-muted)", fontWeight: 500 }}>Range</span>
        <span style={{ color: "var(--dm-text)" }}>{spell.range}</span>
        <span style={{ color: "var(--dm-text-muted)", fontWeight: 500 }}>Components</span>
        <span style={{ color: "var(--dm-text)" }}>
          {spell.components.join(", ")}
          {spell.material && <span style={{ color: "var(--dm-text-muted)" }}> ({spell.material})</span>}
        </span>
        <span style={{ color: "var(--dm-text-muted)", fontWeight: 500 }}>Duration</span>
        <span style={{ color: "var(--dm-text)", display: "flex", alignItems: "center", gap: 6 }}>
          {spell.duration}
          {spell.concentration && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 6,
              background: "var(--dm-tertiary-container)", color: "var(--dm-tertiary)",
            }}>CONC</span>
          )}
        </span>
      </div>

      {/* Badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {spell.concentration && (
          <span style={{
            fontSize: 12, padding: "3px 10px", borderRadius: 8,
            background: "var(--dm-tertiary-container)", color: "var(--dm-tertiary)",
            fontWeight: 500, display: "flex", alignItems: "center", gap: 4,
          }}>
            <Icon name="all_inclusive" size={14} /> Concentration
          </span>
        )}
        {spell.ritual && (
          <span style={{
            fontSize: 12, padding: "3px 10px", borderRadius: 8,
            background: "var(--dm-primary-container)", color: "var(--dm-primary)",
            fontWeight: 500, display: "flex", alignItems: "center", gap: 4,
          }}>
            <Icon name="auto_stories" size={14} /> Ritual
          </span>
        )}
        {spell.classes.map(cls => (
          <span key={cls} style={{
            fontSize: 12, padding: "3px 10px", borderRadius: 8,
            border: "1px solid var(--dm-outline-variant)",
            color: "var(--dm-text-secondary)", fontWeight: 500,
          }}>{cls}</span>
        ))}
      </div>

      {/* Description */}
      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(spell.description) }} />

      {/* At Higher Levels */}
      {spell.higherLevel && (
        <div style={{
          marginTop: 20, padding: 16, borderRadius: 16,
          background: "var(--dm-primary-container)",
          border: "1px solid var(--dm-primary-dim)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-primary-light)", marginBottom: 6 }}>
            At Higher Levels
          </div>
          <div style={{ fontSize: 14, color: "var(--dm-text-secondary)", lineHeight: 1.6 }}>
            {spell.higherLevel}
          </div>
        </div>
      )}
    </div>
  );
}
