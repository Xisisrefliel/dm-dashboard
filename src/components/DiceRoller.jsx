import { useState } from "react";
import Icon from "./ui/Icon.jsx";
import Ripple from "./ui/Ripple.jsx";

function DiceRoller() {
  const [result, setResult] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState([]);
  const dice = [4, 6, 8, 10, 12, 20, 100];

  const roll = (sides) => {
    setRolling(true);
    setTimeout(() => {
      const val = Math.floor(Math.random() * sides) + 1;
      const entry = { sides, val, id: Date.now() };
      setResult(entry);
      setHistory((h) => [entry, ...h].slice(0, 12));
      setRolling(false);
    }, 350);
  };

  const isCrit = result && result.sides === 20 && result.val === 20;
  const isFumble = result && result.sides === 20 && result.val === 1;
  const isMax = result && result.val === result.sides && result.sides !== 20;

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}
      >
        {dice.map((d) => (
          <Ripple
            key={d}
            onClick={() => roll(d)}
            style={{
              minWidth: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              background: "var(--dm-surface-bright)",
              color: "var(--dm-text)",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.2s",
            }}
          >
            d{d}
          </Ripple>
        ))}
      </div>

      {result && (
        <div
          key={result.id}
          style={{
            textAlign: "center",
            padding: 20,
            background: isCrit
              ? "var(--dm-primary-container)"
              : isFumble
                ? "var(--dm-error-container)"
                : "var(--dm-surface)",
            borderRadius: 16,
            marginBottom: 12,
            animation: rolling
              ? "none"
              : isFumble
                ? "fumbleShake 0.5s ease"
                : "m3pop 0.3s cubic-bezier(0.2, 0, 0, 1)",
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: isCrit
                ? "var(--dm-primary-light)"
                : isFumble
                  ? "var(--dm-error)"
                  : isMax
                    ? "var(--dm-tertiary)"
                    : "var(--dm-text)",
              fontFamily: "'Inter', sans-serif",
              animation: isCrit ? "critGlow 1.5s ease infinite" : "none",
            }}
          >
            {result.val}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--dm-text-secondary)",
              marginTop: 4,
            }}
          >
            d{result.sides}
            {isCrit && (
              <span
                style={{
                  color: "var(--dm-primary)",
                  marginLeft: 8,
                  fontWeight: 600,
                }}
              >
                CRITICAL HIT!
              </span>
            )}
            {isFumble && (
              <span
                style={{
                  color: "var(--dm-error)",
                  marginLeft: 8,
                  fontWeight: 600,
                }}
              >
                Critical Fail
              </span>
            )}
            {isMax && (
              <span
                style={{
                  color: "var(--dm-tertiary)",
                  marginLeft: 8,
                  fontWeight: 600,
                }}
              >
                Maximum!
              </span>
            )}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {history.map((h, i) => (
            <span
              key={h.id}
              style={{
                fontSize: 12,
                padding: "3px 8px",
                borderRadius: 8,
                background: "var(--dm-surface-bright)",
                color:
                  h.val === h.sides
                    ? "var(--dm-primary)"
                    : h.val === 1
                      ? "var(--dm-error)"
                      : "var(--dm-text-secondary)",
                opacity: Math.max(0.4, 1 - i * 0.06),
              }}
            >
              d{h.sides}
              {"\u2192"}
              {h.val}
            </span>
          ))}
        </div>
      )}

      {!result && (
        <div
          style={{
            padding: 20,
            textAlign: "center",
            color: "var(--dm-text-muted)",
            fontSize: 14,
          }}
        >
          <Icon
            name="casino"
            size={40}
            style={{ opacity: 0.2, display: "block", margin: "0 auto 12px" }}
          />
          Roll the dice
        </div>
      )}
    </div>
  );
}

export default DiceRoller;
