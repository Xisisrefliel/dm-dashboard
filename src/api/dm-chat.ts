import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { campaigns, docs } from "../db/schema";
import { getSession } from "./auth";
import spellsRaw from "../data/srd-spells.json";
import monstersRaw from "../data/srd-monsters.json";
import classesRaw from "../data/srd-classes.json";
import racesRaw from "../data/srd-races.json";
import rulesRaw from "../data/srd-rules.json";

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-3.1-flash-lite";

const SYSTEM_PROMPT =
  "You are a concise, helpful Dungeons & Dragons dungeon-master assistant. Always respond in German, regardless of the language used by the user. Format responses as clean Markdown: use ##/### headings when helpful, use '-' for bullet lists, avoid '*' bullets, and avoid excessive blank lines between bullets. You have tools to inspect campaign documents and SRD rules/spells/monsters/classes/races. For campaign-specific questions, use campaign tools first, especially sessions, locations, NPCs, encounters, and notes. If the user asks in English but the campaign is German, translate intent internally and search German equivalents too. Do not answer from memory when campaign tools are needed. Cite source titles in parentheses when useful. Keep responses short unless asked for detail.";

const toolDefs = [
  {
    type: "function",
    function: {
      name: "list_campaign_docs",
      description: "List campaign documents with ids, titles, categories, and short previews. Use this first for broad campaign questions.",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string", description: "Optional category key like sessions, locations, npcs." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_campaign_docs",
      description: "Search campaign documents by query. Searches title, category and content, with English/German query expansion.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
          category: { type: "string", description: "Optional category key like sessions, locations, npcs." },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_campaign_doc",
      description: "Read the full content of a campaign document by id.",
      parameters: {
        type: "object",
        properties: { id: { type: "string" } },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_srd",
      description: "Search SRD rules, spells, monsters, classes and races.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
          type: { type: "string", enum: ["all", "rules", "spells", "monsters", "classes", "races"] },
        },
        required: ["query"],
      },
    },
  },
];

const expansions: Record<string, string[]> = {
  combat: ["kampf", "kämpfe", "begegnung", "begegnungen", "schlacht", "gefecht"],
  fight: ["kampf", "kämpfe", "begegnung", "schlacht"],
  battle: ["kampf", "schlacht", "gefecht"],
  encounter: ["begegnung", "begegnungen", "kampf"],
  session: ["session", "sitzung", "spielabend", "abend"],
  sessions: ["sessions", "sitzungen", "spielabende"],
  location: ["ort", "orte", "schauplatz", "stadt", "dorf", "gebiet"],
  locations: ["orte", "schauplätze", "stadt", "dorf", "gebiet"],
  npc: ["nsc", "nsC", "person", "charakter"],
  npcs: ["nscs", "personen", "charaktere"],
  when: ["wann", "als", "nachdem", "bevor"],
  where: ["wo", "wohin", "ort"],
  who: ["wer", "wen", "wem"],
};

function queryTerms(query: string): string[] {
  const base = query.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [];
  return [...new Set(base.flatMap((t) => [t, ...(expansions[t] ?? [])]).filter((t) => t.length > 2))];
}

function scoreText(query: string, text: string): number {
  const hay = text.toLowerCase();
  return queryTerms(query).reduce((sum, t) => sum + (hay.includes(t.toLowerCase()) ? 3 : 0), 0);
}

function preview(text: string, max = 500): string {
  return text.replace(/\s+/g, " ").trim().slice(0, max);
}

async function getCampaignDocs(campaignId: string, userId: string) {
  const [campaign] = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, userId)));
  if (!campaign) throw new Error("Campaign not found");

  return db
    .select({ id: docs.id, title: docs.title, category: docs.categoryKey, content: docs.content })
    .from(docs)
    .where(eq(docs.campaignId, campaignId));
}

function buildSrd() {
  return [
    ...(spellsRaw as any[]).map((s) => ({ title: s.name, kind: "Spell", text: `${s.name} ${s.description} ${s.higherLevel ?? ""}` })),
    ...(monstersRaw as any[]).map((m) => ({ title: m.name, kind: "Monster", text: `${m.name} ${m.type} CR ${m.cr} ${[...(m.specialAbilities ?? []), ...(m.actions ?? [])].map((a) => `${a.name}: ${a.desc}`).join(" ")}` })),
    ...(classesRaw as any[]).map((c) => ({ title: c.name, kind: "Class", text: `${c.name} ${c.proficiencies?.join?.(", ") ?? ""} ${c.features?.map?.((f: any) => f.name).join(", ") ?? ""}` })),
    ...(racesRaw as any[]).map((r) => ({ title: r.name, kind: "Race", text: `${r.name} ${r.traits?.map?.((t: any) => `${t.name}: ${t.desc}`).join(" ") ?? ""}` })),
    ...(rulesRaw as any[]).flatMap((ch) => ch.sections.map((s: any) => ({ title: s.name, kind: "Rule", text: `${s.name} ${s.content}` }))),
  ];
}

export const dmChatRoutes = {
  "/api/dm-chat": {
    async POST(req: Request) {
      try {
        const user = await getSession(req);
        if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) return Response.json({ error: "OPENROUTER_API_KEY not configured" }, { status: 500 });

        const body = await req.json().catch(() => null);
        const question = String(body?.question || "").trim();
        const campaignId = String(body?.campaignId || "").trim();
        if (!question || !campaignId) return Response.json({ error: "Question and campaignId are required" }, { status: 400 });

        const campaignDocs = await getCampaignDocs(campaignId, user.id);
        const usedSources: any[] = [];

        const runTool = async (name: string, args: any) => {
          if (name === "list_campaign_docs") {
            const category = String(args?.category || "").toLowerCase();
            const rows = campaignDocs
              .filter((d) => !category || d.category.toLowerCase().includes(category))
              .map((d) => ({ id: d.id, title: d.title, category: d.category, preview: preview(d.content, 240) }))
              .slice(0, 60);
            return JSON.stringify(rows);
          }
          if (name === "search_campaign_docs") {
            const q = String(args?.query || question);
            const category = String(args?.category || "").toLowerCase();
            const rows = campaignDocs
              .map((d) => ({ d, score: scoreText(q, `${d.title} ${d.category} ${d.content}`) + (category && d.category.toLowerCase().includes(category) ? 20 : 0) }))
              .filter((r) => r.score > 0)
              .sort((a, b) => b.score - a.score)
              .slice(0, 10)
              .map(({ d }) => {
                usedSources.push({ id: d.id, title: d.title, kind: `Campaign / ${d.category}`, docId: d.id });
                return { id: d.id, title: d.title, category: d.category, content: preview(d.content, 1800) };
              });
            return JSON.stringify(rows);
          }
          if (name === "get_campaign_doc") {
            const doc = campaignDocs.find((d) => d.id === String(args?.id));
            if (!doc) return JSON.stringify({ error: "Document not found" });
            usedSources.push({ id: doc.id, title: doc.title, kind: `Campaign / ${doc.category}`, docId: doc.id });
            return JSON.stringify({ id: doc.id, title: doc.title, category: doc.category, content: doc.content.slice(0, 6000) });
          }
          if (name === "search_srd") {
            const q = String(args?.query || question);
            const type = String(args?.type || "all").toLowerCase();
            const rows = buildSrd()
              .filter((s) => type === "all" || `${s.kind}s`.toLowerCase() === type || s.kind.toLowerCase() === type.replace(/s$/, ""))
              .map((s) => ({ s, score: scoreText(q, `${s.title} ${s.kind} ${s.text}`) }))
              .filter((r) => r.score > 0)
              .sort((a, b) => b.score - a.score)
              .slice(0, 8)
              .map(({ s }) => ({ title: s.title, kind: s.kind, content: preview(s.text, 1600) }));
            return JSON.stringify(rows);
          }
          return JSON.stringify({ error: `Unknown tool ${name}` });
        };

        const messages: any[] = [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ];

        let finalText = "";
        for (let i = 0; i < 4; i++) {
          const res = await fetch(OPENROUTER_API, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
              "X-Title": "DM Dashboard",
            },
            body: JSON.stringify({ model: MODEL, messages, tools: toolDefs, tool_choice: "auto", temperature: 0.35, max_tokens: 900 }),
          });
          const data = await res.json().catch(() => null);
          if (!res.ok) return Response.json({ error: data?.error?.message || "OpenRouter request failed" }, { status: res.status });

          const msg = data?.choices?.[0]?.message;
          if (!msg?.tool_calls?.length) {
            finalText = msg?.content || "Ich konnte keine Antwort generieren.";
            break;
          }

          messages.push(msg);
          for (const call of msg.tool_calls) {
            const result = await runTool(call.function.name, JSON.parse(call.function.arguments || "{}"));
            messages.push({ role: "tool", tool_call_id: call.id, name: call.function.name, content: result });
          }
        }

        return Response.json({ text: finalText || "Ich konnte keine Antwort generieren.", sources: usedSources });
      } catch (e: any) {
        console.error("DM chat error:", e);
        return Response.json({ error: e.message || "Internal server error" }, { status: 500 });
      }
    },
  },
};
