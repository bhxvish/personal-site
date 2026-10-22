// Add a project by appending an object. Give it a `caseStudy` to get a /work/[slug] page;
// without one, the row links straight to the repository.

export type PlateKind = "legal" | "lsm" | "rag" | "gpt" | "turbofan" | "agent";

export type CaseStudy = {
  overview: string;
  problem: string[];
  approach: { title: string; body: string }[];
  results: {
    caption: string;
    columns: [string, string, string];
    rows: [string, string, string][];
    note?: string;
  };
  decisions: { title: string; body: string }[];
  next: string[];
};

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  role: string;
  year: string;
  stack: string[];
  summary: string;
  repo: string;
  live?: string;
  metric: { text: string; ref: number };
  plate: PlateKind;
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "legalgpt",
    title: "LegalGPT",
    kicker: "Cited, verified answers over Indian criminal law",
    role: "Solo — research & engineering",
    year: "2026",
    stack: ["RAG", "InLegalBERT", "Prolog", "Groq · Gemini"],
    summary:
      "Ask about an offence in English or Hindi and get an answer written only from the IPC or BNS. Every claim is cited, checked sentence by sentence and signed.",
    repo: "https://github.com/bhxvish/legalgpt",
    metric: { text: "0 / 24 prompt-injection attacks got through", ref: 2 },
    plate: "legal",
    caseStudy: {
      overview:
        "A research system for Indian criminal law whose claims are measured, not asserted. It answers only from the text of the Indian Penal Code (1860) or the Bharatiya Nyaya Sanhita (2023), cites every claim, and declines what it can't ground.",
      problem: [
        "General-purpose models are confident about law they don't know. On statute questions, the same models alone named the right section between 41% and 81% of the time, and stated a wrong punishment in up to half of answers.",
        "The law also changed underneath them: offences after 1 July 2024 fall under the BNS, with different section numbers. A useful system has to know which code applies, say so, and refuse civil or procedural questions instead of guessing.",
      ],
      approach: [
        {
          title: "Retrieve, or decline",
          body: "Questions are rewritten, scope-checked and routed to an IPC or BNS index. If nothing relevant comes back, the system declines. That single rule took civil questions answered as offences from 14–27 of 30 down to 0.",
        },
        {
          title: "Answer only from sources",
          body: "Generation is constrained to the retrieved sections, each cited inline as [1], [2]. IPC sources show their BNS equivalent from the official BPRD correspondence table, and the other way round.",
        },
        {
          title: "Check every sentence",
          body: "Each sentence is checked for support against its cited source, case names are verified against a 28,055-passage judgment library, and Prolog rules encode the elements of IPC offences.",
        },
        {
          title: "Guard the output",
          body: "A verdict guard strips anything that sounds like a finding of guilt, including paraphrases. Answers are signed, with a zero-knowledge proof of the IPC retrieval.",
        },
      ],
      results: {
        caption: "LegalGPT vs. the same model alone, held-out data, 3 models",
        columns: ["Measure", "Model alone", "LegalGPT"],
        rows: [
          ["Right section on statute questions", "41–81%", "98–100%"],
          ["Wrong punishments stated", "15–54%", "0%"],
          ["Civil questions answered as an offence", "14–27 / 30", "0 / 30"],
          ["Prompt-injection attacks that worked", "1 / 24", "0 / 24"],
          ["Paraphrased verdicts caught", "18% (patterns)", "93%"],
          ["Hindi: right section retrieved", "0 / 60", "52 / 60"],
        ],
        note: "p ≤ 0.002 on statute questions. Several ground truths were made with AI help and are labelled as such in the repo.",
      },
      decisions: [
        {
          title: "Legal information, never a verdict",
          body: "Case analysis names at least one correct offence 65% of the time. That's useful as an assistive draft and dangerous as a decision, so the system is built to never say whether anyone is guilty.",
        },
        {
          title: "Small samples, reported honestly",
          body: "60 scenarios, 24 injection files, 19 judgment citations. Confidence intervals are reported and they're wide. No lawyer has reviewed the AI-assisted labels yet.",
        },
      ],
      next: [
        "Lawyer review of the AI-assisted ground truth",
        "Sentence-level support checks for Hindi answers",
        "Retrieval proofs for the BNS index, not just the IPC",
      ],
    },
  },
  {
    slug: "lsm-kv",
    title: "lsm-kv",
    kicker: "An LSM-tree key-value store, from scratch",
    role: "Solo — systems",
    year: "2026",
    stack: ["Python", "multiprocessing", "Bloom filters", "fsync"],
    summary:
      "The same core design as RocksDB and LevelDB, as an embedded library: write-ahead log, memtable and SSTables, Bloom filters, and crash-safe background compaction.",
    repo: "https://github.com/bhxvish/lsm-kv",
    metric: { text: "≈ 20–25× faster reads than a linear-scan baseline", ref: 3 },
    plate: "lsm",
    caseStudy: {
      overview:
        "An embedded, log-structured merge-tree key-value store built in eight milestones, each adding one real systems concept. Every claim in the README is backed by a benchmark that regenerates from one command.",
      problem: [
        "It's easy to describe an LSM-tree and much harder to make one that survives a power cut. The point of this project wasn't the data structure, it was durability and concurrency you can actually test: kill the process mid-write, mid-flush, mid-compaction, and lose nothing.",
      ],
      approach: [
        {
          title: "Durability first",
          body: "Every put is appended to a write-ahead log and fsync'd before it touches the memtable. A hard kill mid-write loses zero acknowledged data.",
        },
        {
          title: "Tiered memory and disk",
          body: "A sorted in-memory memtable flushes to immutable SSTables. Reads check newest to oldest and stop at the first record, including tombstones.",
        },
        {
          title: "Fast reads, measured",
          body: "Each SSTable gets a sparse index and a Bloom filter, so absent keys skip the disk entirely: about 12× faster in isolation.",
        },
        {
          title: "Real background compaction",
          body: "Compaction runs in a separate OS process, not a thread, so it's genuinely parallel under the GIL. It coordinates through an atomically replaced MANIFEST.json and a lock file.",
        },
      ],
      results: {
        caption: "BENCHMARKS.md, regenerable with one command",
        columns: ["Measure", "Naive baseline", "lsm-kv"],
        rows: [
          ["Read latency", "≈ 2,300–2,900 µs", "≈ 90–100 µs"],
          ["Read speed-up (p99, absent keys)", "1×", "≈ 20–25×"],
          ["Write amplification, flush only", "—", "2.16×"],
          ["Write amplification, overwrite-heavy", "—", "19.43×"],
          ["Tests", "—", "98 passing"],
        ],
        note: "The 19.43× figure is a deliberately synthetic worst case for full-generation compaction.",
      },
      decisions: [
        {
          title: "Tombstones, not deletion",
          body: "Once data lives in more than one place, deleting from the memtable would let an older value resurface from disk. A tombstone shadows it until compaction can drop it for real.",
        },
        {
          title: "Atomic everything",
          body: "Every file goes to a temp path, gets fsync'd, then os.replace()'d into place. A reader never sees a half-written file, and a crash leaves either the old state or the new one.",
        },
        {
          title: "Full-generation compaction",
          body: "Simpler than leveled compaction and always safe for dropping tombstones. The write-amplification number above is the honest cost of that choice.",
        },
      ],
      next: [
        "Group-commit fsync for much higher write throughput",
        "Leveled or partial-tiered compaction",
        "Streaming SSTable reads and per-record checksums",
      ],
    },
  },
  {
    slug: "rag-eval-observability",
    title: "RAG Eval & Observability",
    kicker: "Measuring a retrieval pipeline instead of vibing it",
    role: "Solo",
    year: "2026",
    stack: ["FastAPI", "ChromaDB", "sentence-transformers", "Groq"],
    summary:
      "Precision@k, Recall@k and MRR, LLM-judge plus heuristic faithfulness, refusal accuracy on unanswerable questions, query tracing and a chunk-size sweep.",
    repo: "https://github.com/bhxvish/rag-eval-observability",
    metric: { text: "Recall@5 0.962 · MRR 0.917 · 6 / 6 refusals", ref: 4 },
    plate: "rag",
  },
  {
    slug: "gpt-from-scratch",
    title: "GPT from scratch",
    kicker: "A decoder-only transformer from raw tensor ops",
    role: "Solo",
    year: "2026",
    stack: ["PyTorch", "Causal attention"],
    summary:
      "Causal self-attention, the training loop and sampling, written without nn.Transformer and trained on Tiny Shakespeare.",
    repo: "https://github.com/bhxvish/gpt-from-scratch",
    metric: { text: "10.8M params · best val loss 1.48 at step 3,000", ref: 5 },
    plate: "gpt",
  },
  {
    slug: "turbofan-predictive-maintenance",
    title: "Turbofan failure risk",
    kicker: "Is this engine within 30 cycles of failure?",
    role: "Solo",
    year: "2026",
    stack: ["scikit-learn", "NASA C-MAPSS", "IsolationForest"],
    summary:
      "Failure-risk classification and unsupervised anomaly detection on turbofan telemetry, with an error analysis that names the engines it misses.",
    repo: "https://github.com/bhxvish/turbofan-predictive-maintenance",
    metric: { text: "ROC-AUC 0.99, and the tuned model didn't beat the baseline", ref: 6 },
    plate: "turbofan",
  },
  {
    slug: "ai-front-desk-agent",
    title: "AI Front Desk Agent",
    kicker: "A tool-calling WhatsApp receptionist for a fitness club",
    role: "Solo",
    year: "2026",
    stack: ["Groq tool calling", "FastAPI", "Twilio", "Postgres"],
    summary:
      "Not a chatbot: it decides when it needs live data, uses only five approved tools, and hands off to a human when it should.",
    repo: "https://github.com/bhxvish/AI-Front-Desk-Agent",
    metric: { text: "5 approved tools · 3 documented prompt versions", ref: 7 },
    plate: "agent",
  },
];

export const caseStudies = projects.filter((p) => p.caseStudy);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
