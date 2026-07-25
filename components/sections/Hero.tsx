import Link from "next/link";
import { identity, links } from "@/content/profile";

export function Hero() {
  return (
    <section
      id="entry"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 lg:px-12"
    >
      <div className="relative z-10 grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <p className="font-mono text-eyebrow uppercase tracking-[0.15em] text-muted mb-6">
            node: entry
          </p>
          <h1 className="font-display text-3xl leading-[1.05] tracking-[-0.03em] text-vellum [font-size:clamp(2.75rem,6vw,7rem)]">
            {identity.headline}
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg text-muted">
            {identity.subhead}
          </p>
          <div className="mt-8 flex items-center gap-6 font-mono text-sm">
            <Link
              href="#build"
              className="rounded-[2px] border border-hairline px-4 py-2 text-vellum transition-colors hover:border-signal hover:text-signal"
            >
              View work
            </Link>
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-signal"
            >
              GitHub ↗
            </a>
          </div>
          <p className="mt-10 font-mono text-sm text-pulse">
            {identity.metricStrip}
          </p>
        </div>
      </div>
    </section>
  );
}
