import { useState, useEffect } from "react";
import Icon from "./ui/Icon.jsx";
import Ripple from "./ui/Ripple.jsx";

function InitTracker() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [init, setInit] = useState("");
  const [hp, setHp] = useState("");
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const handler = (e) => {
      const { name: mName, hp: mHp } = e.detail;
      const roll = Math.floor(Math.random() * 20) + 1;
      setEntries((prev) =>
        [
          ...prev,
          { name: mName, init: roll, hp: mHp ?? null, id: Date.now() },
        ].sort((a, b) => b.init - a.init),
      );
    };
    window.addEventListener("dm-add-initiative", handler);
    return () => window.removeEventListener("dm-add-initiative", handler);
  }, []);

  const add = () => {
    if (!name.trim()) return;
    setEntries((e) =>
      [
        ...e,
        {
          name: name.trim(),
          init: parseInt(init) || 0,
          hp: hp ? parseInt(hp) : null,
          id: Date.now(),
        },
      ].sort((a, b) => b.init - a.init),
    );
    setName("");
    setInit("");
    setHp("");
  };

  const updateHp = (id, delta) => {
    setEntries((e) =>
      e.map((x) =>
        x.id === id ? { ...x, hp: Math.max(0, (x.hp ?? 0) + delta) } : x,
      ),
    );
  };

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <input
          placeholder="Character name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="m3input"
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Initiative"
            type="number"
            value={init}
            onChange={(e) => setInit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="m3input"
            style={{ flex: 1, minWidth: 0, textAlign: "center" }}
          />
          <input
            placeholder="HP"
            type="number"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="m3input"
            style={{ flex: 1, minWidth: 0, textAlign: "center" }}
          />
          <Ripple
            onClick={add}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--dm-primary)",
              color: "var(--dm-on-primary)",
              flexShrink: 0,
            }}
          >
            <Icon name="add" size={20} />
          </Ripple>
        </div>
      </div>

      {entries.map((e, i) => (
        <Ripple
          key={e.id}
          onClick={() => {}}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            borderRadius: 12,
            marginBottom: 4,
            background:
              i === active ? "var(--dm-secondary-container)" : "transparent",
            transition: "all 0.2s",
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                i === active
                  ? "var(--dm-primary)"
                  : "var(--dm-primary-container)",
              color:
                i === active
                  ? "var(--dm-on-primary)"
                  : "var(--dm-primary-light)",
              fontWeight: 600,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {e.init}
          </span>
          <span
            style={{
              flex: 1,
              fontWeight: i === active ? 600 : 400,
              fontSize: 14,
              color: "var(--dm-text)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {i === active && "\u25B8 "}
            {e.name}
          </span>
          {e.hp !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <span
                onClick={(ev) => {
                  ev.stopPropagation();
                  updateHp(e.id, -1);
                }}
                style={{
                  cursor: "pointer",
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  color: "var(--dm-error)",
                  fontWeight: 700,
                }}
              >
                {"\u2212"}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  minWidth: 28,
                  textAlign: "center",
                  color:
                    e.hp === 0 ? "var(--dm-error)" : "var(--dm-text-secondary)",
                }}
              >
                {e.hp}
              </span>
              <span
                onClick={(ev) => {
                  ev.stopPropagation();
                  updateHp(e.id, 1);
                }}
                style={{
                  cursor: "pointer",
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  color: "var(--dm-tertiary)",
                  fontWeight: 700,
                }}
              >
                +
              </span>
            </div>
          )}
          <Ripple
            onClick={(ev) => {
              ev.stopPropagation();
              setEntries((x) => x.filter((z) => z.id !== e.id));
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon
              name="close"
              size={16}
              style={{ color: "var(--dm-text-secondary)" }}
            />
          </Ripple>
        </Ripple>
      ))}

      {entries.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Ripple
            onClick={() =>
              setActive((a) => (entries.length ? (a + 1) % entries.length : -1))
            }
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "var(--dm-surface-bright)",
              color: "var(--dm-text)",
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            <Icon name="skip_next" size={20} /> Next Turn
          </Ripple>
          <Ripple
            onClick={() => {
              setEntries([]);
              setActive(-1);
            }}
            style={{
              padding: "10px 16px",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--dm-surface-bright)",
              color: "var(--dm-text-secondary)",
            }}
          >
            <Icon name="delete_sweep" size={20} />
          </Ripple>
        </div>
      )}

      {entries.length === 0 && (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            color: "var(--dm-text-secondary)",
          }}
        >
          <Icon
            name="swords"
            size={40}
            style={{ opacity: 0.2, display: "block", margin: "0 auto 12px" }}
          />
          <div style={{ fontSize: 14, marginBottom: 4 }}>No combatants</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            Add characters to track initiative
          </div>
        </div>
      )}
    </div>
  );
}

export default InitTracker;
