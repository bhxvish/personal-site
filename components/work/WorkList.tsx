"use client";

import { useEffect, useRef, useState } from "react";
import { TransitionLink } from "@/components/layout/PageTransition";
import Plate from "@/components/work/Plate";
import type { Project } from "@/content/projects";
import { DUR, EASE, gsap, hasFinePointer } from "@/lib/gsap";

/**
 * Editorial project index. On pointer devices a preview plate follows the cursor and
 * clips open over the list; on touch, each row carries its plate inline.
 */
// Only the fields a row needs, so case-study text isn't serialized into the page.
export type WorkRow = Omit<Project, "caseStudy"> & { hasCaseStudy: boolean };

export default function WorkList({ projects }: { projects: WorkRow[] }) {
  const list = useRef<HTMLOListElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [fine, setFine] = useState(false);

  useEffect(() => setFine(hasFinePointer()), []);

  // Preview follows the pointer with a little lag and a lean in the direction of travel.
  useEffect(() => {
    const el = preview.current;
    if (!fine || !el) return;
    const x = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" });
    const rot = gsap.quickTo(el, "rotation", { duration: 0.9, ease: "power3" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      rot(gsap.utils.clamp(-6, 6, (e.clientX - lastX) * 0.4));
      lastX = e.clientX;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [fine]);

  useEffect(() => {
    const el = preview.current;
    if (!fine || !el) return;
    gsap.to(el.querySelector("[data-frame]"), {
      clipPath: active === null ? "inset(50% 0 50% 0)" : "inset(0% 0 0% 0)",
      duration: DUR.fast,
      ease: EASE.out,
    });
    if (active !== null) {
      gsap.to(el.querySelectorAll("[data-plate]"), {
        yPercent: (i: number) => (i - active) * 100,
        duration: DUR.base,
        ease: EASE.inOut,
      });
    }
  }, [active, fine]);

  return (
    <div className="relative">
      <ol ref={list} className="border-b border-rule" onPointerLeave={() => setActive(null)}>
        {projects.map((p, i) => {
          const dim = active !== null && active !== i;
          const internal = p.hasCaseStudy;
          const content = (
            <>
              <div className="only-touch mb-6 aspect-[4/3] overflow-hidden border border-rule">
                <Plate kind={p.plate} />
              </div>
              <div className="grid-12 items-baseline gap-y-3">
                <span className="micro tabular col-span-2 text-muted md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display col-span-10 text-[clamp(2.5rem,1.2rem+4.2vw,6.5rem)] leading-[0.92] tracking-[-0.035em] transition-transform duration-700 ease-[var(--ease-out)] md:col-span-6 md:group-hover:translate-x-3">
                  {p.title}
                  {!internal && (
                    <span aria-hidden="true" className="ml-3 inline-block align-top font-sans text-[0.35em] text-muted">
                      ↗
                    </span>
                  )}
                </h3>
                <div className="col-span-10 col-start-3 md:col-span-3 md:col-start-auto">
                  <p className="text-[length:var(--fs-small)] leading-snug text-paper">{p.kicker}</p>
                  <p className="micro mt-2 text-muted">{p.stack.join(" · ")}</p>
                </div>
                <p className="micro tabular col-span-10 col-start-3 text-muted md:col-span-1 md:col-start-auto md:text-right">{p.year}</p>
                <span
                  aria-hidden="true"
                  className="hidden text-right text-[length:var(--fs-lead)] transition-transform duration-700 ease-[var(--ease-out)] group-hover:-rotate-45 md:col-span-1 md:block"
                >
                  →
                </span>
                <p className="mono col-span-10 col-start-3 text-[13px] text-muted transition-colors duration-500 group-hover:text-paper md:col-span-6 md:col-start-2">
                  <span className="text-signal">[{p.metric.ref}]</span> {p.metric.text}
                </p>
              </div>
            </>
          );

          const shared = {
            className: "group block py-8 outline-offset-[-1px] md:py-10",
            "data-cursor": "view",
            "data-cursor-label": internal ? "Read" : "Repo",
            onPointerEnter: () => setActive(i),
            onFocus: () => setActive(i),
            onBlur: () => setActive(null),
          };

          return (
            <li
              key={p.slug}
              className={`relative border-t border-rule transition-opacity duration-500 ${dim ? "opacity-35" : ""}`}
              data-reveal="fade"
            >
              {internal ? (
                <TransitionLink href={`/work/${p.slug}`} cover={{ title: p.title, eyebrow: `Case study — ${String(i + 1).padStart(2, "0")}` }} {...shared}>
                  {content}
                </TransitionLink>
              ) : (
                <a href={p.repo} target="_blank" rel="noreferrer" {...shared}>
                  {content}
                  <span className="sr-only">(opens GitHub in a new tab)</span>
                </a>
              )}
            </li>
          );
        })}
      </ol>

      {fine && (
        <div
          ref={preview}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[70] -ml-[min(14vw,220px)] -mt-[min(10.5vw,165px)] w-[min(28vw,440px)]"
        >
          <div data-frame className="relative aspect-[4/3] overflow-hidden border border-rule" style={{ clipPath: "inset(50% 0 50% 0)" }}>
            {projects.map((p, i) => (
              <div key={p.slug} data-plate className="absolute inset-0" style={{ transform: `translateY(${i * 100}%)` }}>
                <Plate kind={p.plate} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
