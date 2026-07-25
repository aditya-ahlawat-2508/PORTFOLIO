import { experience } from "@/content/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Experience() {
  return (
    <section id="run" className="px-6 py-32 lg:px-12">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
          <SectionHeading nodeId="run" title="Experience" />
          {experience.map((role) => (
            <div key={role.company}>
              <Reveal>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-sm text-muted border-b border-hairline pb-4 mb-6">
                  <span className="text-vellum text-lg font-display tracking-[-0.02em]">
                    {role.company}
                  </span>
                  <span>{role.role}</span>
                  <span className="ml-auto">{role.dates}</span>
                  <span>{role.location}</span>
                </div>
              </Reveal>
              <ul className="flex flex-col">
                {role.bullets.map((bullet, i) => (
                  <Reveal key={i} index={i}>
                    <li className="border-t border-hairline py-5 first:border-t-0 text-vellum/90 leading-[1.6] max-w-[68ch]">
                      {bullet}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
