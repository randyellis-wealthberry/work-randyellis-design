import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI Product Design Projects - Randy Ellis Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #0c0c1d 0%, #1a1a3a 50%, #2d1b3d 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          color: "white",
          position: "relative",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.4) 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)`,
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #6366f1 0%, #a855f7 100%)",
              marginRight: "20px",
            }}
          />
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "700",
              background: "linear-gradient(45deg, #ffffff 0%, #e0e7ff 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Randy Ellis
          </h1>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "900px",
            padding: "40px",
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontSize: "56px",
              fontWeight: "800",
              marginBottom: "20px",
              background: "linear-gradient(45deg, #6366f1 0%, #a855f7 100%)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: "1.1",
            }}
          >
            AI Product Design Projects
          </h2>

          <div
            style={{
              fontSize: "28px",
              opacity: 0.9,
              lineHeight: "1.4",
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            Innovative AI-powered design projects with real impact
          </div>

          {/* Project Highlights */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "20px",
                borderRadius: "16px",
                margin: "0 10px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#34d399",
                  marginBottom: "8px",
                }}
              >
                GrowIt
              </div>
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.8,
                  textAlign: "center",
                }}
              >
                100K+ Users
                <br />
                4.8★ Rating
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "20px",
                borderRadius: "16px",
                margin: "0 10px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#60a5fa",
                  marginBottom: "8px",
                }}
              >
                AI Design System
              </div>
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.8,
                  textAlign: "center",
                }}
              >
                Generator Tool
                <br />
                Open Source
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "20px",
                borderRadius: "16px",
                margin: "0 10px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#a78bfa",
                  marginBottom: "8px",
                }}
              >
                METIS
              </div>
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.8,
                  textAlign: "center",
                }}
              >
                AI Business
                <br />
                Strategy Agent
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Brand */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "40px",
            fontSize: "16px",
            opacity: 0.7,
          }}
        >
          work.randyellis.design/projects
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
