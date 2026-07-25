export function SectionHeading({
  nodeId,
  title,
}: {
  nodeId: string;
  title: string;
}) {
  return (
    <div className="mb-12">
      <p className="font-mono text-eyebrow uppercase tracking-[0.15em] text-muted mb-3">
        node: {nodeId}
      </p>
      <h2 className="font-display text-2xl tracking-[-0.03em] text-vellum">
        {title}
      </h2>
    </div>
  );
}
