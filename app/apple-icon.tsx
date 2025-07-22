import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "800",
          fontSize: "64px",
          fontFamily: "system-ui, sans-serif",
          borderRadius: "20%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              lineHeight: "1",
              marginBottom: "-8px",
            }}
          >
            RE
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "400",
              opacity: 0.9,
              letterSpacing: "2px",
            }}
          >
            DESIGN
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
