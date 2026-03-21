import Icon from "../../ui/Icon.jsx";

export default function SummaryRow({ label, value, icon, sub }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: "8px 0",
        borderBottom: "1px solid var(--dm-outline-variant)",
      }}
    >
      {icon && (
        <Icon
          name={icon}
          size={16}
          style={{ color: "var(--dm-primary-dim)", flexShrink: 0, marginTop: 2 }}
        />
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "var(--dm-text-muted)", lineHeight: 1.2 }}>
          {label}
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--dm-text)", lineHeight: 1.3 }}>
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: 11, color: "var(--dm-text-muted)", marginTop: 2, lineHeight: 1.3 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
