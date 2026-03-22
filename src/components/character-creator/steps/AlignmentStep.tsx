import Icon from "../../ui/Icon.tsx";
import Ripple from "../../ui/Ripple.tsx";
import { useIsMobile } from "../../../hooks/useIsMobile.ts";
import { styles, ms } from "../styles.ts";
import { ALIGNMENTS } from "../../../data/character-constants.ts";
import type { Character, Alignment, AlignmentQuestion, AlignmentAnswer } from "../../../types/index.ts";

interface Props {
  char: Character;
  update: (field: keyof Character, value: unknown) => void;
  next: () => void;
  isMobile?: boolean;
  haptic: { trigger: (type: string) => void };
  selectAndAdvance: (field: string, value: string) => void;
  quizQuestions: AlignmentQuestion[];
  quizAnswers: AlignmentAnswer[];
  quizDone: boolean;
  suggestedAlignment: string | null;
  answerQuiz: (answer: AlignmentAnswer) => void;
  resetQuiz: () => void;
}

export default function AlignmentStep({ char, update, next, isMobile: isMobileProp, haptic, selectAndAdvance, quizQuestions, quizAnswers, quizDone, suggestedAlignment, answerQuiz, resetQuiz }: Props) {
  const isMobile = useIsMobile();

  const currentQ = quizQuestions[quizAnswers.length];
  const suggested = suggestedAlignment ? ALIGNMENTS.find((a) => a.id === suggestedAlignment) : null;
  return (
    <div>
      <h2 style={styles.stepTitle}>Discover your Alignment</h2>
      <p style={styles.stepDesc}>
        Answer these questions to reveal your character's moral compass — or pick one directly below.
      </p>

      {/* Quiz section */}
      {!quizDone && currentQ && (
        <div style={{
          background: "rgba(28, 28, 31, 0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          borderRadius: 16, padding: 24,
          marginBottom: 24, border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ fontSize: 13, color: "var(--dm-text-muted)", marginBottom: 8 }}>
            Question {quizAnswers.length + 1} of 2
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, lineHeight: 1.5 }}>
            {currentQ.q}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {currentQ.answers.map((ans, i) => (
              <Ripple
                key={i}
                onClick={() => answerQuiz(ans)}
                style={{
                  padding: "14px 16px", borderRadius: 12,
                  background: "var(--dm-surface-bright)",
                  border: "1px solid var(--dm-outline-variant)",
                  fontSize: 14, lineHeight: 1.5, textAlign: "left",
                  color: "var(--dm-text)",
                }}
              >
                {ans.text}
              </Ripple>
            ))}
          </div>
        </div>
      )}

      {/* Quiz result */}
      {quizDone && suggested && (
        <div style={{
          background: suggested.color + "12", borderRadius: 16, padding: 24,
          marginBottom: 24, border: `1px solid ${suggested.color}40`,
          textAlign: "center",
        }}>
          <Icon name={suggested.icon} size={36} style={{ color: suggested.color, marginBottom: 8 }} />
          <div style={{ fontSize: 20, fontWeight: 700, color: suggested.color, marginBottom: 4 }}>
            {suggested.name}
          </div>
          <div style={{ fontSize: 14, color: "var(--dm-text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>
            {suggested.desc}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <Ripple
              onClick={() => { selectAndAdvance("alignment", suggested.id); next(); }}
              style={{ ...styles.primaryBtn, gap: 6 }}
            >
              <Icon name="check" size={18} /> Accept {suggested.short}
            </Ripple>
            <Ripple onClick={resetQuiz} style={{ ...styles.secondaryBtn, gap: 6 }}>
              <Icon name="restart_alt" size={18} /> Retake Quiz
            </Ripple>
          </div>
        </div>
      )}

      {/* Manual grid always visible */}
      <div style={{ fontSize: 13, color: "var(--dm-text-muted)", marginBottom: 10 }}>
        {quizDone ? "Or pick a different alignment:" : "Or choose directly:"}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: isMobile ? 8 : 10,
          ...(isMobile ? {} : { maxWidth: 520 }),
          margin: "0 auto",
        }}
      >
        {ALIGNMENTS.map((al) => (
          <Ripple
            key={al.id}
            onClick={() => { selectAndAdvance("alignment", al.id); next(); }}
            style={{
              background:
                char.alignment === al.id
                  ? al.color + "18"
                  : "rgba(28, 28, 31, 0.65)",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              borderRadius: 16,
              padding: isMobile ? 12 : 16,
              textAlign: "center",
              border:
                char.alignment === al.id
                  ? `2px solid ${al.color}`
                  : suggestedAlignment === al.id
                    ? `2px solid ${al.color}80`
                    : "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon name={al.icon} size={isMobile ? 20 : 24} style={{ color: al.color }} />
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--dm-text)",
              }}
            >
              {al.short}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--dm-text-secondary)",
                lineHeight: 1.3,
              }}
            >
              {al.name}
            </div>
          </Ripple>
        ))}
      </div>
    </div>
  );
}
