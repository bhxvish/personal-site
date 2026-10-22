"use client";

import { useEffect, useRef } from "react";

const TOKENS = ["q", "k", "v", "∑", "softmax", "§302", "p@5", "τ", "⊕", "0.96", "mrr", "attn", "wal", "k=5", "bns"];

type Point = { x: number; y: number; ox: number; oy: number; phase: number; token?: string };

/**
 * A sparse field of tokens. The cursor acts as a query: lines are drawn to its nearest
 * keys, weighted by a softmax over distance, like a single head of attention.
 * Without a pointer the query drifts on its own. One static frame under reduced motion.
 */
export default function AttentionField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const style = getComputedStyle(document.documentElement);
    const paper = style.getPropertyValue("--color-paper").trim() || "#ece5d6";
    const signal = style.getPropertyValue("--color-signal").trim() || "#ff5b1f";
    const mono = style.getPropertyValue("--font-geist-mono").trim() || "monospace";

    let w = 0;
    let h = 0;
    let points: Point[] = [];
    const pointer = { x: 0, y: 0, active: false };
    const query = { x: 0, y: 0 };
    let raf = 0;
    let visible = true;

    // Deterministic jitter so the field doesn't reshuffle on every resize.
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      seed = 7;
      const cell = w < 640 ? 72 : 96;
      points = [];
      for (let y = cell / 2; y < h; y += cell) {
        for (let x = cell / 2; x < w; x += cell) {
          const px = x + (rand() - 0.5) * cell * 0.8;
          const py = y + (rand() - 0.5) * cell * 0.8;
          points.push({
            x: px,
            y: py,
            ox: px,
            oy: py,
            phase: rand() * Math.PI * 2,
            token: rand() < 0.14 ? TOKENS[Math.floor(rand() * TOKENS.length)] : undefined,
          });
        }
      }
      query.x = w * 0.68;
      query.y = h * 0.42;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Where the query is: the pointer if present, otherwise a slow Lissajous drift.
      const tx = pointer.active ? pointer.x : w * (0.62 + 0.22 * Math.sin(t * 0.00017));
      const ty = pointer.active ? pointer.y : h * (0.42 + 0.22 * Math.sin(t * 0.00029 + 1));
      query.x += (tx - query.x) * 0.12;
      query.y += (ty - query.y) * 0.12;

      const radius = Math.min(320, Math.max(180, w * 0.28));
      const near: { p: Point; d: number }[] = [];

      ctx.font = `10px ${mono}`;
      ctx.textBaseline = "middle";
      for (const p of points) {
        // Idle breathing plus a gentle push away from the query.
        const bx = p.ox + Math.sin(t * 0.0004 + p.phase) * 3;
        const by = p.oy + Math.cos(t * 0.0005 + p.phase) * 3;
        const dx = bx - query.x;
        const dy = by - query.y;
        const d = Math.hypot(dx, dy) || 1;
        const push = d < radius ? (1 - d / radius) * 18 : 0;
        p.x = bx + (dx / d) * push;
        p.y = by + (dy / d) * push;
        if (d < radius) near.push({ p, d });

        ctx.globalAlpha = p.token ? 0.32 : 0.22;
        ctx.fillStyle = paper;
        if (p.token) ctx.fillText(p.token, p.x + 4, p.y);
        ctx.fillRect(p.x - 0.75, p.y - 0.75, 1.5, 1.5);
      }

      near.sort((a, b) => a.d - b.d);
      const keys = near.slice(0, 7);
      if (keys.length) {
        const logits = keys.map((k) => -k.d / 70);
        const max = Math.max(...logits);
        const exps = logits.map((l) => Math.exp(l - max));
        const sum = exps.reduce((a, b) => a + b, 0);
        const weights = exps.map((e) => e / sum);

        ctx.strokeStyle = signal;
        keys.forEach((k, i) => {
          ctx.globalAlpha = 0.12 + weights[i] * 0.75;
          ctx.lineWidth = 0.5 + weights[i] * 1.6;
          ctx.beginPath();
          ctx.moveTo(query.x, query.y);
          ctx.lineTo(k.p.x, k.p.y);
          ctx.stroke();
        });

        const top = keys[0].p;
        ctx.globalAlpha = 0.9;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(top.x, top.y, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = signal;
        ctx.fillText(weights[0].toFixed(2), top.x + 9, top.y - 9);
      }

      // The query itself: a small crosshair.
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = paper;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(query.x - 6, query.y);
      ctx.lineTo(query.x + 6, query.y);
      ctx.moveTo(query.x, query.y - 6);
      ctx.lineTo(query.x, query.y + 6);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.y >= 0 && pointer.y <= rect.height;
    };
    const onLeave = () => (pointer.active = false);

    resize();
    if (reduce) {
      draw(0);
      const ro = new ResizeObserver(() => {
        resize();
        draw(0);
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
