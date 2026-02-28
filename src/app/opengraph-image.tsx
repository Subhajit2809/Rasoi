import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rasoi — Smart Kitchen Assistant for Indian Households";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #D2691E 0%, #A0522D 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />

        {/* Pot icon */}
        <div
          style={{
            fontSize: 96,
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          🍲
        </div>

        {/* App name */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-2px",
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          Rasoi
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.85)",
            marginBottom: 40,
            textAlign: "center",
            maxWidth: 720,
          }}
        >
          Smart Kitchen Assistant for Indian Households
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            "🧊 Track Your Fridge",
            "🍳 Meal Suggestions",
            "🛒 Grocery Lists",
            "👫 Shared Household",
          ].map((pill) => (
            <div
              key={pill}
              style={{
                padding: "10px 22px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: 40,
                color: "#FFFFFF",
                fontSize: 22,
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              {pill}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
