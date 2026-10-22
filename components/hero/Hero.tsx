"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import AttentionField from "@/components/hero/AttentionField";
import AnchorLink from "@/components/ui/AnchorLink";
import CopyEmail from "@/components/ui/CopyEmail";
import Magnetic from "@/components/ui/Magnetic";
import { references } from "@/content/references";
import { site } from "@/content/site";
import { DUR, EASE, gsap, prefersReducedMotion } from "@/lib/gsap";
import { onReveal } from "@/lib/intro";

// The evidence behind citation [1]. Values count from the baseline to the result.
const EVIDENCE = [
  { measure: "Right section, statute questions", alone: "41–81%", from: 41, to: 98, suffix: "–100%" },
  { measure: "Wrong punishments stated", alone: "15–54%", from: 54, to: 0, suffix: "%" },
  { measure: "Civil questions answered as crimes", alone: "14–27/30", from: 27, to: 0, suffix: "/30" },
];

const STAGGER_ROWS = 0.08;

const { statement } = site;
const statementHtml = `${statement.before} <em class="serif-em">${statement.em}</em> ${statement.after}`;

// Wraps each word in a clipping mask, keeping the emphasised word in italic.
const masked = (text: string, em = false) =>
  text
    .split(" ")
    .map((w) => `<span class="w">${em ? `<em class="hero-word serif-em">${w}</em>` : `<span class="hero-word">${w}</span>`}</span>`)
    .join(" ");

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [resolved, setResolved] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  const resolve = useCallback(() => setResolved(true), []);

  // Kinetic intro: name rises letter by letter, then the statement word by word.
  useEffect(() => {
    if (prefersReducedMotion()) {
      setIntroDone(true);
      return;
    }
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    const off = onReveal(async () => {
      const line = root.current?.querySelector<HTMLElement>(".hero-line");
      const words = root.current?.querySelector<HTMLElement>(".hero-statement");
      await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]);
      if (cancelled || !line || !words) return;
      // Split only once the web fonts are in, so the swap can't shift each letter or word.
      line.innerHTML = [...site.name].map((ch) => `<span class="hero-char inline-block">${ch}</span>`).join("");
      line.style.transform = "none";
      words.innerHTML = `${masked(statement.before)} ${masked(statement.em, true)} ${masked(statement.after)}`;
      words.parentElement?.classList.remove("hero-pending");
      ctx = gsap.context(() => {
        gsap
          .timeline({ onComplete: () => setIntroDone(true) })
          .fromTo(".hero-char", { yPercent: 108, y: 0 }, { yPercent: 0, y: 0, duration: 1.3, stagger: 0.05 }, 0)
          .fromTo(".hero-fade", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: DUR.base, stagger: 0.06 }, 0.35)
          .fromTo(".hero-word", { yPercent: 112, y: 0 }, { yPercent: 0, y: 0, duration: 1.1, stagger: 0.03 }, 0.5)
          .fromTo("[data-hero-cite]", { scale: 0 }, { scale: 1, duration: DUR.fast }, 1.25);
      }, root);
    });
    return () => {
      cancelled = true;
      off();
      ctx?.revert();
    };
  }, []);

  // On wide screens the citation also resolves on first scroll, or after a short pause.
  useEffect(() => {
    if (resolved || !introDone || !matchMedia("(min-width: 1024px)").matches) return;
    const onScroll = () => window.scrollY > 24 && resolve();
    const idle = window.setTimeout(resolve, 1600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
    };
  }, [resolved, introDone, resolve]);

  // Draw the leader line from the marker to the evidence card.
  useIsoLayoutEffect(() => {
    const measure = () => {
      if (!stage.current || !marker.current || !card.current || !path.current) return;
      const s = stage.current.getBoundingClientRect();
      const m = marker.current.getBoundingClientRect();
      const c = card.current.getBoundingClientRect();
      const x1 = m.right - s.left + 4;
      const y1 = m.top + m.height / 2 - s.top;
      const x2 = c.left - s.left;
      // Meet the card level with the marker when it can, otherwise at its nearest edge.
      const y2 = Math.min(Math.max(y1, c.top - s.top + 24), c.bottom - s.top - 24);
      const xm = x1 + (x2 - x1) * 0.55;
      path.current.setAttribute("d", `M${x1} ${y1}H${xm}V${y2}H${x2}`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stage.current) ro.observe(stage.current);
    return () => ro.disconnect();
  }, []);

  // The signature moment: the citation resolves into its evidence.
  useEffect(() => {
    if (!resolved || !card.current) return;
    const el = card.current;
    const counts = el.querySelectorAll<HTMLElement>("[data-count]");

    if (prefersReducedMotion()) {
      gsap.set(el, { clipPath: "inset(0% 0 0 0)" });
      gsap.set(path.current, { strokeDashoffset: 0 });
      return;
    }

    const tl = gsap.timeline();
    tl.to(path.current, { strokeDashoffset: 0, duration: 0.8, ease: EASE.inOut })
      .to(el, { clipPath: "inset(0% 0 0 0)", duration: DUR.base }, 0.55)
      .fromTo(el.querySelectorAll("[data-row]"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: STAGGER_ROWS, duration: DUR.fast }, 0.8);
    counts.forEach((node, i) => {
      const { from, to, suffix } = EVIDENCE[i];
      const v = { n: from };
      tl.to(
        v,
        {
          n: to,
          duration: 1.4,
          ease: EASE.inOut,
          onUpdate: () => (node.textContent = `${Math.round(v.n)}${suffix}`),
        },
        0.9 + i * 0.12,
      );
    });
    return () => {
      tl.kill();
    };
  }, [resolved]);

  const ref = references.find((r) => r.n === statement.cite)!;

  return (
    <section
      ref={root}
      id="top"
      data-section="Index"
      data-index="01"
      className="relative flex flex-col overflow-hidden pb-16 md:pb-24 lg:min-h-[100svh] lg:pb-[clamp(24px,5vw,72px)] pt-[calc(var(--nav-h)+clamp(24px,6vh,72px))]"
    >
      <AttentionField />

      <div className="shell pointer-events-none relative flex flex-1 flex-col [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <div className="grid-12 micro hero-fade mb-3 text-muted">
          <p className="col-span-6 lg:col-span-4">(01) Index</p>
          <p className="hidden lg:col-span-4 lg:block">{site.role} — RAG, evals, LLM systems</p>
          <p className="col-span-6 text-right lg:col-span-4">{site.coordinates}</p>
        </div>
        <div className="rule hero-fade" />

        <h1 className="display -ml-[0.055em] mt-[0.06em] text-[length:var(--fs-hero)] leading-[0.8]">
          <span className="sr-only">{site.name}</span>
          <span aria-hidden="true" className="block overflow-clip whitespace-nowrap pb-[0.06em] pt-[0.04em]">
            {/* Plain text until the reveal splits it into .hero-char spans. */}
            <span className="hero-line block" dangerouslySetInnerHTML={{ __html: site.name }} />
          </span>
        </h1>

        <div ref={stage} className="grid-12 relative mt-[clamp(32px,6vh,80px)] items-start gap-y-10">
          <dl className="col-span-12 grid grid-cols-3 gap-x-[var(--gutter)] md:col-span-4 md:grid-cols-1 md:gap-y-4 lg:col-span-3">
            {site.meta.map((m) => (
              <div key={m.label} className="hero-fade">
                <dt className="micro text-muted">{m.label}</dt>
                <dd className="mono mt-1 text-[13px] leading-snug text-paper md:text-[length:var(--fs-small)]">{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className="col-span-12 md:col-span-8 lg:col-span-4 lg:col-start-5">
            <p className="hero-pending lead max-w-[30rem] text-paper">
              {/* Plain text until the reveal splits it into masked words (see splitStatement). */}
              <span className="hero-statement" dangerouslySetInnerHTML={{ __html: statementHtml }} />{" "}
              <button
                ref={marker}
                type="button"
                data-hero-cite
                onClick={() => setResolved((v) => (matchMedia("(min-width: 1024px)").matches ? true : !v))}
                aria-expanded={resolved}
                aria-controls="hero-evidence"
                aria-label={`Citation ${statement.cite}: show the evidence`}
                className={`cite ${resolved ? "" : "pulse"}`}
              >
                [{statement.cite}]
              </button>
            </p>

            <div className="hero-fade mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Magnetic>
                <AnchorLink
                  hash="work"
                  className="group inline-flex items-center gap-4 rounded-full bg-paper px-6 py-4 text-ink transition-colors duration-500 hover:bg-signal"
                >
                  <span className="micro">See the work</span>
                  <span aria-hidden="true" className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-0.5">
                    ↓
                  </span>
                </AnchorLink>
              </Magnetic>
              <CopyEmail className="mono text-muted hover:text-paper">
                <span className="ulink">Copy email</span>
              </CopyEmail>
            </div>
          </div>

          <aside
            ref={card}
            id="hero-evidence"
            aria-label={`Citation ${ref.n}: ${ref.title}`}
            className={`${resolved ? "block" : "hidden"} col-span-12 border border-rule bg-surface/85 p-4 backdrop-blur-md md:col-span-8 md:col-start-5 lg:absolute lg:bottom-0 lg:right-0 lg:block lg:w-[31%] lg:min-w-[320px] lg:max-w-[460px]`}
            style={{ clipPath: "inset(0 0 100% 0)" }}
          >
            <div className="micro flex items-center justify-between">
              <span className="text-signal">[{ref.n}] Evidence</span>
              <a href={ref.href} target="_blank" rel="noreferrer" className="ulink text-muted hover:text-paper">
                Source ↗
              </a>
            </div>
            <p className="mono mt-3 text-paper">{ref.title}</p>
            <table className="mono mt-4 w-full text-[12px] leading-snug">
              <thead>
                <tr className="micro text-muted">
                  <th className="pb-2 text-left font-normal">Measure</th>
                  <th className="pb-2 text-right font-normal">Alone</th>
                  <th className="pb-2 text-right font-normal">Ours</th>
                </tr>
              </thead>
              <tbody>
                {EVIDENCE.map((row) => (
                  <tr key={row.measure} data-row className="border-t border-rule align-top">
                    <td className="py-2 pr-2 text-paper/85">{row.measure}</td>
                    <td className="tabular whitespace-nowrap py-2 text-right text-muted line-through decoration-faint">{row.alone}</td>
                    <td data-count className="tabular whitespace-nowrap py-2 pl-3 text-right text-signal">
                      {row.to}
                      {row.suffix}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[12px] leading-snug text-muted">{ref.detail}</p>
          </aside>

          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block">
            <path
              ref={path}
              fill="none"
              stroke="var(--color-signal)"
              strokeWidth="1"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

