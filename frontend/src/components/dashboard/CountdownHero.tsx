"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatNumberWithCommas } from "@/lib/utils";

interface CountdownHeroProps {
  initialRemainingSeconds: number;
  isGift: boolean;
  giftMessage: string;
}

export default function CountdownHero({
  initialRemainingSeconds,
  isGift: initialIsGift,
  giftMessage,
}: CountdownHeroProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialRemainingSeconds);

  useEffect(() => {
    setSecondsLeft(initialRemainingSeconds);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [initialRemainingSeconds]);

  const isGiftNow = secondsLeft <= 0 || initialIsGift;

  return (
    <section className="relative my-12 flex flex-col items-center justify-center text-center px-4">
      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/60 px-4 py-1 text-xs uppercase tracking-widest text-neutral-400"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 animate-pulse" />
        Estimated Life Remaining
      </motion.div>

      {/* Main Countdown Display */}
      <div className="relative py-6">
        {isGiftNow ? (
          <motion.h1
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extralight tracking-tight text-white leading-tight"
          >
            {giftMessage}
          </motion.h1>
        ) : (
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="font-ticker memento-glow text-6xl sm:text-8xl md:text-[9rem] lg:text-[11rem] font-extrabold tracking-tighter text-white leading-none select-none"
            >
              {formatNumberWithCommas(secondsLeft)}
            </motion.div>
            <span className="mt-4 text-xs sm:text-sm font-mono tracking-widest uppercase text-neutral-400">
              Seconds Remaining
            </span>
          </div>
        )}
      </div>

      {/* Subtle quote context line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="max-w-md text-xs sm:text-sm text-neutral-400 font-light tracking-wide mt-2"
      >
        Time is non-renewable. Treat every single tick as a precious unit of existence.
      </motion.p>
    </section>
  );
}
