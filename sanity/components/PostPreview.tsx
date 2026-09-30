"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { UserViewComponent } from "sanity/structure";
import { fileUrl } from "@/lib/sanity/file";
import type { JournalPost } from "@/lib/journal";

type DraftDoc = Partial<{
  title: string;
  subtitle: string;
  publishedAt: string;
  tags: string[];
  coverImage: { asset?: unknown } | null;
  coverVideo: { asset?: unknown } | null;
  coverVideoLoop: boolean;
  coverVideoFocus: string;
  body: Array<Record<string, unknown>>;
}>;

// Turns the post being edited into the same shape the live site uses.
function toPost(doc: DraftDoc): JournalPost {
  return {
    title: doc.title || "Untitled",
    slug: "",
    subtitle: doc.subtitle ?? "",
    publishedAt: doc.publishedAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seoTitle: null,
    seoDescription: null,
    seoImage: null,
    tags: doc.tags ?? [],
    coverImage: doc.coverImage?.asset ? (doc.coverImage as never) : null,
    coverVideoUrl: doc.coverVideo?.asset ? fileUrl(doc.coverVideo) : null,
    coverVideoLoop: doc.coverVideoLoop ?? null,
    coverVideoFocus: doc.coverVideoFocus ?? null,
    body: (doc.body ?? []).map((item) =>
      item._type === "video" ? { ...item, videoUrl: fileUrl(item) } : item
    ) as never,
  };
}

// Widths the real page is drawn at. It's then scaled down to fit the pane,
// so layout, spacing and breakpoints match what a visitor on that device sees.
const DEVICES = [
  { id: "desktop", label: "Desktop", width: 1440 },
  { id: "tablet", label: "Tablet", width: 820 },
  { id: "mobile", label: "Mobile", width: 390 },
] as const;

const buttonStyle = (active: boolean): CSSProperties => ({
  padding: "5px 12px",
  fontSize: 12,
  fontFamily: "inherit",
  color: active ? "#ffffff" : "#b6b8c2",
  background: active ? "#3b4270" : "transparent",
  border: "1px solid " + (active ? "#3b4270" : "#3a3d48"),
  borderRadius: 4,
  cursor: "pointer",
});

export const PostPreview: UserViewComponent = ({ document }) => {
  const isDraft = Boolean(document.draft);
  const post = toPost(document.displayed as DraftDoc);
  const serialized = JSON.stringify(post);

  const frameRef = useRef<HTMLIFrameElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const latestPost = useRef(post);
  latestPost.current = post;

  const [device, setDevice] = useState<(typeof DEVICES)[number]>(DEVICES[0]);
  const [area, setArea] = useState({ width: 0, height: 600 });

  // Fit the frame to the pane: full width, and tall enough to reach the
  // bottom action bar without adding a second scrollbar.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => {
      const next = {
        width: el.clientWidth,
        height: Math.max(360, window.innerHeight - el.getBoundingClientRect().top - 72),
      };
      setArea((prev) => (prev.width === next.width && prev.height === next.height ? prev : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // The frame announces when it's ready; after that every edit is sent over.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type === "journal-preview:ready") {
        frameRef.current?.contentWindow?.postMessage(
          { type: "journal-preview:update", post: latestPost.current },
          window.location.origin
        );
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage(
      { type: "journal-preview:update", post: latestPost.current },
      window.location.origin
    );
  }, [serialized]);

  const scale = area.width > 0 ? Math.min(1, area.width / device.width) : 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", color: "#e3e4e6" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "10px 16px",
          fontSize: 12,
        }}
      >
        <span style={{ color: "#9a9ca6" }}>
          {isDraft ? "Preview of your unpublished changes" : "Preview of the published post"}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={d.id === device.id}
              style={buttonStyle(d.id === device.id)}
              onClick={() => setDevice(d)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={areaRef}
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: area.height,
          background: "#16171d",
          overflow: "hidden",
        }}
      >
        {area.width > 0 && (
          <div
            style={{
              width: device.width * scale,
              height: area.height,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <iframe
              ref={frameRef}
              src="/studio-preview"
              title="Post preview"
              style={{
                width: device.width,
                height: area.height / scale,
                border: 0,
                background: "#f7efed",
                transform: `scale(${scale})`,
                transformOrigin: "0 0",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
