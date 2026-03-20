import Icon from "./Icon.jsx";
import Ripple from "./Ripple.jsx";

// ---- M3 Chip ----
const Chip = ({ label, selected, onClick, icon }) => (
  <Ripple
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      borderRadius: 8,
      border: selected
        ? "1px solid transparent"
        : "1px solid var(--dm-outline-variant)",
      background: selected ? "var(--dm-secondary-container)" : "transparent",
      color: selected
        ? "var(--dm-on-secondary-container)"
        : "var(--dm-text-secondary)",
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: 0.1,
      transition: "background 0.2s, color 0.2s, border-color 0.2s",
      whiteSpace: "nowrap",
    }}
  >
    {icon && (
      <Icon name={icon} size={18} filled={selected} style={{ width: 18 }} />
    )}
    {label}
  </Ripple>
);

export default Chip;
