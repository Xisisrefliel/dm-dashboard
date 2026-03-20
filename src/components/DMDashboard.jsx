import { useState, useRef, useEffect, useMemo } from "react";
import {
  SRDRulesDrawer,
  SRDRulesContent,
} from "./SRDRulesViewer.jsx";
import SpellList, { spellsData } from "./SpellList.jsx";
import SpellCard from "./SpellCard.jsx";
import MonsterList, { monstersData } from "./MonsterList.jsx";
import MonsterStatBlock from "./MonsterStatBlock.jsx";
import ClassList, { classesData } from "./ClassList.jsx";
import ClassDetail from "./ClassDetail.jsx";
import RaceList, { racesData } from "./RaceList.jsx";
import RaceDetail from "./RaceDetail.jsx";
import rulesData from "../data/srd-rules.json";
import Icon from "./ui/Icon.jsx";
import Ripple from "./ui/Ripple.jsx";
import Chip from "./ui/Chip.jsx";
import ContextMenu from "./ui/ContextMenu.jsx";
import { renderMarkdown, highlightMatch } from "../utils/renderMarkdown.js";
import { SRD_CATEGORIES, ICON_OPTIONS } from "../data/sampleCampaign.js";
import DiceRoller from "./DiceRoller.jsx";
import InitTracker from "./InitTracker.jsx";
import DocPreviewCard from "./DocPreviewCard.jsx";
import PinnedPanel from "./PinnedPanel.jsx";

function DMDashboard({ campaign, onBack, onUpdate }) {
  const [docs, setDocs] = useState(campaign.docs);
  const [cat, setCat] = useState("locations");
  const [doc, setDoc] = useState(campaign.docs[0] || null);
  const [pinned, setPinned] = useState([]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [rightTab, setRightTab] = useState("dice");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteTitle, setPasteTitle] = useState("");
  const [pasteIcon, setPasteIcon] = useState("description");
  const [pasteContent, setPasteContent] = useState("");
  const searchRef = useRef(null);

  // SRD state
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [selectedRuleSection, setSelectedRuleSection] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);

  const isSRD = cat.startsWith("srd-");

  // Context menu
  const [ctxMenu, setCtxMenu] = useState(null);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  // Rename (docs)
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const renameRef = useRef(null);

  // Categories (mutable)
  const [categories, setCategories] = useState(campaign.categories);
  const [renamingCat, setRenamingCat] = useState(null);
  const [renameCatValue, setRenameCatValue] = useState("");
  const renameCatRef = useRef(null);

  // Doc preview hover
  const [hoverPreview, setHoverPreview] = useState(null);
  const hoverTimeout = useRef(null);

  // Sync docs/categories to parent
  useEffect(() => {
    onUpdate({ docs, categories });
  }, [docs, categories]);

  const catItems = useMemo(
    () => docs.filter((d) => d.category === cat),
    [docs, cat],
  );
  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    const campaignResults = docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q),
    );
    const spellResults = spellsData
      .filter((s) => s.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map((s) => ({
        id: `srd-spell-${s.id}`,
        title: s.name,
        icon: "auto_fix_high",
        category: "srd-spells",
        srdId: s.id,
      }));
    const monsterResults = monstersData
      .filter((m) => m.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map((m) => ({
        id: `srd-monster-${m.id}`,
        title: m.name,
        icon: "pets",
        category: "srd-monsters",
        srdId: m.id,
      }));
    const classResults = classesData
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map((c) => ({
        id: `srd-class-${c.id}`,
        title: c.name,
        icon: "person",
        category: "srd-classes",
        srdId: c.id,
      }));
    const raceResults = racesData
      .filter((r) => r.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map((r) => ({
        id: `srd-race-${r.id}`,
        title: r.name,
        icon: "groups",
        category: "srd-races",
        srdId: r.id,
      }));
    const rulesResults = rulesData
      .flatMap((r) => r.sections)
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.content.toLowerCase().includes(q),
      )
      .slice(0, 8)
      .map((s) => ({
        id: `srd-rule-${s.id}`,
        title: s.name,
        icon: "gavel",
        category: "srd-rules",
        srdId: s.id,
      }));
    return [...campaignResults, ...rulesResults, ...spellResults, ...monsterResults, ...classResults, ...raceResults];
  }, [docs, search]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        if (searchOpen) {
          setSearchOpen(false);
          setSearch("");
          searchRef.current?.blur();
        }
        if (ctxMenu) setCtxMenu(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen, ctxMenu]);

  // Focus rename input when it appears
  useEffect(() => {
    if (renamingId && renameRef.current) renameRef.current.focus();
  }, [renamingId]);

  useEffect(() => {
    if (renamingCat && renameCatRef.current) {
      renameCatRef.current.focus();
      renameCatRef.current.select();
    }
  }, [renamingCat]);

  const startRenameCat = (c) => {
    setRenamingCat(c.key);
    setRenameCatValue(c.label);
  };

  const commitRenameCat = () => {
    if (renamingCat && renameCatValue.trim()) {
      setCategories((cats) =>
        cats.map((c) =>
          c.key === renamingCat ? { ...c, label: renameCatValue.trim() } : c,
        ),
      );
    }
    setRenamingCat(null);
    setRenameCatValue("");
  };

  const togglePin = (item) =>
    setPinned((p) =>
      p.find((x) => x.id === item.id)
        ? p.filter((x) => x.id !== item.id)
        : [...p, item],
    );
  const isPinnedCheck = (id) => pinned.some((x) => x.id === id);

  const addToInitiative = (monster) => {
    setRightTab("init");
    setRightOpen(true);
    window.dispatchEvent(
      new CustomEvent("dm-add-initiative", {
        detail: { name: monster.name, hp: monster.hp },
      }),
    );
  };

  const selectDoc = (item) => {
    if (item.category === "srd-spells") {
      const spellId = item.srdId || item.id?.replace("srd-spell-", "");
      setCat("srd-spells");
      setSelectedSpell(spellId);
      setDoc(null);
    } else if (item.category === "srd-monsters") {
      const monsterId = item.srdId || item.id?.replace("srd-monster-", "");
      setCat("srd-monsters");
      setSelectedMonster(monsterId);
      setDoc(null);
    } else if (item.category === "srd-classes") {
      const classId = item.srdId || item.id?.replace("srd-class-", "");
      setCat("srd-classes");
      setSelectedClass(classId);
      setDoc(null);
    } else if (item.category === "srd-races") {
      const raceId = item.srdId || item.id?.replace("srd-race-", "");
      setCat("srd-races");
      setSelectedRace(raceId);
      setDoc(null);
    } else if (item.category === "srd-rules") {
      const ruleId = item.srdId || item.id?.replace("srd-rule-", "");
      setCat("srd-rules");
      setSelectedRuleSection(ruleId);
      setDoc(null);
    } else {
      setDoc(item);
      setCat(item.category);
    }
    setPasteMode(false);
    setEditing(false);
  };

  const updateDoc = (id, updates) => {
    setDocs((d) => d.map((x) => (x.id === id ? { ...x, ...updates } : x)));
    if (doc?.id === id) setDoc((prev) => ({ ...prev, ...updates }));
    setPinned((p) => p.map((x) => (x.id === id ? { ...x, ...updates } : x)));
  };

  const deleteDoc = (id) => {
    setDocs((d) => d.filter((x) => x.id !== id));
    setPinned((p) => p.filter((x) => x.id !== id));
    if (doc?.id === id) setDoc(null);
  };

  const startRename = (item) => {
    setRenamingId(item.id);
    setRenameValue(item.title);
  };

  const commitRename = () => {
    if (renamingId && renameValue.trim()) {
      updateDoc(renamingId, { title: renameValue.trim() });
    }
    setRenamingId(null);
    setRenameValue("");
  };

  const startEdit = () => {
    if (!doc) return;
    setEditContent(doc.content);
    setEditing(true);
  };

  const saveEdit = () => {
    if (doc) updateDoc(doc.id, { content: editContent });
    setEditing(false);
  };

  const addDoc = () => {
    if (!pasteTitle.trim() || !pasteContent.trim()) return;
    const d = {
      id: "c-" + Date.now(),
      title: pasteTitle.trim(),
      category: cat,
      icon: pasteIcon,
      content: pasteContent,
    };
    setDocs((x) => [...x, d]);
    setDoc(d);
    setPasteMode(false);
    setPasteTitle("");
    setPasteIcon("description");
    setPasteContent("");
  };

  const handleBack = () => onBack(docs, categories);

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, item });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        @keyframes m3ripple { to { transform: scale(1); opacity: 0; } }
        @keyframes m3pop { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes m3slideIn { from { transform: translateX(-16px); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes critGlow {
          0%, 100% { text-shadow: 0 0 12px rgba(186, 240, 174, 0.3); }
          50% { text-shadow: 0 0 28px rgba(186, 240, 174, 0.6), 0 0 60px rgba(159, 212, 148, 0.3); }
        }
        @keyframes fumbleShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px) rotate(-2deg); }
          30% { transform: translateX(6px) rotate(2deg); }
          45% { transform: translateX(-4px) rotate(-1deg); }
          60% { transform: translateX(4px) rotate(1deg); }
          75% { transform: translateX(-2px); }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { background: #111611; }

        .m3h1 { font-size: 24px; font-weight: 600; color: var(--dm-text); margin: 0 0 16px; letter-spacing: -0.02em; line-height: 1.3; }
        .m3h2 { font-size: 18px; font-weight: 600; color: var(--dm-text); margin: 28px 0 10px; letter-spacing: -0.01em; line-height: 1.3; }
        .m3h3 { font-size: 15px; font-weight: 600; color: var(--dm-text); margin: 20px 0 8px; line-height: 1.3; }
        .m3h4 { font-size: 14px; font-weight: 600; color: var(--dm-text); margin: 16px 0 6px; line-height: 1.3; }
        .m3h5 { font-size: 13px; font-weight: 600; color: var(--dm-text-secondary); margin: 12px 0 4px; line-height: 1.3; text-transform: uppercase; letter-spacing: 0.04em; }
        .m3h6 { font-size: 12px; font-weight: 600; color: var(--dm-text-muted); margin: 10px 0 4px; line-height: 1.3; text-transform: uppercase; letter-spacing: 0.04em; }
        .m3body { font-size: 14px; line-height: 1.7; color: var(--dm-text-secondary); margin: 4px 0; }
        .m3code { background: var(--dm-surface-bright); padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: 'SF Mono', 'Cascadia Code', monospace; color: var(--dm-primary); }
        .m3link { color: var(--dm-primary); cursor: pointer; font-weight: 500; text-decoration: underline; text-decoration-color: rgba(159,212,148,0.3); text-underline-offset: 2px; transition: text-decoration-color 0.15s; }
        .m3link:hover { text-decoration-color: var(--dm-primary); background: rgba(159,212,148,0.08); border-radius: 3px; }
        .m3hr { border: none; border-top: 1px solid var(--dm-outline-variant); margin: 16px 0; }
        .m3bq { border-left: 3px solid var(--dm-primary); padding: 10px 16px; margin: 12px 0; background: var(--dm-primary-container); border-radius: 0 12px 12px 0; font-style: italic; color: var(--dm-text-secondary); font-size: 14px; line-height: 1.6; }
        .m3list { padding-left: 20px; margin: 8px 0; }
        .m3list li { font-size: 14px; line-height: 1.7; color: var(--dm-text-secondary); margin: 4px 0; }
        .m3list li::marker { color: var(--dm-primary-dim); }
        .m3table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
        .m3table th { text-align: left; padding: 8px 12px; font-weight: 600; color: var(--dm-text); border-bottom: 2px solid var(--dm-outline-variant); }
        .m3table td { padding: 8px 12px; border-bottom: 1px solid var(--dm-surface-bright); color: var(--dm-text-secondary); }
        .m3table tr:hover td { background: rgba(255,255,255,0.03); }
        .m3input { padding: 10px 12px; border: 1px solid var(--dm-outline-variant); border-radius: 12px; background: transparent; color: var(--dm-text); font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .m3input:focus { border-color: var(--dm-primary); border-width: 2px; padding: 9px 11px; box-shadow: 0 0 0 2px rgba(159, 212, 148, 0.1); }
        .m3input::placeholder { color: var(--dm-text-muted); }

        .navitem { transition: all 0.2s cubic-bezier(0.2, 0, 0, 1); }
        .navitem:hover { background: var(--dm-surface-bright) !important; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--dm-outline-variant); border-radius: 3px; }
        ::selection { background: rgba(159, 212, 148, 0.25); }
      `}</style>

      <div
        style={{
          /* -- M3 Dark Pastel Color Tokens (olive/green tint) -- */
          "--dm-bg": "#111611",
          "--dm-surface": "#1e251e",
          "--dm-surface-bright": "#2a322a",
          "--dm-surface-brighter": "#363e35",
          "--dm-surface-lowest": "#0d110c",
          "--dm-text": "#e2e3dc",
          "--dm-text-secondary": "#c2c9bb",
          "--dm-text-muted": "#8c9386",
          "--dm-primary": "#9fd494",
          "--dm-primary-light": "#baf0ae",
          "--dm-primary-dim": "#5a8a50",
          "--dm-primary-container": "#1f3a1a",
          "--dm-on-primary": "#0a3806",
          "--dm-on-primary-container": "#baf0ae",
          "--dm-secondary-container": "#3c4c38",
          "--dm-on-secondary-container": "#d5e8cc",
          "--dm-tertiary": "#a0cfcc",
          "--dm-tertiary-container": "#1e4e4b",
          "--dm-error": "#ffb4ab",
          "--dm-error-container": "#3a1510",
          "--dm-outline": "#8c9386",
          "--dm-outline-variant": "#424940",

          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--dm-bg)",
          color: "var(--dm-text)",
          overflow: "hidden",
        }}
      >
        {/* ====== TOP APP BAR ====== */}
        <div
          style={{
            height: 64,
            minHeight: 64,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 8,
            background: "var(--dm-bg)",
            zIndex: 10,
          }}
        >
          <Ripple
            onClick={handleBack}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="arrow_back" />
          </Ripple>
          <Ripple
            onClick={() => setDrawerOpen((d) => !d)}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={drawerOpen ? "menu_open" : "menu"} />
          </Ripple>
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}
          >
            <Icon
              name="shield_with_house"
              size={28}
              filled
              style={{ color: "var(--dm-primary)" }}
            />
            <span
              style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.3 }}
            >
              DM Dashboard
            </span>
            <span
              style={{
                fontSize: 13,
                color: "var(--dm-text-secondary)",
                marginLeft: 4,
                fontWeight: 400,
              }}
            >
              {campaign.name}
            </span>
          </div>

          {/* M3 Search Bar */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 16px",
                height: 48,
                background: "var(--dm-surface-bright)",
                borderRadius: 28,
                width: 320,
                transition: "all 0.3s",
              }}
            >
              <Icon
                name="search"
                size={20}
                style={{ color: "var(--dm-text-secondary)" }}
              />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                placeholder="Search campaign, spells, monsters..."
                style={{
                  border: "none",
                  background: "none",
                  outline: "none",
                  color: "var(--dm-text)",
                  fontSize: 14,
                  width: "100%",
                  fontFamily: "inherit",
                }}
              />
              {search ? (
                <span
                  onClick={() => {
                    setSearch("");
                    setSearchOpen(false);
                  }}
                  style={{
                    cursor: "pointer",
                    color: "var(--dm-text-secondary)",
                    display: "flex",
                  }}
                >
                  <Icon name="close" size={18} />
                </span>
              ) : (
                <kbd
                  style={{
                    fontSize: 11,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: "var(--dm-surface)",
                    border: "1px solid var(--dm-outline-variant)",
                    color: "var(--dm-text-muted)",
                    fontFamily: "inherit",
                    fontWeight: 500,
                  }}
                >
                  {"\u2318"}K
                </kbd>
              )}
            </div>
            {searchOpen && results.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 56,
                  right: 0,
                  width: 360,
                  background: "var(--dm-surface-brighter)",
                  borderRadius: 16,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                  maxHeight: 400,
                  overflow: "auto",
                  zIndex: 100,
                  animation: "m3pop 0.2s cubic-bezier(0.2,0,0,1)",
                }}
              >
                {results.map((item, i) => (
                  <Ripple
                    key={item.id}
                    onClick={() => {
                      selectDoc(item);
                      setSearchOpen(false);
                      setSearch("");
                    }}
                    style={{
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      borderBottom:
                        i < results.length - 1
                          ? "1px solid var(--dm-outline-variant)"
                          : "none",
                    }}
                  >
                    <Icon
                      name={item.icon}
                      size={20}
                      style={{ color: "var(--dm-text-secondary)" }}
                    />
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>
                        {highlightMatch(item.title, search)}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--dm-text-secondary)",
                        }}
                      >
                        {categories.find((c) => c.key === item.category)
                          ?.label ||
                          SRD_CATEGORIES.find((c) => c.key === item.category)
                            ?.label ||
                          item.category}
                      </div>
                    </div>
                  </Ripple>
                ))}
              </div>
            )}
          </div>

          <Ripple
            onClick={() => setRightOpen((r) => !r)}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={rightOpen ? "right_panel_close" : "right_panel_open"} />
          </Ripple>
        </div>

        {/* ====== MAIN BODY ====== */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* ====== NAVIGATION DRAWER ====== */}
          <div
            style={{
              width: drawerOpen ? 280 : 0,
              minWidth: drawerOpen ? 280 : 0,
              transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              background: "var(--dm-bg)",
            }}
          >
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                scrollbarWidth: "none",
              }}
            >
              <div style={{ padding: "0 12px" }}>
                <div
                  style={{
                    padding: "8px 4px 12px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {categories.map((c) =>
                    renamingCat === c.key ? (
                      <input
                        key={c.key}
                        ref={renameCatRef}
                        value={renameCatValue}
                        onChange={(e) => setRenameCatValue(e.target.value)}
                        onBlur={commitRenameCat}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRenameCat();
                          if (e.key === "Escape") setRenamingCat(null);
                        }}
                        className="m3input"
                        style={{
                          width: 120,
                          fontSize: 14,
                          padding: "5px 12px",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      <div
                        key={c.key}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setCtxMenu({
                            x: e.clientX,
                            y: e.clientY,
                            catItem: c,
                          });
                        }}
                      >
                        <Chip
                          label={c.label}
                          icon={c.icon}
                          selected={
                            cat === c.key || ctxMenu?.catItem?.key === c.key
                          }
                          onClick={() => {
                            setCat(c.key);
                            setPasteMode(false);
                          }}
                        />
                      </div>
                    ),
                  )}
                  {/* SRD Reference divider + chips */}
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      margin: "2px 0",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: "var(--dm-outline-variant)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--dm-text-muted)",
                        fontWeight: 500,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                      }}
                    >
                      Reference
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: "var(--dm-outline-variant)",
                      }}
                    />
                  </div>
                  {SRD_CATEGORIES.map((c) => (
                    <Chip
                      key={c.key}
                      label={c.label}
                      icon={c.icon}
                      selected={cat === c.key}
                      onClick={() => {
                        setCat(c.key);
                        setDoc(null);
                        setPasteMode(false);
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, overflow: "auto", padding: "0 12px" }}>
                {cat === "srd-rules" && (
                  <SRDRulesDrawer
                    Icon={Icon}
                    Ripple={Ripple}
                    selectedSection={selectedRuleSection}
                    onSelectSection={setSelectedRuleSection}
                  />
                )}
                {cat === "srd-spells" && (
                  <SpellList
                    Icon={Icon}
                    Ripple={Ripple}
                    Chip={Chip}
                    selectedSpellId={selectedSpell}
                    onSelectSpell={setSelectedSpell}
                  />
                )}
                {cat === "srd-monsters" && (
                  <MonsterList
                    Icon={Icon}
                    Ripple={Ripple}
                    Chip={Chip}
                    selectedMonsterId={selectedMonster}
                    onSelectMonster={setSelectedMonster}
                  />
                )}
                {cat === "srd-classes" && (
                  <ClassList
                    Icon={Icon}
                    Ripple={Ripple}
                    Chip={Chip}
                    selectedClassId={selectedClass}
                    onSelectClass={setSelectedClass}
                  />
                )}
                {cat === "srd-races" && (
                  <RaceList
                    Icon={Icon}
                    Ripple={Ripple}
                    Chip={Chip}
                    selectedRaceId={selectedRace}
                    onSelectRace={setSelectedRace}
                  />
                )}
                {!isSRD && (
                  <>
                    {catItems.map((item, i) => (
                      <Ripple
                        key={item.id}
                        onClick={() => {
                          if (renamingId !== item.id) {
                            setDoc(item);
                            setPasteMode(false);
                            setEditing(false);
                          }
                        }}
                        onContextMenu={(e) => handleContextMenu(e, item)}
                        className="navitem"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 16px",
                          borderRadius: 28,
                          marginBottom: 2,
                          background:
                            doc?.id === item.id || ctxMenu?.item?.id === item.id
                              ? "var(--dm-secondary-container)"
                              : "transparent",
                          color:
                            doc?.id === item.id || ctxMenu?.item?.id === item.id
                              ? "var(--dm-on-secondary-container)"
                              : "var(--dm-text-secondary)",
                          animation: `m3slideIn 0.25s cubic-bezier(0.2,0,0,1) ${i * 0.04}s both`,
                        }}
                      >
                        <Icon
                          name={item.icon}
                          size={20}
                          filled={
                            doc?.id === item.id || ctxMenu?.item?.id === item.id
                          }
                        />
                        {renamingId === item.id ? (
                          <input
                            ref={renameRef}
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={commitRename}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitRename();
                              if (e.key === "Escape") {
                                setRenamingId(null);
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="m3input"
                            style={{
                              flex: 1,
                              fontSize: 14,
                              padding: "4px 8px",
                              minWidth: 0,
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: doc?.id === item.id ? 600 : 400,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.title}
                          </span>
                        )}
                      </Ripple>
                    ))}

                    <Ripple
                      onClick={() => setPasteMode(true)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        borderRadius: 28,
                        marginTop: 4,
                        color: "var(--dm-text-secondary)",
                      }}
                    >
                      <Icon name="add" size={20} />
                      <span style={{ fontSize: 14 }}>Add document</span>
                    </Ripple>
                  </>
                )}
              </div>
              {isSRD && (
                <div
                  style={{
                    padding: "8px 16px",
                    fontSize: 10,
                    color: "var(--dm-text-muted)",
                    borderTop: "1px solid var(--dm-outline-variant)",
                    lineHeight: 1.4,
                  }}
                >
                  5e SRD content &copy; Wizards of the Coast, CC-BY-4.0
                </div>
              )}
            </div>
          </div>

          {/* ====== MAIN CONTENT (elevated card) ====== */}
          <div
            style={{
              flex: 1,
              background: "var(--dm-surface)",
              borderRadius: "28px 28px 0 0",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ flex: 1, overflow: "auto" }}>
              {cat === "srd-rules" ? (
                <SRDRulesContent
                  sectionId={selectedRuleSection}
                  Icon={Icon}
                  Ripple={Ripple}
                  renderMarkdown={renderMarkdown}
                  onPin={togglePin}
                  isPinned={isPinnedCheck}
                />
              ) : cat === "srd-spells" ? (
                <SpellCard
                  spellId={selectedSpell}
                  Icon={Icon}
                  Ripple={Ripple}
                  renderMarkdown={renderMarkdown}
                  onPin={togglePin}
                  isPinned={isPinnedCheck}
                />
              ) : cat === "srd-monsters" ? (
                <MonsterStatBlock
                  monsterId={selectedMonster}
                  Icon={Icon}
                  Ripple={Ripple}
                  onPin={togglePin}
                  isPinned={isPinnedCheck}
                  onAddToInitiative={addToInitiative}
                />
              ) : cat === "srd-classes" ? (
                <ClassDetail
                  classId={selectedClass}
                  Icon={Icon}
                  Ripple={Ripple}
                  onPin={togglePin}
                  isPinned={isPinnedCheck}
                />
              ) : cat === "srd-races" ? (
                <RaceDetail
                  raceId={selectedRace}
                  Icon={Icon}
                  Ripple={Ripple}
                  onPin={togglePin}
                  isPinned={isPinnedCheck}
                />
              ) : pasteMode ? (
                <div
                  style={{
                    maxWidth: 640,
                    margin: "0 auto",
                    padding: "32px 40px",
                    animation: "m3pop 0.3s ease",
                  }}
                >
                  <h2 className="m3h1">
                    <Icon
                      name="note_add"
                      size={28}
                      style={{
                        verticalAlign: -6,
                        marginRight: 10,
                        color: "var(--dm-primary)",
                      }}
                    />
                    Add New Document
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <input
                      placeholder="Document title"
                      value={pasteTitle}
                      onChange={(e) => setPasteTitle(e.target.value)}
                      className="m3input"
                      style={{ fontSize: 16 }}
                    />

                    {/* Icon Picker */}
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "var(--dm-text-secondary)",
                          marginBottom: 8,
                          letterSpacing: 0.3,
                        }}
                      >
                        Icon
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          padding: 12,
                          borderRadius: 16,
                          background: "var(--dm-bg)",
                          border: "1px solid var(--dm-outline-variant)",
                        }}
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <Ripple
                            key={opt.name + opt.label}
                            onClick={() => setPasteIcon(opt.name)}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 12,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background:
                                pasteIcon === opt.name
                                  ? "var(--dm-secondary-container)"
                                  : "transparent",
                              color:
                                pasteIcon === opt.name
                                  ? "var(--dm-on-secondary-container)"
                                  : "var(--dm-text-muted)",
                              transition: "all 0.15s ease",
                            }}
                            title={opt.label}
                          >
                            <Icon
                              name={opt.name}
                              size={20}
                              filled={pasteIcon === opt.name}
                            />
                          </Ripple>
                        ))}
                      </div>
                    </div>

                    <textarea
                      placeholder="Paste your markdown here..."
                      value={pasteContent}
                      onChange={(e) => setPasteContent(e.target.value)}
                      className="m3input"
                      style={{
                        height: 320,
                        resize: "vertical",
                        fontFamily: "'SF Mono', 'Cascadia Code', monospace",
                        fontSize: 13,
                        lineHeight: 1.6,
                      }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <Ripple
                        onClick={addDoc}
                        style={{
                          padding: "10px 24px",
                          borderRadius: 20,
                          background: "var(--dm-primary)",
                          color: "var(--dm-on-primary)",
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        Add to {categories.find((c) => c.key === cat)?.label}
                      </Ripple>
                      <Ripple
                        onClick={() => setPasteMode(false)}
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
              ) : doc ? (
                <div
                  style={{
                    maxWidth: 700,
                    margin: "0 auto",
                    padding: "32px 48px",
                    animation: "m3pop 0.25s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          color: "var(--dm-on-secondary-container)",
                          background: "var(--dm-secondary-container)",
                          padding: "3px 10px",
                          borderRadius: 8,
                        }}
                      >
                        {categories.find((c) => c.key === doc.category)?.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <Ripple
                        onClick={editing ? saveEdit : startEdit}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          name={editing ? "check" : "edit"}
                          size={20}
                          style={{
                            color: editing
                              ? "var(--dm-primary)"
                              : "var(--dm-text-secondary)",
                          }}
                        />
                      </Ripple>
                      <Ripple
                        onClick={() => togglePin(doc)}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          name="push_pin"
                          size={20}
                          filled={isPinnedCheck(doc.id)}
                          style={{
                            color: isPinnedCheck(doc.id)
                              ? "var(--dm-primary)"
                              : "var(--dm-text-secondary)",
                          }}
                        />
                      </Ripple>
                    </div>
                  </div>
                  {editing ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="m3input"
                        style={{
                          width: "100%",
                          minHeight: 400,
                          resize: "vertical",
                          fontFamily: "'SF Mono', 'Cascadia Code', monospace",
                          fontSize: 13,
                          lineHeight: 1.6,
                        }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <Ripple
                          onClick={saveEdit}
                          style={{
                            padding: "10px 24px",
                            borderRadius: 20,
                            background: "var(--dm-primary)",
                            color: "var(--dm-on-primary)",
                            fontWeight: 500,
                            fontSize: 14,
                          }}
                        >
                          Save
                        </Ripple>
                        <Ripple
                          onClick={() => setEditing(false)}
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
                  ) : (
                    <div
                      onClick={(e) => {
                        const link = e.target.closest("[data-doc-link]");
                        if (!link) return;
                        const name = link.getAttribute("data-doc-link");
                        const target = docs.find(
                          (d) => d.title.toLowerCase() === name.toLowerCase(),
                        );
                        if (target) {
                          setHoverPreview(null);
                          selectDoc(target);
                        }
                      }}
                      onMouseMove={(e) => {
                        const link = e.target.closest("[data-doc-link]");
                        if (!link) {
                          clearTimeout(hoverTimeout.current);
                          hoverTimeout.current = setTimeout(
                            () => setHoverPreview(null),
                            100,
                          );
                          return;
                        }
                        const name = link.getAttribute("data-doc-link");
                        if (
                          hoverPreview?.doc?.title?.toLowerCase() ===
                          name.toLowerCase()
                        )
                          return;
                        clearTimeout(hoverTimeout.current);
                        const target = docs.find(
                          (d) => d.title.toLowerCase() === name.toLowerCase(),
                        );
                        if (
                          target &&
                          (target.category === "locations" ||
                            target.category === "npcs")
                        ) {
                          const rect = link.getBoundingClientRect();
                          hoverTimeout.current = setTimeout(() => {
                            setHoverPreview({
                              doc: target,
                              x: rect.left,
                              y: rect.bottom,
                            });
                          }, 300);
                        } else {
                          setHoverPreview(null);
                        }
                      }}
                      onMouseLeave={() => {
                        clearTimeout(hoverTimeout.current);
                        hoverTimeout.current = setTimeout(() => setHoverPreview(null), 150);
                      }}
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(
                          doc.content,
                          docs
                            .filter((d) => d.id !== doc.id)
                            .map((d) => d.title),
                        ),
                      }}
                    />
                  )}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "var(--dm-text-secondary)",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <Icon
                      name="shield_with_house"
                      size={48}
                      style={{
                        opacity: 0.2,
                        display: "block",
                        margin: "0 auto 12px",
                      }}
                    />
                    <div style={{ fontSize: 14 }}>
                      Select a document to begin
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--dm-text-muted)",
                        marginTop: 6,
                      }}
                    >
                      Or press {"\u2318"}K to search
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ====== RIGHT PANEL (Tools) ====== */}
          {rightOpen && (
            <div
              style={{
                width: 300,
                minWidth: 300,
                background: "var(--dm-bg)",
                display: "flex",
                flexDirection: "column",
                animation: "m3pop 0.2s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  height: 48,
                  borderBottom: "1px solid var(--dm-outline-variant)",
                }}
              >
                {[
                  { key: "pinned", label: "Pinned", icon: "push_pin" },
                  { key: "dice", label: "Dice", icon: "casino" },
                  { key: "init", label: "Initiative", icon: "swords" },
                ].map((tab) => (
                  <Ripple
                    key={tab.key}
                    onClick={() => setRightTab(tab.key)}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0,
                      borderBottom:
                        rightTab === tab.key
                          ? `3px solid var(--dm-primary)`
                          : "3px solid transparent",
                      color:
                        rightTab === tab.key
                          ? "var(--dm-primary)"
                          : "var(--dm-text-secondary)",
                      transition: "all 0.2s",
                    }}
                  >
                    <Icon
                      name={tab.icon}
                      size={18}
                      filled={rightTab === tab.key}
                    />
                    <span
                      style={{ fontSize: 11, fontWeight: 500, marginTop: 2 }}
                    >
                      {tab.label}
                    </span>
                  </Ripple>
                ))}
              </div>

              <div style={{ flex: 1, overflow: "auto" }}>
                {rightTab === "pinned" && (
                  <PinnedPanel
                    pinned={pinned}
                    onRemove={(id) =>
                      setPinned((p) => p.filter((x) => x.id !== id))
                    }
                    onSelect={selectDoc}
                  />
                )}
                {rightTab === "dice" && <DiceRoller />}
                {rightTab === "init" && <InitTracker />}
              </div>
            </div>
          )}
        </div>

        {/* ====== FAB ====== */}
        {!isSRD && (
          <Ripple
            onClick={() => setPasteMode(true)}
            style={{
              position: "fixed",
              bottom: 24,
              right: rightOpen ? 324 : 24,
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "var(--dm-primary-container)",
              color: "var(--dm-on-primary-container)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 3px 12px rgba(0,0,0,0.25), 0 1px 4px rgba(0,0,0,0.15)",
              transition: "right 0.3s cubic-bezier(0.2,0,0,1)",
              zIndex: 20,
            }}
          >
            <Icon name="note_add" size={24} />
          </Ripple>
        )}

        {/* ====== DOC PREVIEW ====== */}
        {hoverPreview && (
          <DocPreviewCard
            doc={hoverPreview.doc}
            x={hoverPreview.x}
            y={hoverPreview.y}
            onHover={() => clearTimeout(hoverTimeout.current)}
            onLeave={() => setHoverPreview(null)}
          />
        )}

        {/* ====== CONTEXT MENU ====== */}
        {ctxMenu && (
          <ContextMenu
            x={ctxMenu.x}
            y={ctxMenu.y}
            onClose={() => setCtxMenu(null)}
            items={
              ctxMenu.catItem
                ? [
                    {
                      icon: "edit",
                      label: "Rename category",
                      action: () => startRenameCat(ctxMenu.catItem),
                    },
                  ]
                : [
                    {
                      icon: "edit",
                      label: "Rename",
                      action: () => startRename(ctxMenu.item),
                    },
                    {
                      icon: "edit_note",
                      label: "Edit content",
                      action: () => {
                        selectDoc(ctxMenu.item);
                        startEdit();
                        setEditContent(ctxMenu.item.content);
                        setEditing(true);
                      },
                    },
                    {
                      icon: "push_pin",
                      label: isPinnedCheck(ctxMenu.item.id) ? "Unpin" : "Pin",
                      action: () => togglePin(ctxMenu.item),
                    },
                    { divider: true },
                    {
                      icon: "delete",
                      label: "Delete",
                      danger: true,
                      action: () => deleteDoc(ctxMenu.item.id),
                    },
                  ]
            }
          />
        )}
      </div>
    </>
  );
}

export default DMDashboard;
