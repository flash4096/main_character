"use client";

import { motion } from "framer-motion";
import { RemainingLife } from "@/types";

interface RemainingLifeCardProps {
  remainingLife: RemainingLife;
  expectedLifeYears: number;
}

export default function RemainingLifeCard({
  remainingLife,
  expectedLifeYears,
}: RemainingLifeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col rounded-2xl border border-neutral-800/80 bg-surface/50 p-6 sm:p-8 backdrop-blur-xs"
    >
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4 mb-6">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
            Years Remaining
          </h2>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Based on target mortality horizon of {expectedLifeYears} years
          </p>
        </div>
        <span className="text-xs font-mono text-neutral-400">
          ~{remainingLife.total_days.toLocaleString()} Days Left
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-900 bg-neutral-950/80 py-5 px-3">
          <span className="font-ticker text-3xl sm:text-4xl font-light text-white">
            {remainingLife.years}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1">
            Years Remaining
          </span>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-900 bg-neutral-950/80 py-5 px-3">
          <span className="font-ticker text-3xl sm:text-4xl font-light text-white">
            {remainingLife.months}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1">
            Months Remaining
          </span>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-900 bg-neutral-950/80 py-5 px-3">
          <span className="font-ticker text-3xl sm:text-4xl font-light text-white">
            {remainingLife.days}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1">
            Days Remaining
          </span>
        </div>
      </div>
    </motion.div>
  );
}
