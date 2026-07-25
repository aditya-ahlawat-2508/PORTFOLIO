"use client";

import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable — link href="mailto:" still works
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group font-mono text-vellum text-left [font-size:clamp(1.25rem,4vw,2.5rem)] tracking-[-0.02em] hover:text-signal transition-colors"
      aria-label={`Copy email address ${email}`}
    >
      {email}
      <span className="ml-3 align-middle font-mono text-eyebrow text-pulse opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 data-[copied=true]:opacity-100" data-copied={copied}>
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}
