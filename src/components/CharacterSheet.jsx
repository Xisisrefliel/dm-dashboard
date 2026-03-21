import { useState, useEffect } from "react";
import allSpellsData from "../data/srd-spells.json";
import Icon from "./ui/Icon.jsx";
import Ripple from "./ui/Ripple.jsx";
import { syncCharacterToParty } from "../utils/syncParty.js";
import { loadCharacters, saveCharacters } from "../utils/characterStorage.js";
import { RACE_IMAGES, CLASS_IMAGES } from "../data/character-images.js";
import { BACKGROUNDS, ALIGNMENTS, ABILITIES, ABILITY_NAMES, ABILITY_ICONS, SRD_ITEMS } from "../data/character-constants.js";
import { styles, ms } from "./character-creator/styles.js";
import TraitChip from "./character-creator/cards/TraitChip.jsx";

export default function CharacterSheet({ char, update, onBack, editId, assignedStats, setAssignedStats, raceData, classData, computedEquipment, getRacialBonus, isMobile, haptic }) {
  const [editing, setEditing] = useState(false);
  const [attackRoll, setAttackRoll] = useState(null);
  const [openPanel, setOpenPanel] = useState(null);
  const [spellFilter, setSpellFilter] = useState("all");
  const [spellSearch, setSpellSearch] = useState("");
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [invView, setInvView] = useState("list");
  const [invSearch, setInvSearch] = useState("");
  const [customItem, setCustomItem] = useState({ name: "", icon: "inventory_2", weight: "", desc: "" });

  // Toggle body scroll for the finished character sheet
  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const saveEdits = () => {
    const chars = loadCharacters();
    const charToSave = { ...char, assignedStats, id: editId || char.id || Date.now().toString() };
    const idx = chars.findIndex((c) => c.id === charToSave.id);
    if (idx >= 0) chars[idx] = charToSave;
    else chars.push(charToSave);
    saveCharacters(chars);
    syncCharacterToParty(charToSave);
    haptic.trigger("success");
    setEditing(false);
  };

  const bgData = BACKGROUNDS.find((b) => b.id === char.background);
  const alData = ALIGNMENTS.find((a) => a.id === char.alignment);

  const rImg = char.race ? RACE_IMAGES[char.race] : null;
  const cImg = char.class ? CLASS_IMAGES[char.class] : null;
  const hp = classData ? classData.hitDie + (char.level - 1) * (Math.floor(classData.hitDie / 2) + 1) : 0;
  const profBonus = Math.ceil(char.level / 4) + 1;

  const inputStyle = {
    background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
    borderRadius: 10, padding: "6px 10px", color: "var(--dm-text)", fontSize: 14,
    outline: "none", width: "100%",
  };

  return (
    <div style={{ ...styles.root, height: "auto", minHeight: isMobile ? "100dvh" : "100vh", overflow: "visible" }}>
      <div style={ms(isMobile, styles.topBar, { height: 56, minHeight: 56 })}>
        <Ripple onClick={onBack} style={styles.backBtn}>
          <Icon name="arrow_back" />
        </Ripple>
        {!isMobile && <Icon name="shield_with_house" size={24} filled style={{ color: "var(--dm-primary)" }} />}
        <span style={{ fontSize: 16, fontWeight: 600 }}>Character Sheet</span>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: isMobile ? "16px 16px" : "24px 20px" }}>
        {/* Hero section */}
        <div style={{
          display: "flex", gap: 0, background: "var(--dm-surface)", borderRadius: 20,
          overflow: "hidden", border: "1px solid var(--dm-outline-variant)", marginBottom: 24,
          ...(isMobile ? { flexDirection: "column" } : {}),
        }}>
          {(cImg || rImg) && (
            <div style={isMobile
              ? { width: "100%", height: 200, flexShrink: 0 }
              : { width: 240, minWidth: 240, flexShrink: 0 }
            }>
              <img src={cImg || rImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
            </div>
          )}
          <div style={isMobile ? { flex: 1, padding: 16 } : { flex: 1, padding: "24px 28px" }}>
            {editing ? (
              <input
                value={char.name}
                onChange={(e) => update("name", e.target.value)}
                style={{ ...inputStyle, fontSize: 28, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}
                placeholder="Character name"
              />
            ) : (
              <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                {char.name || "Unnamed Hero"}
              </h2>
            )}

            {editing ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 14, color: "var(--dm-text-muted)" }}>Level</span>
                <Ripple onClick={() => update("level", Math.max(1, char.level - 1))} style={{
                  width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                }}>
                  <Icon name="remove" size={16} />
                </Ripple>
                <span style={{ fontSize: 18, fontWeight: 700, color: "var(--dm-primary)", minWidth: 24, textAlign: "center" }}>{char.level}</span>
                <Ripple onClick={() => update("level", Math.min(20, char.level + 1))} style={{
                  width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                }}>
                  <Icon name="add" size={16} />
                </Ripple>
                <span style={{ fontSize: 13, color: "var(--dm-text-secondary)", marginLeft: 8 }}>
                  {raceData?.name} {classData?.name}{bgData ? ` · ${bgData.name}` : ""}
                </span>
              </div>
            ) : (
              <div style={{ fontSize: 15, color: "var(--dm-text-secondary)", marginBottom: 16 }}>
                Level {char.level} {raceData?.name} {classData?.name}
                {bgData && ` · ${bgData.name}`}
              </div>
            )}

            {(() => {
              // Calculate AC from equipment
              const dexScore = (assignedStats.DEX ?? 10) + getRacialBonus("DEX");
              const dexMod = Math.floor((dexScore - 10) / 2);
              let baseAC = 10 + dexMod; // unarmored
              let hasShield = false;
              computedEquipment.forEach((it) => {
                const props = it.properties || "";
                if (props.includes("+2 Armor Class")) { hasShield = true; return; }
                const acMatch = props.match(/AC (\d+)/);
                if (acMatch) {
                  const armorAC = parseInt(acMatch[1]);
                  if (props.includes("max 2")) baseAC = armorAC + Math.min(dexMod, 2);
                  else if (props.includes("Dex modifier")) baseAC = armorAC + dexMod;
                  else baseAC = armorAC; // heavy armor, no dex
                }
              });
              if (hasShield) baseAC += 2;
              // Monk/Barbarian unarmored defense
              const hasArmor = computedEquipment.some((it) => (it.properties || "").match(/AC \d+/));
              if (!hasArmor && char.class === "barbarian") {
                const conScore = (assignedStats.CON ?? 10) + getRacialBonus("CON");
                const conMod = Math.floor((conScore - 10) / 2);
                baseAC = 10 + dexMod + conMod + (hasShield ? 2 : 0);
              } else if (!hasArmor && char.class === "monk") {
                const wisScore = (assignedStats.WIS ?? 10) + getRacialBonus("WIS");
                const wisMod = Math.floor((wisScore - 10) / 2);
                baseAC = 10 + dexMod + wisMod;
              }
              const ac = char.acOverride != null ? char.acOverride : baseAC;

              return (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", fontSize: 14 }}>
                  <div>
                    <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>AC: </span>
                    {editing ? (
                      <input
                        type="number"
                        value={char.acOverride != null ? char.acOverride : baseAC}
                        onChange={(e) => {
                          const v = parseInt(e.target.value);
                          update("acOverride", isNaN(v) || v === baseAC ? null : v);
                        }}
                        style={{ ...inputStyle, width: 48, padding: "2px 6px", fontSize: 14, display: "inline-block" }}
                      />
                    ) : (
                      <span style={{ fontWeight: 700 }}>{ac}</span>
                    )}
                  </div>
                  <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>HP: </span>{hp}</div>
                  <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Hit Die: </span>d{classData?.hitDie}</div>
                  <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Proficiency: </span>+{profBonus}</div>
                  <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Speed: </span>{raceData?.speed} ft</div>
                  {alData && <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Alignment: </span>{alData.name}</div>}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Ability Scores */}
        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(6, 1fr)", gap: 10, marginBottom: 24,
        }}>
          {ABILITIES.map((ab) => {
            const base = assignedStats[ab] ?? 10;
            const racial = getRacialBonus(ab);
            const total = base + racial;
            const mod = Math.floor((total - 10) / 2);
            return (
              <div key={ab} style={{
                background: "var(--dm-surface)", borderRadius: 16, padding: 16, textAlign: "center",
                border: "1px solid var(--dm-outline-variant)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--dm-text-muted)", letterSpacing: 1, marginBottom: 4 }}>{ab}</div>
                {editing ? (
                  <input
                    type="number"
                    value={base}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      setAssignedStats((s) => ({ ...s, [ab]: Math.max(1, Math.min(30, v)) }));
                    }}
                    style={{
                      ...inputStyle, width: 52, fontSize: 22, fontWeight: 700, textAlign: "center",
                      padding: "4px", color: "var(--dm-primary)",
                    }}
                  />
                ) : (
                  <div style={{ fontSize: 28, fontWeight: 700, color: "var(--dm-primary)" }}>{total}</div>
                )}
                <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", marginTop: 2 }}>
                  {editing && racial > 0 ? `+${racial} racial = ${total} · ` : ""}
                  {mod >= 0 ? "+" : ""}{mod}
                </div>
              </div>
            );
          })}
        </div>

        {/* Attack Options */}
        {(() => {
          // Gather weapons from equipment + inventory
          const allEquip = [
            ...computedEquipment,
            ...(char.inventory || []),
          ];
          const weapons = allEquip.filter((it) => it.damage);

          // Gather damage-dealing spells (cantrips + known spells)
          const attackSpells = [...char.cantrips, ...char.spells]
            .map((id) => allSpellsData.find((s) => s.id === id))
            .filter((sp) => sp && /\d+d\d+/.test(sp.description));

          // Parse dice string like "1d6", "2d8", "3d10"
          const parseDice = (str) => {
            const m = str.match(/(\d+)d(\d+)/);
            if (!m) return null;
            return { count: parseInt(m[1]), sides: parseInt(m[2]) };
          };

          const rollDice = (count, sides) => {
            return Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
          };

          const doAttack = (name, diceStr, type, isSpell) => {
            const d = parseDice(diceStr);
            if (!d) return;
            // Roll to hit (d20 + modifier)
            const profBonus2 = Math.ceil(char.level / 4) + 1;
            let abilityMod = 0;
            if (isSpell) {
              const castAb = classData?.spellcasting?.ability;
              const abScore = (assignedStats[castAb] ?? 10) + getRacialBonus(castAb || "");
              abilityMod = Math.floor((abScore - 10) / 2);
            } else {
              // Use STR for melee, DEX for finesse/ranged
              const strScore = (assignedStats.STR ?? 10) + getRacialBonus("STR");
              const dexScore = (assignedStats.DEX ?? 10) + getRacialBonus("DEX");
              const strMod = Math.floor((strScore - 10) / 2);
              const dexMod = Math.floor((dexScore - 10) / 2);
              abilityMod = type.includes("finesse") || type.includes("ranged") ? Math.max(strMod, dexMod) : strMod;
            }
            const hitRoll = Math.floor(Math.random() * 20) + 1;
            const hitTotal = hitRoll + abilityMod + profBonus2;
            const isCrit = hitRoll === 20;
            // Roll damage
            const dmgRolls = rollDice(isCrit ? d.count * 2 : d.count, d.sides);
            const dmgTotal = dmgRolls.reduce((s, v) => s + v, 0) + (isSpell ? 0 : abilityMod);
            setAttackRoll({
              name, dice: diceStr, type, isSpell,
              hitRoll, hitTotal, isCrit, hitMiss: hitRoll === 1,
              abilityMod, profBonus: profBonus2,
              dmgRolls, dmgTotal,
            });
          };

          // Extract damage info from spell description
          const getSpellDamage = (sp) => {
            const m = sp.description.match(/(\d+d\d+)\s+(\w+)\s+damage/i);
            return m ? { dice: m[1], type: m[2].toLowerCase() } : null;
          };

          if (weapons.length === 0 && attackSpells.length === 0) return null;

          return (
            <div style={{
              background: "var(--dm-surface)", borderRadius: 16, padding: 20, marginBottom: 24,
              border: "1px solid var(--dm-outline-variant)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 }}>
                Attack Options
              </div>

              {/* Attack roll result */}
              {attackRoll && (
                <div style={{
                  background: attackRoll.isCrit ? "#1a237e" : attackRoll.hitMiss ? "#3a1510" : "var(--dm-surface-bright)",
                  borderRadius: 14, padding: 16, marginBottom: 16,
                  border: attackRoll.isCrit ? "1px solid #7c4dff" : attackRoll.hitMiss ? "1px solid var(--dm-error, #ffb4ab)" : "1px solid var(--dm-outline-variant)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{attackRoll.name}</span>
                    {attackRoll.isCrit && <span style={{ fontSize: 12, fontWeight: 700, color: "#7c4dff", background: "#7c4dff22", padding: "2px 10px", borderRadius: 8 }}>CRITICAL HIT!</span>}
                    {attackRoll.hitMiss && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--dm-error, #ffb4ab)", background: "#ffb4ab22", padding: "2px 10px", borderRadius: 8 }}>NATURAL 1</span>}
                  </div>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--dm-text-muted)", marginBottom: 2 }}>To Hit</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: "var(--dm-primary)" }}>
                        {attackRoll.hitTotal}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--dm-text-muted)" }}>
                        d20({attackRoll.hitRoll}) + {attackRoll.abilityMod} + {attackRoll.profBonus}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--dm-text-muted)", marginBottom: 2 }}>Damage</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: attackRoll.isCrit ? "#7c4dff" : "var(--dm-primary)" }}>
                        {attackRoll.dmgTotal}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--dm-text-muted)" }}>
                        [{attackRoll.dmgRolls.join(", ")}]{!attackRoll.isSpell && attackRoll.abilityMod !== 0 ? ` + ${attackRoll.abilityMod}` : ""} {attackRoll.type}
                      </div>
                    </div>
                  </div>
                  <Ripple onClick={() => setAttackRoll(null)} style={{
                    fontSize: 12, color: "var(--dm-text-muted)", marginTop: 10,
                    display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 10,
                  }}>
                    <Icon name="close" size={14} /> Dismiss
                  </Ripple>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: weapons.length > 0 && attackSpells.length > 0 && !isMobile ? "1fr 1fr" : "1fr", gap: 16 }}>
                {/* Weapons */}
                {weapons.length > 0 && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      <Icon name="swords" size={16} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--dm-primary)" }} />
                      Weapons
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {weapons.map((w, i) => (
                        <Ripple key={w.id + "-" + i} onClick={() => doAttack(w.name, w.damage.split(" ")[0], w.damage.split(" ").slice(1).join(" "), false)} style={{
                          padding: "10px 14px", borderRadius: 12,
                          border: "1px dashed var(--dm-outline-variant)",
                          background: "transparent", cursor: "pointer",
                        }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{w.name}</div>
                          <div style={{ fontSize: 12, color: "var(--dm-text-muted)" }}>{w.damage}</div>
                        </Ripple>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spell attacks */}
                {attackSpells.length > 0 && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      <Icon name="auto_fix_high" size={16} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--dm-primary)" }} />
                      Spells
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {attackSpells.map((sp) => {
                        const dmg = getSpellDamage(sp);
                        if (!dmg) return null;
                        return (
                          <Ripple key={sp.id} onClick={() => doAttack(sp.name, dmg.dice, dmg.type, true)} style={{
                            padding: "10px 14px", borderRadius: 12,
                            border: "1px dashed var(--dm-outline-variant)",
                            background: "transparent", cursor: "pointer",
                          }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{sp.name}</div>
                            <div style={{ fontSize: 12, color: "var(--dm-text-muted)" }}>{dmg.dice} {dmg.type}</div>
                          </Ripple>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Skills & Saving Throws */}
        {(() => {
          const SKILLS_TABLE = [
            { name: "Acrobatics", ability: "DEX" },
            { name: "Animal Handling", ability: "WIS" },
            { name: "Arcana", ability: "INT" },
            { name: "Athletics", ability: "STR" },
            { name: "Deception", ability: "CHA" },
            { name: "History", ability: "INT" },
            { name: "Insight", ability: "WIS" },
            { name: "Intimidation", ability: "CHA" },
            { name: "Investigation", ability: "INT" },
            { name: "Medicine", ability: "WIS" },
            { name: "Nature", ability: "INT" },
            { name: "Perception", ability: "WIS" },
            { name: "Performance", ability: "CHA" },
            { name: "Persuasion", ability: "CHA" },
            { name: "Religion", ability: "INT" },
            { name: "Sleight of Hand", ability: "DEX" },
            { name: "Stealth", ability: "DEX" },
            { name: "Survival", ability: "WIS" },
          ];
          const proficientSkills = new Set([...char.skills, ...(bgData?.skills || [])]);
          return (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div style={{
                background: "var(--dm-surface)", borderRadius: 16, padding: isMobile ? 16 : 20,
                border: "1px solid var(--dm-outline-variant)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 }}>
                  Skills
                </div>
                <div style={{
                  display: "flex", alignItems: "center", padding: "6px 10px",
                  fontSize: 11, fontWeight: 600, color: "var(--dm-text-muted)",
                  borderBottom: "1px solid var(--dm-outline-variant)", marginBottom: 2,
                }}>
                  <span style={{ width: 28 }}>Prof.</span>
                  <span style={{ width: 42, textAlign: "center" }}>Attr.</span>
                  <span style={{ flex: 1, marginLeft: 8 }}>Skill</span>
                  <span style={{ width: 40, textAlign: "right" }}>Mod.</span>
                </div>
                {SKILLS_TABLE.map((skill, i) => {
                  const isProficient = proficientSkills.has(skill.name);
                  const abScore = (assignedStats[skill.ability] ?? 10) + getRacialBonus(skill.ability);
                  const abMod = Math.floor((abScore - 10) / 2);
                  const totalMod = isProficient ? abMod + profBonus : abMod;
                  const modStr = (totalMod >= 0 ? "+" : "") + totalMod;
                  return (
                    <div key={skill.name} style={{
                      display: "flex", alignItems: "center", padding: "7px 10px",
                      borderRadius: 8,
                      background: i % 2 === 0 ? "var(--dm-surface-bright)" : "transparent",
                    }}>
                      <span style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: 4,
                          background: isProficient ? "var(--dm-primary)" : "transparent",
                          border: isProficient ? "none" : "1.5px solid var(--dm-text-muted)",
                        }} />
                      </span>
                      <span style={{
                        width: 42, textAlign: "center",
                        fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                        color: "var(--dm-text-secondary)",
                        background: "var(--dm-surface)", borderRadius: 6, padding: "2px 6px",
                        border: "1px solid var(--dm-outline-variant)",
                      }}>
                        {skill.ability}
                      </span>
                      <span style={{
                        flex: 1, marginLeft: 8, fontSize: 14,
                        fontWeight: isProficient ? 600 : 400,
                        color: isProficient ? "var(--dm-primary)" : "var(--dm-text)",
                      }}>
                        {skill.name}
                      </span>
                      <span style={{
                        width: 40, textAlign: "right",
                        fontSize: 14, fontWeight: 700,
                        color: isProficient ? "var(--dm-primary)" : "var(--dm-text)",
                      }}>
                        {modStr}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ alignSelf: "start", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                background: "var(--dm-surface)", borderRadius: 16, padding: 20,
                border: "1px solid var(--dm-outline-variant)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 }}>
                  Saving Throws
                </div>
                {(() => {
                  const saveProficient = new Set(classData?.savingThrows || []);
                  return ABILITIES.map((ab, i) => {
                    const isProf = saveProficient.has(ab);
                    const abScore = (assignedStats[ab] ?? 10) + getRacialBonus(ab);
                    const abMod = Math.floor((abScore - 10) / 2);
                    const totalMod = isProf ? abMod + profBonus : abMod;
                    const modStr = (totalMod >= 0 ? "+" : "") + totalMod;
                    return (
                      <div key={ab} style={{
                        display: "flex", alignItems: "center", padding: "8px 10px",
                        borderRadius: 8,
                        background: i % 2 === 0 ? "var(--dm-surface-bright)" : "transparent",
                      }}>
                        <span style={{ width: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{
                            width: 8, height: 8, borderRadius: 4,
                            background: isProf ? "var(--dm-primary)" : "transparent",
                            border: isProf ? "none" : "1.5px solid var(--dm-text-muted)",
                          }} />
                        </span>
                        <span style={{
                          flex: 1, fontSize: 14,
                          fontWeight: isProf ? 600 : 400,
                          color: isProf ? "var(--dm-primary)" : "var(--dm-text)",
                        }}>
                          {ABILITY_NAMES[ab]}
                        </span>
                        <span style={{
                          fontSize: 14, fontWeight: 700,
                          color: isProf ? "var(--dm-primary)" : "var(--dm-text)",
                        }}>
                          {modStr}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>

              {computedEquipment.length > 0 && (
                <div style={{
                  background: "var(--dm-surface)", borderRadius: 16, padding: 20,
                  border: "1px solid var(--dm-outline-variant)",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
                    Equipment
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {computedEquipment.map((eq, i) => (
                      <span key={eq.id + "-" + i} style={{
                        padding: "6px 14px", borderRadius: 16, fontSize: 13,
                        background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                        display: "inline-flex", alignItems: "center", gap: 6,
                      }}>
                        <Icon name={eq.icon} size={16} style={{ color: "var(--dm-primary)" }} />
                        {eq.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(char.cantrips.length > 0 || char.spells.length > 0) && (
                <div style={{
                  background: "var(--dm-surface)", borderRadius: 16, padding: 20,
                  border: "1px solid var(--dm-outline-variant)",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
                    Spells
                  </div>
                  {char.cantrips.length > 0 && (
                    <div style={{ marginBottom: char.spells.length > 0 ? 12 : 0 }}>
                      <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginBottom: 6 }}>Cantrips</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {char.cantrips.map((id) => {
                          const sp = allSpellsData.find((s) => s.id === id);
                          return sp ? (
                            <Ripple key={id} onClick={() => { setSelectedSpell(sp); setOpenPanel("spellbook"); }} style={{
                              padding: "5px 12px", borderRadius: 16, fontSize: 12,
                              background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                              color: "var(--dm-primary)", cursor: "pointer",
                            }}>
                              {sp.name}
                            </Ripple>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  {char.spells.length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginBottom: 6 }}>1st Level</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {char.spells.map((id) => {
                          const sp = allSpellsData.find((s) => s.id === id);
                          return sp ? (
                            <Ripple key={id} onClick={() => { setSelectedSpell(sp); setOpenPanel("spellbook"); }} style={{
                              padding: "5px 12px", borderRadius: 16, fontSize: 12,
                              background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                              color: "var(--dm-primary)", cursor: "pointer",
                            }}>
                              {sp.name}
                            </Ripple>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {raceData?.traits?.length > 0 && (
                <div style={{
                  background: "var(--dm-surface)", borderRadius: 16, padding: 20,
                  border: "1px solid var(--dm-outline-variant)",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
                    Racial Traits
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {raceData.traits.map((t) => (
                      <TraitChip key={t.name} trait={t} asButton />
                    ))}
                  </div>
                </div>
              )}
              </div>
            </div>
          );
        })()}



        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 8, paddingBottom: 80 }}>
          {editing ? (
            <>
              <Ripple onClick={() => { haptic.trigger("light"); setEditing(false); }} style={{ ...styles.secondaryBtn, gap: 6 }}>
                <Icon name="close" size={16} /> Cancel
              </Ripple>
              <Ripple onClick={saveEdits} style={{ ...styles.primaryBtn, gap: 6 }}>
                <Icon name="save" size={16} /> Save Changes
              </Ripple>
            </>
          ) : (
            <>
              <Ripple onClick={() => { haptic.trigger("light"); setEditing(true); }} style={{ ...styles.secondaryBtn, gap: 6 }}>
                <Icon name="edit" size={16} /> Edit Character
              </Ripple>
              <Ripple onClick={() => onBack()} style={{ ...styles.primaryBtn, gap: 6 }}>
                <Icon name="check" size={16} /> Done
              </Ripple>
            </>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", justifyContent: "center", gap: 12,
        padding: isMobile ? "12px 16px" : "12px 20px",
        paddingBottom: isMobile ? "calc(12px + env(safe-area-inset-bottom, 0px))" : 12,
        background: "linear-gradient(transparent, var(--dm-bg) 30%)",
        pointerEvents: "none",
      }}>
        <Ripple
          onClick={() => { haptic.trigger("medium"); setOpenPanel(openPanel === "inventory" ? null : "inventory"); }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "12px 24px", borderRadius: 24,
            background: openPanel === "inventory" ? "var(--dm-primary)" : "var(--dm-surface)",
            color: openPanel === "inventory" ? "var(--dm-on-primary)" : "var(--dm-text)",
            border: "1px solid var(--dm-outline-variant)",
            fontWeight: 600, fontSize: 14, pointerEvents: "auto",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <Icon name="backpack" size={20} /> Inventory
        </Ripple>
        <Ripple
          onClick={() => { haptic.trigger("medium"); setOpenPanel(openPanel === "spellbook" ? null : "spellbook"); setSpellFilter("my"); setSpellSearch(""); setSelectedSpell(null); }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "12px 24px", borderRadius: 24,
            background: openPanel === "spellbook" ? "var(--dm-primary)" : "var(--dm-surface)",
            color: openPanel === "spellbook" ? "var(--dm-on-primary)" : "var(--dm-text)",
            border: "1px solid var(--dm-outline-variant)",
            fontWeight: 600, fontSize: 14, pointerEvents: "auto",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <Icon name="auto_stories" size={20} /> Spellbook
        </Ripple>
      </div>

      {/* Modal overlay */}
      {openPanel && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 60,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.6)",
        }}>
          {/* Backdrop click */}
          <div onClick={() => setOpenPanel(null)} style={{ position: "absolute", inset: 0 }} />
          {/* Modal */}
          <div style={isMobile ? {
            position: "relative", width: "100%", height: "100%",
            background: "var(--dm-surface)", display: "flex", flexDirection: "column",
            overflow: "hidden",
          } : {
            position: "relative", width: "90%", maxWidth: 700,
            maxHeight: "80vh", background: "var(--dm-surface)",
            borderRadius: 20, display: "flex", flexDirection: "column",
            overflow: "hidden", border: "1px solid var(--dm-outline-variant)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
          }}>
            {/* Panel header */}
            <div style={{
              display: "flex", alignItems: "center", padding: "16px 20px", gap: 12,
              borderBottom: "1px solid var(--dm-outline-variant)", flexShrink: 0,
            }}>
              <Icon
                name={openPanel === "inventory" ? "backpack" : "auto_stories"}
                size={24} style={{ color: "var(--dm-primary)" }}
              />
              <span style={{ fontSize: 18, fontWeight: 700, flex: 1 }}>
                {openPanel === "inventory" ? "Inventory" : "Spellbook"}
              </span>
              <Ripple onClick={() => setOpenPanel(null)} style={{
                width: 36, height: 36, borderRadius: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--dm-surface-bright)",
              }}>
                <Icon name="close" size={20} />
              </Ripple>
            </div>

            {/* Panel content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
              {openPanel === "inventory" && (() => {
                // Merge equipment (from creation) + inventory (added later)
                const allItems = [
                  ...computedEquipment.map((eq) => ({ ...eq, source: "equipment" })),
                  ...(char.inventory || []).map((it) => ({ ...it, source: "inventory" })),
                ];

                const removeItem = (idx) => {
                  const inv = [...(char.inventory || [])];
                  inv.splice(idx, 1);
                  update("inventory", inv);
                };

                const addSrdItem = (item) => {
                  update("inventory", [...(char.inventory || []), { ...item, id: item.id + "-" + Date.now() }]);
                  setInvView("list");
                  setInvSearch("");
                };

                const addCustomItem = () => {
                  if (!customItem.name.trim()) return;
                  update("inventory", [...(char.inventory || []), {
                    id: "custom-" + Date.now(),
                    name: customItem.name.trim(),
                    icon: customItem.icon || "inventory_2",
                    weight: customItem.weight || undefined,
                    desc: customItem.desc || undefined,
                    custom: true,
                  }]);
                  setCustomItem({ name: "", icon: "inventory_2", weight: "", desc: "" });
                  setInvView("list");
                };

                // Add item view
                if (invView === "add") {
                  const q = invSearch.toLowerCase();
                  const filtered = SRD_ITEMS.filter((it) =>
                    it.name.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)
                  );
                  return (
                    <div>
                      <Ripple onClick={() => { setInvView("list"); setInvSearch(""); }} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "6px 14px", borderRadius: 16, fontSize: 13,
                        color: "var(--dm-text-muted)", marginBottom: 12,
                      }}>
                        <Icon name="arrow_back" size={16} /> Back to inventory
                      </Ripple>
                      <input
                        value={invSearch}
                        onChange={(e) => setInvSearch(e.target.value)}
                        placeholder="Search items..."
                        className="m3input"
                        style={{ width: "100%", fontSize: 14, marginBottom: 12, boxSizing: "border-box" }}
                      />
                      <Ripple onClick={() => setInvView("custom")} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                        background: "var(--dm-surface-bright)", borderRadius: 12,
                        border: "1px dashed var(--dm-outline-variant)", marginBottom: 12,
                        fontSize: 14, fontWeight: 500, color: "var(--dm-primary)",
                      }}>
                        <Icon name="add_circle" size={22} /> Create Custom Item
                      </Ripple>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {filtered.map((item) => (
                          <Ripple key={item.id} onClick={() => addSrdItem(item)} style={{
                            display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                            background: "var(--dm-surface-bright)", borderRadius: 12,
                            border: "1px solid var(--dm-outline-variant)",
                          }}>
                            <Icon name={item.icon} size={20} style={{ color: "var(--dm-primary)", flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
                              <div style={{ fontSize: 11, color: "var(--dm-text-muted)" }}>{item.weight}{item.weight ? " · " : ""}{item.desc}</div>
                            </div>
                            <Icon name="add" size={18} style={{ color: "var(--dm-primary)", flexShrink: 0 }} />
                          </Ripple>
                        ))}
                      </div>
                    </div>
                  );
                }

                // Custom item form
                if (invView === "custom") {
                  const fieldStyle = {
                    width: "100%", boxSizing: "border-box", fontSize: 14,
                    padding: "10px 12px", borderRadius: 12,
                    background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                    color: "var(--dm-text)", outline: "none",
                  };
                  return (
                    <div>
                      <Ripple onClick={() => setInvView("add")} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "6px 14px", borderRadius: 16, fontSize: 13,
                        color: "var(--dm-text-muted)", marginBottom: 16,
                      }}>
                        <Icon name="arrow_back" size={16} /> Back
                      </Ripple>
                      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Create Custom Item</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginBottom: 4 }}>Item Name *</div>
                          <input value={customItem.name} onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                            placeholder="e.g. Mysterious Amulet" style={fieldStyle} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginBottom: 4 }}>Weight</div>
                          <input value={customItem.weight} onChange={(e) => setCustomItem({ ...customItem, weight: e.target.value })}
                            placeholder="e.g. 1 lb" style={fieldStyle} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginBottom: 4 }}>Description</div>
                          <textarea value={customItem.desc} onChange={(e) => setCustomItem({ ...customItem, desc: e.target.value })}
                            placeholder="Describe the item..." rows={3}
                            style={{ ...fieldStyle, resize: "vertical", fontFamily: "inherit" }} />
                        </div>
                        <Ripple
                          onClick={addCustomItem}
                          style={{
                            padding: "10px 24px", borderRadius: 20, fontWeight: 500, fontSize: 14,
                            background: customItem.name.trim() ? "var(--dm-primary)" : "var(--dm-surface-bright)",
                            color: customItem.name.trim() ? "var(--dm-on-primary)" : "var(--dm-text-muted)",
                            display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start",
                          }}
                        >
                          <Icon name="add" size={18} /> Add Item
                        </Ripple>
                      </div>
                    </div>
                  );
                }

                // List view
                return (
                  <div>
                    <Ripple onClick={() => setInvView("add")} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
                      background: "var(--dm-surface-bright)", borderRadius: 12,
                      border: "1px dashed var(--dm-outline-variant)", marginBottom: 16,
                      fontSize: 14, fontWeight: 500, color: "var(--dm-primary)", justifyContent: "center",
                    }}>
                      <Icon name="add" size={20} /> Add Item
                    </Ripple>

                    {allItems.length === 0 ? (
                      <div style={{ textAlign: "center", padding: 40, color: "var(--dm-text-muted)" }}>
                        <Icon name="inventory_2" size={48} style={{ opacity: 0.4, marginBottom: 12 }} />
                        <div style={{ fontSize: 15 }}>No items in inventory</div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {allItems.map((item, i) => (
                          <div key={item.id + "-" + i} style={{
                            display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px",
                            background: "var(--dm-surface-bright)", borderRadius: 14,
                            border: "1px solid var(--dm-outline-variant)",
                          }}>
                            <Icon name={item.icon || "inventory_2"} size={24} style={{ color: "var(--dm-primary)", marginTop: 2, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 15, fontWeight: 600 }}>{item.name}</div>
                              {item.damage && <div style={{ fontSize: 12, color: "var(--dm-text-secondary)", marginTop: 2 }}>Damage: {item.damage}</div>}
                              {item.properties && <div style={{ fontSize: 12, color: "var(--dm-text-secondary)" }}>Properties: {item.properties}</div>}
                              {item.weight && <div style={{ fontSize: 12, color: "var(--dm-text-muted)" }}>Weight: {item.weight}</div>}
                              {item.desc && <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginTop: 4, lineHeight: 1.4 }}>{item.desc}</div>}
                            </div>
                            {item.source === "inventory" ? (
                              <Ripple onClick={() => {
                                removeItem(i - computedEquipment.length);
                              }} style={{
                                width: 32, height: 32, borderRadius: 10,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                              }}>
                                <Icon name="delete" size={18} style={{ color: "var(--dm-error, #ffb4ab)" }} />
                              </Ripple>
                            ) : (
                              <Icon name="lock" size={16} style={{ color: "var(--dm-text-muted)", flexShrink: 0, opacity: 0.5 }} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {openPanel === "spellbook" && (() => {
                // Spell detail view
                if (selectedSpell) {
                  const sp = selectedSpell;
                  const known = [...char.cantrips, ...char.spells].includes(sp.id);
                  const schoolIcon = sp.school === "Evocation" ? "local_fire_department" :
                    sp.school === "Abjuration" ? "shield" :
                    sp.school === "Conjuration" ? "auto_awesome" :
                    sp.school === "Divination" ? "visibility" :
                    sp.school === "Enchantment" ? "psychology" :
                    sp.school === "Illusion" ? "blur_on" :
                    sp.school === "Necromancy" ? "skull" :
                    sp.school === "Transmutation" ? "swap_horiz" : "auto_fix_high";
                  return (
                    <div>
                      <Ripple onClick={() => setSelectedSpell(null)} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "6px 14px", borderRadius: 16, fontSize: 13,
                        color: "var(--dm-text-muted)", marginBottom: 16,
                      }}>
                        <Icon name="arrow_back" size={16} /> Back to spells
                      </Ripple>

                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 14,
                          background: "var(--dm-surface-bright)", display: "flex",
                          alignItems: "center", justifyContent: "center",
                        }}>
                          <Icon name={schoolIcon} size={28} style={{ color: "var(--dm-primary)" }} />
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 22, fontWeight: 700 }}>{sp.name}</span>
                            {known && <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 8, background: "var(--dm-primary)", color: "var(--dm-on-primary)", fontWeight: 600 }}>KNOWN</span>}
                          </div>
                          <div style={{ fontSize: 13, color: "var(--dm-text-muted)" }}>
                            {sp.level === 0 ? "Cantrip" : `Level ${sp.level}`} · {sp.school}
                          </div>
                        </div>
                      </div>

                      <div style={{
                        display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px 20px",
                        background: "var(--dm-surface-bright)", borderRadius: 14, padding: isMobile ? 12 : 16, marginBottom: 16,
                        fontSize: 13,
                      }}>
                        <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Casting Time: </span>{sp.castingTime}</div>
                        <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Range: </span>{sp.range}</div>
                        <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Duration: </span>{sp.duration}{sp.concentration ? " (Concentration)" : ""}</div>
                        <div>
                          <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Components: </span>
                          {sp.components ? sp.components.map((c) => c === "V" ? "Verbal" : c === "S" ? "Somatic" : c === "M" ? "Material" : c).join(", ") : "\u2014"}
                        </div>
                        {sp.material && (
                          <div style={{ gridColumn: "1 / -1" }}>
                            <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Material: </span>{sp.material}
                          </div>
                        )}
                        {sp.ritual && (
                          <div><span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Ritual: </span>Yes</div>
                        )}
                        <div style={{ gridColumn: "1 / -1" }}>
                          <span style={{ color: "var(--dm-primary)", fontWeight: 600 }}>Classes: </span>{sp.classes.join(", ")}
                        </div>
                      </div>

                      <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--dm-text-secondary)" }}>
                        {sp.description}
                      </div>

                      {sp.higherLevel && (
                        <div style={{
                          marginTop: 16, padding: 14, borderRadius: 12,
                          background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                        }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-primary)", marginBottom: 4 }}>At Higher Levels</div>
                          <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", lineHeight: 1.5 }}>{sp.higherLevel}</div>
                        </div>
                      )}
                    </div>
                  );
                }

                const className = char.class ? char.class.charAt(0).toUpperCase() + char.class.slice(1) : "";
                const classSpells = char.class
                  ? allSpellsData.filter((s) => s.classes.map((c) => c.toLowerCase()).includes(char.class))
                  : [];
                const mySpellIds = new Set([...char.cantrips, ...char.spells]);
                const maxSpellLevel = Math.min(9, char.level >= 17 ? 9 : char.level >= 15 ? 8 : char.level >= 13 ? 7 :
                  char.level >= 11 ? 6 : char.level >= 9 ? 5 : char.level >= 7 ? 4 :
                  char.level >= 5 ? 3 : char.level >= 3 ? 2 : 1);
                const availableLevels = [...new Set(classSpells.map((s) => s.level))].sort((a, b) => a - b);

                let filtered = classSpells;
                if (spellFilter === "my") {
                  filtered = allSpellsData.filter((s) => mySpellIds.has(s.id));
                } else if (spellFilter !== "all") {
                  filtered = classSpells.filter((s) => s.level === spellFilter);
                }
                if (spellSearch) {
                  const q = spellSearch.toLowerCase();
                  filtered = filtered.filter((s) =>
                    s.name.toLowerCase().includes(q) ||
                    s.school.toLowerCase().includes(q) ||
                    s.description.toLowerCase().includes(q)
                  );
                }

                // Group by level
                const grouped = {};
                filtered.forEach((s) => {
                  const lbl = s.level === 0 ? "Cantrips" : `Level ${s.level}`;
                  if (!grouped[lbl]) grouped[lbl] = [];
                  grouped[lbl].push(s);
                });
                const sortedGroups = Object.keys(grouped).sort((a, b) => {
                  const la = a === "Cantrips" ? -1 : parseInt(a.split(" ")[1]);
                  const lb = b === "Cantrips" ? -1 : parseInt(b.split(" ")[1]);
                  return la - lb;
                });

                return (
                  <div>
                    {/* Search */}
                    <input
                      value={spellSearch}
                      onChange={(e) => setSpellSearch(e.target.value)}
                      placeholder="Search spells..."
                      className="m3input"
                      style={{ width: "100%", fontSize: 14, marginBottom: 12, boxSizing: "border-box" }}
                    />

                    {/* Filters */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                      {[
                        { key: "my", label: `My Spells (${mySpellIds.size})` },
                        { key: "all", label: `All ${className}` },
                        ...availableLevels.map((l) => ({ key: l, label: l === 0 ? "Cantrips" : `Level ${l}` })),
                      ].map((f) => (
                        <Ripple
                          key={f.key}
                          onClick={() => setSpellFilter(f.key)}
                          style={{
                            padding: "6px 14px", borderRadius: 16, fontSize: 12, fontWeight: 500,
                            background: spellFilter === f.key ? "var(--dm-primary)" : "var(--dm-surface)",
                            color: spellFilter === f.key ? "var(--dm-on-primary)" : "var(--dm-text)",
                            border: "1px solid var(--dm-outline-variant)",
                          }}
                        >
                          {f.label}
                        </Ripple>
                      ))}
                    </div>

                    {/* Spell list */}
                    {sortedGroups.length === 0 ? (
                      <div style={{ textAlign: "center", padding: 40, color: "var(--dm-text-muted)" }}>
                        <Icon name="search_off" size={48} style={{ opacity: 0.4, marginBottom: 12 }} />
                        <div style={{ fontSize: 15 }}>No spells found</div>
                      </div>
                    ) : (
                      sortedGroups.map((group) => (
                        <div key={group} style={{ marginBottom: 20 }}>
                          <div style={{
                            fontSize: 13, fontWeight: 600, color: "var(--dm-text-muted)",
                            textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8,
                          }}>
                            {group}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {grouped[group].map((sp) => {
                              const known = mySpellIds.has(sp.id);
                              const tooHigh = sp.level > maxSpellLevel && sp.level > 0;
                              return (
                                <Ripple key={sp.id} onClick={() => setSelectedSpell(sp)} style={{
                                  display: "flex", gap: 12, padding: "12px 14px",
                                  background: known ? "var(--dm-primary-container)" : "var(--dm-surface-bright)",
                                  borderRadius: 12, border: known ? "1px solid var(--dm-primary)" : "1px solid var(--dm-outline-variant)",
                                  opacity: tooHigh ? 0.5 : 1, cursor: "pointer",
                                }}>
                                  <Icon
                                    name={sp.school === "Evocation" ? "local_fire_department" :
                                      sp.school === "Abjuration" ? "shield" :
                                      sp.school === "Conjuration" ? "auto_awesome" :
                                      sp.school === "Divination" ? "visibility" :
                                      sp.school === "Enchantment" ? "psychology" :
                                      sp.school === "Illusion" ? "blur_on" :
                                      sp.school === "Necromancy" ? "skull" :
                                      sp.school === "Transmutation" ? "swap_horiz" : "auto_fix_high"}
                                    size={20}
                                    style={{ color: known ? "var(--dm-primary)" : "var(--dm-text-muted)", marginTop: 2, flexShrink: 0 }}
                                  />
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                      <span style={{ fontSize: 14, fontWeight: 600, color: known ? "var(--dm-on-primary-container)" : "var(--dm-text)" }}>
                                        {sp.name}
                                      </span>
                                      {known && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "var(--dm-primary)", color: "var(--dm-on-primary)", fontWeight: 600 }}>KNOWN</span>}
                                      {tooHigh && <span style={{ fontSize: 10, color: "var(--dm-text-muted)" }}>Lvl {sp.level} required</span>}
                                    </div>
                                    <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginTop: 2 }}>
                                      {sp.school} · {sp.castingTime} · {sp.range}
                                      {sp.concentration ? " · Concentration" : ""}
                                    </div>
                                    <div style={{ fontSize: 12, color: "var(--dm-text-secondary)", marginTop: 4, lineHeight: 1.4 }}>
                                      {sp.description.length > 150 ? sp.description.slice(0, 150) + "\u2026" : sp.description}
                                    </div>
                                  </div>
                                </Ripple>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
