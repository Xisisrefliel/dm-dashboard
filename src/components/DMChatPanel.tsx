import { useMemo, useRef, useState, useEffect } from "react";
import spellsDataRaw from "../data/srd-spells.json";
import monstersDataRaw from "../data/srd-monsters.json";
import classesDataRaw from "../data/srd-classes.json";
import racesDataRaw from "../data/srd-races.json";
import rulesDataRaw from "../data/srd-rules.json";
import { renderMarkdown } from "../utils/renderMarkdown.tsx";
import type { Doc, SrdSpell, SrdMonster, SrdClass, SrdRace, SrdRuleChapter } from "../types/index.ts";

interface Source {
  id: string;
  title: string;
  kind: string;
  text: string;
  category?: string;
  doc?: Doc;
}

interface Message {
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
}

interface DMChatPanelProps {
  campaignId: string;
  docs: Doc[];
  onSelectDoc: (doc: Doc) => void;
}

const spellsData = spellsDataRaw as SrdSpell[];
const monstersData = monstersDataRaw as SrdMonster[];
const classesData = classesDataRaw as SrdClass[];
const racesData = racesDataRaw as SrdRace[];
const rulesData = rulesDataRaw as SrdRuleChapter[];

const STOP = new Set(["the", "and", "for", "with", "that", "this", "what", "who", "how", "can", "does", "about", "from", "into", "when", "where", "have", "has", "are", "is", "to", "of", "in", "a", "an", "or", "on", "it", "i", "me", "my", "our"]);

function terms(q: string) {
  return q.toLowerCase().match(/[a-z0-9']+/g)?.filter((w) => w.length > 2 && !STOP.has(w)) ?? [];
}

function snippet(text: string, words: string[]) {
  const clean = text.replace(/[#*_>`\-[\]]/g, " ").replace(/\s+/g, " ").trim();
  const lower = clean.toLowerCase();
  const idx = Math.max(0, ...words.map((w) => lower.indexOf(w)).filter((i) => i >= 0));
  const start = Math.max(0, idx - 90);
  return `${start > 0 ? "…" : ""}${clean.slice(start, start + 360)}${start + 360 < clean.length ? "…" : ""}`;
}

function buildSources(docs: Doc[]): Source[] {
  return [
    ...docs.map((d) => ({
      id: d.id,
      title: d.title,
      kind: `Campaign${d.category ? ` / ${d.category}` : ""}`,
      category: d.category || d.category_key,
      text: `Title: ${d.title}\nCategory: ${d.category || d.category_key || "Campaign"}\n\n${d.content}`,
      doc: d,
    })),
    ...spellsData.map((s) => ({ id: `spell-${s.id}`, title: s.name, kind: "Spell", text: `Level ${s.level} ${s.school}. Casting: ${s.castingTime}. Range: ${s.range}. Duration: ${s.duration}. Components: ${s.components.join(", ")}. ${s.description} ${s.higherLevel ?? ""}` })),
    ...monstersData.map((m) => ({ id: `monster-${m.id}`, title: m.name, kind: "Monster", text: `${m.size} ${m.type}, CR ${m.cr}, AC ${m.ac}, HP ${m.hp}. ${[...(m.specialAbilities ?? []), ...(m.actions ?? []), ...(m.reactions ?? []), ...(m.legendaryActions ?? [])].map((a) => `${a.name}: ${a.desc}`).join(" ")}` })),
    ...classesData.map((c) => ({ id: `class-${c.id}`, title: c.name, kind: "Class", text: `Hit die d${c.hitDie}. Saves ${c.savingThrows.join(", ")}. Proficiencies ${c.proficiencies.join(", ")}. Features ${c.features.map((f) => `${f.level}: ${f.name}`).join(", ")}` })),
    ...racesData.map((r) => ({ id: `race-${r.id}`, title: r.name, kind: "Race", text: `Speed ${r.speed}. Size ${r.size}. Languages ${r.languages.join(", ")}. ${r.traits.map((t) => `${t.name}: ${t.desc}`).join(" ")}` })),
    ...rulesData.flatMap((ch) => ch.sections.map((s) => ({ id: `rule-${s.id}`, title: s.name, kind: "Rule", text: s.content }))),
  ];
}

function findRelevantSources(question: string, allSources: Source[]): Source[] {
  const qTerms = terms(question);
  if (!qTerms.length) return [];
  const q = question.toLowerCase();
  const wantsCampaign = /\b(campaign|session|sessions|npc|npcs|location|locations|where|when|who|plot|story|combat|fight|battle|encounter|next|last)\b/.test(q);
  const wantsSessions = /\b(when|session|sessions|combat|fight|battle|encounter|happen|happened|next|last)\b/.test(q);
  const wantsNpcs = /\b(who|npc|npcs|person|people|character)\b/.test(q);
  const wantsLocations = /\b(where|location|locations|place|places)\b/.test(q);

  return allSources
    .map((s) => {
      const hay = `${s.title} ${s.kind} ${s.category ?? ""} ${s.text}`.toLowerCase();
      const title = s.title.toLowerCase();
      const cat = (s.category || "").toLowerCase();
      const isCampaign = !!s.doc;
      let score = qTerms.reduce((sum, t) => sum + (title.includes(t) ? 10 : 0) + (hay.includes(t) ? 2 : 0) + ((hay.match(new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g")) ?? []).length), 0);

      // Broad DM questions like “when do we have combat?” often need campaign notes,
      // especially Sessions, even when the exact word does not appear in every doc.
      if (wantsCampaign && isCampaign) score += 12;
      if (wantsSessions && isCampaign && /session|sessions/.test(cat)) score += 35;
      if (wantsNpcs && isCampaign && /npc|npcs/.test(cat)) score += 25;
      if (wantsLocations && isCampaign && /location|locations/.test(cat)) score += 25;
      if (wantsCampaign && !isCampaign) score -= 8;

      return { s, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((r) => r.s);
}

function fallbackAnswer(question: string, ranked: Source[]): Message {
  const qTerms = terms(question);
  if (!ranked.length) return { role: "assistant", text: "I couldn't find anything relevant in the campaign notes or SRD data. Try a character, place, spell, monster, or rule name." };
  const body = ranked.slice(0, 5).map((s) => `**${s.title}** (${s.kind})\n${snippet(s.text, qTerms)}`).join("\n\n");
  return { role: "assistant", text: body, sources: ranked };
}

async function askAI(question: string, campaignId: string, docs: Doc[]): Promise<Message> {
  const res = await fetch("/api/dm-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, campaignId }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "AI request failed");
  const returnedSources = Array.isArray(data?.sources) ? data.sources : [];
  const sourceDocs = returnedSources.map((s: any) => {
    const doc = docs.find((d) => d.id === (s.docId || s.id));
    return { id: s.id || s.docId, title: s.title, kind: s.kind || "Campaign", text: "", doc } as Source;
  });
  return { role: "assistant", text: data?.text || "I couldn't generate a response.", sources: sourceDocs };
}

const welcomeMessage: Message = { role: "assistant", text: "I'm your DM helper. Ask me to look up campaign lore, rules, spells, monsters, classes, or races." };

export default function DMChatPanel({ campaignId, docs, onSelectDoc }: DMChatPanelProps) {
  const storageKey = `dm-chat:${campaignId}`;
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved) as Message[];
    } catch {}
    return [welcomeMessage];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const sources = useMemo(() => buildSources(docs), [docs]);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(messages)); } catch {}
  }, [messages, storageKey]);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight }); }, [messages, loading]);

  const clearChat = () => setMessages([welcomeMessage]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    const ranked = findRelevantSources(q, sources);
    setInput("");
    setLoading(true);
    setMessages((m) => [...m, { role: "user", text: q }]);
    try {
      const reply = await askAI(q, campaignId, docs);
      setMessages((m) => [...m, reply]);
    } catch (e: any) {
      const fallback = fallbackAnswer(q, ranked);
      setMessages((m) => [...m, { ...fallback, text: `AI is unavailable: ${e.message}\n\n${fallback.text}` }]);
    } finally {
      setLoading(false);
    }
  };

  return <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <style>{`
      .dm-chat-markdown { font-size: 13px; line-height: 1.48; color: inherit; }
      .dm-chat-markdown .m3body { font-size: 13px; line-height: 1.48; color: inherit; margin: 0 0 8px; }
      .dm-chat-markdown .m3body:last-child,
      .dm-chat-markdown .m3list:last-child,
      .dm-chat-markdown .m3pre:last-child { margin-bottom: 0; }
      .dm-chat-markdown .m3h1,
      .dm-chat-markdown .m3h2,
      .dm-chat-markdown .m3h3,
      .dm-chat-markdown .m3h4 { font-size: 13px; line-height: 1.35; color: inherit; margin: 10px 0 6px; font-weight: 700; letter-spacing: 0; }
      .dm-chat-markdown .m3h1:first-child,
      .dm-chat-markdown .m3h2:first-child,
      .dm-chat-markdown .m3h3:first-child,
      .dm-chat-markdown .m3h4:first-child { margin-top: 0; }
      .dm-chat-markdown .m3list { margin: 6px 0 8px; padding-left: 18px; }
      .dm-chat-markdown .m3list li { font-size: 13px; line-height: 1.5; color: inherit; margin: 3px 0; }
      .dm-chat-markdown strong { color: var(--dm-text); font-weight: 700; }
      .dm-chat-markdown em { color: inherit; opacity: 0.92; }
      .dm-chat-markdown .m3code { font-size: 12px; background: rgba(255,255,255,0.08); color: var(--dm-primary); }
      .dm-chat-markdown .m3pre { max-width: 100%; white-space: pre-wrap; word-break: break-word; margin: 8px 0; }
      .dm-chat-markdown .m3bq { margin: 8px 0; font-size: 13px; line-height: 1.5; color: inherit; background: rgba(255,255,255,0.04); }
      .dm-chat-user { white-space: pre-wrap; overflow-wrap: anywhere; }
    `}</style>
    <div style={{ padding: 12, borderBottom: "1px solid var(--dm-outline-variant)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--dm-text)" }}>DM Assistant</div>
        <button onClick={clearChat} title="Clear chat" style={{ border: "1px solid var(--dm-outline-variant)", background: "var(--dm-surface)", color: "var(--dm-text-secondary)", borderRadius: 999, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>Clear</button>
      </div>

    </div>
    <div ref={listRef} style={{ flex: 1, overflow: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 12, background: "linear-gradient(180deg, rgba(255,255,255,0.015), transparent 120px)" }}>
      {messages.map((m, i) => <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start", width: "100%" }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--dm-text-muted)", margin: m.role === "user" ? "0 10px 4px 0" : "0 0 4px 10px" }}>{m.role === "user" ? "You" : "Assistant"}</div>
        <div style={{ maxWidth: "86%", padding: "10px 13px", borderRadius: m.role === "user" ? "18px 18px 6px 18px" : "18px 18px 18px 6px", background: m.role === "user" ? "var(--dm-primary)" : "var(--dm-surface-container)", color: m.role === "user" ? "var(--dm-on-primary)" : "var(--dm-text)", fontSize: 13, lineHeight: 1.45, boxShadow: "0 1px 2px rgba(0,0,0,0.18)", border: m.role === "user" ? "none" : "1px solid var(--dm-outline-variant)" }}>
          {m.role === "assistant" ? (
            <div
              className="dm-chat-markdown"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }}
            />
          ) : <span className="dm-chat-user">{m.text}</span>}
        </div>
        {m.sources?.some((s) => s.doc) && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6, maxWidth: "86%" }}>
          {m.sources.filter((s) => s.doc).map((s) => <button key={s.id} onClick={() => s.doc && onSelectDoc(s.doc)} style={{ border: "1px solid var(--dm-outline-variant)", background: "var(--dm-surface)", color: "var(--dm-primary)", borderRadius: 999, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>Open {s.title}</button>)}
        </div>}
      </div>)}
      {loading && <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--dm-text-muted)", margin: "0 0 4px 10px" }}>Assistant</div>
        <div style={{ padding: "10px 13px", borderRadius: "18px 18px 18px 6px", background: "var(--dm-surface-container)", border: "1px solid var(--dm-outline-variant)", color: "var(--dm-text-muted)", boxShadow: "0 1px 2px rgba(0,0,0,0.18)", fontSize: 13 }}>Thinking…</div>
      </div>}
    </div>
    <div style={{ padding: 12, borderTop: "1px solid var(--dm-outline-variant)", display: "flex", gap: 8, background: "var(--dm-bg)" }}>
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Ask the DM assistant…" style={{ flex: 1, border: "1px solid var(--dm-outline-variant)", background: "var(--dm-surface-bright)", color: "var(--dm-text)", borderRadius: 22, padding: "0 14px", height: 42, outline: "none" }} />
      <button disabled={loading || !input.trim()} onClick={send} style={{ width: 42, height: 42, borderRadius: 21, border: "none", background: loading || !input.trim() ? "var(--dm-surface-bright)" : "var(--dm-primary)", color: loading || !input.trim() ? "var(--dm-text-muted)" : "var(--dm-on-primary)", cursor: loading || !input.trim() ? "default" : "pointer", fontWeight: 700 }}>➤</button>
    </div>
  </div>;
}
