import type { PlateKind } from "@/content/projects";

// Specimen plates: one drawn visual per project, built from the project's own idea.
// Pure SVG and deterministic (seeded), so they render identically on server and client.

const PAPER = "var(--color-paper)";
const MUTED = "var(--color-muted)";
const RULE = "var(--color-rule)";
const SIGNAL = "var(--color-signal)";
const MONO = { fontFamily: "var(--font-geist-mono)", fontSize: 9, letterSpacing: "0.06em" } as const;

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function Legal() {
  const r = rng(11);
  const lines = Array.from({ length: 13 }, (_, i) => ({ y: 92 + i * 13, w: 120 + r() * 150 }));
  const cited = new Set([2, 3, 7, 10]);
  return (
    <>
      <text x="40" y="52" fill={MUTED} style={MONO}>INDIAN PENAL CODE, 1860</text>
      <text x="40" y="76" fill={PAPER} style={{ fontFamily: "var(--font-fraunces)", fontSize: 22 }}>§ 302 — Punishment for murder</text>
      <line x1="30" y1="86" x2="30" y2="262" stroke={RULE} />
      {lines.map((l, i) => (
        <g key={i}>
          <rect x="40" y={l.y} width={l.w} height="5" fill={cited.has(i) ? SIGNAL : PAPER} opacity={cited.has(i) ? 0.85 : 0.16} />
          {cited.has(i) && (
            <text x={48 + l.w} y={l.y + 6} fill={SIGNAL} style={MONO}>
              [{[...cited].indexOf(i) + 1}]
            </text>
          )}
        </g>
      ))}
      <g transform="translate(300 96)">
        <rect width="72" height="96" fill="none" stroke={RULE} />
        {["SUPPORTED", "CITED", "SIGNED"].map((t, i) => (
          <g key={t} transform={`translate(8 ${20 + i * 28})`}>
            <circle r="3" cx="3" cy="-3" fill={SIGNAL} />
            <text x="11" y="0" fill={PAPER} style={{ ...MONO, fontSize: 7.5 }}>{t}</text>
          </g>
        ))}
      </g>
    </>
  );
}

function Lsm() {
  const levels = [
    { label: "MEMTABLE", y: 54, count: 1, w: 120 },
    { label: "L0", y: 118, count: 4, w: 58 },
    { label: "L1", y: 178, count: 2, w: 130 },
    { label: "L2", y: 236, count: 1, w: 276 },
  ];
  return (
    <>
      <text x="40" y="36" fill={MUTED} style={MONO}>WAL → MEMTABLE → SSTABLE</text>
      {levels.map((lv, li) => {
        const total = lv.count * lv.w + (lv.count - 1) * 12;
        const x0 = 88 + (276 - total) / 2;
        return (
          <g key={lv.label}>
            <text x="40" y={lv.y + 15} fill={MUTED} style={MONO}>{lv.label}</text>
            {Array.from({ length: lv.count }, (_, i) => {
              const hot = li === 1 && i === 2;
              return (
                <g key={i}>
                  <rect x={x0 + i * (lv.w + 12)} y={lv.y} width={lv.w} height="24" fill={hot ? SIGNAL : "none"} fillOpacity={hot ? 0.18 : 0} stroke={hot ? SIGNAL : PAPER} strokeOpacity={hot ? 1 : 0.4} />
                  {Array.from({ length: Math.floor(lv.w / 10) }, (_, k) => (
                    <rect key={k} x={x0 + i * (lv.w + 12) + 5 + k * 10} y={lv.y + 9} width="5" height="6" fill={hot ? SIGNAL : PAPER} opacity={hot ? 0.9 : 0.22} />
                  ))}
                </g>
              );
            })}
            {li < levels.length - 1 && (
              <path d={`M226 ${lv.y + 28}V${levels[li + 1].y - 6}`} stroke={MUTED} strokeDasharray="2 3" />
            )}
          </g>
        );
      })}
      <text x="296" y="148" fill={SIGNAL} style={MONO}>COMPACTING</text>
    </>
  );
}

function Rag() {
  const scores = [0.962, 0.71, 0.58, 0.44, 0.31, 0.22, 0.17];
  return (
    <>
      <text x="40" y="44" fill={MUTED} style={MONO}>QUERY ▸ “How do I undo a rebase?”</text>
      {scores.map((s, i) => (
        <g key={i} transform={`translate(40 ${68 + i * 26})`}>
          <text x="0" y="12" fill={i === 0 ? SIGNAL : MUTED} style={MONO}>#{String(i + 1).padStart(2, "0")}</text>
          <rect x="34" y="4" width="250" height="10" fill={PAPER} opacity="0.06" />
          <rect x="34" y="4" width={250 * s} height="10" fill={i === 0 ? SIGNAL : PAPER} opacity={i === 0 ? 0.9 : 0.3} />
          <text x="294" y="12" fill={i === 0 ? SIGNAL : PAPER} opacity={i === 0 ? 1 : 0.55} style={MONO}>{s.toFixed(3)}</text>
          {i === 4 && <line x1="-6" y1="22" x2="330" y2="22" stroke={SIGNAL} strokeDasharray="3 3" opacity="0.6" />}
        </g>
      ))}
      <text x="270" y="262" fill={SIGNAL} style={MONO}>k = 5</text>
    </>
  );
}

function Gpt() {
  const r = rng(5);
  const n = 14;
  const size = 14;
  const x0 = 108;
  const y0 = 46;
  const highlight = 9;
  return (
    <>
      <text x="40" y="36" fill={MUTED} style={MONO}>CAUSAL SELF-ATTENTION · HEAD 3</text>
      {Array.from({ length: n }, (_, row) =>
        Array.from({ length: n }, (_, col) => {
          const masked = col > row;
          const w = Math.pow(r(), 2.2) * (col === row ? 1 : 0.8);
          if (masked) return null;
          return (
            <rect
              key={`${row}-${col}`}
              x={x0 + col * (size + 1)}
              y={y0 + row * (size + 1)}
              width={size}
              height={size}
              fill={row === highlight && !masked ? SIGNAL : PAPER}
              opacity={0.08 + w * 0.8}
            />
          );
        }),
      )}
      <path d={`M${x0 + 15} ${y0}H${x0 + n * 15 - 1}V${y0 + (n - 1) * 15 - 1}Z`} fill={PAPER} opacity="0.03" />
      <text x="40" y={y0 + highlight * 15 + 10} fill={SIGNAL} style={MONO}>t = 9 ▸</text>
      <text x={x0 + 9 * 15} y={y0 + 4 * 15} fill={MUTED} style={MONO}>−∞</text>
    </>
  );
}

function Turbofan() {
  const r = rng(3);
  const traces = Array.from({ length: 4 }, (_, k) => {
    const pts: string[] = [];
    let v = 0;
    for (let i = 0; i <= 60; i++) {
      v += (r() - 0.5) * 3;
      const x = 40 + i * 5.3;
      const decay = i > 44 ? Math.pow((i - 44) / 16, 2) * 38 : 0;
      pts.push(`${x.toFixed(1)},${(84 + k * 44 + v - decay).toFixed(1)}`);
    }
    return pts.join(" ");
  });
  return (
    <>
      <text x="40" y="36" fill={MUTED} style={MONO}>C-MAPSS FD001 · UNIT 20</text>
      <rect x="273" y="46" width="85" height="214" fill={SIGNAL} opacity="0.1" />
      <line x1="273" y1="46" x2="273" y2="260" stroke={SIGNAL} strokeDasharray="3 3" />
      <text x="279" y="60" fill={SIGNAL} style={MONO}>RUL ≤ 30</text>
      {traces.map((p, k) => (
        <polyline key={k} points={p} fill="none" stroke={k === 0 ? SIGNAL : PAPER} strokeOpacity={k === 0 ? 1 : 0.45} strokeWidth="1.1" />
      ))}
      {["s11", "s9", "s12", "s7"].map((s, k) => (
        <text key={s} x="12" y={88 + k * 44} fill={k === 0 ? SIGNAL : MUTED} style={MONO}>{s}</text>
      ))}
    </>
  );
}

function Agent() {
  const msgs = [
    { side: "l", text: "Can I book a PT session Friday 7am?", y: 52 },
    { side: "tool", text: "check_availability(fri, 07:00, pt)", y: 98 },
    { side: "tool", text: "book_appointment(…)", y: 128 },
    { side: "r", text: "Booked: Friday 7:00 with Arjun.", y: 168 },
    { side: "l", text: "Also, can I get a refund?", y: 214 },
    { side: "tool", text: "escalate_to_human(refund)", y: 254 },
  ];
  return (
    <>
      {msgs.map((m, i) => {
        if (m.side === "tool") {
          return (
            <g key={i} transform={`translate(110 ${m.y - 14})`}>
              <rect width={m.text.length * 6 + 18} height="20" rx="10" fill="none" stroke={SIGNAL} />
              <text x="9" y="13.5" fill={SIGNAL} style={MONO}>{m.text}</text>
            </g>
          );
        }
        const w = m.text.length * 6.1 + 24;
        const x = m.side === "l" ? 40 : 360 - w;
        return (
          <g key={i} transform={`translate(${x} ${m.y - 18})`}>
            <rect width={w} height="28" fill={m.side === "l" ? PAPER : "none"} fillOpacity={m.side === "l" ? 0.08 : 0} stroke={PAPER} strokeOpacity={m.side === "l" ? 0 : 0.4} />
            <text x="12" y="18" fill={PAPER} style={{ ...MONO, fontSize: 9.5, letterSpacing: 0 }}>{m.text}</text>
          </g>
        );
      })}
      <line x1="100" y1="80" x2="100" y2="262" stroke={RULE} />
    </>
  );
}

const PLATES: Record<PlateKind, () => React.JSX.Element> = {
  legal: Legal,
  lsm: Lsm,
  rag: Rag,
  gpt: Gpt,
  turbofan: Turbofan,
  agent: Agent,
};

export default function Plate({ kind, label, className }: { kind: PlateKind; label?: string; className?: string }) {
  const Body = PLATES[kind];
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid meet"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`block h-full w-full bg-surface ${className ?? ""}`}
    >
      <Body />
      <text x="388" y="290" textAnchor="end" fill={MUTED} style={{ ...MONO, fontSize: 7 }}>
        FIG. — {kind.toUpperCase()}
      </text>
    </svg>
  );
}
