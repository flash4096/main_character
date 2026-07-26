"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface LifeClockProps {
  birthDateIso: string;
  expectedLifeYears: number;
  currentAgeYears: number;
  remainingLifeYears: number;
}

export default function LifeClock({
  birthDateIso,
  expectedLifeYears,
  currentAgeYears,
  remainingLifeYears,
}: LifeClockProps) {
  const [livedPercentage, setLivedPercentage] = useState<number>(0);

  useEffect(() => {
    const birthDate = new Date(birthDateIso);
    const now = new Date();

    const ageSeconds = Math.max(0, (now.getTime() - birthDate.getTime()) / 1000);
    const totalExpectedSeconds = expectedLifeYears * 365.2425 * 86400;
    const percent = Math.min(100, Math.max(0, (ageSeconds / totalExpectedSeconds) * 100));

    setLivedPercentage(percent);
  }, [birthDateIso, expectedLifeYears]);

  const springValue = useSpring(0, {
    stiffness: 45,
    damping: 18,
  });

  const displayPercent = useTransform(springValue, (current) => current.toFixed(1));
  const [formattedPercent, setFormattedPercent] = useState<string>("0.0");

  useEffect(() => {
    springValue.set(livedPercentage);
  }, [livedPercentage, springValue]);

  useEffect(() => {
    const unsubscribe = displayPercent.on("change", (latest) => {
      setFormattedPercent(latest);
    });
    return () => unsubscribe();
  }, [displayPercent]);

  // Compact size for full-desktop single viewport fit
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (livedPercentage / 100) * circumference;

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center p-2"
    >
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-950/80 px-3 py-0.5 text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        Life Clock
      </div>

      {/* Donut Chart */}
      <div className="relative flex items-center justify-center my-1">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#18181b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#ffffff"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-ticker text-3xl sm:text-4xl font-extrabold tracking-tighter text-white">
            {formattedPercent}%
          </span>
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono mt-0.5">
            Life Progress
          </span>
        </div>
      </div>

      {/* Metrics Breakdown Below Donut Chart */}
      <div className="mt-4 grid grid-cols-3 gap-2 w-full max-w-md text-center">
        <div className="flex flex-col items-center rounded-xl border border-neutral-900 bg-neutral-950/80 py-2.5 px-1.5">
          <span className="font-ticker text-lg font-light text-white">
            {currentAgeYears}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5 font-mono">
            Years Lived
          </span>
        </div>

        <div className="flex flex-col items-center rounded-xl border border-neutral-900 bg-neutral-950/80 py-2.5 px-1.5">
          <span className="font-ticker text-lg font-light text-white">
            {remainingLifeYears}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5 font-mono">
            Years Remaining
          </span>
        </div>

        <div className="flex flex-col items-center rounded-xl border border-neutral-900 bg-neutral-950/80 py-2.5 px-1.5">
          <span className="font-ticker text-lg font-light text-neutral-300">
            {expectedLifeYears}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5 font-mono">
            Life Expectancy
          </span>
        </div>
      </div>
    </motion.section>
  );
}
