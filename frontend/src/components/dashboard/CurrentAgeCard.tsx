"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CurrentAge } from "@/types";

interface CurrentAgeCardProps {
  birthDateIso: string;
  initialAge: CurrentAge;
}

export default function CurrentAgeCard({ birthDateIso, initialAge }: CurrentAgeCardProps) {
  const [age, setAge] = useState<CurrentAge>(initialAge);

  useEffect(() => {
    const birthDate = new Date(birthDateIso);

    const updateAge = () => {
      const now = new Date();
      const diffMs = now.getTime() - birthDate.getTime();
      const totalSeconds = Math.max(0, diffMs / 1000);
      const totalYears = totalSeconds / (365.2425 * 86400);

      // Precise breakdown
      let years = now.getUTCFullYear() - birthDate.getUTCFullYear();
      let months = now.getUTCMonth() - birthDate.getUTCMonth();
      let days = now.getUTCDate() - birthDate.getUTCDate();
      let hours = now.getUTCHours();
      let minutes = now.getUTCMinutes();
      let seconds = now.getUTCSeconds();

      if (seconds < 0) {
        minutes -= 1;
        seconds += 60;
      }
      if (minutes < 0) {
        hours -= 1;
        minutes += 60;
      }
      if (hours < 0) {
        days -= 1;
        hours += 24;
      }
      if (days < 0) {
        months -= 1;
        const prevMonthDays = new Date(now.getUTCFullYear(), now.getUTCMonth(), 0).getDate();
        days += prevMonthDays;
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      setAge({
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds),
        total_seconds: totalSeconds,
        total_years: totalYears,
      });
    };

    updateAge();
    const interval = setInterval(updateAge, 1000);
    return () => clearInterval(interval);
  }, [birthDateIso]);

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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col rounded-2xl border border-neutral-800/80 bg-surface/50 p-6 sm:p-8 backdrop-blur-xs"
    >
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4 mb-6">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
            Current Age
          </h2>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Exact time elapsed since birth ({age.total_years.toFixed(2)} years)
          </p>
        </div>
        <div className="h-2 w-2 rounded-full bg-emerald-500/80 animate-ping" />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center rounded-xl border border-neutral-900 bg-neutral-950/80 py-4 px-2"
          >
            <span className="font-ticker text-2xl sm:text-3xl font-light text-white">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
