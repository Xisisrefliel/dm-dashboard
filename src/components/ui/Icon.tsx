import React from "react";

// ---- Material Symbols Icon ----
interface IconProps {
  name: string;
  size?: number;
  filled?: boolean;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, filled = false, style = {} }) => (
  <span
    className="material-symbols-outlined"
    style={{
      fontSize: size,
      fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'shield_with_house' 0, 'opsz' ${size}`,
      userSelect: "none",
      lineHeight: 1,
      ...style,
    }}
  >
    {name}
  </span>
);

export default Icon;
