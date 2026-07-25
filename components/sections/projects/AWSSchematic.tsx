const layers = ["Terraform", "Lambda / API Gateway", "Streamlit"];

export function AWSSchematic() {
  return (
    <div
      className="flex flex-col gap-0 font-mono text-eyebrow"
      role="img"
      aria-label="Schematic: Terraform provisions Lambda and API Gateway, which serve the Streamlit dashboard"
    >
      {layers.map((layer, i) => (
        <div key={layer} className="flex flex-col items-center">
          <div className="w-full border border-hairline rounded-[2px] bg-void px-4 py-3 text-center text-vellum">
            {layer}
          </div>
          {i < layers.length - 1 && (
            <svg width="12" height="20" viewBox="0 0 12 20" aria-hidden="true">
              <line x1="6" y1="0" x2="6" y2="14" stroke="var(--muted)" strokeWidth="1" />
              <path d="M2 12 L6 18 L10 12" fill="none" stroke="var(--muted)" strokeWidth="1" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
