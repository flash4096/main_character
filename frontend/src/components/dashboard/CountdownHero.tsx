"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
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
  const [secondsWithMs, setSecondsWithMs] = useState<number>(initialRemainingSeconds);
  const prevSecondRef = useRef<number>(Math.floor(initialRemainingSeconds));
  const controls = useAnimation();

  useEffect(() => {
    let animFrameId: number;
    const startTime = performance.now();
    const initialSeconds = initialRemainingSeconds;

    const updateTimer = (currentTime: number) => {
      const elapsedSeconds = (currentTime - startTime) / 1000;
      const currentRemaining = Math.max(0, initialSeconds - elapsedSeconds);
      setSecondsWithMs(currentRemaining);

      const currentSecondInt = Math.floor(currentRemaining);

      // Trigger one fast heartbeat pulse every time a new second tick occurs!
      if (currentSecondInt !== prevSecondRef.current) {
        prevSecondRef.current = currentSecondInt;
        controls.start({
          scale: [1, 1.05, 0.98, 1.02, 1],
          transition: { duration: 0.35, ease: "easeInOut" },
        });
      }

      if (currentRemaining > 0) {
        animFrameId = requestAnimationFrame(updateTimer);
      }
    };

    animFrameId = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animFrameId);
  }, [initialRemainingSeconds, controls]);

  const isGiftNow = secondsWithMs <= 0 || initialIsGift;

  const integerSeconds = Math.floor(secondsWithMs);
  const msFraction = Math.floor((secondsWithMs % 1) * 1000);
  const msFormatted = String(msFraction).padStart(3, "0");

  return (
    <section className="relative my-8 flex flex-col items-center justify-center text-center px-4">
      {/* Label Badge: Time Remaining */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/80 px-4 py-1 text-[11px] uppercase tracking-widest text-neutral-400 font-mono"
      >
        <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
        Time Remaining
      </motion.div>

      {/* Heartbeat Ticker Display with Milliseconds */}
      <div className="relative py-4">
        {isGiftNow ? (
          <motion.h1
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl sm:text-5xl font-extralight tracking-tight text-white leading-snug"
          >
            {giftMessage}
          </motion.h1>
        ) : (
          <div className="flex flex-col items-center">
            {/* Heartbeat animated main container */}
            <motion.div
              animate={controls}
              className="flex items-baseline justify-center font-ticker memento-glow text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-white leading-none select-none my-2"
            >
              <span>{formatNumberWithCommas(integerSeconds)}</span>
              <span className="text-rose-500 font-mono text-2xl sm:text-4xl md:text-5xl ml-1 font-semibold">
                .{msFormatted}
              </span>
            </motion.div>

            <div className="flex items-center gap-2 mt-3">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-mono tracking-widest uppercase text-neutral-400">
                Seconds & Milliseconds Remaining
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Minimalist quote */}
      <p className="max-w-md text-xs text-neutral-400 font-light tracking-wide mt-2">
        Time is non-renewable. Treat every single tick as a precious unit of existence.
      </p>
    </section>
  );
}
