"use client";

import { useEffect, useRef } from "react";

// TODO: replace with a real photo. Drop it at /public/portrait.jpg and swap this for:
//   <Image src="/portrait.jpg" alt="Bhavish" fill sizes="(min-width: 1024px) 33vw, 90vw" className="object-cover grayscale" />
// Until then: a halftone dot field that resolves into the monogram, drawn on a canvas
// so ~1,400 dots don't end up in the HTML.

function inB(x: number, y: number) {
  // Normalised 0..1 coordinates; a rough "B" made of a stem and two bowls.
  const stem = x > 0.26 && x < 0.38 && y > 0.18 && y < 0.82;
  const bowl = (cx: number, cy: number, rx: number, ry: number, t: number) => {
    const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
    return d < 1 && d > 1 - t && x > 0.32;
  };
  return stem || bowl(0.42, 0.335, 0.24, 0.155, 0.42) || bowl(0.44, 0.655, 0.28, 0.165, 0.4);
}

export default function Portrait() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const style = getComputedStyle(document.documentElement);
    const paper = style.getPropertyValue("--color-paper").trim();
    const signal = style.getPropertyValue("--color-signal").trim();

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform((width / 400) * dpr, 0, 0, (height / 500) * dpr, 0, 0);
      ctx.clearRect(0, 0, 400, 500);

      const cols = 34;
      const rows = 42;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = (i + 0.5) / cols;
          const y = (j + 0.5) / rows;
          const hit = inB(x, y);
          const glow = 1 - Math.min(1, Math.hypot(x - 0.5, y - 0.48) * 1.5);
          const hot = hit && i % 9 === 4 && j % 7 === 2;
          ctx.globalAlpha = hot ? 1 : hit ? 0.92 : 0.28;
          ctx.fillStyle = hot ? signal : paper;
          ctx.beginPath();
          ctx.arc(x * 400, y * 500, hit ? 4.4 : 0.6 + glow * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    // Draw only once it's near the viewport, then keep it sharp on resize.
    const ro = new ResizeObserver(draw);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        ro.observe(canvas);
      },
      { rootMargin: "50%" },
    );
    io.observe(canvas);
    return () => {
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Placeholder portrait: the letter B drawn as a field of dots"
      className="block h-full w-full bg-surface"
    />
  );
}
