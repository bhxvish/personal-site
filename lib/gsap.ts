import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// The whole site moves on two curves. Keep these in sync with --ease-* in globals.css.
export const EASE = {
  out: "site.out",
  inOut: "site.inOut",
} as const;

export const DUR = { fast: 0.6, base: 0.9, slow: 1.2 } as const;
export const STAGGER = 0.06;

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create(EASE.out, "0.22,1,0.36,1");
  CustomEase.create(EASE.inOut, "0.65,0,0.35,1");
  gsap.defaults({ ease: EASE.out, duration: DUR.base });
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export { gsap, ScrollTrigger };
