import { useState } from "react";
import Icon from "./ui/Icon.jsx";
import Ripple from "./ui/Ripple.jsx";
import { CAMPAIGN_COLORS } from "../data/sampleCampaign.js";

function CampaignHome({ campaigns, onSelect, onCreate, user, onLogout }) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState(CAMPAIGN_COLORS[0]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreate({
      name: newName.trim(),
      description: newDesc.trim(),
      color: newColor,
    });
    setNewName("");
    setNewDesc("");
    setNewColor(CAMPAIGN_COLORS[0]);
    setCreating(false);
  };

  return (
    <div
      style={{
        "--dm-bg": "#111611",
        "--dm-surface": "#1e251e",
        "--dm-surface-bright": "#2a322a",
        "--dm-text": "#e2e3dc",
        "--dm-text-secondary": "#c2c9bb",
        "--dm-text-muted": "#8c9386",
        "--dm-primary": "#9fd494",
        "--dm-outline": "#8c9386",
        "--dm-outline-variant": "#424940",
        fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
        height: "100vh",
        background: "var(--dm-bg)",
        color: "var(--dm-text)",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center", paddingTop: 80, marginBottom: 48 }}>
        <Icon
          name="shield"
          size={56}
          filled
          style={{ color: "var(--dm-primary)", marginBottom: 16 }}
        />
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            margin: "0 0 8px",
          }}
        >
          DM Dashboard
        </h1>
        <p
          style={{ fontSize: 16, color: "var(--dm-text-secondary)", margin: 0 }}
        >
          Your campaigns
        </p>
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 16,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "var(--dm-text-muted)",
              }}
            >
              {user.displayName}
            </span>
            <Ripple
              onClick={onLogout}
              style={{
                padding: "6px 16px",
                borderRadius: 16,
                border: "1px solid var(--dm-outline-variant)",
                color: "var(--dm-text-secondary)",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Sign out
            </Ripple>
          </div>
        )}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 16,
          width: "100%",
          maxWidth: 960,
          padding: "0 32px 64px",
        }}
      >
        {campaigns.map((c) => (
          <Ripple
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
              background: "var(--dm-surface)",
              borderRadius: 20,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              border: "1px solid var(--dm-outline-variant)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: c.color + "18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name="shield"
                  size={24}
                  filled
                  style={{ color: c.color }}
                />
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {c.name}
              </div>
            </div>
            {c.description && (
              <p
                style={{
                  fontSize: 14,
                  color: "var(--dm-text-secondary)",
                  lineHeight: 1.5,
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {c.description}
              </p>
            )}
            <div
              style={{
                fontSize: 12,
                color: "var(--dm-text-muted)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 4,
              }}
            >
              <Icon name="description" size={14} />
              {c.docCount ?? 0} document{c.docCount !== 1 ? "s" : ""}
              <span style={{ margin: "0 4px" }}>{"\u00B7"}</span>
              <Icon name="category" size={14} />
              {c.categoryCount ?? 0} categor
              {c.categoryCount !== 1 ? "ies" : "y"}
            </div>
          </Ripple>
        ))}
        <Ripple
          onClick={() => setCreating(true)}
          style={{
            background: "transparent",
            borderRadius: 20,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            minHeight: 160,
            border: "2px dashed var(--dm-outline-variant)",
            color: "var(--dm-text-secondary)",
          }}
        >
          <Icon name="add" size={32} style={{ opacity: 0.6 }} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>New Campaign</span>
        </Ripple>
      </div>
      {creating && (
        <div
          onClick={() => setCreating(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--dm-surface)",
              borderRadius: 28,
              padding: 32,
              width: 420,
              maxWidth: "90vw",
              border: "1px solid var(--dm-outline-variant)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
              animation: "m3pop 0.2s cubic-bezier(0.2,0,0,1)",
            }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 600,
                margin: "0 0 20px",
                letterSpacing: "-0.02em",
              }}
            >
              New Campaign
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                placeholder="Campaign name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="m3input"
                style={{ fontSize: 16 }}
                autoFocus
              />
              <textarea
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="m3input"
                style={{
                  height: 80,
                  resize: "vertical",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--dm-text-secondary)",
                    marginBottom: 8,
                  }}
                >
                  Color
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {CAMPAIGN_COLORS.map((color) => (
                    <div
                      key={color}
                      onClick={() => setNewColor(color)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        background: color + "30",
                        border:
                          newColor === color
                            ? `2px solid ${color}`
                            : "2px solid transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "border-color 0.15s",
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 8,
                          background: color,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <Ripple
                  onClick={handleCreate}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 20,
                    background: "var(--dm-primary)",
                    color: "#0a3806",
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  Create
                </Ripple>
                <Ripple
                  onClick={() => setCreating(false)}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 20,
                    border: "1px solid var(--dm-outline)",
                    color: "var(--dm-primary)",
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  Cancel
                </Ripple>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignHome;
