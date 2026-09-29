// Which part of a cropped video stays in view. Stored in Sanity as a plain
// key and mapped to a CSS object-position here, so only known values can
// ever reach the page.
export const focusOptions = [
  { title: "Center (default)", value: "center" },
  { title: "Top", value: "top" },
  { title: "Bottom", value: "bottom" },
  { title: "Left", value: "left" },
  { title: "Right", value: "right" },
  { title: "Top left", value: "top-left" },
  { title: "Top right", value: "top-right" },
  { title: "Bottom left", value: "bottom-left" },
  { title: "Bottom right", value: "bottom-right" },
];

const positions: Record<string, string> = {
  center: "50% 50%",
  top: "50% 0%",
  bottom: "50% 100%",
  left: "0% 50%",
  right: "100% 50%",
  "top-left": "0% 0%",
  "top-right": "100% 0%",
  "bottom-left": "0% 100%",
  "bottom-right": "100% 100%",
};

export function focusToObjectPosition(value?: string | null): string {
  return (value && positions[value]) || positions.center;
}
