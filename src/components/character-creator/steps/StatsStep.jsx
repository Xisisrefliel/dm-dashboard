import Icon from "../../ui/Icon.jsx";
import Ripple from "../../ui/Ripple.jsx";
import { useIsMobile } from "../../../hooks/useIsMobile.js";
import { styles, ms } from "../styles.js";
import { ABILITIES, ABILITY_NAMES, ABILITY_ICONS, POINT_BUY_COSTS, POINT_BUY_TOTAL } from "../../../data/character-constants.js";

export default function StatsStep({ char, update, isMobile: isMobileProp, haptic, assignedStats, adjustStat, rollStats, statMode, switchStatMode, getRacialBonus, raceData, classData }) {
  const isMobile = useIsMobile();

  const pointsSpent = statMode === "pointbuy"
    ? Object.values(assignedStats).reduce((sum, v) => sum + (POINT_BUY_COSTS[v] ?? 0), 0)
    : 0;
  const pointsRemaining = POINT_BUY_TOTAL - pointsSpent;
  const pmBtnSize = isMobile ? 44 : 36;
  return (
    <div>
      <h2 style={styles.stepTitle}>Ability Scores</h2>

      {/* Mode toggle */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 0, marginBottom: 16,
        background: "rgba(28, 28, 31, 0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderRadius: 14, padding: 4,
        border: "1px solid rgba(255,255,255,0.08)", alignSelf: "center",
      }}>
        {[
          { id: "pointbuy", label: `Point Buy (${POINT_BUY_TOTAL} pts)` },
          { id: "manual", label: "Manual Adjustment" },
        ].map(m => (
          <Ripple
            key={m.id}
            onClick={() => statMode !== m.id && switchStatMode(m.id)}
            style={{
              flex: 1, padding: "10px 16px", borderRadius: 11,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600, gap: 6, cursor: "pointer",
              background: statMode === m.id ? "var(--dm-primary)" : "transparent",
              color: statMode === m.id ? "var(--dm-on-primary, #1a1c18)" : "var(--dm-text-secondary)",
              transition: "all .2s",
            }}
          >
            {m.label}
          </Ripple>
        ))}
      </div>

      {/* Points remaining (point buy only) */}
      {statMode === "pointbuy" && (
        <div style={{
          textAlign: "center", marginBottom: 16, fontSize: 14, fontWeight: 600,
          letterSpacing: 0.5, textTransform: "uppercase",
          color: pointsRemaining < 0 ? "var(--dm-error, #ffb4ab)" : "var(--dm-text-secondary)",
        }}>
          Points Remaining: <span style={{ color: pointsRemaining === 0 ? "#6ecf9a" : pointsRemaining < 0 ? "var(--dm-error, #ffb4ab)" : "var(--dm-primary)", fontSize: 18, fontWeight: 700 }}>{pointsRemaining}</span>
        </div>
      )}

      {/* Level selector */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20, background: "rgba(28, 28, 31, 0.65)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderRadius: 14, padding: "12px 20px",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="military_tech" size={20} style={{ color: "var(--dm-primary)" }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--dm-primary)", textTransform: "uppercase", letterSpacing: 1 }}>Level:</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Ripple
            onClick={() => { haptic.trigger("selection"); update("level", Math.max(1, char.level - 1)); }}
            style={{
              width: pmBtnSize, height: pmBtnSize, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
            }}
          >
            <Icon name="remove" size={18} />
          </Ripple>
          <span style={{ fontSize: 24, fontWeight: 700, color: "var(--dm-primary)", minWidth: 36, textAlign: "center" }}>
            {char.level}
          </span>
          <Ripple
            onClick={() => { haptic.trigger("selection"); update("level", Math.min(20, char.level + 1)); }}
            style={{
              width: pmBtnSize, height: pmBtnSize, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
            }}
          >
            <Icon name="add" size={18} />
          </Ripple>
        </div>
        <span style={{ fontSize: 12, color: "var(--dm-text-muted)" }}>
          HP: {classData ? classData.hitDie + (char.level - 1) * (Math.floor(classData.hitDie / 2) + 1) : "\u2014"}
        </span>
      </div>

      {/* Column headers */}
      <div style={{
        display: "flex", alignItems: "center", padding: "0 16px 8px",
        fontSize: 11, fontWeight: 600, color: "var(--dm-text-muted)",
        textTransform: "uppercase", letterSpacing: 1,
      }}>
        <span style={{ flex: 1 }}>Stats</span>
        <span style={{ width: isMobile ? 130 : 150, textAlign: "center" }}>Score</span>
        <span style={{ width: 50, textAlign: "right" }}>Mod</span>
      </div>

      {/* Stat rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
        {ABILITIES.map((ab) => {
          const base = assignedStats[ab] ?? 8;
          const racial = getRacialBonus(ab);
          const total = base + racial;
          const mod = Math.floor((total - 10) / 2);
          const atMin = statMode === "pointbuy" ? base <= 8 : base <= 1;
          const atMax = statMode === "pointbuy" ? base >= 15 : base >= 30;
          const cantIncrease = statMode === "pointbuy" && !atMax && (
            pointsSpent + ((POINT_BUY_COSTS[base + 1] ?? 0) - (POINT_BUY_COSTS[base] ?? 0)) > POINT_BUY_TOTAL
          );
          return (
            <div
              key={ab}
              style={{
                display: "flex", alignItems: "center",
                background: "rgba(28, 28, 31, 0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                borderRadius: 14, padding: isMobile ? "14px 12px" : "12px 16px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Icon + Ability name */}
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(135deg, rgba(var(--dm-primary-rgb, 141,166,100), 0.2), rgba(var(--dm-primary-rgb, 141,166,100), 0.05))",
                  border: "1px solid var(--dm-outline-variant)",
                }}>
                  <Icon name={ABILITY_ICONS[ab]} size={20} style={{ color: "var(--dm-primary)" }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{ABILITY_NAMES[ab]}</div>
                  {racial > 0 && (
                    <div style={{ fontSize: 11, color: "var(--dm-primary)", fontWeight: 500 }}>
                      +{racial} from {raceData?.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Score controls: - [score] + */}
              <div style={{ width: isMobile ? 130 : 150, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Ripple
                  onClick={() => !atMin && adjustStat(ab, -1)}
                  style={{
                    width: pmBtnSize, height: pmBtnSize, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                    opacity: atMin ? 0.3 : 1, cursor: atMin ? "default" : "pointer",
                  }}
                >
                  <Icon name="remove" size={18} />
                </Ripple>
                <span style={{
                  fontSize: 22, fontWeight: 700, color: "var(--dm-primary)",
                  minWidth: 36, textAlign: "center",
                }}>
                  {total}
                </span>
                <Ripple
                  onClick={() => !atMax && !cantIncrease && adjustStat(ab, 1)}
                  style={{
                    width: pmBtnSize, height: pmBtnSize, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--dm-surface-bright)", border: "1px solid var(--dm-outline-variant)",
                    opacity: (atMax || cantIncrease) ? 0.3 : 1, cursor: (atMax || cantIncrease) ? "default" : "pointer",
                  }}
                >
                  <Icon name="add" size={18} />
                </Ripple>
              </div>

              {/* Modifier */}
              <div style={{
                width: 50, textAlign: "right",
                fontSize: 20, fontWeight: 700,
                color: mod >= 0 ? "#6ecf9a" : "var(--dm-error, #ffb4ab)",
              }}>
                {mod >= 0 ? `+${mod}` : mod}
              </div>
            </div>
          );
        })}
      </div>

      {/* Roll for me button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Ripple onClick={rollStats} style={{ ...styles.secondaryBtn, gap: 6 }}>
          <Icon name="casino" size={18} /> Roll for me
        </Ripple>
      </div>
    </div>
  );
}
