import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#07080a",
          color: "#ecece8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 10,
              background: "#d4ff3a",
              color: "#0b0d02",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            TS
          </div>
          <div style={{ fontSize: 22, color: "#a3a7ae", letterSpacing: 4, textTransform: "uppercase" }}>
            {`${profile.role} · ${profile.company}`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 150, fontWeight: 700, letterSpacing: -8, lineHeight: 0.9 }}>
            {profile.name}
          </div>
          <div style={{ marginTop: 28, fontSize: 36, color: "#a3a7ae" }}>
            Real-time data products that act in seconds, not hours.
          </div>
        </div>
        <div style={{ display: "flex", height: 6, width: "100%", background: "#d4ff3a" }} />
      </div>
    ),
    size,
  );
}
