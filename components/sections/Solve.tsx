import { achievements, links } from "@/content/profile";
import { getLeetCodeStats } from "@/lib/fetchers";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export async function Solve() {
  const leetcode = await getLeetCodeStats();

  return (
    <section id="solve" className="px-6 py-32 lg:px-12 bg-surface/40">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
          <SectionHeading nodeId="solve" title="Competitive programming" />

          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
            {achievements.map((a, i) => (
              <Reveal key={a.label} index={i}>
                <p className="font-mono text-3xl text-vellum tracking-[-0.02em] [font-size:clamp(1.75rem,4vw,2.5rem)]">
                  {a.value}
                </p>
                <p className="mt-2 font-mono text-eyebrow text-muted">{a.label}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6 font-mono text-sm">
            <a
              href={links.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal hover:underline"
            >
              LeetCode ↗
            </a>
            <a
              href={links.codolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal hover:underline"
            >
              Codolio ↗
            </a>
            <span className="text-muted">
              {leetcode.totalSolved}+ solved · updated {leetcode.updated}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
