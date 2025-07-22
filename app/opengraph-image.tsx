import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Randy Ellis - AI Product Design Engineer";
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
          background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
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
            background: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)`,
          }}
        />

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
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "800",
              marginBottom: "20px",
              background: "linear-gradient(45deg, #ffffff 0%, #e0e7ff 100%)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: "1.1",
            }}
          >
            Randy Ellis
          </h1>

          <div
            style={{
              fontSize: "32px",
              fontWeight: "600",
              marginBottom: "30px",
              background: "linear-gradient(45deg, #60a5fa 0%, #a78bfa 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            AI Product Design Engineer
          </div>

          <div
            style={{
              fontSize: "24px",
              opacity: 0.9,
              lineHeight: "1.4",
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            Specializing in Generative AI • Design Systems • Product Leadership
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  color: "#60a5fa",
                }}
              >
                2.5M+
              </div>
              <div
                style={{
                  fontSize: "16px",
                  opacity: 0.8,
                }}
              >
                Users Impacted
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  color: "#a78bfa",
                }}
              >
                $50M
              </div>
              <div
                style={{
                  fontSize: "16px",
                  opacity: 0.8,
                }}
              >
                Product Value
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  color: "#34d399",
                }}
              >
                800+
              </div>
              <div
                style={{
                  fontSize: "16px",
                  opacity: 0.8,
                }}
              >
                Designers Mentored
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Brand */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            fontSize: "18px",
            opacity: 0.7,
          }}
        >
          work.randyellis.design
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}