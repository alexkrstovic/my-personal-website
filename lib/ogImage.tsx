import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };

export function renderOgImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#f7efed",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 30, color: "#131112", opacity: 0.55, marginBottom: 28 }}>
          alexkrstovic.com
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, color: "#131112", lineHeight: 1.08 }}>
          {title}
        </div>
        <div style={{ fontSize: 36, fontWeight: 400, color: "#131112", marginTop: 28 }}>
          {subtitle}
        </div>
      </div>
    ),
    { ...ogImageSize }
  );
}
