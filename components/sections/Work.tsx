import SectionHead from "@/components/sections/SectionHead";
import WorkList from "@/components/work/WorkList";
import SplitWords from "@/components/ui/SplitWords";
import { projects } from "@/content/projects";

export default function Work() {
  return (
    <section id="work" data-section="Work" data-index="03" className="section shell" aria-labelledby="work-title">
      <SectionHead index="03" name="Selected work" aside={`${projects.length} projects · 2025 — 2026`} />
      <div className="grid-12 mb-[clamp(48px,6vw,96px)] items-end gap-y-6">
        <SplitWords
          as="h2"
          id="work-title"
          className="display col-span-12 text-[length:var(--fs-h2)] lg:col-span-8"
          parts={["Things I've built,", { em: "and measured." }]}
        />
        <p className="prose-body col-span-12 text-muted md:col-span-6 lg:col-span-3 lg:col-start-10" data-reveal="fade">
          Each project carries the number I&rsquo;d defend in an interview. The citation links to where it was measured.
        </p>
      </div>
      <WorkList
        projects={projects.map(({ caseStudy, ...row }) => ({ ...row, hasCaseStudy: Boolean(caseStudy) }))}
      />
    </section>
  );
}
