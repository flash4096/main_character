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

    // Calculate exact lived percentage
    const ageSeconds = Math.max(0, (now.getTime() - birthDate.getTime()) / 1000);
    const totalExpectedSeconds = expectedLifeYears * 365.2425 * 86400;
    const percent = Math.min(100, Math.max(0, (ageSeconds / totalExpectedSeconds) * 100));

    setLivedPercentage(percent);
  }, [birthDateIso, expectedLifeYears]);

  // Animated number spring for smooth counter animation
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

  // SVG Donut Circle parameters
  const size = 260;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Lived stroke offset calculation
  const strokeDashoffset = circumference - (livedPercentage / 100) * circumference;

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="my-10 flex flex-col items-center justify-center text-center px-4"
    >
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/80 px-4 py-1 text-[11px] uppercase tracking-widest text-neutral-400 font-mono">
        <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
        Life Clock
      </div>

      {/* Circular Donut Chart */}
      <div className="relative flex items-center justify-center my-2">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background track circle (Remaining life) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#18181b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated foreground circle (Years Lived) */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#ffffff"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Content Inside Donut Chart */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-ticker text-4xl sm:text-5xl font-extrabold tracking-tighter text-white">
            {formattedPercent}%
          </span>
          <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-mono mt-1">
            Life Progress
          </span>
        </div>
      </div>

      {/* Metrics Breakdown Below Life Clock */}
      <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-8 max-w-lg w-full text-center">
        <div className="flex flex-col items-center rounded-xl border border-neutral-900 bg-neutral-950/80 py-3.5 px-2">
          <span className="font-ticker text-xl sm:text-2xl font-light text-white">
            {currentAgeYears}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1 font-mono">
            Years Lived
          </span>
        </div>

        <div className="flex flex-col items-center rounded-xl border border-neutral-900 bg-neutral-950/80 py-3.5 px-2">
          <span className="font-ticker text-xl sm:text-2xl font-light text-white">
            {remainingLifeYears}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1 font-mono">
            Years Remaining
          </span>
        </div>

        <div className="flex flex-col items-center rounded-xl border border-neutral-900 bg-neutral-950/80 py-3.5 px-2">
          <span className="font-ticker text-xl sm:text-2xl font-light text-neutral-300">
            {expectedLifeYears}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1 font-mono">
            Life Expectancy
          </span>
        </div>
      </div>
    </motion.section>
  );
}
