import { aboutParagraphs, currentState } from "@/content/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="state" className="px-6 py-32 lg:px-12 lg:py-32">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 lg:col-start-2">
          <SectionHeading nodeId="state" title="About" />
          <div className="flex flex-col gap-5 max-w-[68ch]">
            {aboutParagraphs.map((p, i) => (
              <Reveal key={i} index={i}>
                <p className="text-base leading-[1.6] text-vellum/90">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="col-span-12 mt-12 lg:col-span-4 lg:col-start-9 lg:mt-0">
          <Reveal index={1} className="border border-hairline rounded-[2px] bg-surface p-6">
            <p className="font-mono text-eyebrow uppercase tracking-[0.15em] text-muted mb-4">
              current_state
            </p>
            <dl className="flex flex-col gap-3 font-mono text-sm">
              {Object.entries(currentState).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1 border-t border-hairline pt-3 first:border-t-0 first:pt-0">
                  <dt className="text-muted">{key}</dt>
                  <dd className="text-vellum">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
