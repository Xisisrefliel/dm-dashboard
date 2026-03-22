import React from "react";
import type { Doc } from "../types/index.ts";
import Icon from "./ui/Icon.tsx";

// ---- Doc Preview Helpers ----
interface DocPreview {
  type: "npc" | "location";
  detail: string;
}

export function getDocPreview(doc: Doc | null): DocPreview | null {
  if (!doc || !doc.content) return null;
  const lines: string[] = doc.content.split("\n").filter((l) => l.trim());

  if (doc.category === "npcs") {
    const roleLine = lines.find(
      (l) => /\*\*Role:\*\*/.test(l) || /Role:/.test(l),
    );
    if (roleLine) {
      return {
        type: "npc",
        detail: roleLine
          .replace(/\*\*/g, "")
          .replace(/^#+\s*/, "")
          .trim(),
      };
    }
  }

  if (doc.category === "locations") {
    const para = lines.find(
      (l) =>
        !l.startsWith("#") &&
        !l.startsWith(">") &&
        !l.startsWith("-") &&
        !l.startsWith("|") &&
        l.trim().length > 10,
    );
    if (para) {
      const text: string = para.replace(/\*\*/g, "").replace(/\*/g, "").trim();
      return {
        type: "location",
        detail: text.length > 140 ? text.slice(0, 140) + "\u2026" : text,
      };
    }
  }

  return null;
}

// ---- Doc Preview Card ----
interface DocPreviewCardProps {
  doc: Doc;
  x: number;
  y: number;
  onHover: () => void;
  onLeave: () => void;
}

function DocPreviewCard({ doc, x, y, onHover, onLeave }: DocPreviewCardProps): React.ReactElement | null {
  const preview: DocPreview | null = getDocPreview(doc);
  if (!preview) return null;

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        position: "fixed",
        left: x,
        top: y + 8,
        zIndex: 300,
        background: "var(--dm-surface-brighter)",
        borderRadius: 16,
        padding: "14px 18px",
        maxWidth: 320,
        border: "1px solid var(--dm-outline-variant)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        animation: "m3pop 0.12s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <Icon
          name={doc.icon}
          size={18}
          filled
          style={{ color: "var(--dm-primary)" }}
        />
        <span
          style={{ fontSize: 14, fontWeight: 600, color: "var(--dm-text)" }}
        >
          {doc.title}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            color: "var(--dm-text-muted)",
            marginLeft: "auto",
          }}
        >
          {preview.type === "npc" ? "NPC" : "Location"}
        </span>
      </div>
      <div
        style={{
          fontSize: 13,
          lineHeight: 1.5,
          color: "var(--dm-text-secondary)",
        }}
      >
        {preview.detail}
      </div>
    </div>
  );
}

export default DocPreviewCard;
