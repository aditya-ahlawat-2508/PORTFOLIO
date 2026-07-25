"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const friends = [
  { x: 10, y: 15 },
  { x: 88, y: 10 },
  { x: 14, y: 82 },
  { x: 92, y: 78 },
  { x: 50, y: 8 },
];

const roads = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [0, 4],
  [1, 4],
  [4, 5],
  [2, 5],
  [3, 5],
] as const;

const venueA = { x: 38, y: 46 };
const venueB = { x: 60, y: 55 };

export function MeetingPointToggle() {
  const [rule, setRule] = useState<"total" | "worst">("total");
  const winner = rule === "total" ? "A" : "B";
  const nodes = [...friends, venueA, venueB];

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex w-fit border border-hairline rounded-[2px] font-mono text-eyebrow overflow-hidden"
        role="group"
        aria-label="Fairness rule"
      >
        <button
          type="button"
          aria-pressed={rule === "total"}
          onClick={() => setRule("total")}
          className={cn(
            "px-3 py-1.5 transition-colors",
            rule === "total" ? "bg-signal text-void" : "text-muted hover:text-vellum"
          )}
        >
          minimise total
        </button>
        <button
          type="button"
          aria-pressed={rule === "worst"}
          onClick={() => setRule("worst")}
          className={cn(
            "px-3 py-1.5 border-l border-hairline transition-colors",
            rule === "worst" ? "bg-signal text-void" : "text-muted hover:text-vellum"
          )}
        >
          minimise worst
        </button>
      </div>

      <svg
        viewBox="0 0 100 92"
        className="w-full h-auto"
        role="img"
        aria-label={`Weighted graph fragment: five friend pins connected by a road network, with two candidate venues. Under the ${
          rule === "total" ? "minimise total" : "minimise worst"
        } rule, venue ${winner} wins.`}
      >
        {roads.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="var(--muted)"
            strokeWidth={0.4}
            opacity={0.35}
          />
        ))}

        {friends.map((f, i) => (
          <circle key={i} cx={f.x} cy={f.y} r={1.8} fill="var(--muted)" />
        ))}

        <g>
          <circle
            cx={venueA.x}
            cy={venueA.y}
            r={winner === "A" ? 3.2 : 2.2}
            fill={winner === "A" ? "var(--pulse)" : "none"}
            stroke={winner === "A" ? "var(--pulse)" : "var(--muted)"}
            strokeWidth={0.5}
            style={{ transition: "all 0.25s ease" }}
          />
          <text x={venueA.x} y={venueA.y - 5} textAnchor="middle" fontSize={3.4} fontFamily="var(--font-mono)" fill="var(--muted)">
            A
          </text>
        </g>
        <g>
          <circle
            cx={venueB.x}
            cy={venueB.y}
            r={winner === "B" ? 3.2 : 2.2}
            fill={winner === "B" ? "var(--pulse)" : "none"}
            stroke={winner === "B" ? "var(--pulse)" : "var(--muted)"}
            strokeWidth={0.5}
            style={{ transition: "all 0.25s ease" }}
          />
          <text x={venueB.x} y={venueB.y - 5} textAnchor="middle" fontSize={3.4} fontFamily="var(--font-mono)" fill="var(--muted)">
            B
          </text>
        </g>
      </svg>
      <p className="font-mono text-eyebrow text-muted">
        winner: <span className="text-pulse">venue {winner}</span>
      </p>
    </div>
  );
}
