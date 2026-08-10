"use client";

import { motion } from "framer-motion";
import { RemainingLife } from "@/types";
import { HeartPulse, Flame } from "lucide-react";

interface RemainingLifeCardProps {
  remainingLife: RemainingLife;
  expectedLifeYears: number;
}

export default function RemainingLifeCard({
  remainingLife,
  expectedLifeYears,
}: RemainingLifeCardProps) {
  const totalWeeks = Math.floor(remainingLife.total_days / 7);
  const totalHours = remainingLife.total_days * 24;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-col rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-4 sm:p-5 backdrop-blur-md shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-rose-400">
            <HeartPulse className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-widest text-neutral-300 font-semibold">
              Time You Have Left
            </h2>
            <p className="text-[11px] text-neutral-500 font-mono">
              Based on target horizon of {expectedLifeYears} years
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono rounded-full bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-rose-300">
          ~{remainingLife.total_days.toLocaleString()} Days
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-900 bg-neutral-900/40 py-2.5 px-1.5">
          <span className="font-ticker text-xl sm:text-2xl font-bold text-white">
            {remainingLife.years}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5 font-mono">
            Years Left
          </span>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-900 bg-neutral-900/40 py-2.5 px-1.5">
          <span className="font-ticker text-xl sm:text-2xl font-bold text-white">
            {remainingLife.months}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5 font-mono">
            Months Left
          </span>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-900 bg-neutral-900/40 py-2.5 px-1.5">
          <span className="font-ticker text-xl sm:text-2xl font-bold text-white">
            {remainingLife.days}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5 font-mono">
            Days Left
          </span>
        </div>
      </div>

      {/* Weeks & Hours Summary */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-center border-t border-neutral-900/80 pt-3">
        <div className="rounded-xl border border-neutral-900/60 bg-neutral-900/20 py-1.5 px-2">
          <div className="text-[10px] uppercase font-mono text-neutral-500">Total Weeks Left</div>
          <div className="font-ticker text-sm sm:text-base font-semibold text-rose-300/90 mt-0.5">
            ~{totalWeeks.toLocaleString()} weeks
          </div>
        </div>

        <div className="rounded-xl border border-neutral-900/60 bg-neutral-900/20 py-1.5 px-2">
          <div className="text-[10px] uppercase font-mono text-neutral-500">Total Hours Left</div>
          <div className="font-ticker text-sm sm:text-base font-semibold text-neutral-200 mt-0.5">
            ~{totalHours.toLocaleString()} hrs
          </div>
        </div>
      </div>
    </motion.div>
  );
}
