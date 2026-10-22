import SectionHead from "@/components/sections/SectionHead";
import CopyEmail from "@/components/ui/CopyEmail";
import Magnetic from "@/components/ui/Magnetic";
import SplitWords from "@/components/ui/SplitWords";
import { references } from "@/content/references";
import { site, visibleSocials } from "@/content/site";

export default function Contact() {
  return (
    <section id="contact" data-section="Contact" data-index="06" className="section shell pb-[clamp(48px,6vw,96px)]" aria-labelledby="contact-title">
      <SectionHead index="06" name="Contact" aside="Replies within a day, usually faster" />

      <SplitWords
        as="h2"
        id="contact-title"
        className="display -ml-[0.04em] text-[clamp(3.5rem,1rem+11vw,17rem)] leading-[0.86]"
        parts={["Let's build", "something", { em: "measurable." }]}
      />

      <div className="grid-12 mt-[clamp(48px,7vw,120px)] gap-y-12">
        <div className="col-span-12 md:col-span-7" data-reveal="fade">
          <p className="micro mb-4 text-muted">Email — click to copy</p>
          <Magnetic strength={0.12}>
            <CopyEmail className="lead break-all text-[clamp(1.5rem,1rem+2.4vw,3.5rem)] hover:text-signal" />
          </Magnetic>
          <p className="mono mt-5 text-muted">
            or{" "}
            <a href={`mailto:${site.email}`} className="ulink text-paper">
              open your mail app
            </a>
          </p>
        </div>

        <nav aria-label="Elsewhere" className="col-span-12 md:col-span-4 md:col-start-9" data-reveal="fade" data-reveal-delay="0.1">
          <p className="micro mb-4 text-muted">Elsewhere</p>
          <ul className="border-b border-rule">
            {visibleSocials.map((s) => (
              <li key={s.label} className="border-t border-rule">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer me"
                  className="group flex items-baseline justify-between py-4 transition-colors duration-500 hover:text-signal"
                >
                  <span className="lead text-[clamp(1.25rem,1rem+0.8vw,1.75rem)]">{s.label}</span>
                  <span className="mono flex items-center gap-3 text-muted transition-colors group-hover:text-signal">
                    {s.handle}
                    <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-[clamp(80px,10vw,160px)]" data-reveal="fade">
        <h3 className="micro mb-4 text-muted">References</h3>
        <ol className="grid gap-x-[var(--gutter)] md:grid-cols-2">
          {references.map((r) => (
            <li key={r.n} id={`ref-${r.n}`} className="scroll-mt-32 border-t border-rule py-4 target:bg-surface">
              <a href={r.href} target="_blank" rel="noreferrer" className="group grid grid-cols-[3rem_1fr] gap-2">
                <span className="mono text-signal">[{r.n}]</span>
                <span>
                  <span className="mono block text-paper group-hover:text-signal">{r.title} ↗</span>
                  <span className="mt-1 block text-[length:var(--fs-small)] text-muted">{r.detail}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
