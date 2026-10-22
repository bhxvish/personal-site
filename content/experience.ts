// TODO: confirm years and wording. Dates are read from GitHub activity.
export type Milestone = { year: string; period: string; title: string; body: string; tags: string[] };

export const experience: Milestone[] = [
  {
    year: "2023",
    period: "Aug 2023",
    title: "B.Tech, Computer Science (AI & ML) — PES University",
    body: "Started at PESU in Bangalore. First repos: C login systems, a Caesar cipher, the usual rites of passage.",
    tags: ["University"],
  },
  {
    year: "2025",
    period: "Jun – Nov 2025",
    title: "A season of applied ML",
    body: "Shipped a dozen-plus end-to-end models: fraud and credit-risk scoring, pneumonia detection from chest X-rays, toxicity detection, a PESU EC ML hackathon entry. Learned that the dataset is the project.",
    tags: ["scikit-learn", "TensorFlow", "Streamlit"],
  },
  {
    year: "2026",
    period: "Aug 2026",
    title: "Agents & transformers, from first principles",
    body: "Wrote a decoder-only transformer from raw tensor ops, and a tool-calling WhatsApp front desk agent with versioned prompts and safe escalation.",
    tags: ["PyTorch", "Tool calling", "FastAPI"],
  },
  {
    year: "2026",
    period: "Sep 2026",
    title: "Systems: storage and retrieval",
    body: "Built an LSM-tree key-value store that survives SIGKILL mid-compaction, then an evaluation and observability layer for RAG.",
    tags: ["Storage engines", "Evals", "ChromaDB"],
  },
  {
    year: "2026",
    period: "Oct 2026 — now",
    title: "LegalGPT",
    body: "A research system for Indian criminal law where every claim is cited, checked sentence by sentence and signed. Currently extending BNS and Hindi coverage.",
    tags: ["RAG", "InLegalBERT", "Prolog"],
  },
];
