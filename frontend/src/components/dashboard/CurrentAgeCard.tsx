"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CurrentAge } from "@/types";
import { calculateCurrentAge } from "@/lib/calculations";
import { formatNumberWithCommas } from "@/lib/utils";
import { Hourglass, Sparkles, Activity } from "lucide-react";

interface CurrentAgeCardProps {
  birthDateIso: string;
  initialAge?: CurrentAge;
}

export default function CurrentAgeCard({ birthDateIso, initialAge }: CurrentAgeCardProps) {
  const [age, setAge] = useState<CurrentAge>(
    initialAge || calculateCurrentAge(birthDateIso)
  );

  useEffect(() => {
    const updateAge = () => {
      setAge(calculateCurrentAge(birthDateIso));
    };

    updateAge();
    const interval = setInterval(updateAge, 1000);
    return () => clearInterval(interval);
  }, [birthDateIso]);

  const totalDaysLived = Math.floor(age.total_seconds / 86400);
  const totalHoursLived = Math.floor(age.total_seconds / 3600);

  const timeUnits = [
    { label: "Years", value: age.years },
    { label: "Months", value: age.months },
    { label: "Days", value: age.days },
    { label: "Hours", value: age.hours },
    { label: "Minutes", value: age.minutes },
    { label: "Seconds", value: age.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-3 sm:p-3.5 backdrop-blur-md shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-neutral-900 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-amber-400">
            <Hourglass className="h-3 w-3" />
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-widest text-neutral-300 font-semibold">
              Time You Have Lived
            </h2>
            <p className="text-[10px] text-neutral-500 font-mono">
              Exact elapsed time since birth ({age.total_years.toFixed(2)} yrs)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[9px] font-mono text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Ticking</span>
        </div>
      </div>

      {/* Live Breakdown Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center rounded-xl border border-neutral-900 bg-neutral-900/40 py-1.5 px-1"
          >
            <span className="font-ticker text-base sm:text-lg font-bold text-white">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[8px] uppercase tracking-wider text-neutral-400 mt-0.5 font-mono">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      {/* Total Days & Hours Summary */}
      <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-center border-t border-neutral-900/80 pt-2">
        <div className="rounded-lg border border-neutral-900/60 bg-neutral-900/20 py-1 px-2">
          <div className="text-[9px] uppercase font-mono text-neutral-500">Total Days Lived</div>
          <div className="font-ticker text-xs sm:text-sm font-bold text-neutral-200 mt-0.5">
            {totalDaysLived.toLocaleString()} days
          </div>
        </div>

        <div className="rounded-lg border border-neutral-900/60 bg-neutral-900/20 py-1 px-2">
          <div className="text-[9px] uppercase font-mono text-neutral-500">Total Hours Lived</div>
          <div className="font-ticker text-xs sm:text-sm font-bold text-neutral-200 mt-0.5">
            {totalHoursLived.toLocaleString()} hrs
          </div>
        </div>
      </div>
    </motion.div>
  );
}
