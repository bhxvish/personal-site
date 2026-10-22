// The monogram: a constructed "B" with its citation dot.
export default function Mark({ className, draw = false }: { className?: string; draw?: boolean }) {
  return (
    <svg viewBox="0 0 104 124" className={className} aria-hidden="true" fill="none">
      <g
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={draw ? "mark-stroke" : undefined}
      >
        <path d="M18 8V116" pathLength={draw ? 1 : undefined} />
        <path d="M18 8H50C68 8 78 19 78 34C78 49 68 60 50 60H18" pathLength={draw ? 1 : undefined} />
        <path d="M18 60H56C76 60 86 72 86 88C86 104 75 116 55 116H18" pathLength={draw ? 1 : undefined} />
      </g>
      <circle cx="94" cy="12" r="7" fill="var(--color-signal)" className={draw ? "mark-dot" : undefined} />
    </svg>
  );
}
