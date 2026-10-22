"use client";

import { useEffect, useRef } from "react";
import Mark from "@/components/ui/Mark";
import { site } from "@/content/site";
import { INTRO_KEY, REVEAL_EVENT, isIntroRunning } from "@/lib/intro";
import { EASE, gsap } from "@/lib/gsap";

/**
 * First-visit intro (~2.1s): the monogram draws itself while a counter calibrates
 * 0.00 → 1.00, then the panel lifts and hands over to the hero. Click, tap or any key skips.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !isIntroRunning()) return;

    const counter = el.querySelector<HTMLElement>("[data-counter]");
    const value = { p: 0 };
    const finish = () => {
      try {
        localStorage.setItem(INTRO_KEY, "1");
      } catch {}
      document.documentElement.classList.remove("intro");
    };

    const tl = gsap.timeline({ onComplete: finish });
    tl.set(el.querySelectorAll(".mark-stroke path"), { strokeDasharray: 1, strokeDashoffset: 1 })
      .set(el.querySelector(".mark-dot"), { scale: 0, transformOrigin: "center" })
      .to(el.querySelectorAll(".mark-stroke path"), { strokeDashoffset: 0, duration: 1.1, stagger: 0.14, ease: EASE.inOut }, 0)
      .to(value, {
        p: 1,
        duration: 1.35,
        ease: EASE.inOut,
        onUpdate: () => {
          if (counter) counter.textContent = value.p.toFixed(2);
        },
      }, 0)
      .to(el.querySelector(".mark-dot"), { scale: 1, duration: 0.5 }, 1.15)
      .addLabel("exit", 1.55)
      .call(() => window.dispatchEvent(new Event(REVEAL_EVENT)), [], "exit")
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: EASE.inOut }, "exit")
      .to(el.querySelector("[data-inner]"), { yPercent: -18, duration: 0.9, ease: EASE.inOut }, "exit");

    const skip = () => {
      if (tl.time() < tl.labels.exit) tl.seek("exit");
    };
    window.addEventListener("keydown", skip);
    el.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      el.removeEventListener("pointerdown", skip);
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[140] bg-ink"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div data-inner className="shell flex w-full flex-col justify-between py-[var(--margin)]">
        <div className="micro flex justify-between text-muted">
          <span>{site.name} — Index</span>
          <span>{site.location}</span>
        </div>
        <Mark draw className="mx-auto h-[clamp(96px,16vw,180px)] w-auto text-paper" />
        <div className="flex items-end justify-between">
          <button type="button" className="micro ulink text-muted" onClick={() => window.dispatchEvent(new KeyboardEvent("keydown"))}>
            Skip intro
          </button>
          <p className="mono tabular text-right text-muted" aria-hidden="true">
            <span className="micro block">calibrating</span>
            <span className="display block text-[clamp(3rem,8vw,7rem)] text-paper">
              p = <span data-counter className="inline-block w-[2.3em] text-left">0.00</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
