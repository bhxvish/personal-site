// Coordinates the first-visit preloader with the hero reveal.
// The inline script in app/layout.tsx adds `.intro` to <html> when the preloader should run.

export const INTRO_KEY = "bh:intro";
export const REVEAL_EVENT = "bh:reveal";

export const introInlineScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var seen=localStorage.getItem('${INTRO_KEY}');var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!seen&&!rm&&location.pathname==='/')d.classList.add('intro')}catch(e){}})();`;

export const isIntroRunning = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("intro");

/** Runs `fn` once the hero is allowed to reveal: now, or when the preloader hands over. */
export function onReveal(fn: () => void) {
  if (!isIntroRunning()) {
    fn();
    return () => {};
  }
  window.addEventListener(REVEAL_EVENT, fn, { once: true });
  return () => window.removeEventListener(REVEAL_EVENT, fn);
}
