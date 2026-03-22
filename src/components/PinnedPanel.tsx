import React from "react";
import Icon from "./ui/Icon.tsx";
import Ripple from "./ui/Ripple.tsx";

interface PinnedItem {
  id: string;
  title: string;
  icon: string;
  category: string;
  srdType?: string;
  cr?: number | string;
  ac?: number;
  hp?: number;
  level?: number;
  school?: string;
  hitDie?: number;
  size?: string;
  speed?: number;
}

interface PinnedPanelProps {
  pinned: PinnedItem[];
  onRemove: (id: string) => void;
  onSelect: (item: PinnedItem) => void;
}

function PinnedPanel({ pinned, onRemove, onSelect }: PinnedPanelProps): React.ReactElement {
  if (!pinned.length)
    return (
      <div
        style={{
          padding: 24,
          textAlign: "center",
          color: "var(--dm-text-secondary)",
        }}
      >
        <Icon
          name="push_pin"
          size={40}
          style={{ opacity: 0.2, display: "block", margin: "0 auto 12px" }}
        />
        <div style={{ fontSize: 14, marginBottom: 4 }}>No pinned items</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Pin documents for quick reference during sessions
        </div>
      </div>
    );

  return (
    <div
      style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8 }}
    >
      {pinned.map((item) => (
        <div
          key={item.id}
          style={{
            background: "var(--dm-surface)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Ripple
            onClick={() => onSelect(item)}
            style={{
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                overflow: "hidden",
                flex: 1,
              }}
            >
              <Icon
                name={item.icon}
                size={16}
                style={{ color: "var(--dm-primary-dim)", flexShrink: 0 }}
              />
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                    color: "var(--dm-text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title}
                </div>
                {item.srdType === "monster" && (
                  <div style={{ fontSize: 11, color: "var(--dm-text-muted)" }}>
                    CR {item.cr} &middot; AC {item.ac} &middot; HP {item.hp}
                  </div>
                )}
                {item.srdType === "spell" && (
                  <div style={{ fontSize: 11, color: "var(--dm-text-muted)" }}>
                    {item.level === 0 ? "Cantrip" : `Level ${item.level}`}{" "}
                    &middot; {item.school}
                  </div>
                )}
                {item.srdType === "class" && (
                  <div style={{ fontSize: 11, color: "var(--dm-text-muted)" }}>
                    Hit Die: d{item.hitDie}
                  </div>
                )}
                {item.srdType === "race" && (
                  <div style={{ fontSize: 11, color: "var(--dm-text-muted)" }}>
                    {item.size} &middot; Speed {item.speed} ft.
                  </div>
                )}
              </div>
            </div>
            <span
              onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
              style={{
                padding: 4,
                cursor: "pointer",
                color: "var(--dm-text-secondary)",
                display: "flex",
                flexShrink: 0,
              }}
            >
              <Icon name="close" size={16} />
            </span>
          </Ripple>
        </div>
      ))}
    </div>
  );
}

export default PinnedPanel;
