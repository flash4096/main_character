"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProgressMetrics } from "@/types";

interface ProgressSectionProps {
  initialProgress: ProgressMetrics;
}

export default function ProgressSection({ initialProgress }: ProgressSectionProps) {
  const [progress, setProgress] = useState<ProgressMetrics>(initialProgress);

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const year = now.getFullYear();

      // 1. Year Progress
      const startOfYear = new Date(year, 0, 1).getTime();
      const endOfYear = new Date(year + 1, 0, 1).getTime();
      const yearPercent = ((now.getTime() - startOfYear) / (endOfYear - startOfYear)) * 100;

      // 2. Month Progress
      const startOfMonth = new Date(year, now.getMonth(), 1).getTime();
      const endOfMonth = new Date(year, now.getMonth() + 1, 1).getTime();
      const monthPercent = ((now.getTime() - startOfMonth) / (endOfMonth - startOfMonth)) * 100;

      // 3. Day Progress
      const startOfDay = new Date(year, now.getMonth(), now.getDate()).getTime();
      const dayPercent = ((now.getTime() - startOfDay) / (24 * 3600 * 1000)) * 100;

      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      setProgress({
        year,
        year_progress_percent: Math.min(100, Math.max(0, yearPercent)),
        month_name: monthNames[now.getMonth()],
        month_progress_percent: Math.min(100, Math.max(0, monthPercent)),
        day_progress_percent: Math.min(100, Math.max(0, dayPercent)),
      });
    };

    updateProgress();
    // Update every minute as requested
    const interval = setInterval(updateProgress, 60000);
    return () => clearInterval(interval);
  }, []);

  const progressItems = [
    {
      title: `Year Progress (${progress.year})`,
      percentage: progress.year_progress_percent,
    },
    {
      title: `Month Progress (${progress.month_name})`,
      percentage: progress.month_progress_percent,
    },
    {
      title: "Day Progress",
      percentage: progress.day_progress_percent,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col rounded-2xl border border-neutral-800/80 bg-surface/50 p-6 sm:p-8 backdrop-blur-xs"
    >
      <div className="border-b border-neutral-800/80 pb-4 mb-6">
        <h2 className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
          Temporal Milestones
        </h2>
        <p className="text-xs text-neutral-400 font-light mt-0.5">
          Real-time completion percentage of present cycles
        </p>
      </div>

      <div className="space-y-6">
        {progressItems.map((item, idx) => (
          <div key={item.title} className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-300 tracking-wide">{item.title}</span>
              <span className="text-white font-semibold">{item.percentage.toFixed(2)}%</span>
            </div>

            {/* Linear Progress Bar */}
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-neutral-900 border border-neutral-800/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
