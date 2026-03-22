import React, { useState, useMemo } from "react";
import type { SrdRuleChapter, SrdRuleSection } from "../types/index.ts";
import rulesRaw from "../data/srd-rules.json";

const rulesData = rulesRaw as SrdRuleChapter[];

interface SRDRulesDrawerProps {
  Icon: React.FC<{ name: string; size?: number; filled?: boolean; style?: React.CSSProperties }>;
  Ripple: React.FC<React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode; style?: React.CSSProperties; onClick?: React.MouseEventHandler<HTMLDivElement>; disabled?: boolean; className?: string }>;
  selectedSection: string | null;
  onSelectSection: (id: string) => void;
}

export function SRDRulesDrawer({ Icon, Ripple, selectedSection, onSelectSection }: SRDRulesDrawerProps): React.ReactElement {
  const [expanded, setExpanded] = useState<string | null>(rulesData[0]?.id || null);
  const [search, setSearch] = useState<string>("");

  const filteredRules = useMemo<SrdRuleChapter[]>(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rulesData;
    return rulesData
      .map(rule => ({
        ...rule,
        sections: rule.sections.filter(
          s => s.name.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
        ),
      }))
      .filter(rule => rule.sections.length > 0 || rule.name.toLowerCase().includes(q));
  }, [search]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "8px 12px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "0 12px", height: 40,
          background: "var(--dm-surface-bright)",
          borderRadius: 20, marginBottom: 8,
        }}>
          <Icon name="search" size={18} style={{ color: "var(--dm-text-muted)" }} />
          <input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search rules..."
            style={{
              border: "none", background: "none", outline: "none",
              color: "var(--dm-text)", fontSize: 13, width: "100%",
              fontFamily: "inherit",
            }}
          />
          {search && (
            <span onClick={() => setSearch("")} style={{ cursor: "pointer", display: "flex", color: "var(--dm-text-muted)" }}>
              <Icon name="close" size={16} />
            </span>
          )}
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "0 12px" }}>
        {filteredRules.map(rule => (
          <div key={rule.id} style={{ marginBottom: 2 }}>
            <Ripple
              onClick={() => setExpanded(expanded === rule.id ? null : rule.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 16px", borderRadius: 28,
                color: "var(--dm-text-secondary)",
              }}
            >
              <Icon name={expanded === rule.id ? "expand_more" : "chevron_right"} size={18} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>{rule.name}</span>
              <span style={{
                fontSize: 11, color: "var(--dm-text-muted)", marginLeft: "auto",
              }}>{rule.sections.length}</span>
            </Ripple>
            {expanded === rule.id && rule.sections.map((section: SrdRuleSection, i: number) => (
              <Ripple
                key={section.id}
                onClick={() => onSelectSection(section.id)}
                className="navitem"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 16px 9px 44px", borderRadius: 28, marginBottom: 1,
                  background: selectedSection === section.id ? "var(--dm-secondary-container)" : "transparent",
                  color: selectedSection === section.id ? "var(--dm-on-secondary-container)" : "var(--dm-text-secondary)",
                  animation: `m3slideIn 0.2s cubic-bezier(0.2,0,0,1) ${i * 0.03}s both`,
                }}
              >
                <span style={{
                  fontSize: 13,
                  fontWeight: selectedSection === section.id ? 600 : 400,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{section.name}</span>
              </Ripple>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface RulePinData {
  id: string;
  title: string;
  icon: string;
  category: string;
  srdType: string;
}

interface SRDRulesContentProps {
  sectionId: string | null;
  Icon: React.FC<{ name: string; size?: number; filled?: boolean; style?: React.CSSProperties }>;
  Ripple: React.FC<React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode; style?: React.CSSProperties; onClick?: React.MouseEventHandler<HTMLDivElement>; disabled?: boolean; className?: string }>;
  renderMarkdown: (md: string) => string;
  onPin: (data: RulePinData) => void;
  isPinned: (id: string) => boolean;
}

export function SRDRulesContent({ sectionId, Icon, Ripple, renderMarkdown, onPin, isPinned }: SRDRulesContentProps): React.ReactElement {
  const currentSection: SrdRuleSection | undefined = sectionId
    ? rulesData.flatMap(r => r.sections).find(s => s.id === sectionId)
    : undefined;

  if (!currentSection) return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", height: "100%",
      color: "var(--dm-text-secondary)",
    }}>
      <div style={{ textAlign: "center" }}>
        <Icon name="gavel" size={48} style={{ opacity: 0.2, display: "block", margin: "0 auto 12px" }} />
        <div style={{ fontSize: 14 }}>Select a rule section</div>
        <div style={{ fontSize: 12, color: "var(--dm-text-muted)", marginTop: 6 }}>
          Browse the 5e SRD rules reference
        </div>
      </div>
    </div>
  );

  const pinId: string = `srd-rule-${currentSection.id}`;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 48px", animation: "m3pop 0.25s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{
          fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.8,
          color: "var(--dm-on-secondary-container)",
          background: "var(--dm-secondary-container)",
          padding: "3px 10px", borderRadius: 8,
        }}>5e Rules</span>
        <Ripple onClick={() => onPin({
          id: pinId,
          title: currentSection.name,
          icon: "gavel",
          category: "srd-rules",
          srdType: "rule",
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
      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(currentSection.content) }} />
    </div>
  );
}
