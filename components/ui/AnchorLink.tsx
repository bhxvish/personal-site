"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { TransitionLink } from "@/components/layout/PageTransition";
import { scrollToTarget, useLenis } from "@/components/layout/SmoothScroll";

/**
 * Links to a section of the home page ("/#work"). On the home page it smooth-scrolls;
 * elsewhere it plays the page transition and lands on the section.
 */
export default function AnchorLink({
  hash,
  onClick,
  ...rest
}: Omit<ComponentProps<"a">, "href"> & { hash: string }) {
  const pathname = usePathname();
  const lenis = useLenis();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (pathname !== "/" || e.defaultPrevented) return;
    e.preventDefault();
    scrollToTarget(lenis, hash === "top" ? 0 : `#${hash}`);
    history.replaceState(null, "", hash === "top" ? "/" : `#${hash}`);
  };

  return (
    <TransitionLink
      href={hash === "top" ? "/" : `/#${hash}`}
      cover={{ title: "Bhavish", eyebrow: "Index" }}
      onClick={handle}
      scroll={false}
      {...rest}
    />
  );
}
