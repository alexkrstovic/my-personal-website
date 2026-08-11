import type { NextConfig } from "next";

// Applied to every route. Vercel already sends Strict-Transport-Security on
// the custom domain, so HTTPS enforcement is not repeated here.
//
// Deliberately no full Content-Security-Policy: Next.js and the JSON-LD block
// in app/layout.tsx emit inline <script> tags, so a script-src policy would
// need per-request nonces and would break the site the moment one was missed.
// frame-ancestors is the one directive that costs nothing to set correctly.
const securityHeaders = [
  // Stop other sites embedding this one in an iframe (clickjacking).
  // frame-ancestors is the modern directive; X-Frame-Options covers browsers
  // that predate it.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  // Trust the declared Content-Type instead of sniffing the bytes, so an
  // upload that looks like markup can't be re-interpreted as HTML.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the full URL to same-origin destinations, bare origin cross-origin,
  // and nothing when downgrading to HTTP.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here uses these APIs; refuse them so embedded content can't ask.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  /* config options here */
  // Lets the dev server be reached from other devices on the same WiFi
  // (e.g. testing on an iPad/phone via the "Network" URL Next.js prints).
  allowedDevOrigins: ["192.168.1.70"],
  headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
