"use client";

import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-7 py-4 font-mono text-sm transition hover:border-fg"
      aria-live="polite"
    >
      {copied ? <span className="text-accent">Copied ✓</span> : "Copy email"}
    </button>
  );
}
