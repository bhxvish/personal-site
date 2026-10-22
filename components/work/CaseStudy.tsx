import AnchorLink from "@/components/ui/AnchorLink";
import SplitWords from "@/components/ui/SplitWords";
import { TransitionLink } from "@/components/layout/PageTransition";
import Plate from "@/components/work/Plate";
import type { Project } from "@/content/projects";

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid-12 gap-y-6 border-t border-rule pt-8" aria-labelledby={`cs-${n}`}>
      <div className="col-span-12 md:col-span-3">
        <p className="micro text-muted">({n})</p>
        <h2 id={`cs-${n}`} className="micro mt-1 text-paper">
          {title}
        </h2>
      </div>
      <div className="col-span-12 md:col-span-8 md:col-start-5">{children}</div>
    </section>
  );
}

/** Reusable case-study layout. Everything comes from the project's `caseStudy` data. */
export default function CaseStudy({ project, index, next }: { project: Project; index: number; next: Project }) {
  const cs = project.caseStudy!;
  const no = String(index + 1).padStart(2, "0");

  return (
    <article data-section={project.title} data-index={no} className="shell pt-[calc(var(--nav-h)+24px)]">
      <div className="grid-12 micro mb-3 text-muted" data-reveal="fade">
        <p className="col-span-6 md:col-span-4">
          <AnchorLink hash="work" className="ulink text-paper">
            ← Index
          </AnchorLink>
        </p>
        <p className="hidden md:col-span-4 md:block">Case study — {no}</p>
        <p className="col-span-6 text-right md:col-span-4">{project.year}</p>
      </div>
      <div className="rule" data-reveal="rule" />

      <header className="pb-[clamp(40px,6vw,96px)] pt-[clamp(32px,5vw,80px)]">
        <SplitWords as="h1" className="display -ml-[0.05em] text-[clamp(3.5rem,1rem+12vw,16rem)] leading-[0.84]" parts={project.title} />
        <div className="grid-12 mt-[clamp(32px,4vw,64px)] gap-y-10">
          <p className="lead col-span-12 text-paper md:col-span-7" data-reveal="fade">
            {cs.overview}
          </p>
          <dl className="col-span-12 grid grid-cols-2 gap-x-[var(--gutter)] gap-y-5 md:col-span-4 md:col-start-9" data-reveal="fade" data-reveal-delay="0.1">
            <div>
              <dt className="micro text-muted">Role</dt>
              <dd className="mono mt-1">{project.role}</dd>
            </div>
            <div>
              <dt className="micro text-muted">Year</dt>
              <dd className="mono mt-1">{project.year}</dd>
            </div>
            <div className="col-span-2">
              <dt className="micro text-muted">Stack</dt>
              <dd className="mono mt-1">{project.stack.join(" · ")}</dd>
            </div>
            <div className="col-span-2">
              <dt className="micro text-muted">Source</dt>
              <dd className="mono mt-1">
                <a href={project.repo} target="_blank" rel="noreferrer" className="ulink text-signal">
                  {project.repo.replace("https://", "")} ↗
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <figure data-reveal="clip" className="-mx-[var(--margin)] aspect-[4/3] overflow-hidden border-y border-rule md:mx-0 md:aspect-[21/10] md:border">
        <Plate kind={project.plate} label={`Diagram for ${project.title}`} />
      </figure>

      <div className="space-y-[clamp(64px,8vw,128px)] py-[clamp(72px,10vw,160px)]">
        <Block n="01" title="Problem">
          <div className="space-y-5">
            {cs.problem.map((p, i) => (
              <p key={i} className={i === 0 ? "lead text-paper" : "prose-body"} data-reveal="fade">
                {p}
              </p>
            ))}
          </div>
        </Block>

        <Block n="02" title="Approach">
          <ol className="grid gap-x-[var(--gutter)] gap-y-10 sm:grid-cols-2">
            {cs.approach.map((step, i) => (
              <li key={step.title} data-reveal="fade" data-reveal-delay={String((i % 2) * 0.08)}>
                <p className="micro tabular text-signal">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="lead mt-2 text-[clamp(1.25rem,1rem+0.9vw,1.875rem)]">{step.title}</h3>
                <p className="prose-body mt-3">{step.body}</p>
              </li>
            ))}
          </ol>
        </Block>

        <Block n="03" title="Results">
          <div data-reveal="fade">
            <div className="-mx-[var(--margin)] overflow-x-auto px-[var(--margin)] md:mx-0 md:px-0">
              <table className="mono w-full min-w-[520px] text-[length:var(--fs-small)]">
                <caption className="micro mb-4 text-left text-muted">{cs.results.caption}</caption>
                <thead>
                  <tr className="micro text-muted">
                    {cs.results.columns.map((c, i) => (
                      <th key={c} scope="col" className={`pb-3 font-normal ${i ? "text-right" : "text-left"}`}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cs.results.rows.map((row) => (
                    <tr key={row[0]} className="border-t border-rule">
                      <th scope="row" className="py-4 pr-4 text-left font-normal text-paper">
                        {row[0]}
                      </th>
                      <td className="tabular py-4 text-right text-muted">{row[1]}</td>
                      <td className="tabular py-4 pl-4 text-right text-signal">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {cs.results.note && <p className="micro mt-5 max-w-[70ch] normal-case tracking-normal text-muted">{cs.results.note}</p>}
          </div>
        </Block>

        <Block n="04" title="Decisions & limits">
          <div className="space-y-8">
            {cs.decisions.map((d) => (
              <div key={d.title} data-reveal="fade">
                <h3 className="lead text-[clamp(1.25rem,1rem+0.9vw,1.875rem)]">{d.title}</h3>
                <p className="prose-body mt-3">{d.body}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block n="05" title="What I'd do next">
          <ul data-reveal="fade">
            {cs.next.map((item, i) => (
              <li key={item} className="mono flex gap-4 border-t border-rule py-4 first:border-t-0 first:pt-0">
                <span className="tabular text-muted">{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>
        </Block>
      </div>

      <TransitionLink
        href={`/work/${next.slug}`}
        cover={{ title: next.title, eyebrow: "Next case study" }}
        data-cursor="view"
        data-cursor-label="Next"
        className="group mb-[clamp(48px,6vw,96px)] block border-t border-rule pt-8"
      >
        <p className="micro text-muted">Next case study</p>
        <p className="display mt-4 flex items-baseline justify-between text-[clamp(3rem,1rem+9vw,12rem)] leading-[0.9] transition-colors duration-700 group-hover:text-signal">
          <span className="transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-4">{next.title}</span>
          <span aria-hidden="true" className="text-[0.4em] transition-transform duration-700 ease-[var(--ease-out)] group-hover:-rotate-45">
            →
          </span>
        </p>
      </TransitionLink>
    </article>
  );
}
