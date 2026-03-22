import React from "react";
import type { SrdMonster, MonsterAbility } from "../types/index.ts";
import { monstersData, crDisplay } from "./MonsterList.tsx";

function abilityMod(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : String(mod);
}

interface AbilityGridProps {
  monster: SrdMonster;
}

function AbilityGrid({ monster }: AbilityGridProps): React.ReactElement {
  const abilities: { key: keyof SrdMonster; label: string }[] = [
    { key: "str", label: "STR" },
    { key: "dex", label: "DEX" },
    { key: "con", label: "CON" },
    { key: "int", label: "INT" },
    { key: "wis", label: "WIS" },
    { key: "cha", label: "CHA" },
  ];

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(6, 1fr)",
      gap: 4, textAlign: "center", padding: "12px 0",
    }}>
      {abilities.map(a => (
        <div key={a.key}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--dm-text-muted)", letterSpacing: 0.5 }}>
            {a.label}
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--dm-text)" }}>
            {monster[a.key] as number}
          </div>
          <div style={{ fontSize: 12, color: "var(--dm-primary-dim)" }}>
            ({abilityMod(monster[a.key] as number)})
          </div>
        </div>
      ))}
    </div>
  );
}

interface StatLineProps {
  label: string;
  value: string | null;
}

function StatLine({ label, value }: StatLineProps): React.ReactElement | null {
  if (!value) return null;
  return (
    <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", padding: "2px 0" }}>
      <span style={{ fontWeight: 600, color: "var(--dm-text)" }}>{label} </span>
      {value}
    </div>
  );
}

interface ActionSectionProps {
  title: string;
  actions: MonsterAbility[] | null;
  Icon: React.FC<{ name: string; size?: number; filled?: boolean; style?: React.CSSProperties }>;
}

function ActionSection({ title, actions, Icon }: ActionSectionProps): React.ReactElement | null {
  if (!actions?.length) return null;
  return (
    <>
      <div style={{
        fontSize: 16, fontWeight: 600, color: "var(--dm-primary)",
        borderBottom: "2px solid var(--dm-primary-dim)",
        paddingBottom: 4, marginTop: 20, marginBottom: 8,
      }}>{title}</div>
      {actions.map((action, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text)", fontStyle: "italic" }}>
            {action.name}.
          </span>{" "}
          <span style={{ fontSize: 13, color: "var(--dm-text-secondary)", lineHeight: 1.6 }}>
            {action.desc}
          </span>
        </div>
      ))}
    </>
  );
}

interface MonsterPinData {
  id: string;
  title: string;
  icon: string;
  category: string;
  srdType: string;
  cr: number | string;
  hp: number;
  ac: number;
}

interface MonsterStatBlockProps {
  monsterId: string | null;
  Icon: React.FC<{ name: string; size?: number; filled?: boolean; style?: React.CSSProperties }>;
  Ripple: React.FC<React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode; style?: React.CSSProperties; onClick?: React.MouseEventHandler<HTMLDivElement>; disabled?: boolean; className?: string }>;
  onPin: (data: MonsterPinData) => void;
  isPinned: (id: string) => boolean;
  onAddToInitiative: (monster: SrdMonster) => void;
}

export default function MonsterStatBlock({ monsterId, Icon, Ripple, onPin, isPinned, onAddToInitiative }: MonsterStatBlockProps): React.ReactElement {
  const monster: SrdMonster | undefined = monstersData.find(m => m.id === monsterId);
  if (!monster) return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", height: "100%",
      color: "var(--dm-text-secondary)",
    }}>
      <div style={{ textAlign: "center" }}>
        <Icon name="pets" size={48} style={{ opacity: 0.2, display: "block", margin: "0 auto 12px" }} />
        <div style={{ fontSize: 14 }}>Select a creature</div>
        <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginTop: 6 }}>
          Browse the 5e SRD bestiary
        </div>
      </div>
    </div>
  );

  const pinId: string = `srd-monster-${monster.id}`;
  const speedStr: string = Object.entries(monster.speed).map(([k, v]) => k === "walk" ? v : `${k} ${v}`).join(", ");
  const savesStr: string | null = monster.savingThrows
    ? Object.entries(monster.savingThrows).map(([k, v]) => `${k} +${v}`).join(", ")
    : null;
  const skillsStr: string | null = monster.skills
    ? Object.entries(monster.skills).map(([k, v]) => `${k} +${v}`).join(", ")
    : null;
  const sensesStr: string | null = monster.senses
    ? Object.entries(monster.senses)
        .map(([k, v]) => k === "passive_perception" ? `passive Perception ${v}` : `${k} ${v}`)
        .join(", ")
    : null;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 48px", animation: "m3pop 0.25s ease" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{
          fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.8,
          color: "var(--dm-on-secondary-container)",
          background: "var(--dm-secondary-container)",
          padding: "3px 10px", borderRadius: 8,
        }}>Bestiary</span>
        <div style={{ display: "flex", gap: 4 }}>
          <Ripple onClick={() => onAddToInitiative(monster)} style={{
            height: 36, borderRadius: 18, padding: "0 14px",
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--dm-primary-container)", color: "var(--dm-on-primary-container)",
            fontSize: 12, fontWeight: 500,
          }}>
            <Icon name="swords" size={16} /> Add to Initiative
          </Ripple>
          <Ripple onClick={() => onPin({
            id: pinId,
            title: monster.name,
            icon: "pets",
            category: "srd-monsters",
            srdType: "monster",
            cr: monster.cr,
            hp: monster.hp,
            ac: monster.ac,
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
      </div>

      {/* Stat block card */}
      <div style={{
        background: "var(--dm-surface-bright)",
        borderRadius: 16, padding: 24, marginTop: 8,
      }}>
        {/* Header */}
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--dm-text)", marginBottom: 2 }}>
          {monster.name}
        </h1>
        <div style={{ fontSize: 13, color: "var(--dm-text-muted)", fontStyle: "italic", marginBottom: 16 }}>
          {monster.size} {monster.type}, {monster.alignment}
        </div>

        {/* Core stats */}
        <div style={{ borderTop: "1px solid var(--dm-primary-dim)", borderBottom: "1px solid var(--dm-primary-dim)", padding: "8px 0", marginBottom: 4 }}>
          <StatLine label="Armor Class" value={`${monster.ac}${monster.acType && monster.acType !== "dex" ? ` (${monster.acType})` : ""}`} />
          <StatLine label="Hit Points" value={`${monster.hp} (${monster.hitDice})`} />
          <StatLine label="Speed" value={speedStr} />
        </div>

        {/* Ability scores */}
        <div style={{ borderBottom: "1px solid var(--dm-primary-dim)", marginBottom: 8 }}>
          <AbilityGrid monster={monster} />
        </div>

        {/* Properties */}
        <div style={{ padding: "4px 0 8px" }}>
          <StatLine label="Saving Throws" value={savesStr} />
          <StatLine label="Skills" value={skillsStr} />
          {monster.vulnerabilities && <StatLine label="Vulnerabilities" value={monster.vulnerabilities} />}
          {monster.resistances && <StatLine label="Resistances" value={monster.resistances} />}
          {monster.immunities && <StatLine label="Damage Immunities" value={monster.immunities} />}
          {monster.conditionImmunities && <StatLine label="Condition Immunities" value={monster.conditionImmunities} />}
          <StatLine label="Senses" value={sensesStr} />
          <StatLine label="Languages" value={monster.languages || "\u2014"} />
          <StatLine label="Challenge" value={`${crDisplay(monster.cr)} (${(monster.xp || 0).toLocaleString()} XP)`} />
        </div>

        {/* Abilities & Actions */}
        <ActionSection title="Traits" actions={monster.specialAbilities} Icon={Icon} />
        <ActionSection title="Actions" actions={monster.actions} Icon={Icon} />
        <ActionSection title="Reactions" actions={monster.reactions} Icon={Icon} />
        {monster.legendaryActions && (
          <>
            <div style={{
              fontSize: 16, fontWeight: 600, color: "var(--dm-primary)",
              borderBottom: "2px solid var(--dm-primary-dim)",
              paddingBottom: 4, marginTop: 20, marginBottom: 8,
            }}>Legendary Actions</div>
            <div style={{ fontSize: 13, color: "var(--dm-text-muted)", marginBottom: 10, fontStyle: "italic" }}>
              The {monster.name.toLowerCase()} can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The {monster.name.toLowerCase()} regains spent legendary actions at the start of its turn.
            </div>
            {monster.legendaryActions.map((action, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text)", fontStyle: "italic" }}>
                  {action.name}.
                </span>{" "}
                <span style={{ fontSize: 13, color: "var(--dm-text-secondary)", lineHeight: 1.6 }}>
                  {action.desc}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export { abilityMod };
