import { projects, projectsFraming } from "@/content/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectPanel } from "@/components/sections/projects/ProjectPanel";
import { AWSSchematic } from "@/components/sections/projects/AWSSchematic";
import { TripMateGraph } from "@/components/sections/projects/TripMateGraph";
import { MeetingPointToggle } from "@/components/sections/projects/MeetingPointToggle";

const schematics = [<AWSSchematic key="aws" />, <TripMateGraph key="trip" />, <MeetingPointToggle key="mp" />];

export function Projects() {
  return (
    <section id="build" className="px-6 py-32 lg:px-12">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
          <SectionHeading nodeId="build" title="Projects" />
          <p className="max-w-[60ch] text-muted mb-16 leading-[1.6]">{projectsFraming}</p>
          <div>
            {projects.map((project, i) => (
              <ProjectPanel
                key={project.slug}
                project={project}
                reversed={i % 2 === 1}
                schematic={schematics[i]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
