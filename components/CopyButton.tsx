"use client";

import { useState } from "react";
import { motion } from "motion/react";

type CopyButtonProps = {
  text: string;
  label?: string;
};

export function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-medium text-zinc-800 backdrop-blur-sm transition-colors hover:bg-white"
    >
      {copied ? "Copied!" : label}
    </motion.button>
  );
}
