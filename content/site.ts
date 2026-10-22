// Single source of truth for personal details and copy.
// Anything marked TODO is a believable draft — replace it with your own words.

export type Social = { label: string; handle: string; href: string };

export const site = {
  name: "Bhavish",
  fullName: "S Bhavish",
  initial: "B",
  role: "AI Engineer",
  location: "Bangalore, IN",
  coordinates: "12.97° N, 77.59° E",
  timezone: "Asia/Kolkata",
  tzLabel: "IST",
  email: "sbhavish2005@gmail.com",
  description:
    "Bhavish is an AI engineer in Bangalore building retrieval systems, evaluations and LLM applications whose claims are measured, not asserted.",

  // The hero statement. `em` is set in italic; `cite` points at content/references.ts.
  statement: {
    before: "I build AI systems whose claims are",
    em: "measured,",
    after: "not asserted.",
    cite: 1,
  },

  meta: [
    { label: "Studying", value: "CSE (AI & ML), PES University" },
    // TODO: confirm what you're open to and when.
    { label: "Open to", value: "AI / ML engineering internships" },
    { label: "Focus", value: "RAG · Evals · LLM systems" },
  ],

  about: {
    // TODO: these paragraphs are a draft in your voice — edit freely.
    opener: "I don't trust a number until I've tried to break it.",
    body: [
      "I study Computer Science (AI & ML) at PES University in Bangalore. Most of what I build sits where language models meet things that have to be right: criminal law, retrieval, storage engines that can't lose a write.",
      "I build the unglamorous layer first. The eval set, the crash test, the baseline that tells me whether the clever part actually helped. When the tuned model doesn't beat logistic regression, that goes in the README too.",
    ],
    into: [
      "Retrieval that knows when to refuse",
      "Evals before features",
      "Write-ahead logs & storage engines",
      "Transformers from raw tensor ops",
      "Honest baselines",
      "English ↔ Hindi NLP",
    ],
    // TODO: keep this current — it's the most human part of the page.
    currently: [
      { label: "Building", value: "LegalGPT — BNS coverage & case analysis" },
      { label: "Reading", value: "Designing Data-Intensive Applications" },
      { label: "Listening", value: "Lo-fi while the evals run" },
    ],
  },

  socials: [
    { label: "GitHub", handle: "@bhxvish", href: "https://github.com/bhxvish" },
    // TODO: add your LinkedIn and X URLs. Entries with an empty href are hidden.
    { label: "LinkedIn", handle: "in/bhavish", href: "" },
    { label: "X", handle: "@bhavish", href: "" },
  ] satisfies Social[],
};

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const visibleSocials = site.socials.filter((s) => s.href);
