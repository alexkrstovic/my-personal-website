"use client";

import { Analytics } from "@vercel/analytics/next";

// The Studio and its preview frame are the owner at work, not visitors, so
// they're left out of the page-view counts.
export default function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        try {
          return new URL(event.url).pathname.startsWith("/studio") ? null : event;
        } catch {
          return event;
        }
      }}
    />
  );
}
