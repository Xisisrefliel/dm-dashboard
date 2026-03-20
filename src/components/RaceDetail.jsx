import { racesData, RACE_ICONS } from "./RaceList.jsx";

export default function RaceDetail({ raceId, Icon, Ripple, onPin, isPinned }) {
  const race = racesData.find(r => r.id === raceId);
  if (!race) return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", height: "100%",
      color: "var(--dm-text-secondary)",
    }}>
      <div style={{ textAlign: "center" }}>
        <Icon name="groups" size={48} style={{ opacity: 0.2, display: "block", margin: "0 auto 12px" }} />
        <div style={{ fontSize: 14 }}>Select a race</div>
        <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginTop: 6 }}>
          Browse the 5e SRD races
        </div>
      </div>
    </div>
  );

  const pinId = `srd-race-${race.id}`;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 48px", animation: "m3pop 0.25s ease" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{
          fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.8,
          color: "var(--dm-on-secondary-container)",
          background: "var(--dm-secondary-container)",
          padding: "3px 10px", borderRadius: 8,
        }}>5e Race</span>
        <Ripple onClick={() => onPin({
          id: pinId,
          title: race.name,
          icon: RACE_ICONS[race.id] || "person",
          category: "srd-races",
          srdType: "race",
          speed: race.speed,
          size: race.size,
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

      {/* Race card */}
      <div style={{
        background: "var(--dm-surface-bright)",
        borderRadius: 16, padding: 24, marginTop: 8,
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Icon name={RACE_ICONS[race.id] || "person"} size={32} style={{ color: "var(--dm-primary)" }} />
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--dm-text)", marginBottom: 2 }}>
              {race.name}
            </h1>
            <div style={{ fontSize: 13, color: "var(--dm-text-muted)", fontStyle: "italic" }}>
              {race.size} &bull; Speed {race.speed} ft.
            </div>
          </div>
        </div>

        {/* Core stats */}
        <div style={{ borderTop: "1px solid var(--dm-primary-dim)", borderBottom: "1px solid var(--dm-primary-dim)", padding: "12px 0", marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", padding: "2px 0" }}>
            <span style={{ fontWeight: 600, color: "var(--dm-text)" }}>Speed </span>
            {race.speed} ft.
          </div>
          <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", padding: "2px 0" }}>
            <span style={{ fontWeight: 600, color: "var(--dm-text)" }}>Size </span>
            {race.size}
          </div>
          <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", padding: "2px 0" }}>
            <span style={{ fontWeight: 600, color: "var(--dm-text)" }}>Languages </span>
            {race.languages.join(", ")}
          </div>
        </div>

        {/* Ability Bonuses */}
        <div style={{
          fontSize: 16, fontWeight: 600, color: "var(--dm-primary)",
          borderBottom: "2px solid var(--dm-primary-dim)",
          paddingBottom: 4, marginBottom: 8,
        }}>Ability Score Increases</div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(6, 1fr)",
          gap: 4, textAlign: "center", padding: "8px 0", marginBottom: 16,
        }}>
          {["STR", "DEX", "CON", "INT", "WIS", "CHA"].map(ability => {
            const bonus = race.abilityBonuses.find(b => b.ability === ability);
            return (
              <div key={ability}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--dm-text-muted)", letterSpacing: 0.5 }}>
                  {ability}
                </div>
                <div style={{
                  fontSize: 18, fontWeight: 600,
                  color: bonus ? "var(--dm-primary)" : "var(--dm-text-muted)",
                }}>
                  {bonus ? `+${bonus.bonus}` : "\u2014"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Racial Traits */}
        {race.traits.length > 0 && (
          <>
            <div style={{
              fontSize: 16, fontWeight: 600, color: "var(--dm-primary)",
              borderBottom: "2px solid var(--dm-primary-dim)",
              paddingBottom: 4, marginBottom: 8,
            }}>Racial Traits</div>
            {race.traits.map((trait, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text)", fontStyle: "italic" }}>
                  {trait.name}.
                </span>{" "}
                <span style={{ fontSize: 13, color: "var(--dm-text-secondary)", lineHeight: 1.6 }}>
                  {trait.desc}
                </span>
              </div>
            ))}
          </>
        )}

        {/* Subraces */}
        {race.subraces.length > 0 && (
          <>
            {race.subraces.map((sub, si) => (
              <div key={si} style={{ marginTop: 20 }}>
                <div style={{
                  fontSize: 16, fontWeight: 600, color: "var(--dm-primary)",
                  borderBottom: "2px solid var(--dm-primary-dim)",
                  paddingBottom: 4, marginBottom: 8,
                }}>{sub.name}</div>
                <div style={{ fontSize: 13, color: "var(--dm-text-muted)", fontStyle: "italic", marginBottom: 10 }}>
                  {sub.desc}
                </div>
                {sub.abilityBonuses?.length > 0 && (
                  <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: "var(--dm-text)" }}>Ability Bonus: </span>
                    {sub.abilityBonuses.map(b => `${b.ability} +${b.bonus}`).join(", ")}
                  </div>
                )}
                {sub.traits?.map((trait, ti) => (
                  <div key={ti} style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-text)", fontStyle: "italic" }}>
                      {trait.name}.
                    </span>{" "}
                    <span style={{ fontSize: 13, color: "var(--dm-text-secondary)", lineHeight: 1.6 }}>
                      {trait.desc}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {/* Flavor text */}
        <div style={{
          marginTop: 20, padding: 16, borderRadius: 16,
          background: "var(--dm-primary-container)",
          border: "1px solid var(--dm-primary-dim)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm-primary-light)", marginBottom: 6 }}>
            Lore
          </div>
          <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", lineHeight: 1.6, marginBottom: 8 }}>
            <span style={{ fontWeight: 500 }}>Age: </span>{race.age}
          </div>
          <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", lineHeight: 1.6, marginBottom: 8 }}>
            <span style={{ fontWeight: 500 }}>Alignment: </span>{race.alignment}
          </div>
          <div style={{ fontSize: 13, color: "var(--dm-text-secondary)", lineHeight: 1.6 }}>
            <span style={{ fontWeight: 500 }}>Size: </span>{race.sizeDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
