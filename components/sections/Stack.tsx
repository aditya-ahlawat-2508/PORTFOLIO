import { skillGroups } from "@/content/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Stack() {
  return (
    <section id="stack" className="px-6 py-32 lg:px-12">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
          <SectionHeading nodeId="stack" title="Technical skills" />
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            {skillGroups.map((group, i) => (
              <Reveal key={group.label} index={i % 2}>
                <p className="font-mono text-eyebrow uppercase tracking-[0.15em] text-muted mb-4 border-b border-hairline pb-3">
                  {group.label}
                </p>
                <ul className="flex flex-col">
                  {group.tags.map((tag) => (
                    <li
                      key={tag}
                      className="font-mono text-sm text-vellum border-t border-hairline py-2.5 first:border-t-0"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
