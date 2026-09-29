"use client";

import { useEffect, useState } from "react";
import JournalPostView from "@/app/components/journal/JournalPostView";
import type { JournalPost } from "@/lib/journal";

// The frame the Studio's Preview tab shows a draft in. It has no content of
// its own: the Studio (same origin only) sends the post being edited, and
// this draws it with the exact same layout as the live page.
export default function StudioPreviewPage() {
  const [post, setPost] = useState<JournalPost | null>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type === "journal-preview:update" && event.data.post) {
        setPost(event.data.post as JournalPost);
      }
    }
    // Links stay inert so a stray click can't navigate the preview away.
    function onClick(event: MouseEvent) {
      if ((event.target as Element | null)?.closest("a")) event.preventDefault();
    }

    window.addEventListener("message", onMessage);
    document.addEventListener("click", onClick, true);
    window.parent.postMessage({ type: "journal-preview:ready" }, window.location.origin);
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  if (!post) {
    return (
      <div className="bg-bg min-h-screen flex items-center justify-center font-[family-name:var(--font-body)] font-light text-[16px] text-text/60">
        Loading preview…
      </div>
    );
  }

  return <JournalPostView post={post} />;
}
