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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col justify-between h-full"
    >
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-300 font-semibold mb-2">
        <QuoteIcon className="h-3.5 w-3.5 text-amber-400" />
        <span>Daily Wisdom</span>
      </div>

      <p className="text-sm sm:text-base font-light italic text-neutral-200 leading-relaxed my-1.5">
        &ldquo;{quote.quote}&rdquo;
      </p>

      <div className="mt-2.5 flex items-center justify-between border-t border-neutral-900 pt-2">
        <span className="text-xs font-semibold text-white tracking-wide">
          —{" "}
          {quote.authorUrl ? (
            <a
              href={quote.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-amber-400 underline decoration-neutral-700 underline-offset-2 transition-colors"
            >
              {quote.author}
            </a>
          ) : (
            quote.author
          )}
        </span>
        {quote.source && (
          <span className="text-[10px] text-neutral-400 font-mono tracking-wider">
            {quote.source}
          </span>
        )}
      </div>
    </motion.div>
  );
}
