"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RemainingLife } from "@/types";
import { 
  HeartPulse, 
  CalendarDays, 
  Sun, 
  Coffee, 
  Sparkles, 
  Clock, 
  Layers, 
  Info 
} from "lucide-react";

interface RemainingLifeCardProps {
  remainingLife: RemainingLife;
  expectedLifeYears: number;
}

export default function RemainingLifeCard({
  remainingLife,
  expectedLifeYears,
}: RemainingLifeCardProps) {
  const [activeTab, setActiveTab] = useState<"standard" | "weeks" | "philosophical">("standard");

  const totalDays = remainingLife.total_days;
  const totalWeeks = remainingLife.total_weeks ?? Math.floor(totalDays / 7);
  const totalMonths = remainingLife.total_months ?? Math.floor(totalDays / 30.4375);
  const totalYearsDecimal = remainingLife.total_years_decimal ?? Number((totalDays / 365.25).toFixed(1));
  const weeksLived = remainingLife.weeks_lived ?? 0;
  const totalWeeksInLife = remainingLife.total_weeks_in_life ?? (totalWeeks + weeksLived);
  const summersRemaining = remainingLife.summers_remaining ?? remainingLife.years;
  const weekendsRemaining = remainingLife.weekends_remaining ?? totalWeeks;
  const wakingHoursRemaining = remainingLife.waking_hours_remaining ?? (totalDays * 16);

  const percentWeeksRemaining = totalWeeksInLife > 0 
    ? ((totalWeeks / totalWeeksInLife) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="flex flex-col rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-3 sm:p-3.5 backdrop-blur-md shadow-2xl space-y-2.5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-900 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-rose-400">
            <HeartPulse className="h-3 w-3" />
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-widest text-neutral-300 font-semibold flex items-center gap-1.5">
              <span>Time You Have Left</span>
              <span className="text-[9px] font-mono text-rose-400/90 lowercase">({expectedLifeYears}y horizon)</span>
            </h2>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center rounded-xl bg-neutral-900/90 p-0.5 border border-neutral-800 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("standard")}
            className={`px-2 py-0.5 rounded-lg transition ${
              activeTab === "standard"
                ? "bg-neutral-800 text-white font-semibold shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("weeks")}
            className={`px-2 py-0.5 rounded-lg transition flex items-center gap-1 ${
              activeTab === "weeks"
                ? "bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <CalendarDays className="h-2.5 w-2.5" />
            <span>Weeks</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("philosophical")}
            className={`px-2 py-0.5 rounded-lg transition flex items-center gap-1 ${
              activeTab === "philosophical"
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Sun className="h-2.5 w-2.5" />
            <span>Horizons</span>
          </button>
        </div>
      </div>

      {/* Hero Highlight: The Stoic "Weeks Remaining" Box */}
      <div className="rounded-xl border border-rose-500/25 bg-gradient-to-br from-rose-500/10 via-neutral-900/50 to-neutral-950/80 p-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-200">
              Life In Weeks Remaining
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <span className="font-extrabold text-sm sm:text-base font-ticker text-rose-300">
              ~{totalWeeks.toLocaleString()}
            </span>
            <span className="text-neutral-400">weeks</span>
          </div>
        </div>

        {/* Progress Bar of Weeks Remaining */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-neutral-950 border border-rose-500/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentWeeksRemaining}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-rose-500 via-pink-400 to-amber-300 rounded-full"
          />
        </div>

        <div className="flex items-center justify-between text-[9px] text-neutral-400 font-mono">
          <span>{weeksLived.toLocaleString()} weeks lived</span>
          <span className="text-neutral-500">•</span>
          <span>{percentWeeksRemaining.toFixed(1)}% of life remaining</span>
          <span className="text-neutral-500">•</span>
          <span>{totalWeeksInLife.toLocaleString()} total weeks</span>
        </div>
      </div>

      {/* Dynamic Tab Views */}
      <AnimatePresence mode="wait">
        {activeTab === "standard" && (
          <motion.div
            key="standard"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {/* 4-Unit Grid */}
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-900 bg-neutral-900/40 py-1.5 px-1">
                <span className="font-ticker text-sm sm:text-base font-bold text-white">
                  {remainingLife.years}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-neutral-400 font-mono">
                  Years
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-900 bg-neutral-900/40 py-1.5 px-1">
                <span className="font-ticker text-sm sm:text-base font-bold text-white">
                  {remainingLife.months}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-neutral-400 font-mono">
                  Months
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-900 bg-neutral-900/40 py-1.5 px-1">
                <span className="font-ticker text-sm sm:text-base font-bold text-rose-300">
                  {totalWeeks.toLocaleString()}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-neutral-400 font-mono">
                  Weeks
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-900 bg-neutral-900/40 py-1.5 px-1">
                <span className="font-ticker text-sm sm:text-base font-bold text-white">
                  {remainingLife.days}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-neutral-400 font-mono">
                  Days
                </span>
              </div>
            </div>

            {/* Total Days & Years Horizon */}
            <div className="grid grid-cols-2 gap-1.5 text-center pt-0.5">
              <div className="rounded-lg border border-neutral-900/60 bg-neutral-900/20 py-1 px-2">
                <div className="text-[9px] uppercase font-mono text-neutral-500">Total Days Remaining</div>
                <div className="font-ticker text-xs sm:text-sm font-bold text-rose-300/90 mt-0.5">
                  ~{totalDays.toLocaleString()} days
                </div>
              </div>

              <div className="rounded-lg border border-neutral-900/60 bg-neutral-900/20 py-1 px-2">
                <div className="text-[9px] uppercase font-mono text-neutral-500">Total Horizon (Decimal)</div>
                <div className="font-ticker text-xs sm:text-sm font-bold text-neutral-200 mt-0.5">
                  ~{totalYearsDecimal} years ({totalMonths} mos)
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "weeks" && (
          <motion.div
            key="weeks"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }}
            className="space-y-1.5 text-xs"
          >
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="rounded-xl border border-neutral-900 bg-neutral-900/50 p-2">
                <div className="text-[9px] uppercase text-neutral-500 font-mono">Weeks Lived</div>
                <div className="text-sm font-bold text-neutral-300 font-ticker mt-0.5">
                  {weeksLived.toLocaleString()}
                </div>
                <div className="text-[8px] text-neutral-500 font-mono mt-0.5">
                  {((weeksLived / totalWeeksInLife) * 100).toFixed(1)}% spent
                </div>
              </div>

              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2">
                <div className="text-[9px] uppercase text-rose-400 font-mono font-semibold">Weeks Left</div>
                <div className="text-sm font-bold text-rose-300 font-ticker mt-0.5">
                  {totalWeeks.toLocaleString()}
                </div>
                <div className="text-[8px] text-rose-400/80 font-mono mt-0.5">
                  {percentWeeksRemaining.toFixed(1)}% remaining
                </div>
              </div>

              <div className="rounded-xl border border-neutral-900 bg-neutral-900/50 p-2">
                <div className="text-[9px] uppercase text-neutral-500 font-mono">Total Life</div>
                <div className="text-sm font-bold text-white font-ticker mt-0.5">
                  {totalWeeksInLife.toLocaleString()}
                </div>
                <div className="text-[8px] text-neutral-500 font-mono mt-0.5">
                  ~4,000 weeks avg
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-neutral-900/30 border border-neutral-800/50 p-2 text-[10px] text-neutral-300 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-rose-400 shrink-0" />
              <span>
                <strong>Memento Mori:</strong> Seneca observed that life is not short, but that we waste much of it. You have <strong>{totalWeeks.toLocaleString()} weeks</strong> left to build what truly matters.
              </span>
            </div>
          </motion.div>
        )}

        {activeTab === "philosophical" && (
          <motion.div
            key="philosophical"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }}
            className="space-y-1.5 text-xs"
          >
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2">
                <div className="flex items-center justify-center gap-1 text-[9px] uppercase text-amber-400 font-mono">
                  <Sun className="h-2.5 w-2.5" />
                  <span>Summers</span>
                </div>
                <div className="text-sm font-bold text-amber-200 font-ticker mt-0.5">
                  ~{summersRemaining}
                </div>
                <div className="text-[8px] text-neutral-400 mt-0.5">Warm seasons left</div>
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-2">
                <div className="flex items-center justify-center gap-1 text-[9px] uppercase text-blue-400 font-mono">
                  <Coffee className="h-2.5 w-2.5" />
                  <span>Weekends</span>
                </div>
                <div className="text-sm font-bold text-blue-200 font-ticker mt-0.5">
                  ~{weekendsRemaining.toLocaleString()}
                </div>
                <div className="text-[8px] text-neutral-400 mt-0.5">Sat & Sun mornings</div>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2">
                <div className="flex items-center justify-center gap-1 text-[9px] uppercase text-emerald-400 font-mono">
                  <Clock className="h-2.5 w-2.5" />
                  <span>Awake Hours</span>
                </div>
                <div className="text-sm font-bold text-emerald-200 font-ticker mt-0.5">
                  ~{(wakingHoursRemaining / 1000).toFixed(0)}k
                </div>
                <div className="text-[8px] text-neutral-400 mt-0.5">Active conscious hrs</div>
              </div>
            </div>

            <div className="rounded-lg bg-neutral-900/30 border border-neutral-800/50 p-2 text-[10px] text-neutral-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>
                You will only experience <strong>{summersRemaining} more summers</strong> and <strong>{weekendsRemaining.toLocaleString()} more weekends</strong>. Make each one count.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
