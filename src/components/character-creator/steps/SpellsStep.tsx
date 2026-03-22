import Icon from "../../ui/Icon.tsx";
import Ripple from "../../ui/Ripple.tsx";
import { useIsMobile } from "../../../hooks/useIsMobile.ts";
import { styles, ms } from "../styles.ts";
import allSpellsData from "../../../data/srd-spells.json";
import SpellRow from "../cards/SpellRow.tsx";
import type { Character, SrdSpell, SrdClass, ClassSpellSlots } from "../../../types/index.ts";

interface Props {
  char: Character;
  update: (field: keyof Character, value: unknown) => void;
  isMobile?: boolean;
  haptic: { trigger: (type: string) => void };
  spellSlots: ClassSpellSlots | null;
  hasSpellcasting: boolean;
  classData: SrdClass | null;
}

export default function SpellsStep({ char, update, isMobile: isMobileProp, haptic, spellSlots, hasSpellcasting, classData }: Props) {
  const isMobile = useIsMobile();

  const className = char.class ? char.class.charAt(0).toUpperCase() + char.class.slice(1) : "";
  const slots = spellSlots;

  if (!hasSpellcasting) {
    return (
      <div>
        <h2 style={styles.stepTitle}>Spells</h2>
        <div style={{
          background: "rgba(28, 28, 31, 0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          borderRadius: 16, padding: 32,
          textAlign: "center", border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <Icon name="block" size={48} style={{ color: "var(--dm-text-muted)", marginBottom: 12 }} />
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            {char.class ? `${className} doesn't have spellcasting at level ${char.level}` : "Select a class first"}
          </div>
          <div style={{ fontSize: 13, color: "var(--dm-text-secondary)" }}>
            {char.class && slots ? `${className} gains spellcasting at level ${slots.castLevel}.` : "Choose a class to see available spells."}
          </div>
        </div>
      </div>
    );
  }

  const availableCantrips = (allSpellsData as SrdSpell[]).filter(
    (s) => s.level === 0 && s.classes.map((c) => c.toLowerCase()).includes(char.class!)
  );
  const availableSpells = (allSpellsData as SrdSpell[]).filter(
    (s) => s.level === 1 && s.classes.map((c) => c.toLowerCase()).includes(char.class!)
  );

  const toggleCantrip = (id: string): void => {
    haptic.trigger("light");
    if (char.cantrips.includes(id)) {
      update("cantrips", char.cantrips.filter((c) => c !== id));
    } else if (slots && char.cantrips.length < slots.cantrips) {
      update("cantrips", [...char.cantrips, id]);
    }
  };
  const toggleSpell = (id: string): void => {
    haptic.trigger("light");
    if (char.spells.includes(id)) {
      update("spells", char.spells.filter((s) => s !== id));
    } else if (slots && char.spells.length < slots.spells) {
      update("spells", [...char.spells, id]);
    }
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>Choose Spells</h2>
      <p style={styles.stepDesc}>
        As a {className}, select your known cantrips and spells.
        {slots && slots.cantrips > 0 && ` You know ${slots.cantrips} cantrip${slots.cantrips > 1 ? "s" : ""}.`}
        {slots && slots.spells > 0 && ` You know ${slots.spells} 1st-level spell${slots.spells > 1 ? "s" : ""}.`}
      </p>

      {/* Cantrips */}
      {slots && slots.cantrips > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
              <Icon name="auto_fix_high" size={18} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--dm-primary)" }} />
              Cantrips
            </h3>
            <span style={{ fontSize: 13, fontWeight: 500, color: char.cantrips.length >= slots.cantrips ? "var(--dm-primary)" : "var(--dm-text-muted)" }}>
              {char.cantrips.length} / {slots.cantrips}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(250px, 1fr))", gap: 8, marginBottom: 28 }}>
            {availableCantrips.map((sp) => (
              <SpellRow
                key={sp.id}
                spell={sp}
                selected={char.cantrips.includes(sp.id)}
                disabled={char.cantrips.length >= slots.cantrips}
                onToggle={() => toggleCantrip(sp.id)}
                isMobile={isMobile}
              />
            ))}
          </div>
        </>
      )}

      {/* Level 1 Spells */}
      {slots && slots.spells > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
              <Icon name="menu_book" size={18} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--dm-primary)" }} />
              1st-Level Spells
            </h3>
            <span style={{ fontSize: 13, fontWeight: 500, color: char.spells.length >= slots.spells ? "var(--dm-primary)" : "var(--dm-text-muted)" }}>
              {char.spells.length} / {slots.spells}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(250px, 1fr))", gap: 8 }}>
            {availableSpells.map((sp) => (
              <SpellRow
                key={sp.id}
                spell={sp}
                selected={char.spells.includes(sp.id)}
                disabled={char.spells.length >= slots.spells}
                onToggle={() => toggleSpell(sp.id)}
                isMobile={isMobile}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
