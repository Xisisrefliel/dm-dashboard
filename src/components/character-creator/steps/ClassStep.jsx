import { useState } from "react";
import Icon from "../../ui/Icon.jsx";
import Ripple from "../../ui/Ripple.jsx";
import { useIsMobile } from "../../../hooks/useIsMobile.js";
import { styles, ms } from "../styles.js";
import classesData from "../../../data/srd-classes.json";
import { CLASS_IMAGES } from "../../../data/character-images.js";
import { CLASS_ICONS, CLASS_DESCRIPTIONS, CLASS_PRIMARY_ABILITY, SKILL_DESCRIPTIONS, ABILITY_NAMES } from "../../../data/character-constants.js";
import ClassCard from "../cards/ClassCard.jsx";

export default function ClassStep({ char, update, next, prev, haptic, previewClass, setPreviewClass, classCarouselRef, classCarouselOverflows, classData }) {
  const isMobile = useIsMobile();
  const [closing, setClosing] = useState(false);

  const pCls = previewClass ? classesData.find((c) => c.id === previewClass) : null;
  const pImg = previewClass ? CLASS_IMAGES[previewClass] : null;
  const pSkillsFrom = pCls ? pCls.skills.from : [];
  const pSkillsChoose = pCls ? pCls.skills.choose : 0;
  const selectedSkills = char.skills;

  const openPreview = (id) => {
    haptic.trigger("light");
    if (id !== char.class) {
      update("class", id);
      update("skills", []);
      update("equipChoices", {});
    }
    setClosing(false);
    setPreviewClass(id);
  };

  const closePreview = (cb) => {
    setClosing(true);
    setTimeout(() => { setClosing(false); setPreviewClass(null); update("class", ""); update("skills", []); update("equipChoices", {}); cb?.(); }, 250);
  };

  const toggleSkill = (skill) => {
    haptic.trigger("light");
    if (selectedSkills.includes(skill)) {
      update("skills", selectedSkills.filter((s) => s !== skill));
    } else if (selectedSkills.length < pSkillsChoose) {
      update("skills", [...selectedSkills, skill]);
    }
  };

  const confirmClass = () => {
    setPreviewClass(null);
    next();
  };

  if (pCls) {
    // Detail view
    return (
      <div>
        <h2 style={styles.stepTitle}>Choose your Class</h2>

        {/* Detail card */}
        <div key={previewClass} style={{
          position: "relative", borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)", marginBottom: 24,
          animation: `${closing ? "detailCardOut" : "detailCardIn"} ${closing ? "0.25s" : "0.35s"} cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(28, 28, 31, 0.7)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }} />
          <div style={{
            position: "relative", display: "flex", gap: 0,
            animation: `${closing ? "detailContentOut" : "detailContentIn"} ${closing ? "0.25s" : "0.35s"} cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
            ...(isMobile ? { flexDirection: "column" } : { flexWrap: "wrap" }),
          }}>
          {/* Image */}
          {pImg && (
            <div style={isMobile
              ? { width: "100%", height: 200, flexShrink: 0 }
              : { width: 280, minWidth: 280, flexShrink: 0 }
            }>
              <img src={pImg} alt={pCls.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          )}

          {/* Info */}
          <div style={isMobile
            ? { flex: 1, padding: 16 }
            : { flex: 1, padding: "28px 32px", minWidth: 260 }
          }>
            <h3 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px", letterSpacing: "0.02em", textTransform: "uppercase" }}>
              {pCls.name}
            </h3>
            <p style={{ fontSize: 15, color: "var(--dm-text-secondary)", lineHeight: 1.6, margin: "0 0 20px" }}>
              {CLASS_DESCRIPTIONS[pCls.id]}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 14 }}>
                <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Primary Ability: </span>
                {CLASS_PRIMARY_ABILITY[pCls.id]}
              </div>
              <div style={{ fontSize: 14 }}>
                <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Hit Die: </span>
                d{pCls.hitDie}
              </div>
              <div style={{ fontSize: 14 }}>
                <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Saving Throws: </span>
                {pCls.savingThrows.map((s) => ABILITY_NAMES[s] || s).join(", ")}
              </div>

              {/* Skill selection */}
              <div style={{ fontSize: 14, marginTop: 8 }}>
                <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>
                  Skills <span style={{ fontWeight: 400, color: "var(--dm-text-muted)" }}>(choose {pSkillsChoose})</span>:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {pSkillsFrom.map((skill) => {
                    const picked = selectedSkills.includes(skill);
                    const disabled = !picked && selectedSkills.length >= pSkillsChoose;
                    return (
                      <Ripple
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        style={{
                          padding: isMobile ? "10px 16px" : "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                          background: picked ? "var(--dm-primary)" : "var(--dm-surface-bright)",
                          color: picked ? "var(--dm-on-primary)" : disabled ? "var(--dm-text-muted)" : "var(--dm-text)",
                          border: picked ? "1px solid var(--dm-primary)" : "1px solid rgba(255,255,255,0.08)",
                          opacity: disabled ? 0.5 : 1,
                          transition: "all 0.15s",
                        }}
                      >
                        {picked && <Icon name="check" size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />}
                        {skill}
                      </Ripple>
                    );
                  })}
                </div>
                <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginTop: 6, visibility: selectedSkills.length > 0 && selectedSkills.length < pSkillsChoose ? "visible" : "hidden" }}>
                  {selectedSkills.length < pSkillsChoose ? pSkillsChoose - selectedSkills.length : 0} more to choose
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <Ripple onClick={() => closePreview()} style={{ ...styles.secondaryBtn, gap: 6, ...(isMobile ? { flex: 1, justifyContent: "center" } : {}) }}>
                <Icon name="arrow_back" size={16} /> Back
              </Ripple>
              <Ripple
                onClick={selectedSkills.length >= pSkillsChoose ? confirmClass : undefined}
                style={{
                  ...styles.primaryBtn, gap: 6,
                  opacity: selectedSkills.length >= pSkillsChoose ? 1 : 0.4,
                  cursor: selectedSkills.length >= pSkillsChoose ? "pointer" : "default",
                  ...(isMobile ? { flex: 1, justifyContent: "center" } : {}),
                }}
              >
                <Icon name="check" size={16} /> Confirm {pCls.name}
              </Ripple>
            </div>
          </div>
          </div>
        </div>

        {/* Mini class carousel */}
        <div style={{ position: "relative" }}>
          {!isMobile && classCarouselOverflows && (
            <Ripple
              onClick={() => classCarouselRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
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
            ref={classCarouselRef}
            style={{
              display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8,
              scrollbarWidth: "none", msOverflowStyle: "none",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {classesData.map((cls) => {
              const img = CLASS_IMAGES[cls.id];
              const active = cls.id === previewClass;
              return (
                <Ripple
                  key={cls.id}
                  onClick={() => openPreview(cls.id)}
                  style={{
                    flexShrink: 0, width: 100, borderRadius: 12, overflow: "hidden",
                    border: active ? "2px solid var(--dm-primary)" : "1px solid var(--dm-outline-variant)",
                    background: "var(--dm-surface)", display: "flex", flexDirection: "column",
                    opacity: active ? 1 : 0.7, transition: "all 0.15s",
                    scrollSnapAlign: "start",
                  }}
                >
                  {img && <img src={img} alt={cls.name} loading="lazy" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />}
                  <div style={{ padding: "6px 0", textAlign: "center", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {cls.name}
                  </div>
                </Ripple>
              );
            })}
          </div>
          {!isMobile && classCarouselOverflows && (
            <Ripple
              onClick={() => classCarouselRef.current?.scrollBy({ left: 240, behavior: "smooth" })}
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

  // Grid view (no class previewed)
  return (
    <div>
      <h2 style={styles.stepTitle}>Choose your Class</h2>
      <p style={styles.stepDesc}>
        Your class defines your abilities, skills, and role in the party.
      </p>
      <div style={ms(isMobile, styles.cardGrid, { gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" })}>
        {classesData.map((cls) => (
          <ClassCard
            key={cls.id}
            cls={cls}
            selected={char.class === cls.id}
            onSelect={() => openPreview(cls.id)}
          />
        ))}
      </div>
    </div>
  );
}
