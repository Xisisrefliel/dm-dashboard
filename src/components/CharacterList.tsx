import { useState } from "react";
import racesData from "../data/srd-races.json";
import classesData from "../data/srd-classes.json";
import Icon from "./ui/Icon.tsx";
import Ripple from "./ui/Ripple.tsx";
import { useIsMobile } from "../hooks/useIsMobile.ts";
import { useWebHaptics } from "web-haptics/react";
import { loadCharacters, saveCharacters, STORAGE_KEY } from "../utils/characterStorage.ts";
import { CLASS_IMAGES, RACE_IMAGES } from "../data/character-images.ts";
import type { Character } from "../types/index.ts";

interface CharacterListProps {
  onBack: () => void;
  onNewCharacter: () => void;
  onEditCharacter: (id: string) => void;
}

function CharacterList({ onBack, onNewCharacter, onEditCharacter }: CharacterListProps) {
  const isMobile = useIsMobile();
  const haptic = useWebHaptics();
  const [characters, setCharacters] = useState<Character[]>(() => loadCharacters());

  const deleteCharacter = (id: string) => {
    haptic.trigger("warning");
    const updated = characters.filter((c) => c.id !== id);
    setCharacters(updated);
    saveCharacters(updated);
  };

  return (
    <div style={{
      "--dm-bg": "#121214", "--dm-surface": "#1c1c1f", "--dm-surface-bright": "#26262a",
      "--dm-text": "#e2e2e6", "--dm-text-secondary": "#c2c2c8", "--dm-text-muted": "#8a8a92",
      "--dm-primary": "#9fa8da", "--dm-on-primary": "#0d0f2b",
      "--dm-outline-variant": "#38383e", "--dm-primary-container": "#1a237e",
      "--dm-on-primary-container": "#c5cae9", "--dm-secondary-container": "#2c2c3a",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      minHeight: "100vh", background: "var(--dm-bg)", color: "var(--dm-text)",
    } as React.CSSProperties}>
      <div style={{
        height: 64, minHeight: 64, display: "flex", alignItems: "center",
        padding: "0 16px", gap: 12, borderBottom: "1px solid var(--dm-outline-variant)",
      }}>
        <Ripple onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="arrow_back" />
        </Ripple>
        <Icon name="group" size={24} filled style={{ color: "var(--dm-primary)" }} />
        <span style={{ fontSize: 16, fontWeight: 600 }}>My Characters</span>
        <div style={{ flex: 1 }} />
        <Ripple onClick={() => {
          haptic.trigger("medium");
          localStorage.removeItem(STORAGE_KEY);
          onNewCharacter();
        }} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 20px", borderRadius: 20,
          background: "var(--dm-primary)", color: "var(--dm-on-primary)",
          fontWeight: 500, fontSize: 14,
        }}>
          <Icon name="add" size={18} /> {!isMobile && "New Character"}
        </Ripple>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "16px 16px" : "24px 20px" }}>
        {characters.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: "var(--dm-text-muted)",
          }}>
            <Icon name="person_off" size={56} style={{ marginBottom: 16, opacity: 0.4 }} />
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No characters yet</div>
            <div style={{ fontSize: 14, marginBottom: 24 }}>Create your first adventurer to get started.</div>
            <Ripple onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              onNewCharacter();
            }} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "10px 24px", borderRadius: 20,
              background: "var(--dm-primary)", color: "var(--dm-on-primary)",
              fontWeight: 500, fontSize: 14,
            }}>
              <Icon name="add" size={18} /> Create Character
            </Ripple>
          </div>
        ) : (
          <div style={{
            display: "grid", gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(150px, 1fr))" : "repeat(auto-fill, minmax(280px, 1fr))", gap: isMobile ? 12 : 16,
          }}>
            {characters.map((ch) => {
              const rd = racesData.find((r) => r.id === ch.race);
              const cd = classesData.find((c) => c.id === ch.class);
              const img = ch.class ? (CLASS_IMAGES as Record<string, string>)[ch.class] : (ch.race ? (RACE_IMAGES as Record<string, string>)[ch.race] : null);
              return (
                <div key={ch.id} style={{
                  background: "var(--dm-surface)", borderRadius: 16, overflow: "hidden",
                  border: "1px solid var(--dm-outline-variant)", position: "relative",
                }}>
                  <Ripple onClick={() => { haptic.trigger("light"); onEditCharacter(ch.id!); }} style={{
                    display: "flex", flexDirection: "column", width: "100%",
                  }}>
                    {img && (
                      <div style={{ width: "100%", height: isMobile ? 120 : 160, overflow: "hidden" }}>
                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                      </div>
                    )}
                    <div style={{ padding: isMobile ? "10px 14px" : "14px 18px" }}>
                      <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700 }}>{ch.name || "Unnamed"}</div>
                      <div style={{ fontSize: isMobile ? 12 : 13, color: "var(--dm-text-secondary)", marginTop: 2 }}>
                        Level {ch.level} {rd?.name || ""} {cd?.name || ""}
                      </div>
                    </div>
                  </Ripple>
                  <Ripple
                    onClick={() => deleteCharacter(ch.id!)}
                    style={{
                      position: "absolute", top: 8, right: 8,
                      width: isMobile ? 40 : 32, height: isMobile ? 40 : 32, borderRadius: isMobile ? 20 : 16,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "rgba(0,0,0,0.6)", border: "1px solid var(--dm-outline-variant)",
                    }}
                  >
                    <Icon name="delete" size={16} style={{ color: "var(--dm-error, #ffb4ab)" }} />
                  </Ripple>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CharacterList;
