import { useState } from "react";
import Icon from "../../ui/Icon.jsx";
import Ripple from "../../ui/Ripple.jsx";
import { useIsMobile } from "../../../hooks/useIsMobile.js";
import { styles, ms } from "../styles.js";
import { BG_IMAGES } from "../../../data/character-images.js";
import { BACKGROUNDS, SKILL_DESCRIPTIONS } from "../../../data/character-constants.js";
import TraitChip from "../cards/TraitChip.jsx";

export default function BackgroundStep({ char, update, next, prev, haptic, previewBg, setPreviewBg, bgCarouselRef, bgCarouselOverflows }) {
  const isMobile = useIsMobile();
  const [closing, setClosing] = useState(false);

  const pBg = previewBg ? BACKGROUNDS.find((b) => b.id === previewBg) : null;
  const pBgImg = previewBg ? BG_IMAGES[previewBg] : null;

  const openBgPreview = (id) => {
    haptic.trigger("light");
    update("background", id);
    setClosing(false);
    setPreviewBg(id);
  };

  const closePreview = (cb) => {
    setClosing(true);
    setTimeout(() => { setClosing(false); setPreviewBg(null); update("background", ""); cb?.(); }, 250);
  };

  if (pBg) {
    return (
      <div>
        <h2 style={styles.stepTitle}>Choose your Background</h2>

        {/* Detail card */}
        <div key={previewBg} style={{
          position: "relative", borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)", marginBottom: 24,
          animation: `${closing ? "detailCardOut" : "detailCardIn"} ${closing ? "0.25s" : "0.35s"} cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
          ...(isMobile ? {} : { height: 360 }),
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(28, 28, 31, 0.7)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }} />
          <div style={{
            position: "relative", display: "flex", gap: 0, height: "100%",
            animation: `${closing ? "detailContentOut" : "detailContentIn"} ${closing ? "0.25s" : "0.35s"} cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
            ...(isMobile ? { flexDirection: "column" } : {}),
          }}>
          {pBgImg && (
            <div style={isMobile
              ? { width: "100%", height: 200, flexShrink: 0 }
              : { width: 240, minWidth: 240, flexShrink: 0 }
            }>
              <img src={pBgImg} alt={pBg.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
            </div>
          )}

          <div style={isMobile
            ? { flex: 1, padding: 16, overflowY: "auto" }
            : { flex: 1, padding: "20px 28px", minWidth: 260, overflowY: "auto" }
          }>
            <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", letterSpacing: "0.02em", textTransform: "uppercase" }}>
              {pBg.name}
            </h3>
            <p style={{ fontSize: 14, color: "var(--dm-text-secondary)", lineHeight: 1.6, margin: "0 0 16px" }}>
              {pBg.desc}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", fontSize: 13 }}>
              <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Skill Proficiencies:</span>
              {pBg.skills.map((skill) => (
                <TraitChip key={skill} trait={{ name: skill, desc: SKILL_DESCRIPTIONS[skill] || skill }} asButton />
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <Ripple onClick={() => closePreview()} style={{ ...styles.secondaryBtn, gap: 6, ...(isMobile ? { flex: 1, justifyContent: "center" } : {}) }}>
                <Icon name="arrow_back" size={16} /> Back
              </Ripple>
              <Ripple onClick={() => { setPreviewBg(null); next(); }} style={{ ...styles.primaryBtn, gap: 6, ...(isMobile ? { flex: 1, justifyContent: "center" } : {}) }}>
                <Icon name="check" size={16} /> Confirm {pBg.name}
              </Ripple>
            </div>
          </div>
          </div>
        </div>

        {/* Mini background carousel */}
        <div style={{ position: "relative" }}>
          {!isMobile && bgCarouselOverflows && (
            <Ripple
              onClick={() => bgCarouselRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
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
            ref={bgCarouselRef}
            style={{
              display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8,
              scrollbarWidth: "none", msOverflowStyle: "none",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {BACKGROUNDS.map((bg) => {
              const img = BG_IMAGES[bg.id];
              const active = bg.id === previewBg;
              return (
                <Ripple
                  key={bg.id}
                  onClick={() => openBgPreview(bg.id)}
                  style={{
                    flexShrink: 0, width: 100, borderRadius: 12, overflow: "hidden",
                    border: active ? "2px solid var(--dm-primary)" : "1px solid var(--dm-outline-variant)",
                    background: "var(--dm-surface)", display: "flex", flexDirection: "column",
                    opacity: active ? 1 : 0.7, transition: "all 0.15s",
                    scrollSnapAlign: "start",
                  }}
                >
                  {img ? (
                    <img src={img} alt={bg.name} loading="lazy" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ width: "100%", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--dm-surface-bright)" }}>
                      <Icon name={bg.icon} size={28} style={{ color: "var(--dm-primary)" }} />
                    </div>
                  )}
                  <div style={{ padding: "6px 0", textAlign: "center", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>
                    {bg.name}
                  </div>
                </Ripple>
              );
            })}
          </div>
          {!isMobile && bgCarouselOverflows && (
            <Ripple
              onClick={() => bgCarouselRef.current?.scrollBy({ left: 240, behavior: "smooth" })}
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
      <h2 style={styles.stepTitle}>Choose your Background</h2>
      <p style={styles.stepDesc}>
        Your background reveals where you came from and your place in the world.
      </p>
      <div style={ms(isMobile, styles.cardGrid, { gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" })}>
        {BACKGROUNDS.map((bg) => {
          const img = BG_IMAGES[bg.id];
          return (
            <Ripple
              key={bg.id}
              onClick={() => openBgPreview(bg.id)}
              style={{
                background: "var(--dm-surface)", borderRadius: 16, padding: 0, overflow: "hidden",
                display: "flex", flexDirection: "column", position: "relative",
                transition: "border-color 0.2s",
                border: char.background === bg.id ? "2px solid var(--dm-primary)" : "1px solid var(--dm-outline-variant)",
              }}
            >
              {img ? (
                <div style={{ width: "100%", aspectRatio: "1", overflow: "hidden" }}>
                  <img src={img} alt={bg.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ) : (
                <div style={{ ...styles.cardIconWrap, margin: "20px 20px 0" }}>
                  <Icon name={bg.icon} size={32} style={{ color: "var(--dm-primary)" }} />
                </div>
              )}
              <div style={{ padding: "12px 20px 16px", borderRadius: 16, marginTop: -16, position: "relative", background: "var(--dm-surface)" }}>
                <div style={styles.cardName}>{bg.name}</div>
                <div style={{ ...styles.cardMeta, marginBottom: 6 }}>{bg.skills.join(", ")}</div>
                <div style={{ ...styles.cardMeta, fontSize: 12, lineHeight: 1.4, opacity: 0.7 }}>{bg.desc}</div>
              </div>
            </Ripple>
          );
        })}
      </div>
    </div>
  );
}
