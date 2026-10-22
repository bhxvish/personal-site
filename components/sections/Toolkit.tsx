"use client";

import { useState } from "react";
import SectionHead from "@/components/sections/SectionHead";
import { toolkit, type Tool } from "@/content/toolkit";

function Row({
  tools,
  variant,
  onHover,
}: {
  tools: Tool[];
  variant: "display" | "mono";
  onHover: (t: Tool | null) => void;
}) {
  const big = variant === "display";
  const item = (t: Tool, i: number, copy: boolean) => (
    <li
      key={`${copy ? "c" : ""}${t.name}`}
      tabIndex={copy ? -1 : 0}
      aria-hidden={copy || undefined}
      onPointerEnter={() => onHover(t)}
      onFocus={() => onHover(t)}
      onBlur={() => onHover(null)}
      className={`flex shrink-0 items-center outline-offset-[-2px] transition-colors duration-500 hover:text-signal focus-visible:text-signal ${
        big
          ? "display gap-[0.4em] px-[0.4em] text-[clamp(3rem,1.6rem+6vw,9rem)] leading-[1.05] tracking-[-0.04em] even:italic even:font-[family-name:var(--font-fraunces-italic)]"
          : "micro gap-6 px-6 py-1 text-[clamp(0.75rem,0.7rem+0.3vw,1rem)] text-muted"
      }`}
    >
      {t.name}
      <span aria-hidden="true" className={big ? "text-[0.3em] text-faint" : "text-faint"}>
        {big ? "●" : "/"}
      </span>
    </li>
  );

  return (
    <div className="marquee-wrap overflow-hidden" onPointerLeave={() => onHover(null)}>
      <ul
        className="marquee"
        style={{ ["--marquee-dur" as string]: big ? "60s" : "44s", ["--marquee-dir" as string]: big ? "normal" : "reverse" }}
      >
        {tools.map((t, i) => item(t, i, false))}
        {/* Second copy makes the loop seamless; hidden from assistive tech. */}
        {tools.map((t, i) => item(t, i, true))}
      </ul>
    </div>
  );
}

export default function Toolkit() {
  const [hovered, setHovered] = useState<Tool | null>(null);

  return (
    <section id="toolkit" data-section="Toolkit" data-index="04" className="section" aria-labelledby="toolkit-title">
      <div className="shell">
        <SectionHead index="04" name="Toolkit" aside="Hover a tool to see where it earned its place" />
        <h2 id="toolkit-title" className="sr-only">
          Toolkit
        </h2>
      </div>

      <div className="space-y-4 border-y border-rule py-6" data-reveal="fade">
        <Row tools={toolkit.primary} variant="display" onHover={setHovered} />
        <div className="rule" />
        <Row tools={toolkit.secondary} variant="mono" onHover={setHovered} />
      </div>

      <div className="shell grid-12 mt-6 min-h-[3.5em]">
        <p className="micro col-span-12 text-muted md:col-span-8" aria-live="polite">
          {hovered ? (
            <>
              <span className="text-signal">{hovered.name}</span> — used in {hovered.usedIn.join(", ")}
            </>
          ) : (
            "Python first. Then whatever the problem asks for."
          )}
        </p>
      </div>
    </section>
  );
}
