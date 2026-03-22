import { useState } from "react";
import Icon from "../../ui/Icon.jsx";
import Ripple from "../../ui/Ripple.jsx";
import { useIsMobile } from "../../../hooks/useIsMobile.js";
import { styles, ms } from "../styles.js";
import racesData from "../../../data/srd-races.json";
import { RACE_IMAGES } from "../../../data/character-images.js";
import { RACE_ICONS, ABILITY_NAMES } from "../../../data/character-constants.js";
import RaceCard from "../cards/RaceCard.jsx";
import TraitChip from "../cards/TraitChip.jsx";
import { useCarouselOverflow } from "../../../hooks/useCarouselOverflow.js";

export default function RaceStep({ char, update, next, prev, haptic, previewRace, setPreviewRace, raceCarouselRef, raceCarouselOverflows }) {
  const isMobile = useIsMobile();
  const [closing, setClosing] = useState(false);

  const pRace = previewRace ? racesData.find((r) => r.id === previewRace) : null;
  const pRaceImg = previewRace ? RACE_IMAGES[previewRace] : null;

  const openRacePreview = (id) => {
    haptic.trigger("light");
    update("race", id);
    setClosing(false);
    setPreviewRace(id);
  };

  const closePreview = (cb) => {
    setClosing(true);
    setTimeout(() => { setClosing(false); setPreviewRace(null); cb?.(); }, 250);
  };

  if (pRace) {
    return (
      <div>
        <h2 style={styles.stepTitle}>Choose your Race</h2>

        {/* Detail card */}
        <div key={previewRace} style={{
          position: "relative", borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)", marginBottom: 24,
          animation: `${closing ? "detailCardOut" : "detailCardIn"} ${closing ? "0.25s" : "0.35s"} cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
          ...(isMobile ? {} : { height: 420 }),
        }}>
          {/* Blur backdrop — separate from content so blur is visible during animation */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(28, 28, 31, 0.7)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }} />
          <div style={{
            position: "relative", display: "flex", gap: 0, height: "100%",
            animation: `${closing ? "detailContentOut" : "detailContentIn"} ${closing ? "0.25s" : "0.35s"} cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
            ...(isMobile ? { flexDirection: "column" } : {}),
          }}>
          {pRaceImg && (
            <div style={isMobile
              ? { width: "100%", height: 200, flexShrink: 0, position: "relative" }
              : { width: 240, minWidth: 240, flexShrink: 0, position: "relative" }
            }>
              <img src={pRaceImg} alt={pRace.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
            </div>
          )}

          <div style={isMobile
            ? { flex: 1, padding: 16, overflowY: "auto" }
            : { flex: 1, padding: "20px 28px", minWidth: 260, overflowY: "auto" }
          }>
            <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", letterSpacing: "0.02em", textTransform: "uppercase" }}>
              {pRace.name}
            </h3>
            <p style={{ fontSize: 13, color: "var(--dm-text-secondary)", lineHeight: 1.5, margin: "0 0 12px" }}>
              {pRace.age}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px", fontSize: 13, marginBottom: 12 }}>
              <div>
                <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Ability Bonuses: </span>
                {pRace.abilityBonuses.map((b) => `${ABILITY_NAMES[b.ability] || b.ability} +${b.bonus}`).join(", ")}
              </div>
              <div>
                <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Speed: </span>
                {pRace.speed} ft
              </div>
              <div>
                <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Size: </span>
                {pRace.size}
              </div>
              <div>
                <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Languages: </span>
                {pRace.languages.join(", ")}
              </div>
            </div>

            {/* Traits */}
            {pRace.traits?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", fontSize: 13 }}>
                <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Racial Traits:</span>
                {pRace.traits.map((t) => (
                  <TraitChip key={t.name} trait={t} asButton />
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <Ripple onClick={() => closePreview()} style={{ ...styles.secondaryBtn, gap: 6, ...(isMobile ? { flex: 1, justifyContent: "center" } : {}) }}>
                <Icon name="arrow_back" size={16} /> Back
              </Ripple>
              <Ripple onClick={() => { setPreviewRace(null); next(); }} style={{ ...styles.primaryBtn, gap: 6, ...(isMobile ? { flex: 1, justifyContent: "center" } : {}) }}>
                <Icon name="check" size={16} /> Confirm {pRace.name}
              </Ripple>
            </div>
          </div>
          </div>
        </div>

        {/* Mini race carousel */}
        <div style={{ position: "relative" }}>
          {!isMobile && raceCarouselOverflows && (
            <Ripple
              onClick={() => raceCarouselRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
              style={{
                position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", zIndex: 2,
                width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--dm-surface-brighter)", border: "1px solid var(--dm-outline-variant)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              <Icon name="chevron_left" size={22} />
            </Ripple>
          )}
          <div
            ref={raceCarouselRef}
            style={{
              display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8,
              scrollbarWidth: "none", msOverflowStyle: "none",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {racesData.map((race) => {
              const img = RACE_IMAGES[race.id];
              const active = race.id === previewRace;
              return (
                <Ripple
                  key={race.id}
                  onClick={() => openRacePreview(race.id)}
                  style={{
                    flexShrink: 0, width: 100, borderRadius: 12, overflow: "hidden",
                    border: active ? "2px solid var(--dm-primary)" : "1px solid var(--dm-outline-variant)",
                    background: "var(--dm-surface)", display: "flex", flexDirection: "column",
                    opacity: active ? 1 : 0.7, transition: "all 0.15s",
                    scrollSnapAlign: "start",
                  }}
                >
                  {img && <img src={img} alt={race.name} loading="lazy" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />}
                  <div style={{ padding: "6px 0", textAlign: "center", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {race.name}
                  </div>
                </Ripple>
              );
            })}
          </div>
          {!isMobile && raceCarouselOverflows && (
            <Ripple
              onClick={() => raceCarouselRef.current?.scrollBy({ left: 240, behavior: "smooth" })}
              style={{
                position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", zIndex: 2,
                width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--dm-surface-brighter)", border: "1px solid var(--dm-outline-variant)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              <Icon name="chevron_right" size={22} />
            </Ripple>
          )}
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div>
      <h2 style={styles.stepTitle}>Choose your Race</h2>
      <p style={styles.stepDesc}>
        Your race determines your physical traits, abilities, and cultural
        background.
      </p>
      <div style={ms(isMobile, styles.cardGrid, { gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" })}>
        {racesData.map((race) => (
          <RaceCard
            key={race.id}
            race={race}
            selected={char.race === race.id}
            onSelect={() => openRacePreview(race.id)}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
}
