"use client";

import { motion } from "framer-motion";
import { Quote } from "@/types";
import { Quote as QuoteIcon } from "lucide-react";

interface DailyQuoteProps {
  quote: Quote | null;
}

export default function DailyQuote({ quote }: DailyQuoteProps) {
  if (!quote) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950/80 p-8 sm:p-10 transition-all hover:border-neutral-700/80"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-4">
        <QuoteIcon className="h-4 w-4 text-white" />
        <span>Daily Wisdom</span>
      </div>

      <p className="text-lg sm:text-xl md:text-2xl font-light italic text-neutral-200 leading-relaxed">
        &ldquo;{quote.quote}&rdquo;
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-neutral-900 pt-4">
        <span className="text-sm font-medium text-white tracking-wide">
          — {quote.author}
        </span>
        {quote.source && (
          <span className="text-xs text-neutral-400 font-mono tracking-wider">
            {quote.source}
          </span>
        )}
      </div>
    </motion.div>
  );
}
