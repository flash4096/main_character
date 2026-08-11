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

      // Trigger fast heartbeat pulse every time a new second tick occurs
      if (currentSecondInt !== prevSecondRef.current) {
        prevSecondRef.current = currentSecondInt;
        controls.start({
          scale: [1, 1.04, 0.98, 1.015, 1],
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
    <section className="relative flex flex-col items-center justify-center text-center p-1">
      {/* Label Badge: Time Remaining */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-950/90 px-2.5 py-0.5 text-[9px] uppercase tracking-widest text-neutral-400 font-mono"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
        Time Remaining
      </motion.div>

      {/* Heartbeat Ticker Display with Proportional Non-Overflow Sizing */}
      <div className="relative py-0.5 w-full overflow-hidden">
        {isGiftNow ? (
          <motion.h1
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-xl sm:text-2xl font-extralight tracking-tight text-white leading-snug"
          >
            {giftMessage}
          </motion.h1>
        ) : (
          <div className="flex flex-col items-center">
            {/* Perfectly scaled non-overflowing text */}
            <motion.div
              animate={controls}
              className="flex items-baseline justify-center font-ticker memento-glow text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-none select-none my-0.5 whitespace-nowrap"
            >
              <span>{formatNumberWithCommas(integerSeconds)}</span>
              <span className="text-rose-500 font-mono text-sm sm:text-lg lg:text-xl ml-1 font-bold">
                .{msFormatted}
              </span>
            </motion.div>

            <div className="flex items-center gap-1.5 mt-1">
              <span className="h-1 w-1 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-400">
                Seconds & Milliseconds Remaining
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
