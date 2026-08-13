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
      className="flex items-start gap-2"
    >
      <QuoteIcon className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
      <p className="text-sm sm:text-base font-medium italic text-white leading-snug">
        &ldquo;{quote.quote}&rdquo;{" "}
        <span className="not-italic font-semibold text-amber-300">
          —{" "}
          {quote.authorUrl ? (
            <a
              href={quote.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 underline decoration-sky-500/40 underline-offset-2 transition-colors"
            >
              {quote.author}
            </a>
          ) : (
            quote.author
          )}
        </span>
      </p>
    </motion.div>
  );
}
