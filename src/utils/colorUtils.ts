// Derive a full M3-style color palette from a single hex color

function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h: number, s: number, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h! * 360, s! * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(r!)}${toHex(g!)}${toHex(b!)}`;
}

export function hexToRGB(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

// tint = low saturation version of the hue, used for neutral surfaces
const tint = (h: number, s: number, l: number): string => hslToHex(h, Math.min(s, 6), l);

export function derivePalette(hex: string) {
  const [h, s, l] = hexToHSL(hex);
  // Tertiary is ~60° offset (analogous complement)
  const ht = (h + 60) % 360;

  return {
    // Primary accent colors
    primary: hex,
    primaryLight: hslToHex(h, Math.min(s + 10, 100), Math.min(l + 15, 90)),
    primaryDim: hslToHex(h, s, Math.max(l - 20, 20)),
    primaryContainer: hslToHex(h, Math.min(s, 40), 12),
    onPrimary: hslToHex(h, Math.min(s, 50), 8),
    onPrimaryContainer: hslToHex(h, Math.min(s + 10, 100), Math.min(l + 15, 90)),
    secondaryContainer: hslToHex(h, Math.max(s - 20, 10), 26),
    onSecondaryContainer: hslToHex(h, Math.max(s - 10, 10), 85),

    // Tertiary (analogous hue)
    tertiary: hslToHex(ht, Math.min(s + 5, 60), Math.min(l + 5, 80)),
    tertiaryContainer: hslToHex(ht, Math.min(s, 35), 16),

    // Neutral surfaces — very low saturation tinted with the primary hue
    bg: tint(h, s, 5.5),
    surface: tint(h, s, 9),
    surfaceBright: tint(h, s, 13),
    surfaceBrighter: tint(h, s, 17),
    surfaceLowest: tint(h, s, 4),

    // Neutral text — slightly tinted
    text: hslToHex(h, Math.min(s, 8), 89),
    textSecondary: hslToHex(h, Math.min(s, 10), 77),
    textMuted: hslToHex(h, Math.min(s, 8), 55),

    // Outlines
    outline: hslToHex(h, Math.min(s, 8), 55),
    outlineVariant: hslToHex(h, Math.min(s, 8), 27),
  };
}

export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
