import { ImageResponse } from "next/og";
import { identity } from "@/content/profile";
import { graphSequence, heroPositions, heroEdges } from "@/components/graph/graph-data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0E1116",
          position: "relative",
        }}
      >
        <svg
          width="1200"
          height="630"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, opacity: 0.9 }}
        >
          {heroEdges.map(([a, b], i) => {
            const from = heroPositions[a];
            const to = heroPositions[b];
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#5A6CFF"
                strokeWidth={0.3}
              />
            );
          })}
          {graphSequence.map((n) => {
            const p = heroPositions[n.id];
            return <circle key={n.id} cx={p.x} cy={p.y} r={1.3} fill="#00C2A8" />;
          })}
        </svg>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 24,
            color: "#79859A",
            letterSpacing: 4,
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          node: entry
        </p>
        <h1
          style={{
            fontSize: 64,
            color: "#DDE3EC",
            maxWidth: 800,
            lineHeight: 1.1,
            marginTop: 24,
          }}
        >
          {identity.headline}
        </h1>
        <p style={{ fontSize: 28, color: "#00C2A8", fontFamily: "monospace", marginTop: 32 }}>
          Aditya Ahlawat
        </p>
      </div>
    ),
    { ...size }
  );
}
