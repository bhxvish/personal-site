import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0e0c" }}>
        <svg width="120" height="140" viewBox="0 0 104 124" fill="none">
          <g stroke="#ece5d6" strokeWidth="10" strokeLinecap="square">
            <path d="M18 8V116" />
            <path d="M18 8H50C68 8 78 19 78 34C78 49 68 60 50 60H18" />
            <path d="M18 60H56C76 60 86 72 86 88C86 104 75 116 55 116H18" />
          </g>
          <circle cx="94" cy="12" r="8" fill="#ff5b1f" />
        </svg>
      </div>
    ),
    size,
  );
}
