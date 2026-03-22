import React from "react";
import type { SrdClass } from "../types/index.ts";
import { classesData, CLASS_ICONS } from "./ClassList.tsx";

interface ClassPinData {
  id: string;
  title: string;
  icon: string;
  category: string;
  srdType: string;
  hitDie: number;
}

interface ClassDetailProps {
  classId: string | null;
  Icon: React.FC<{ name: string; size?: number; filled?: boolean; style?: React.CSSProperties }>;
  Ripple: React.FC<React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode; style?: React.CSSProperties; onClick?: React.MouseEventHandler<HTMLDivElement>; disabled?: boolean; className?: string }>;
  onPin: (data: ClassPinData) => void;
  isPinned: (id: string) => boolean;
}

export default function ClassDetail({ classId, Icon, Ripple, onPin, isPinned }: ClassDetailProps): React.ReactElement {
  const cls: SrdClass | undefined = classesData.find(c => c.id === classId);
  if (!cls) return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", height: "100%",
      color: "var(--dm-text-secondary)",
    }}>
      <div style={{ textAlign: "center" }}>
        <Icon name="person" size={48} style={{ opacity: 0.2, display: "block", margin: "0 auto 12px" }} />
        <div style={{ fontSize: 14 }}>Select a class</div>
        <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginTop: 6 }}>
          Browse the 5e SRD classes
        </div>
      </div>
    </div>
  );

  const pinId: string = `srd-class-${cls.id}`;

  // Group features by level
  const featuresByLevel: Record<number, string[]> = {};
  for (const f of cls.features) {
    if (!featuresByLevel[f.level]) featuresByLevel[f.level] = [];
    featuresByLevel[f.level]!.push(f.name);
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 48px", animation: "m3pop 0.25s ease" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{
          fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.8,
          color: "var(--dm-on-secondary-container)",
          background: "var(--dm-secondary-container)",
          padding: "3px 10px", borderRadius: 8,
        }}>5e Class</span>
        <Ripple onClick={() => onPin({
          id: pinId,
          title: cls.name,
          icon: CLASS_ICONS[cls.id] || "person",
          category: "srd-classes",
          srdType: "class",
          hitDie: cls.hitDie,
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

      {/* Class card */}
      <div style={{
        background: "var(--dm-surface-bright)",
        borderRadius: 16, padding: 24, marginTop: 8,
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Icon name={CLASS_ICONS[cls.id] || "person"} size={32} style={{ color: "var(--dm-primary)" }} />
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--dm-text)", marginBottom: 2 }}>
              {cls.name}
            </h1>
            <div style={{ fontSize: 13, color: "var(--dm-text-muted)", fontStyle: "italic" }}>
              Hit Die: d{cls.hitDie} &bull; {cls.spellcasting ? `${(cls.spellcasting as { ability: string }).ability} caster` : "Non-caster"}
            </div>
          </div>
        </div>

        {/* Core stats */}
        <div style={{ borderTop: "1px solid var(--dm-primary-dim)", borderBottom: "1px solid var(--dm-primary-dim)", padding: "12px 0", marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", padding: "2px 0" }}>
            <span style={{ fontWeight: 600, color: "var(--dm-text)" }}>Hit Die </span>
            d{cls.hitDie}
          </div>
          <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", padding: "2px 0" }}>
            <span style={{ fontWeight: 600, color: "var(--dm-text)" }}>Saving Throws </span>
            {cls.savingThrows.join(", ")}
          </div>
          {!!cls.spellcasting && (
            <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", padding: "2px 0" }}>
              <span style={{ fontWeight: 600, color: "var(--dm-text)" }}>Spellcasting </span>
              {(cls.spellcasting as { ability: string; level: number }).ability} (from level {(cls.spellcasting as { ability: string; level: number }).level})
            </div>
          )}
        </div>

        {/* Proficiencies */}
        <div style={{
          fontSize: 16, fontWeight: 600, color: "var(--dm-primary)",
          borderBottom: "2px solid var(--dm-primary-dim)",
          paddingBottom: 4, marginBottom: 8,
        }}>Proficiencies</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {cls.proficiencies.map(p => (
            <span key={p} style={{
              fontSize: 12, padding: "3px 10px", borderRadius: 8,
              border: "1px solid var(--dm-outline-variant)",
              color: "var(--dm-text-secondary)", fontWeight: 500,
            }}>{p}</span>
          ))}
        </div>

        {/* Skills */}
        <div style={{
          fontSize: 16, fontWeight: 600, color: "var(--dm-primary)",
          borderBottom: "2px solid var(--dm-primary-dim)",
          paddingBottom: 4, marginBottom: 8,
        }}>Skills (choose {cls.skills.choose})</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {cls.skills.from.map(s => (
            <span key={s} style={{
              fontSize: 12, padding: "3px 10px", borderRadius: 8,
              border: "1px solid var(--dm-outline-variant)",
              color: "var(--dm-text-secondary)", fontWeight: 500,
            }}>{s}</span>
          ))}
        </div>

        {/* Subclasses */}
        {cls.subclasses.length > 0 && (
          <>
            <div style={{
              fontSize: 16, fontWeight: 600, color: "var(--dm-primary)",
              borderBottom: "2px solid var(--dm-primary-dim)",
              paddingBottom: 4, marginBottom: 8,
            }}>Subclasses (SRD)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {cls.subclasses.map(s => (
                <span key={s} style={{
                  fontSize: 12, padding: "3px 10px", borderRadius: 8,
                  background: "var(--dm-primary-container)", color: "var(--dm-primary)",
                  fontWeight: 500,
                }}>{s}</span>
              ))}
            </div>
          </>
        )}

        {/* Level progression table */}
        <div style={{
          fontSize: 16, fontWeight: 600, color: "var(--dm-primary)",
          borderBottom: "2px solid var(--dm-primary-dim)",
          paddingBottom: 4, marginBottom: 8, marginTop: 4,
        }}>Level Progression</div>
        <div style={{ fontSize: 13 }}>
          {Object.entries(featuresByLevel).map(([level, features]) => (
            <div key={level} style={{
              display: "flex", gap: 12, padding: "6px 0",
              borderBottom: "1px solid var(--dm-outline-variant)",
            }}>
              <span style={{
                fontWeight: 600, color: "var(--dm-primary-dim)", minWidth: 32, flexShrink: 0,
              }}>Lv {level}</span>
              <span style={{ color: "var(--dm-text-secondary)", lineHeight: 1.5 }}>
                {features.join(", ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
