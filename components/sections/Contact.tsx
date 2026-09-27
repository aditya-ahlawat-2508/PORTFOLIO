import { links } from "@/content/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Reveal } from "@/components/ui/Reveal";

const profileLinks = [
  { label: "GitHub", href: links.github },
  { label: "LinkedIn", href: links.linkedin },
  { label: "LeetCode", href: links.leetcode },
  { label: "Codolio", href: links.codolio },
];

export function Contact() {
  return (
    <section id="reach" className="px-6 py-32 lg:px-12">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 lg:col-start-2">
          <SectionHeading nodeId="reach" title="Contact" />
          <Reveal>
            <CopyEmail email={links.emailPrimary} />
          </Reveal>

          <Reveal index={1} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
            {profileLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-signal transition-colors"
              >
                {l.label} ↗
              </a>
            ))}
          </Reveal>

          <Reveal index={2} className="mt-10">
            <a
              href="/resume.pdf"
              download
              className="inline-block rounded-[2px] border border-hairline px-5 py-2.5 font-mono text-sm text-vellum transition-colors hover:border-signal hover:text-signal"
            >
              Résumé ↓
            </a>
          </Reveal>
        </div>
      </div>

    </section>
  );
}
