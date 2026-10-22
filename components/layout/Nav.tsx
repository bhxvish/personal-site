"use client";

import { useEffect, useRef } from "react";
import AnchorLink from "@/components/ui/AnchorLink";
import LocalTime from "@/components/ui/LocalTime";
import Mark from "@/components/ui/Mark";
import { site } from "@/content/site";

const LINKS = [
  { hash: "work", label: "Work" },
  { hash: "about", label: "About" },
  { hash: "contact", label: "Contact" },
];

/** Fixed top bar. Slides away while scrolling down, returns on the way up. */
export default function Nav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const el = ref.current;
      if (!el) return;
      const hide = y > last && y > 160;
      el.style.transform = hide ? "translateY(-110%)" : "";
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-[100] shell transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)]"
    >
      <nav aria-label="Primary" className="grid-12 h-[var(--nav-h)] items-center">
        <AnchorLink
          hash="top"
          className="col-span-6 flex items-center gap-3 md:col-span-3"
          aria-label={`${site.name} — back to top`}
        >
          <Mark className="h-[22px] w-auto text-paper" />
          <span className="micro">{site.name}</span>
        </AnchorLink>

        <p className="micro hidden text-muted md:col-span-4 md:block">
          {site.role} — <LocalTime seconds={false} />
        </p>

        <ul className="col-span-6 flex justify-end gap-5 md:col-span-5 md:gap-8">
          {LINKS.map((l) => (
            <li key={l.hash}>
              <AnchorLink hash={l.hash} className="micro ulink">
                {l.label}
              </AnchorLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
