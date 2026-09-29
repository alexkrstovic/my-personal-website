import type { BlockStyleProps } from "sanity";

// In the editor the first letter is simply enlarged as a cue that this
// paragraph has a drop cap. The real thing (letter sunk into the first few
// lines) is drawn by the site and shown in the Preview tab.
export function DropCapStyle(props: BlockStyleProps) {
  return (
    <div className="first-letter:text-[2.4em] first-letter:font-bold first-letter:leading-none">
      {props.children}
    </div>
  );
}
