"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * The instrument readout in the bottom-right corner: current section and scroll
 * position as a probability, plus a hairline progress track on the right edge.
 * Writes straight to the DOM so scrolling never re-renders React.
 */
export default function MarginRail() {
  const pathname = usePathname();
  const section = useRef<HTMLSpanElement>(null);
  const prob = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (prob.current) prob.current.textContent = p.toFixed(2);
      if (bar.current) bar.current.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const sections = document.querySelectorAll<HTMLElement>("[data-section]");
    const total = String(sections.length).padStart(2, "0");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || !section.current) continue;
          const el = entry.target as HTMLElement;
          section.current.textContent = `${el.dataset.index} / ${total} — ${el.dataset.section}`;
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
    };
  }, [pathname]);

  return (
    <aside aria-hidden="true" className="pointer-events-none fixed inset-y-0 right-0 z-[80] hidden md:block">
      <div className="absolute right-[calc(var(--margin)/2)] top-[calc(var(--nav-h)+24px)] bottom-28 w-px bg-rule">
        <div ref={bar} className="h-full w-full origin-top bg-signal" style={{ transform: "scaleY(0)" }} />
      </div>
      <div className="micro absolute bottom-[var(--margin)] right-[var(--margin)] whitespace-nowrap text-right text-muted">
        <span ref={section} className="block text-paper">
          01 — Index
        </span>
        <span className="tabular">
          p = <span ref={prob}>0.00</span>
        </span>
      </div>
    </aside>
  );
}
