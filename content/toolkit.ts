export type Tool = { name: string; usedIn: string[] };

// Row one is set large in the display face, row two small in mono.
export const toolkit: { primary: Tool[]; secondary: Tool[] } = {
  primary: [
    { name: "Python", usedIn: ["legalgpt", "lsm-kv", "rag-eval-observability", "gpt-from-scratch"] },
    { name: "PyTorch", usedIn: ["gpt-from-scratch", "medical-imaging-segmentation"] },
    { name: "Transformers", usedIn: ["legalgpt (InLegalBERT ensemble)"] },
    { name: "scikit-learn", usedIn: ["turbofan-predictive-maintenance", "fraud detection", "credit risk"] },
    { name: "TensorFlow", usedIn: ["pneumonia detection", "dog-breed classifier", "fish classifier"] },
    { name: "Retrieval", usedIn: ["legalgpt", "rag-eval-observability", "PDF chatbot"] },
    { name: "Evals", usedIn: ["rag-eval-observability", "legalgpt", "turbofan-predictive-maintenance"] },
  ],
  secondary: [
    { name: "FastAPI", usedIn: ["rag-eval-observability", "AI Front Desk Agent"] },
    { name: "ChromaDB", usedIn: ["rag-eval-observability"] },
    { name: "sentence-transformers", usedIn: ["rag-eval-observability", "legalgpt"] },
    { name: "Groq · Gemini", usedIn: ["legalgpt", "rag-eval-observability", "AI Front Desk Agent"] },
    { name: "Prolog", usedIn: ["legalgpt (rule verification)"] },
    { name: "SQLAlchemy · Postgres", usedIn: ["AI Front Desk Agent"] },
    { name: "Pydantic", usedIn: ["AI Front Desk Agent"] },
    { name: "Twilio", usedIn: ["AI Front Desk Agent"] },
    { name: "Streamlit", usedIn: ["market sentiment dashboard", "pneumonia detection"] },
    { name: "TypeScript · React · Next.js", usedIn: ["dsa-revision-app", "medi_mind", "this site"] },
    { name: "Java · C · C++", usedIn: ["car-rental simulation", "compiler labs"] },
    { name: "Docker", usedIn: ["legalgpt"] },
  ],
};
