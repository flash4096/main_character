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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col justify-between h-full"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-3">
        <QuoteIcon className="h-4 w-4 text-white" />
        <span>Daily Wisdom</span>
      </div>

      <p className="text-base sm:text-lg font-light italic text-neutral-200 leading-relaxed my-2">
        &ldquo;{quote.quote}&rdquo;
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-neutral-900 pt-3">
        <span className="text-xs font-semibold text-white tracking-wide">
          — {quote.author}
        </span>
        {quote.source && (
          <span className="text-[11px] text-neutral-400 font-mono tracking-wider">
            {quote.source}
          </span>
        )}
      </div>
    </motion.div>
  );
}
