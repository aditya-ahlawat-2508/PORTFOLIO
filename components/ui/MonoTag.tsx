export function MonoTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block border border-hairline rounded-[2px] px-2 py-1 font-mono text-eyebrow text-muted">
      {children}
    </span>
  );
}
