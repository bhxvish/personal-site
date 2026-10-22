"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { REVEAL_EVENT, isIntroRunning } from "@/lib/intro";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/** Smooth-scrolls to a selector or offset, falling back to native scrolling. */
export function scrollToTarget(lenis: Lenis | null, target: string | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target });
  else document.querySelector(target)?.scrollIntoView();
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const start = () => instance.start();
    if (isIntroRunning()) {
      instance.stop();
      window.addEventListener(REVEAL_EVENT, start, { once: true });
    }

    setLenis(instance);
    return () => {
      window.removeEventListener(REVEAL_EVENT, start);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // New route: start at the top (or at the hash), then let ScrollTrigger re-measure.
  useEffect(() => {
    const hash = window.location.hash;
    const el = hash ? document.querySelector(hash) : null;
    if (el) {
      lenis?.scrollTo(el as HTMLElement, { immediate: true, force: true });
    } else {
      lenis?.scrollTo(0, { immediate: true, force: true });
    }
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
