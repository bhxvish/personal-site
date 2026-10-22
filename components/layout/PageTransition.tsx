"use client";

import { useAnimate } from "framer-motion/mini";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { prefersReducedMotion } from "@/lib/gsap";

const EASE = [0.65, 0, 0.35, 1] as const;

type Cover = { title: string; eyebrow: string };
type Navigate = (href: string, cover?: Cover) => void;

const TransitionContext = createContext<Navigate | null>(null);

/**
 * Route transitions: a paper curtain rises over the page carrying the destination's
 * title, the route changes underneath it, then it lifts away.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [cover, setCover] = useState<Cover>({ title: "", eyebrow: "" });
  const pending = useRef<string | null>(null);
  const busy = useRef(false);

  const navigate = useCallback<Navigate>(
    async (href, next) => {
      if (busy.current) return;
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      busy.current = true;
      setCover(next ?? { title: "Bhavish", eyebrow: "Index" });
      router.prefetch(href);
      const el = scope.current;
      el.style.visibility = "visible";
      await animate(el, { clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"] }, { duration: 0.75, ease: EASE });
      await animate("[data-curtain-text]", { y: ["40%", "0%"], opacity: [0, 1] }, { duration: 0.5, ease: EASE });
      pending.current = href;
      router.push(href);
    },
    [animate, router, scope],
  );

  useEffect(() => {
    if (!pending.current) return;
    pending.current = null;
    const el = scope.current;
    (async () => {
      await animate(el, { clipPath: ["inset(0 0 0% 0)", "inset(0 0 100% 0)"] }, { duration: 0.85, ease: EASE, delay: 0.15 });
      el.style.visibility = "hidden";
      busy.current = false;
    })();
  }, [pathname, animate, scope]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        ref={scope}
        aria-hidden="true"
        className="fixed inset-0 z-[120] flex flex-col justify-end bg-paper text-ink shell pb-[var(--margin)]"
        style={{ visibility: "hidden", clipPath: "inset(100% 0 0 0)" }}
      >
        <div data-curtain-text className="opacity-0">
          <p className="micro mb-4">{cover.eyebrow}</p>
          <p className="display text-[length:var(--fs-h2)]">{cover.title}</p>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

/** An internal link that plays the curtain. Modified clicks fall through to the browser. */
export function TransitionLink({
  href,
  cover,
  onClick,
  ...rest
}: Omit<ComponentProps<typeof NextLink>, "href"> & { href: string; cover?: Cover }) {
  const navigate = useContext(TransitionContext);
  const pathname = usePathname();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !navigate) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const [path, hash] = href.split("#");
    if (path === pathname || (path === "" && hash)) return; // same-page anchors are handled elsewhere
    e.preventDefault();
    navigate(href, cover);
  };

  return <NextLink href={href} onClick={handle} {...rest} />;
}
