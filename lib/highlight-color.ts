// Shared by the Studio (editor) and the live site so a highlight looks the
// same in both places.

export const DEFAULT_HIGHLIGHT = "#EFB65D";

const DARK_TEXT = "#131112";
const LIGHT_TEXT = "#FFFFFF";

// Colors come from Studio data, so only well-formed hex values are used.
export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

export function highlightColorOf(value: unknown): string {
  const hex = (value as { color?: { hex?: unknown } } | undefined)?.color?.hex;
  return isHexColor(hex) ? hex : DEFAULT_HIGHLIGHT;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

// Dark or white text, whichever reads better on the chosen highlight color.
export function readableTextColor(hex: string): string {
  const bg = luminance(hex);
  const vsDark = (bg + 0.05) / (luminance(DARK_TEXT) + 0.05);
  const vsLight = 1.05 / (bg + 0.05);
  return vsDark >= vsLight ? DARK_TEXT : LIGHT_TEXT;
}

// The shape Sanity's color picker stores, so a preset can be used as the
// picker's starting value.
export function hexToColorValue(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const sHsl = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const sHsv = max === 0 ? 0 : d / max;

  return {
    _type: "color",
    hex,
    alpha: 1,
    hsl: { _type: "hslaColor", h, s: sHsl, l, a: 1 },
    hsv: { _type: "hsvaColor", h, s: sHsv, v: max, a: 1 },
    rgb: { _type: "rgbaColor", r, g, b, a: 1 },
  };
}
