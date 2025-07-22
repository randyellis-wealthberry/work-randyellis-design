import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "About Randy Ellis - AI Product Design Engineer & Leader";
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
            "linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #2d1b3d 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "system-ui, sans-serif",
          color: "white",
          position: "relative",
          padding: "60px",
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
            background: `radial-gradient(circle at 20% 30%, rgba(52, 211, 153, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)`,
          }}
        />

        {/* Left Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "600px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: "600",
              marginBottom: "10px",
              opacity: 0.8,
            }}
          >
            About
          </div>

          <h1
            style={{
              fontSize: "64px",
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
              fontSize: "28px",
              fontWeight: "600",
              marginBottom: "30px",
              background: "linear-gradient(45deg, #34d399 0%, #60a5fa 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            AI Product Design Engineer & Leader
          </div>

          <div
            style={{
              fontSize: "20px",
              opacity: 0.9,
              lineHeight: "1.5",
              marginBottom: "40px",
            }}
          >
            From design leadership to AI innovation, bridging the gap between
            cutting-edge AI and human-centered design.
          </div>

          {/* Experience Highlights */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#34d399",
                  marginRight: "15px",
                }}
              />
              Head of Product at Wealthberry Labs
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#60a5fa",
                  marginRight: "15px",
                }}
              />
              Former Head of Design at Nagarro
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#a78bfa",
                  marginRight: "15px",
                }}
              />
              Mentored 800+ Designers Globally
            </div>
          </div>
        </div>

        {/* Right Stats Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "rgba(255, 255, 255, 0.1)",
            padding: "40px",
            borderRadius: "20px",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            Career Impact
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  color: "#34d399",
                }}
              >
                2.5M+
              </div>
              <div
                style={{
                  fontSize: "14px",
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
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  color: "#60a5fa",
                }}
              >
                6
              </div>
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.8,
                }}
              >
                Design Awards
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
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
                  fontSize: "14px",
                  opacity: 0.8,
                }}
              >
                Product Value
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
          work.randyellis.design/about
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
