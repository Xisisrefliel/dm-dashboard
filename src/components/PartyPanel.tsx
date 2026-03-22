import { useState, useEffect } from "react";
import Icon from "./ui/Icon.tsx";
import Ripple from "./ui/Ripple.tsx";

interface PartyCharacter {
  name: string;
  race?: string;
  class?: string;
  level?: number;
  hp?: number | null;
  ac?: number | null;
}

interface PartyMember {
  id: string;
  playerName: string;
  character: PartyCharacter;
}

interface PartyPanelProps {
  campaignId: string;
  onAddToInit: (creature: { name: string; hp: number | null }) => void;
}

function PartyPanel({ campaignId, onAddToInit }: PartyPanelProps) {
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);

  const fetchParty = () => {
    fetch(`/api/campaigns/${campaignId}/party`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setMembers(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchParty();
  }, [campaignId]);

  const generateInvite = async () => {
    setGenerating(true);
    const res = await fetch(`/api/campaigns/${campaignId}/invites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      const { token } = await res.json();
      setInviteUrl(`${window.location.origin}/invite/${token}`);
      setCopied(false);
    }
    setGenerating(false);
  };

  const copyLink = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const removeMember = async (memberId: string) => {
    const res = await fetch(`/api/campaigns/${campaignId}/party/${memberId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMembers((m) => m.filter((x) => x.id !== memberId));
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "var(--dm-text-muted)" }}>
        Loading party...
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      {/* Invite link section */}
      <div style={{ marginBottom: 16 }}>
        {inviteUrl ? (
          <div style={{
            background: "var(--dm-surface-bright)",
            borderRadius: 12,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--dm-text-secondary)" }}>
              Invite Link
            </div>
            <div style={{
              fontSize: 12,
              color: "var(--dm-text-muted)",
              wordBreak: "break-all",
              lineHeight: 1.5,
              background: "var(--dm-surface)",
              padding: "8px 10px",
              borderRadius: 8,
              fontFamily: "monospace",
            }}>
              {inviteUrl}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Ripple
                onClick={copyLink}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 16,
                  background: copied ? "var(--dm-primary)" : "var(--dm-surface-bright)",
                  color: copied ? "var(--dm-on-primary)" : "var(--dm-text)",
                  fontSize: 13,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  border: copied ? "none" : "1px solid var(--dm-outline-variant)",
                  transition: "all 0.2s",
                }}
              >
                <Icon name={copied ? "check" : "content_copy"} size={16} />
                {copied ? "Copied!" : "Copy"}
              </Ripple>
              <Ripple
                onClick={generateInvite}
                style={{
                  padding: "8px 12px",
                  borderRadius: 16,
                  border: "1px solid var(--dm-outline-variant)",
                  color: "var(--dm-text-secondary)",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="refresh" size={16} />
              </Ripple>
            </div>
          </div>
        ) : (
          <Ripple
            onClick={generateInvite}
            disabled={generating}
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "var(--dm-primary)",
              color: "var(--dm-on-primary)",
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            <Icon name="link" size={18} />
            Generate Invite Link
          </Ripple>
        )}
      </div>

      {/* Party members */}
      {members.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center", color: "var(--dm-text-secondary)" }}>
          <Icon
            name="groups"
            size={40}
            style={{ opacity: 0.2, display: "block", margin: "0 auto 12px" }}
          />
          <div style={{ fontSize: 14, marginBottom: 4 }}>No players yet</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            Share the invite link with your players
          </div>
        </div>
      ) : (
        members.map((m) => {
          const c = m.character;
          return (
            <div
              key={m.id}
              style={{
                background: "var(--dm-surface-bright)",
                borderRadius: 12,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    background: "var(--dm-primary-container)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="person" size={20} style={{ color: "var(--dm-primary-light)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--dm-text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--dm-text-muted)" }}>
                    {m.playerName}
                  </div>
                </div>
                <Ripple
                  onClick={() => removeMember(m.id)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="close" size={14} style={{ color: "var(--dm-text-muted)" }} />
                </Ripple>
              </div>

              <div style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 8,
              }}>
                {c.race && (
                  <span style={{
                    fontSize: 11,
                    padding: "3px 8px",
                    borderRadius: 10,
                    background: "var(--dm-surface)",
                    color: "var(--dm-text-secondary)",
                    textTransform: "capitalize",
                  }}>
                    {c.race}
                  </span>
                )}
                {c.class && (
                  <span style={{
                    fontSize: 11,
                    padding: "3px 8px",
                    borderRadius: 10,
                    background: "var(--dm-surface)",
                    color: "var(--dm-text-secondary)",
                    textTransform: "capitalize",
                  }}>
                    {c.class}
                  </span>
                )}
                {c.level && (
                  <span style={{
                    fontSize: 11,
                    padding: "3px 8px",
                    borderRadius: 10,
                    background: "var(--dm-surface)",
                    color: "var(--dm-text-secondary)",
                  }}>
                    Lvl {c.level}
                  </span>
                )}
              </div>

              <div style={{
                display: "flex",
                gap: 12,
                fontSize: 12,
                color: "var(--dm-text-secondary)",
                marginBottom: 10,
              }}>
                {c.hp != null && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon name="favorite" size={14} style={{ color: "#d09090" }} />
                    {c.hp} HP
                  </span>
                )}
                {c.ac != null && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon name="shield" size={14} style={{ color: "#90b4d0" }} />
                    {c.ac} AC
                  </span>
                )}
              </div>

              <Ripple
                onClick={() => onAddToInit({ name: c.name, hp: c.hp ?? null })}
                style={{
                  width: "100%",
                  padding: "7px 0",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  border: "1px solid var(--dm-outline-variant)",
                  color: "var(--dm-text-secondary)",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                <Icon name="swords" size={14} />
                Add to Initiative
              </Ripple>
            </div>
          );
        })
      )}
    </div>
  );
}

export default PartyPanel;
