import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Skill.md: Randy Ellis's design judgment as an agent skill";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * The share card, in the site's own vocabulary rather than the gradient the
 * older routes carry: paper ground, one zinc family, a hairline doing the
 * structure, the file name in mono because it is a file name.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          color: "#18181b",
          padding: "72px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "0.02em",
              color: "#71717a",
            }}
          >
            Free core · Paid modules · work.randyellis.design
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 120,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
            }}
          >
            SKILL.md
          </div>
          <div
            style={{
              marginTop: 32,
              maxWidth: 900,
              fontSize: 40,
              fontWeight: 400,
              lineHeight: 1.25,
              color: "#52525b",
            }}
          >
            Install my judgment before you hire it.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "2px solid #18181b",
            paddingTop: 24,
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 600 }}>Randy Ellis</div>
          <div style={{ fontSize: 22, color: "#71717a" }}>
            Fractional Chief Design Officer
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
