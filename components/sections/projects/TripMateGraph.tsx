const agents = ["flight", "hotel", "weather", "itinerary", "response"];

export function TripMateGraph() {
  const n = agents.length;
  const step = 100 / (n - 1);

  return (
    <svg
      viewBox="0 0 100 24"
      className="w-full h-auto"
      role="img"
      aria-label={`5-agent LangGraph workflow: ${agents.join(" to ")}`}
    >
      <line
        x1={0}
        y1={12}
        x2={100}
        y2={12}
        stroke="var(--signal)"
        strokeWidth={0.5}
        opacity={0.5}
      />
      {agents.map((agent, i) => {
        const x = i * step;
        return (
          <g key={agent}>
            <circle cx={x} cy={12} r={2.4} fill="var(--pulse)" stroke="var(--pulse)" />
            <text
              x={x}
              y={20}
              textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
              fontSize={3.4}
              fontFamily="var(--font-mono)"
              fill="var(--muted)"
            >
              {agent}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
