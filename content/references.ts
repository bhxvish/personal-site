// Every [n] citation on the site resolves to one of these.
// Numbers are taken from each repository's README / BENCHMARKS file.

export type Reference = { n: number; title: string; detail: string; href: string };

export const references: Reference[] = [
  {
    n: 1,
    title: "LegalGPT — held-out evaluation",
    detail: "Same model with and without the pipeline, 3 models, p ≤ 0.002.",
    href: "https://github.com/bhxvish/legalgpt#results",
  },
  {
    n: 2,
    title: "LegalGPT — prompt-injection suite",
    detail: "24 attack files; 1/24 succeed without the defences, 0/24 with them.",
    href: "https://github.com/bhxvish/legalgpt#results",
  },
  {
    n: 3,
    title: "lsm-kv — BENCHMARKS.md",
    detail: "Read p50/p99 vs. a naive single-file linear scan; write amplification.",
    href: "https://github.com/bhxvish/lsm-kv/blob/main/BENCHMARKS.md",
  },
  {
    n: 4,
    title: "rag-eval-observability — results",
    detail: "32-question eval set (26 answerable, 6 unanswerable), k = 5.",
    href: "https://github.com/bhxvish/rag-eval-observability#results",
  },
  {
    n: 5,
    title: "gpt-from-scratch — training run",
    detail: "384-dim, 6-head, 6-layer decoder, 5,000 steps on Tiny Shakespeare.",
    href: "https://github.com/bhxvish/gpt-from-scratch",
  },
  {
    n: 6,
    title: "turbofan-predictive-maintenance — results",
    detail: "NASA C-MAPSS FD001 held-out split, 13,096 rows, 2.5% positive.",
    href: "https://github.com/bhxvish/turbofan-predictive-maintenance",
  },
  {
    n: 7,
    title: "AI Front Desk Agent — prompt history",
    detail: "prompts/v1.md → v3.md, each version's changes documented.",
    href: "https://github.com/bhxvish/AI-Front-Desk-Agent",
  },
];

export const refHref = (n: number) => `#ref-${n}`;
