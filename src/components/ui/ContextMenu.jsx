import { useRef, useEffect } from "react";
import Icon from "./Icon.jsx";
import Ripple from "./Ripple.jsx";

// ---- Context Menu ----
function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const esc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 200,
        background: "var(--dm-surface-brighter)",
        borderRadius: 12,
        padding: "6px 0",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
        border: "1px solid var(--dm-outline-variant)",
        minWidth: 180,
        animation: "m3pop 0.12s cubic-bezier(0.2,0,0,1)",
      }}
    >
      {items.map((item, i) =>
        item.divider ? (
          <div
            key={i}
            style={{
              height: 1,
              background: "var(--dm-outline-variant)",
              margin: "4px 0",
            }}
          />
        ) : (
          <Ripple
            key={i}
            onClick={() => {
              item.action();
              onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              color: item.danger ? "var(--dm-error)" : "var(--dm-text)",
              fontSize: 14,
            }}
          >
            <Icon
              name={item.icon}
              size={18}
              style={{
                color: item.danger
                  ? "var(--dm-error)"
                  : "var(--dm-text-secondary)",
              }}
            />
            {item.label}
          </Ripple>
        ),
      )}
    </div>
  );
}

export default ContextMenu;
