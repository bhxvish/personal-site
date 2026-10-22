"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { DUR, gsap, prefersReducedMotion, ScrollTrigger, STAGGER } from "@/lib/gsap";

/**
 * Finds every [data-reveal] element on the page and plays it once when it scrolls in.
 *   words → masked word rise   fade → opacity + lift
 *   clip  → bottom-up clip-path   rule → line draws from the left
 * Add data-reveal-delay="0.2" for an offset.
 */
export default function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const type = el.dataset.reveal;
        const delay = Number(el.dataset.revealDelay ?? 0);
        const scrollTrigger = { trigger: el, start: "top 90%", once: true };

        if (type === "words") {
          gsap.to(el.querySelectorAll(".w > span"), {
            y: 0,
            duration: DUR.slow,
            stagger: STAGGER * 0.6,
            delay,
            scrollTrigger,
          });
        } else if (type === "fade") {
          gsap.to(el, { opacity: 1, y: 0, duration: DUR.base, delay, scrollTrigger });
        } else if (type === "clip") {
          gsap.to(el, { clipPath: "inset(0% 0 0 0)", duration: DUR.slow, delay, scrollTrigger });
        } else if (type === "rule") {
          gsap.to(el, { scaleX: 1, duration: DUR.slow, delay, scrollTrigger });
        }
      });
    });

    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(id);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
