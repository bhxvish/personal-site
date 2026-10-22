"use client";

import { useRef, useState, type ReactNode } from "react";
import { site } from "@/content/site";

/** Copies the email address and confirms it, in the UI and to screen readers. */
export default function CopyEmail({ className, children }: { className?: string; children?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="copy"
      data-cursor-label={copied ? "Copied" : "Copy"}
      className={`group relative inline-flex items-baseline gap-3 text-left ${className ?? ""}`}
    >
      {children ?? <span className="ulink">{site.email}</span>}
      <span className="micro text-muted transition-colors group-hover:text-signal" aria-hidden="true">
        {copied ? "Copied ✓" : "Copy"}
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}
