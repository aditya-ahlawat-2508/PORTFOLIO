import { Project } from "@/content/profile";
import { MonoTag } from "@/components/ui/MonoTag";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

export function ProjectPanel({
  project,
  reversed,
  schematic,
}: {
  project: Project;
  reversed: boolean;
  schematic?: React.ReactNode;
}) {
  return (
    <Reveal
      id={`panel-${project.slug}`}
      className="border-t border-hairline py-16 first:border-t-0 first:pt-0"
    >
      <div className="grid grid-cols-12 gap-6">
        <div
          className={cn(
            "col-span-12 lg:col-span-5",
            reversed ? "lg:col-start-8 lg:order-2" : "lg:col-start-1 lg:order-1"
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <h3 className="font-display text-xl tracking-[-0.03em] text-vellum">
              {project.name}
            </h3>
            {project.status === "in-progress" && (
              <span className="font-mono text-eyebrow uppercase tracking-wide text-muted border border-hairline rounded-[2px] px-2 py-0.5">
                in progress
              </span>
            )}
          </div>
          <p className="text-vellum/80 leading-[1.6] max-w-[46ch]">{project.thesis}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-eyebrow text-muted">
            <span>{project.dates}</span>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal hover:underline"
            >
              GitHub ↗
            </a>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <MonoTag key={tech}>{tech}</MonoTag>
            ))}
          </div>
          {schematic && <div className="mt-8">{schematic}</div>}
        </div>

        <div
          className={cn(
            "col-span-12 mt-8 lg:col-span-6 lg:mt-0",
            reversed ? "lg:col-start-1 lg:order-1" : "lg:col-start-7 lg:order-2"
          )}
        >
          <ul className="flex flex-col">
            {project.bullets.map((bullet, i) => (
              <li key={i} className="border-t border-hairline py-5 first:border-t-0">
                <span className="font-mono text-pulse text-sm">{bullet.metric}</span>{" "}
                <span className="text-vellum/85 leading-[1.6]">{bullet.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
