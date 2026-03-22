import { useState, useMemo, useRef, useEffect } from "react";
import racesData from "../data/srd-races.json";
import classesData from "../data/srd-classes.json";
import Icon from "./ui/Icon.tsx";
import Ripple from "./ui/Ripple.tsx";
import { syncCharacterToParty } from "../utils/syncParty.ts";
import { useIsMobile } from "../hooks/useIsMobile.ts";
import { useWebHaptics } from "web-haptics/react";
import { useCarouselOverflow } from "../hooks/useCarouselOverflow.ts";
import {
  loadSavedState,
  loadCharacters,
  saveCharacters,
  STORAGE_KEY,
} from "../utils/characterStorage.ts";
import { RACE_LANDSCAPES } from "../data/character-images.ts";

// Prefetch all race landscape backgrounds so they're cached before selection
if (typeof window !== "undefined") {
  Object.values(RACE_LANDSCAPES).forEach((src) => {
    const img = new window.Image();
    img.src = src as string;
  });
}
import {
  STEPS,
  CLASS_SPELL_SLOTS,
  BACKGROUNDS,
  ALIGNMENTS,
  ALIGNMENT_QUESTIONS,
  ABILITIES,
  EMPTY_CHAR,
  DEFAULT_POINTBUY,
  DEFAULT_MANUAL,
  POINT_BUY_COSTS,
  POINT_BUY_TOTAL,
  RACE_ICONS,
  CLASS_ICONS,
} from "../data/character-constants.ts";
import { CLASS_STARTING_EQUIPMENT } from "../data/class-starting-equipment.ts";
import { styles, ms } from "./character-creator/styles.ts";
import SummaryRow from "./character-creator/cards/SummaryRow.tsx";
import CharacterList from "./CharacterList.tsx";
import CharacterSheet from "./CharacterSheet.tsx";
import RaceStep from "./character-creator/steps/RaceStep.tsx";
import ClassStep from "./character-creator/steps/ClassStep.tsx";
import BackgroundStep from "./character-creator/steps/BackgroundStep.tsx";
import StatsStep from "./character-creator/steps/StatsStep.tsx";
import AlignmentStep from "./character-creator/steps/AlignmentStep.tsx";
import EquipmentStep from "./character-creator/steps/EquipmentStep.tsx";
import SpellsStep from "./character-creator/steps/SpellsStep.tsx";
import type { Character, AbilityKey, AbilityScores } from "../types/index.ts";

interface LocalAlignmentAnswer {
  law: number;
  good: number;
}

interface LocalAlignmentQuestion {
  q: string;
  answers: Array<LocalAlignmentAnswer & { text: string }>;
}

interface CharacterCreatorProps {
  onBack: () => void;
  listMode?: boolean;
  onNewCharacter?: () => void;
  onEditCharacter?: (id: string) => void;
  editId?: string | null;
}

function CharacterCreator({
  onBack,
  listMode,
  onNewCharacter,
  onEditCharacter,
  editId,
}: CharacterCreatorProps) {
  if (listMode) {
    return (
      <CharacterList
        onBack={onBack}
        onNewCharacter={onNewCharacter!}
        onEditCharacter={onEditCharacter!}
      />
    );
  }

  const isMobile = useIsMobile();
  const haptic = useWebHaptics();

  // Load existing character if editing
  const editChar = useMemo(() => {
    if (!editId) return null;
    const chars = loadCharacters();
    return chars.find((c) => c.id === editId) || null;
  }, [editId]);

  const saved = useMemo(() => (editChar ? null : loadSavedState()), [editId]);
  const [step, setStep] = useState<number>(editChar ? 6 : (saved?.step ?? 0));
  const [finished, setFinished] = useState<boolean>(
    !!editChar || (saved?.finished ?? false),
  );
  const [char, setChar] = useState<Character>(
    editChar || saved?.char || { ...EMPTY_CHAR },
  );
  const [previewClass, setPreviewClass] = useState<string | null>(null);
  const classCarouselRef = useRef<HTMLDivElement>(null);
  const [previewRace, setPreviewRace] = useState<string | null>(null);
  const raceCarouselRef = useRef<HTMLDivElement>(null);
  const [previewBg, setPreviewBg] = useState<string | null>(null);
  const bgCarouselRef = useRef<HTMLDivElement>(null);
  const stepBarRef = useRef<HTMLDivElement>(null);
  const [showValidation, setShowValidation] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const raceCarouselOverflows = useCarouselOverflow(raceCarouselRef);
  const classCarouselOverflows = useCarouselOverflow(classCarouselRef);
  const bgCarouselOverflows = useCarouselOverflow(bgCarouselRef);

  const update = (key: string, val: any) => {
    if (key === "name" && showValidation) setShowValidation(false);
    setChar((c) => ({ ...c, [key]: val }));
  };

  const raceData = useMemo(
    () => (char.race ? (racesData as any[]).find((r: any) => r.id === char.race) ?? null : null) as any,
    [char.race],
  );
  const classData = useMemo(
    () => (char.class ? (classesData as any[]).find((c: any) => c.id === char.class) ?? null : null) as any,
    [char.class],
  );

  const next = () => {
    haptic.trigger("medium");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => {
    haptic.trigger("light");
    setStep((s) => Math.max(s - 1, 0));
  };

  const selectAndAdvance = (key: string, val: any) => {
    update(key, val);
  };

  const spellSlots = char.class ? CLASS_SPELL_SLOTS[char.class] : null;
  const hasSpellcasting = spellSlots && char.level >= spellSlots.castLevel;

  // Class starting equipment config
  const classEquipConfig = useMemo(() => {
    if (!char.class) return null;
    return CLASS_STARTING_EQUIPMENT[char.class] || null;
  }, [char.class]);

  // Compute flat equipment list from choices + guaranteed
  const computedEquipment = useMemo(() => {
    if (!classEquipConfig) return [];
    const items = [];
    classEquipConfig.choices.forEach((choiceGroup, idx) => {
      const selectedOptionId = (char.equipChoices || {})[idx];
      if (selectedOptionId != null) {
        const option = choiceGroup.options.find(
          (o) => o.id === selectedOptionId,
        );
        if (option) items.push(...option.items);
      }
    });
    items.push(...classEquipConfig.guaranteed);
    return items;
  }, [classEquipConfig, char.equipChoices]);

  const stepComplete = (i: number): boolean => {
    switch (i) {
      case 0:
        return char.race != null;
      case 1: {
        if (!char.class) return false;
        const cd = classesData.find((c) => c.id === char.class);
        return cd ? char.skills.length === cd.skills.choose : false;
      }
      case 2:
        return char.background != null;
      case 3:
        return Object.keys(assignedStats).length === 6;
      case 4:
        return char.alignment != null;
      case 5: {
        if (!classEquipConfig) return false;
        const choices = char.equipChoices || {};
        return classEquipConfig.choices.every((_, idx) => choices[idx] != null);
      }
      case 6:
        if (!hasSpellcasting) return true;
        const needCantrips = spellSlots.cantrips > 0;
        const needSpells = spellSlots.spells > 0;
        return (
          (!needCantrips || char.cantrips.length === spellSlots.cantrips) &&
          (!needSpells || char.spells.length === spellSlots.spells)
        );
      default:
        return false;
    }
  };

  const getMissing = () => {
    const missing = [];
    if (!char.name.trim()) missing.push("Name");
    for (let i = 0; i < STEPS.length; i++) {
      if (!stepComplete(i)) missing.push(STEPS[i]);
    }
    return missing;
  };

  const selectEquipChoice = (choiceIdx: number, optionId: string | undefined) => {
    haptic.trigger("light");
    setChar((c) => ({
      ...c,
      equipChoices: { ...(c.equipChoices || {}), [choiceIdx]: optionId },
    }));
  };

  // Alignment quiz
  const [quizQuestions] = useState(() => {
    const shuffled = [...ALIGNMENT_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  });
  const [quizAnswers, setQuizAnswers] = useState<LocalAlignmentAnswer[]>([]);
  const [quizDone, setQuizDone] = useState<boolean>(false);
  const [suggestedAlignment, setSuggestedAlignment] = useState<string | null>(null);

  const answerQuiz = (answer: LocalAlignmentAnswer) => {
    haptic.trigger("light");
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    if (newAnswers.length >= 2) {
      const totalLaw = newAnswers.reduce((s, a) => s + a.law, 0);
      const totalGood = newAnswers.reduce((s, a) => s + a.good, 0);
      const lawAxis = totalLaw > 0 ? "l" : totalLaw < 0 ? "c" : "n";
      const goodAxis = totalGood > 0 ? "g" : totalGood < 0 ? "e" : "n";
      let id;
      if (lawAxis === "n" && goodAxis === "n") id = "tn";
      else if (lawAxis === "n") id = "n" + goodAxis;
      else if (goodAxis === "n") id = lawAxis + "n";
      else id = lawAxis + goodAxis;
      setSuggestedAlignment(id);
      setQuizDone(true);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers([]);
    setQuizDone(false);
    setSuggestedAlignment(null);
  };

  // Stat assignment
  const [statMode, setStatMode] = useState<string>((saved?.statMode as string) || "pointbuy");
  const initStats = (): Record<string, number> => {
    if (editChar?.assignedStats) return editChar.assignedStats as unknown as Record<string, number>;
    if (saved?.assignedStats && Object.keys(saved.assignedStats as Record<string, number>).length === 6)
      return saved.assignedStats as Record<string, number>;
    return { ...DEFAULT_POINTBUY };
  };
  const [assignedStats, setAssignedStats] = useState<Record<string, number>>(initStats);
  const [unassigned, setUnassigned] = useState<number[]>([]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        step,
        char,
        assignedStats,
        unassigned,
        finished,
        statMode,
      }),
    );
  }, [step, char, assignedStats, unassigned, finished, statMode]);

  // Auto-scroll step bar to active step on mobile
  useEffect(() => {
    if (isMobile && stepBarRef.current) {
      const active = stepBarRef.current.children[step];
      if (active)
        active.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
    }
  }, [step, isMobile]);

  // Track step direction
  const prevStepRef = useRef<number>(step);
  const [stepDir, setStepDir] = useState<number>(0);
  useEffect(() => {
    setStepDir(
      step > prevStepRef.current ? 1 : step < prevStepRef.current ? -1 : 0,
    );
    prevStepRef.current = step;
  }, [step]);

  const adjustStat = (ability: string, delta: number) => {
    haptic.trigger("selection");
    const current = assignedStats[ability] ?? 8;
    let newVal;
    if (statMode === "pointbuy") {
      newVal = Math.max(8, Math.min(15, current + delta));
      const newStats = { ...assignedStats, [ability]: newVal };
      const spent = Object.values(newStats).reduce(
        (sum, v) => sum + (POINT_BUY_COSTS[v] ?? 0),
        0,
      );
      if (spent > POINT_BUY_TOTAL) return;
    } else {
      newVal = Math.max(1, Math.min(30, current + delta));
    }
    const newStats = { ...assignedStats, [ability]: newVal };
    setAssignedStats(newStats);
    update("stats", { ...char.stats, [ability]: newVal });
  };

  const rollStats = () => {
    haptic.trigger("heavy");
    const roll4d6 = () => {
      const dice = Array.from(
        { length: 4 },
        () => Math.floor(Math.random() * 6) + 1,
      );
      dice.sort((a, b) => a - b);
      return dice[1]! + dice[2]! + dice[3]!;
    };
    const rolled: Record<string, number> = {};
    ABILITIES.forEach((ab) => {
      rolled[ab] = roll4d6();
    });
    setAssignedStats(rolled);
    setStatMode("manual");
    update("stats", { ...char.stats, ...rolled });
  };

  const switchStatMode = (mode: string) => {
    haptic.trigger("selection");
    setStatMode(mode);
    const defaults =
      mode === "pointbuy" ? { ...DEFAULT_POINTBUY } : { ...DEFAULT_MANUAL };
    setAssignedStats(defaults);
    update("stats", { ...char.stats, ...defaults });
  };

  const getRacialBonus = (ability: string): number => {
    if (!raceData) return 0;
    const b = raceData.abilityBonuses.find((x: any) => x.ability === ability);
    return b ? b.bonus : 0;
  };

  // Restore preview when navigating back to a step with a selection
  useEffect(() => {
    if (step === 0 && char.race) setPreviewRace(char.race);
    if (step === 1 && char.class) setPreviewClass(char.class);
    if (step === 2 && char.background) setPreviewBg(char.background);
  }, [step]);

  // Summary sidebar data
  const bgData = BACKGROUNDS.find((b) => b.id === char.background);
  const alData = ALIGNMENTS.find((a) => a.id === char.alignment);

  // Finish handler (shared between desktop and mobile)
  const handleFinish = () => {
    const missing = getMissing();
    if (missing.length > 0) {
      setShowValidation(true);
      haptic.trigger("error");
      if (!char.name.trim()) nameInputRef.current?.focus();
      return;
    }
    const chars = loadCharacters();
    const charToSave = {
      ...char,
      assignedStats: assignedStats as unknown as AbilityScores,
      id: editId || char.id || Date.now().toString(),
    };
    const existing = chars.findIndex((c) => c.id === charToSave.id);
    if (existing >= 0) {
      chars[existing] = charToSave;
    } else {
      chars.push(charToSave);
    }
    saveCharacters(chars);
    syncCharacterToParty(charToSave);
    localStorage.removeItem(STORAGE_KEY);
    haptic.trigger("success");
    setFinished(true);
  };

  // Render step component
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <RaceStep
            char={char}
            update={update}
            next={next}
            prev={prev}
            haptic={haptic}
            previewRace={previewRace}
            setPreviewRace={setPreviewRace}
            raceCarouselRef={raceCarouselRef}
            raceCarouselOverflows={raceCarouselOverflows}
          />
        );
      case 1:
        return (
          <ClassStep
            char={char}
            update={update}
            next={next}
            prev={prev}
            haptic={haptic}
            previewClass={previewClass}
            setPreviewClass={setPreviewClass}
            classCarouselRef={classCarouselRef}
            classCarouselOverflows={classCarouselOverflows}
            classData={classData}
          />
        );
      case 2:
        return (
          <BackgroundStep
            char={char}
            update={update}
            next={next}
            prev={prev}
            haptic={haptic}
            previewBg={previewBg}
            setPreviewBg={setPreviewBg}
            bgCarouselRef={bgCarouselRef}
            bgCarouselOverflows={bgCarouselOverflows}
          />
        );
      case 3:
        return (
          <StatsStep
            char={char}
            update={update}
            isMobile={isMobile}
            haptic={haptic}
            assignedStats={assignedStats as unknown as AbilityScores}
            adjustStat={adjustStat}
            rollStats={rollStats}
            statMode={statMode}
            switchStatMode={switchStatMode}
            getRacialBonus={getRacialBonus}
            raceData={raceData as any}
            classData={classData as any}
          />
        );
      case 4:
        return (
          <AlignmentStep
            char={char}
            update={update}
            next={next}
            isMobile={isMobile}
            haptic={haptic}
            selectAndAdvance={selectAndAdvance}
            quizQuestions={quizQuestions as any}
            quizAnswers={quizAnswers as any}
            quizDone={quizDone}
            suggestedAlignment={suggestedAlignment}
            answerQuiz={answerQuiz as any}
            resetQuiz={resetQuiz}
          />
        );
      case 5:
        return (
          <EquipmentStep
            char={char}
            isMobile={isMobile}
            haptic={haptic}
            classEquipConfig={classEquipConfig}
            selectEquipChoice={selectEquipChoice}
            classData={classData}
          />
        );
      case 6:
        return (
          <SpellsStep
            char={char}
            update={update}
            isMobile={isMobile}
            haptic={haptic}
            spellSlots={spellSlots ?? null}
            hasSpellcasting={!!hasSpellcasting}
            classData={classData as any}
          />
        );
      default:
        return null;
    }
  };

  // Character Sheet routing
  if (finished) {
    return (
      <CharacterSheet
        char={char}
        update={update}
        onBack={onBack}
        editId={editId}
        assignedStats={assignedStats}
        setAssignedStats={setAssignedStats}
        raceData={raceData}
        classData={classData}
        computedEquipment={computedEquipment}
        getRacialBonus={getRacialBonus}
        isMobile={isMobile}
        haptic={haptic}
      />
    );
  }

  const landscapeBg = char.race ? (RACE_LANDSCAPES as Record<string, string>)[char.race] : null;

  return (
    <div
      style={{
        ...ms(isMobile, styles.root ?? {}, { height: "100dvh" }),
        position: "relative",
      }}
    >
      {/* Ambient background image — full page behind topbar + body */}
      {landscapeBg && (
        <div
          key={char.race}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <img
            src={landscapeBg}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "saturate(0.6) brightness(0.45)",
              animation: "m3stepIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(
                to bottom,
                rgba(18, 18, 20, 0.3) 0%,
                rgba(18, 18, 20, 0.05) 25%,
                rgba(18, 18, 20, 0.1) 65%,
                rgba(18, 18, 20, 0.6) 100%
              )`,
            }}
          />
        </div>
      )}
      {/* Top bar — desktop: back + title + steps + name input in one row */}
      <div
        style={{
          ...ms(isMobile, styles.topBar ?? {}, { height: 56, minHeight: 56 }),
          position: "relative",
          zIndex: 2,
        }}
      >
        <Ripple onClick={onBack} style={styles.backBtn}>
          <Icon name="arrow_back" />
        </Ripple>
        {!isMobile && (
          <>
            <Icon
              name="shield_with_house"
              size={24}
              filled
              style={{ color: "var(--dm-primary)" }}
            />
            <span style={{ fontSize: 18, fontWeight: 500 }}>
              Character Creator
            </span>
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                gap: 4,
              }}
            >
              {STEPS.map((s, i) => {
                const done = stepComplete(i);
                const active = i === step;
                return (
                  <Ripple
                    key={s}
                    onClick={() => {
                      haptic.trigger("selection");
                      setStep(i);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 14px",
                      borderRadius: 20,
                      background: active
                        ? "var(--dm-secondary-container)"
                        : "transparent",
                      color: active
                        ? "var(--dm-on-secondary-container)"
                        : done
                          ? "var(--dm-primary)"
                          : "var(--dm-text-muted)",
                      fontWeight: active ? 600 : 400,
                      fontSize: 13,
                      transition: "all 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 600,
                        background: done
                          ? "var(--dm-primary)"
                          : active
                            ? "var(--dm-on-secondary-container)"
                            : showValidation && !done
                              ? "var(--dm-error-container, #3a1510)"
                              : "var(--dm-surface-bright)",
                        color: done
                          ? "var(--dm-on-primary)"
                          : active
                            ? "var(--dm-secondary-container)"
                            : showValidation && !done
                              ? "var(--dm-error, #ffb4ab)"
                              : "var(--dm-text-muted)",
                      }}
                    >
                      {done ? (
                        <Icon name="check" size={14} />
                      ) : showValidation && !done ? (
                        <Icon name="priority_high" size={14} />
                      ) : (
                        i + 1
                      )}
                    </span>
                    {s}
                  </Ripple>
                );
              })}
            </div>
          </>
        )}
        <input
          ref={nameInputRef}
          placeholder="Character name"
          value={char.name}
          onChange={(e) => update("name", e.target.value)}
          className="m3input"
          style={{
            ...(isMobile
              ? { flex: 1, minWidth: 0, fontSize: 14, textAlign: "center" }
              : { width: 220, fontSize: 14, textAlign: "center" }),
            ...(showValidation && !char.name.trim()
              ? {
                  borderColor: "var(--dm-error, #ffb4ab)",
                  boxShadow: "0 0 0 1px var(--dm-error, #ffb4ab)",
                }
              : {}),
          }}
        />
      </div>

      {/* Step indicator — mobile only (separate row) */}
      {isMobile && (
        <div
          ref={stepBarRef}
          className="mobile-hide-scrollbar"
          style={{
            position: "relative",
            zIndex: 2,
            ...styles.stepBar,
            flexWrap: "nowrap",
            justifyContent: "flex-start",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            padding: "0 12px 10px",
            gap: 2,
          }}
        >
          {STEPS.map((s, i) => {
            const done = stepComplete(i);
            const active = i === step;
            return (
              <Ripple
                key={s}
                onClick={() => {
                  haptic.trigger("selection");
                  setStep(i);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                  padding: "8px 10px",
                  borderRadius: 20,
                  background: active
                    ? "var(--dm-secondary-container)"
                    : "transparent",
                  color: active
                    ? "var(--dm-on-secondary-container)"
                    : done
                      ? "var(--dm-primary)"
                      : "var(--dm-text-muted)",
                  fontWeight: active ? 600 : 400,
                  fontSize: 13,
                  transition: "all 0.2s",
                  flexShrink: 0,
                  scrollSnapAlign: "center",
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 600,
                    background: done
                      ? "var(--dm-primary)"
                      : active
                        ? "var(--dm-on-secondary-container)"
                        : showValidation && !done
                          ? "var(--dm-error-container, #3a1510)"
                          : "var(--dm-surface-bright)",
                    color: done
                      ? "var(--dm-on-primary)"
                      : active
                        ? "var(--dm-secondary-container)"
                        : showValidation && !done
                          ? "var(--dm-error, #ffb4ab)"
                          : "var(--dm-text-muted)",
                  }}
                >
                  {done ? (
                    <Icon name="check" size={14} />
                  ) : showValidation && !done ? (
                    <Icon name="priority_high" size={14} />
                  ) : (
                    i + 1
                  )}
                </span>
              </Ripple>
            );
          })}
        </div>
      )}

      <div style={{ ...styles.body, position: "relative", zIndex: 1 }}>
        {/* Main content */}
        <div
          style={{
            ...ms(isMobile, styles.main ?? {}, {
              padding: "16px 16px 80px",
              WebkitOverflowScrolling: "touch",
            }),
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            key={step}
            style={{
              animation: `${stepDir >= 0 ? "stepSlideLeft" : "stepSlideRight"} 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)`,
            }}
          >
            {renderStep()}
          </div>

          {/* Nav buttons — inline on desktop */}
          {!isMobile && (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 24,
                  justifyContent: "space-between",
                }}
              >
                {step > 0 ? (
                  <Ripple onClick={prev} style={styles.secondaryBtn}>
                    <Icon
                      name="arrow_back"
                      size={18}
                      style={{ marginRight: 4 }}
                    />{" "}
                    Back
                  </Ripple>
                ) : (
                  <div />
                )}
                {step < STEPS.length - 1 ? (
                  <Ripple onClick={next} style={styles.secondaryBtn}>
                    Next{" "}
                    <Icon
                      name="arrow_forward"
                      size={18}
                      style={{ marginLeft: 4 }}
                    />
                  </Ripple>
                ) : (
                  (() => {
                    const missing = getMissing();
                    const canFinish = missing.length === 0;
                    return (
                      <Ripple
                        onClick={handleFinish}
                        style={{
                          ...styles.primaryBtn,
                          opacity: canFinish ? 1 : 0.4,
                          cursor: canFinish ? "pointer" : "default",
                        }}
                      >
                        <Icon
                          name="check"
                          size={18}
                          style={{ marginRight: 4 }}
                        />{" "}
                        Finish
                      </Ripple>
                    );
                  })()
                )}
              </div>
              {showValidation && getMissing().length > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 12,
                    background: "var(--dm-error-container, #3a1510)",
                    color: "var(--dm-error, #ffb4ab)",
                    fontSize: 13,
                    fontWeight: 500,
                    marginTop: 8,
                    animation: "m3stepIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Icon name="error" size={18} />
                  <span>Required: {getMissing().join(", ")}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Summary panel — desktop only */}
        {!isMobile && (
          <div style={{ ...styles.summary, position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--dm-text-muted)",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Summary
            </div>
            {char.name && <SummaryRow label="Name" value={char.name} />}
            {raceData && (
              <SummaryRow
                label="Race"
                value={raceData.name}
                icon={(RACE_ICONS as Record<string, string>)[char.race!]}
              />
            )}
            {classData && (
              <SummaryRow
                label="Class"
                value={`${classData.name} (Lvl ${char.level})`}
                icon={(CLASS_ICONS as Record<string, string>)[char.class!]}
                sub={
                  char.skills.length > 0
                    ? `Skills: ${char.skills.join(", ")}`
                    : null
                }
              />
            )}
            {bgData && (
              <SummaryRow
                label="Background"
                value={bgData.name}
                icon={bgData.icon}
                sub={bgData.skills.join(", ")}
              />
            )}
            {alData && (
              <SummaryRow
                label="Alignment"
                value={alData.name}
                icon={alData.icon}
              />
            )}
            {Object.keys(assignedStats).length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--dm-text-muted)",
                    fontWeight: 600,
                    marginBottom: 6,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Stats
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 4,
                  }}
                >
                  {ABILITIES.map((ab) => {
                    const val = assignedStats[ab];
                    if (val == null) return null;
                    const total = val + getRacialBonus(ab);
                    return (
                      <div
                        key={ab}
                        style={{
                          textAlign: "center",
                          padding: 6,
                          borderRadius: 8,
                          background: "var(--dm-surface-bright)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--dm-text-muted)",
                            fontWeight: 600,
                          }}
                        >
                          {ab}
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "var(--dm-primary)",
                          }}
                        >
                          {total}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {computedEquipment.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--dm-text-muted)",
                    fontWeight: 600,
                    marginBottom: 4,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Equipment
                </div>
                {computedEquipment.map((eq, i) => (
                  <div
                    key={eq.id + "-" + i}
                    style={{
                      fontSize: 13,
                      color: "var(--dm-text-secondary)",
                      padding: "2px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Icon
                      name={eq.icon}
                      size={14}
                      style={{ color: "var(--dm-text-muted)" }}
                    />{" "}
                    {eq.name}
                  </div>
                ))}
              </div>
            )}
            {!char.race && !char.class && !char.name && (
              <div
                style={{
                  fontSize: 13,
                  color: "var(--dm-text-muted)",
                  fontStyle: "italic",
                }}
              >
                Make selections to build your character...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile fixed nav buttons */}
      {isMobile && (
        <>
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 20,
              display: "flex",
              gap: 8,
              padding: "12px 16px",
              paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
              background: "var(--dm-bg)",
              borderTop: "1px solid var(--dm-outline-variant)",
            }}
          >
            {step > 0 ? (
              <Ripple
                onClick={prev}
                style={{
                  ...styles.secondaryBtn,
                  flex: 1,
                  justifyContent: "center",
                  padding: "14px 24px",
                }}
              >
                <Icon name="arrow_back" size={18} style={{ marginRight: 4 }} />{" "}
                Back
              </Ripple>
            ) : (
              <div style={{ flex: 1 }} />
            )}
            {step < STEPS.length - 1 ? (
              <Ripple
                onClick={next}
                style={{
                  ...styles.primaryBtn,
                  flex: 1,
                  justifyContent: "center",
                  padding: "14px 24px",
                }}
              >
                Next{" "}
                <Icon
                  name="arrow_forward"
                  size={18}
                  style={{ marginLeft: 4 }}
                />
              </Ripple>
            ) : (
              (() => {
                const missing = getMissing();
                const canFinish = missing.length === 0;
                return (
                  <Ripple
                    onClick={handleFinish}
                    style={{
                      ...styles.primaryBtn,
                      flex: 1,
                      justifyContent: "center",
                      padding: "14px 24px",
                      opacity: canFinish ? 1 : 0.4,
                      cursor: canFinish ? "pointer" : "default",
                    }}
                  >
                    <Icon name="check" size={18} style={{ marginRight: 4 }} />{" "}
                    Finish
                  </Ripple>
                );
              })()
            )}
          </div>
          {showValidation && getMissing().length > 0 && (
            <div
              style={{
                position: "fixed",
                bottom: 68,
                left: 16,
                right: 16,
                zIndex: 21,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 14px",
                borderRadius: 12,
                background: "var(--dm-error-container, #3a1510)",
                color: "var(--dm-error, #ffb4ab)",
                fontSize: 13,
                fontWeight: 500,
                animation: "m3stepIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <Icon name="error" size={18} />
              <span>Required: {getMissing().join(", ")}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CharacterCreator;
