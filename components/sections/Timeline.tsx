"use client";

import { useEffect, useRef, useState } from "react";
import SectionHead from "@/components/sections/SectionHead";
import { experience } from "@/content/experience";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

/**
 * Scroll-driven timeline: the spine fills as you read, entries light up as they cross
 * the middle of the screen, and the large year on the left follows along.
 */
export default function Timeline() {
  const root = useRef<HTMLDivElement>(null);
  const spine = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          spine.current,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 60%", end: "bottom 60%", scrub: 0.6 } },
        );
      }
      el.querySelectorAll<HTMLElement>("[data-entry]").forEach((entry, i) => {
        ScrollTrigger.create({
          trigger: entry,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const year = experience[active]?.year;

  return (
    <section id="experience" data-section="Experience" data-index="05" className="section shell" aria-labelledby="exp-title">
      <SectionHead index="05" name="Experience" aside="Read from the commit history" />

      <div className="grid-12">
        <div className="col-span-12 mb-10 md:col-span-4 md:mb-0">
          <div className="md:sticky md:top-[calc(var(--nav-h)+48px)]">
            <h2 id="exp-title" className="display text-[length:var(--fs-h3)] leading-[0.95]" data-reveal="fade">
              The path, <em>so far.</em>
            </h2>
            <p
              aria-hidden="true"
              className="display tabular mt-8 hidden text-[clamp(5rem,12vw,13rem)] leading-[0.8] text-paper/90 md:block"
            >
              <span key={year} className="inline-block animate-[yearIn_0.9s_var(--ease-out)]">
                {year}
              </span>
            </p>
          </div>
        </div>

        <div ref={root} className="relative col-span-12 md:col-span-7 md:col-start-6">
          <div className="absolute bottom-0 left-[5px] top-0 w-px bg-rule" aria-hidden="true">
            <div ref={spine} className="h-full w-full origin-top bg-signal" />
          </div>
          <ol className="space-y-[clamp(48px,6vw,96px)]">
            {experience.map((m, i) => (
              <li key={m.title} data-entry className="relative pl-10">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-[0.35em] h-[11px] w-[11px] rounded-full border transition-colors duration-500 ${
                    i <= active ? "border-signal bg-signal" : "border-faint bg-ink"
                  }`}
                />
                <p className="micro text-muted">{m.period}</p>
                <h3
                  className={`lead mt-2 text-[clamp(1.375rem,1.1rem+1vw,2.25rem)] transition-colors duration-500 ${
                    i === active ? "text-paper" : "text-paper/60"
                  }`}
                >
                  {m.title}
                </h3>
                <p className="prose-body mt-3">{m.body}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {m.tags.map((t) => (
                    <li key={t} className="micro rounded-full border border-rule px-3 py-1 text-muted">
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
