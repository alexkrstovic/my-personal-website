import type { BlockAnnotationProps } from "sanity";
import { highlightColorOf, readableTextColor } from "@/lib/highlight-color";

// How a highlight looks inside the Studio editor: the chosen color behind
// the text, like the live site. renderDefault keeps Sanity's own click-to-edit
// panel (the color picker) attached to the text.
export function HighlightAnnotation(props: BlockAnnotationProps) {
  const bg = highlightColorOf(props.value);
  return (
    <span style={{ backgroundColor: bg, color: readableTextColor(bg), borderRadius: 3 }}>
      {props.renderDefault(props)}
    </span>
  );
}
