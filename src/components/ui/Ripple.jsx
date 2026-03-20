import { useRef } from "react";

// ---- M3 Ripple ----
const Ripple = ({
  children,
  style = {},
  onClick,
  disabled,
  className = "",
  ...props
}) => {
  const ref = useRef(null);
  const handleClick = (e) => {
    if (disabled) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height) * 2;
    Object.assign(ripple.style, {
      position: "absolute",
      left: `${x - size / 2}px`,
      top: `${y - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: "var(--dm-primary)",
      opacity: "0.10",
      transform: "scale(0)",
      animation: "m3ripple 0.5s ease-out forwards",
      pointerEvents: "none",
    });
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
    onClick?.(e);
  };
  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: disabled ? "default" : "pointer",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Ripple;
