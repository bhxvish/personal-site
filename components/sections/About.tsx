import SectionHead from "@/components/sections/SectionHead";
import Portrait from "@/components/sections/Portrait";
import SplitWords from "@/components/ui/SplitWords";
import { site } from "@/content/site";

export default function About() {
  const { about } = site;
  return (
    <section id="about" data-section="About" data-index="02" className="section shell" aria-labelledby="about-title">
      <SectionHead index="02" name="About" aside="A person, not a pipeline" />

      <div className="grid-12 gap-y-14">
        <figure className="col-span-12 sm:col-span-8 md:col-span-5 lg:col-span-4">
          <div data-reveal="clip" className="aspect-[4/5] overflow-hidden bg-surface">
            <Portrait />
          </div>
          <figcaption className="micro mt-3 flex justify-between text-muted">
            <span>Fig. 2 — {site.name}, as a dot field</span>
            <span>{site.location}</span>
          </figcaption>
        </figure>

        <div className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-6">
          <h2 id="about-title" className="sr-only">
            About
          </h2>
          <SplitWords
            as="p"
            className="display text-[length:var(--fs-h3)] leading-[0.98] tracking-[-0.035em]"
            parts={[about.opener.replace(" break it.", ""), { em: "break it." }]}
          />
          <div className="mt-10 space-y-5">
            {about.body.map((p, i) => (
              <p key={i} className="prose-body" data-reveal="fade" data-reveal-delay={String(0.1 * i)}>
                {p}
              </p>
            ))}
          </div>

          <div className="mt-14" data-reveal="fade">
            <h3 className="micro mb-4 text-muted">Into</h3>
            <ol className="grid gap-x-[var(--gutter)] sm:grid-cols-2">
              {about.into.map((item, i) => (
                <li key={item} className="mono flex gap-4 border-t border-rule py-3 text-paper">
                  <span className="tabular text-muted">{String(i + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <dl className="mt-[clamp(64px,8vw,128px)] grid border-y border-rule md:grid-cols-3" data-reveal="fade">
        {about.currently.map((c, i) => (
          <div
            key={c.label}
            className={`flex items-baseline gap-4 py-5 md:block md:px-6 md:py-7 ${i ? "border-t border-rule md:border-l md:border-t-0" : "md:pl-0"}`}
          >
            <dt className="micro flex shrink-0 items-center gap-2 text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
              Currently {c.label.toLowerCase()}
            </dt>
            <dd className="lead mt-0 text-[length:var(--fs-body)] md:mt-3 md:text-[clamp(1.25rem,1rem+0.8vw,1.75rem)]">{c.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
