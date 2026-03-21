import { useState, useEffect } from "react";
import classesData from "../data/srd-classes.json";
import racesData from "../data/srd-races.json";
import Icon from "./ui/Icon.jsx";
import Ripple from "./ui/Ripple.jsx";

const CHARACTERS_KEY = "dm-dashboard-characters";

function loadCharacters() {
  try {
    const saved = localStorage.getItem(CHARACTERS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

function buildSnapshot(ch) {
  const cd = classesData.find((c) => c.id === ch.class);
  const stats = ch.assignedStats || ch.stats || {};
  const hitDie = cd?.hitDie || 8;
  const hp = hitDie + (ch.level - 1) * (Math.floor(hitDie / 2) + 1);
  const dexMod = Math.floor(((stats.DEX || 10) - 10) / 2);
  const ac = 10 + dexMod;

  return {
    name: ch.name,
    race: ch.race,
    class: ch.class,
    level: ch.level || 1,
    hp,
    ac,
    stats,
  };
}

function InviteJoin({ token, onBack }) {
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    fetch(`/api/invites/${token}`)
      .then((r) => {
        if (!r.ok) throw new Error("Invalid or expired invite link");
        return r.json();
      })
      .then((data) => {
        setInvite(data);
        if (data.alreadyJoined) setJoined(true);
        setCharacters(loadCharacters());
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleJoin = async () => {
    if (!selected) return;
    setJoining(true);
    const snapshot = buildSnapshot(selected);
    const res = await fetch(`/api/invites/${token}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ character: snapshot }),
    });
    if (res.ok) {
      setJoined(true);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to join");
    }
    setJoining(false);
  };

  const styles = {
    root: {
      "--dm-bg": "#121214",
      "--dm-surface": "#1c1c1f",
      "--dm-surface-bright": "#26262a",
      "--dm-text": "#e2e2e6",
      "--dm-text-secondary": "#c2c2c8",
      "--dm-text-muted": "#8a8a92",
      "--dm-primary": "#9fa8da",
      "--dm-on-primary": "#0d0f2b",
      "--dm-outline-variant": "#38383e",
      "--dm-error": "#ffb4ab",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      minHeight: "100vh",
      background: "var(--dm-bg)",
      color: "var(--dm-text)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };

  if (loading) {
    return (
      <div style={{ ...styles.root, justifyContent: "center" }}>
        <span style={{ fontSize: 16, opacity: 0.6 }}>Loading invite...</span>
      </div>
    );
  }

  if (error && !invite) {
    return (
      <div style={{ ...styles.root, justifyContent: "center", textAlign: "center", padding: 32 }}>
        <Icon name="link_off" size={48} style={{ color: "var(--dm-error)", marginBottom: 16, opacity: 0.6 }} />
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{error}</div>
        <div style={{ fontSize: 14, color: "var(--dm-text-secondary)", marginBottom: 24 }}>
          This invite link may have expired or been revoked.
        </div>
        <Ripple
          onClick={onBack}
          style={{
            padding: "10px 24px",
            borderRadius: 20,
            border: "1px solid var(--dm-outline-variant)",
            color: "var(--dm-text-secondary)",
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          Go Home
        </Ripple>
      </div>
    );
  }

  if (invite?.isOwner) {
    return (
      <div style={{ ...styles.root, justifyContent: "center", textAlign: "center", padding: 32 }}>
        <Icon name="shield_with_house" size={48} filled style={{ color: "var(--dm-primary)", marginBottom: 16 }} />
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>This is your campaign!</div>
        <div style={{ fontSize: 14, color: "var(--dm-text-secondary)", marginBottom: 24 }}>
          Share this invite link with your players, not yourself.
        </div>
        <Ripple
          onClick={onBack}
          style={{
            padding: "10px 24px",
            borderRadius: 20,
            background: "var(--dm-primary)",
            color: "var(--dm-on-primary)",
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          Go Home
        </Ripple>
      </div>
    );
  }

  if (joined) {
    return (
      <div style={{ ...styles.root, justifyContent: "center", textAlign: "center", padding: 32 }}>
        <Icon name="check_circle" size={56} filled style={{ color: "#81c784", marginBottom: 16 }} />
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>You're In!</div>
        <div style={{ fontSize: 16, color: "var(--dm-text-secondary)", marginBottom: 6 }}>
          You've joined <strong style={{ color: "var(--dm-text)" }}>{invite.campaign.name}</strong>
        </div>
        <div style={{ fontSize: 14, color: "var(--dm-text-muted)", marginBottom: 28 }}>
          Your DM can now see your character in their campaign.
        </div>
        <Ripple
          onClick={onBack}
          style={{
            padding: "10px 24px",
            borderRadius: 20,
            background: "var(--dm-primary)",
            color: "var(--dm-on-primary)",
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          Go Home
        </Ripple>
      </div>
    );
  }

  const campaign = invite.campaign;

  return (
    <div style={styles.root}>
      <div style={{ textAlign: "center", paddingTop: 60, marginBottom: 32, padding: "60px 32px 0" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: (campaign.color || "#9fa8da") + "20",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Icon
            name="shield_with_house"
            size={32}
            filled
            style={{ color: campaign.color || "var(--dm-primary)" }}
          />
        </div>
        <div style={{ fontSize: 14, color: "var(--dm-text-muted)", marginBottom: 6 }}>
          You've been invited to join
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
          {campaign.name}
        </h1>
        {campaign.description && (
          <p style={{ fontSize: 14, color: "var(--dm-text-secondary)", margin: 0, maxWidth: 400 }}>
            {campaign.description}
          </p>
        )}
      </div>

      {characters.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 32px", maxWidth: 400 }}>
          <Icon name="person_off" size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No characters found</div>
          <div style={{ fontSize: 14, color: "var(--dm-text-secondary)", marginBottom: 20 }}>
            Create a character first, then come back to this link.
          </div>
          <Ripple
            onClick={() => {
              // Save invite URL so they can come back
              sessionStorage.setItem("dm-pending-invite", window.location.href);
              window.history.pushState(null, "", "/character-creator");
              window.location.reload();
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 24px",
              borderRadius: 20,
              background: "var(--dm-primary)",
              color: "var(--dm-on-primary)",
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            <Icon name="person_add" size={18} />
            Create Character
          </Ripple>
        </div>
      ) : (
        <>
          <div style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--dm-text-secondary)",
            marginBottom: 12,
            padding: "0 32px",
            alignSelf: "flex-start",
            maxWidth: 640,
            width: "100%",
            margin: "0 auto 12px",
          }}>
            Choose a character:
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 12,
            width: "100%",
            maxWidth: 640,
            padding: "0 32px 32px",
          }}>
            {characters.map((ch) => {
              const rd = racesData.find((r) => r.id === ch.race);
              const cd = classesData.find((c) => c.id === ch.class);
              const isSelected = selected?.id === ch.id;
              const snap = buildSnapshot(ch);

              return (
                <Ripple
                  key={ch.id}
                  onClick={() => setSelected(ch)}
                  style={{
                    background: "var(--dm-surface)",
                    borderRadius: 16,
                    padding: 16,
                    border: isSelected
                      ? `2px solid var(--dm-primary)`
                      : "2px solid var(--dm-outline-variant)",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    transition: "border-color 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      background: isSelected
                        ? "var(--dm-primary)"
                        : "var(--dm-surface-bright)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background 0.15s",
                    }}
                  >
                    <Icon
                      name={isSelected ? "check" : "person"}
                      size={22}
                      style={{
                        color: isSelected ? "var(--dm-on-primary)" : "var(--dm-text-muted)",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>
                      {ch.name || "Unnamed"}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--dm-text-secondary)" }}>
                      Lvl {ch.level} {rd?.name || ""} {cd?.name || ""}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: "var(--dm-text-muted)",
                      marginTop: 4,
                      display: "flex",
                      gap: 10,
                    }}>
                      <span>{snap.hp} HP</span>
                      <span>{snap.ac} AC</span>
                    </div>
                  </div>
                </Ripple>
              );
            })}
          </div>

          {error && (
            <div style={{
              color: "var(--dm-error)",
              fontSize: 14,
              padding: "0 32px",
              marginBottom: 12,
            }}>
              {error}
            </div>
          )}

          <div style={{ padding: "0 32px 64px", display: "flex", gap: 12 }}>
            <Ripple
              onClick={handleJoin}
              disabled={!selected || joining}
              style={{
                padding: "12px 32px",
                borderRadius: 20,
                background: selected ? "var(--dm-primary)" : "var(--dm-surface-bright)",
                color: selected ? "var(--dm-on-primary)" : "var(--dm-text-muted)",
                fontWeight: 600,
                fontSize: 15,
                transition: "all 0.15s",
              }}
            >
              {joining ? "Joining..." : "Join Campaign"}
            </Ripple>
            <Ripple
              onClick={onBack}
              style={{
                padding: "12px 24px",
                borderRadius: 20,
                border: "1px solid var(--dm-outline-variant)",
                color: "var(--dm-text-secondary)",
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              Cancel
            </Ripple>
          </div>
        </>
      )}
    </div>
  );
}

export default InviteJoin;
