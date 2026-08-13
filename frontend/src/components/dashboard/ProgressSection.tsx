"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProgressMetrics } from "@/types";
import { calculateTimeProgress } from "@/lib/calculations";
import { Activity, Flame, Calendar, Sparkles, TrendingUp, Compass } from "lucide-react";

interface ProgressSectionProps {
  initialProgress: ProgressMetrics;
  birthDateIso?: string;
}

function MiniDonut({ percentage }: { percentage: number }) {
  const size = 60;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Remaining (blue) — full track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.35}
        />
        {/* Spent (red) — animated arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f43f5e"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute flex items-center justify-center">
        <span className="text-[10px] font-bold font-ticker text-white">
          {clamped.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

export default function ProgressSection({ initialProgress, birthDateIso }: ProgressSectionProps) {
  const [progress, setProgress] = useState<ProgressMetrics>(initialProgress);

  useEffect(() => {
    const updateProgress = () => {
      setProgress(calculateTimeProgress(birthDateIso));
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000); // 1-second live ticker
    return () => clearInterval(interval);
  }, [birthDateIso]);

  const ageProgress = progress.age_progress_percent || 0;
  const currentAge = progress.current_age_year ?? 0;
  const nextAge = progress.next_age_year ?? (currentAge + 1);
  const daysLeft = progress.days_until_next_birthday ?? 0;

  const milestoneItems = [
    { label: `Year ${progress.year}`, percentage: progress.year_progress_percent },
    { label: `${progress.month_name}`, percentage: progress.month_progress_percent },
    { label: "Today (24h)", percentage: progress.day_progress_percent },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-amber-400">
            <TrendingUp className="h-3 w-3" />
          </div>
          <h2 className="text-xs uppercase tracking-widest text-neutral-300 font-semibold">
            Temporal & Age Progress
          </h2>
        </div>
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
          Real-time
        </span>
      </div>

      {/* 1. Featured Age Progress Highlight Card */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-neutral-900/60 to-neutral-950/80 p-3 shadow-inner">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-200 uppercase tracking-wide">
              Age {currentAge} → {nextAge} Progress
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold font-ticker text-amber-300">
              {ageProgress.toFixed(2)}%
            </span>
            <span className="rounded-md bg-neutral-900/90 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-mono text-amber-300">
              {daysLeft}d left
            </span>
          </div>
        </div>

        {/* Progress Bar with Glow */}
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-neutral-950 border border-amber-500/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, ageProgress))}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-rose-400 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)]"
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono mt-1.5">
          <span>Turned {currentAge}</span>
          <span className="text-neutral-500">•</span>
          <span>{daysLeft} days until turning {nextAge}</span>
          <span className="text-neutral-500">•</span>
          <span>Turning {nextAge}</span>
        </div>
      </div>

      {/* 2. Calendar Milestones (Year / Month / Day) in compact grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5">
        {milestoneItems.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-2.5 flex flex-col items-center gap-1.5"
          >
            <span className="text-[11px] font-mono text-neutral-300 truncate">{item.label}</span>
            <MiniDonut percentage={item.percentage} />
            <div className="flex items-center gap-2 text-[9px] font-mono text-neutral-500">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Spent
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500/60" /> Left
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
