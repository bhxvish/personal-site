"use client";

import { useEffect, useRef } from "react";
import { gsap, hasFinePointer } from "@/lib/gsap";

const LABELS: Record<string, string> = { view: "View", copy: "Copy" };

/**
 * Dot + trailing ring. State comes from the nearest [data-cursor] ancestor
 * ("link" | "view" | "copy"); plain links and buttons get "link".
 */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || !root.current) return;
    const el = root.current;
    document.documentElement.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });

    let state = "";
    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      delete el.dataset.hidden;
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.("[data-cursor], a, button");
      const next = target ? target.getAttribute("data-cursor") ?? "link" : "";
      if (next === state) return;
      state = next;
      el.dataset.state = next;
      if (label.current) {
        label.current.textContent = target?.getAttribute("data-cursor-label") ?? LABELS[next] ?? "";
      }
    };
    const hide = () => (el.dataset.hidden = "");
    const down = () => (el.dataset.down = "");
    const up = () => delete el.dataset.down;

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div ref={root} className="cursor" aria-hidden="true" data-hidden="">
      <div ref={ring} className="cursor-ring">
        <div className="cursor-ring-inner" />
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
