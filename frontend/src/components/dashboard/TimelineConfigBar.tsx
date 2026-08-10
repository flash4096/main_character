"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  HeartPulse, 
  Sparkles, 
  Check, 
  Sliders, 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { 
  formatDateDisplay, 
  calculateCurrentAge, 
  DEFAULT_BIRTH_DATE, 
  DEFAULT_LIFE_EXPECTANCY 
} from "@/lib/calculations";

interface TimelineConfigBarProps {
  currentBirthDate: string;
  currentExpectedLife: number;
  onUpdate: (birthDate: string, expectedLife: number) => void;
}

export default function TimelineConfigBar({
  currentBirthDate,
  currentExpectedLife,
  onUpdate,
}: TimelineConfigBarProps) {
  const [birthDate, setBirthDate] = useState<string>(currentBirthDate || DEFAULT_BIRTH_DATE);
  const [expectedLife, setExpectedLife] = useState<number>(currentExpectedLife || DEFAULT_LIFE_EXPECTANCY);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [justSaved, setJustSaved] = useState<boolean>(false);

  useEffect(() => {
    if (currentBirthDate) setBirthDate(currentBirthDate);
    if (currentExpectedLife) setExpectedLife(currentExpectedLife);
  }, [currentBirthDate, currentExpectedLife]);

  const currentAgeObj = calculateCurrentAge(birthDate);
  const ageYears = currentAgeObj.years;

  const handleDateChange = (newDate: string) => {
    if (!newDate) return;
    setBirthDate(newDate);
    onUpdate(newDate, expectedLife);
    triggerSaveFeedback();
  };

  const handleExpectancyChange = (newExp: number) => {
    const clamped = Math.max(1, Math.min(130, newExp));
    setExpectedLife(clamped);
    onUpdate(birthDate, clamped);
    triggerSaveFeedback();
  };

  const triggerSaveFeedback = () => {
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const quickYearPresets = [
    { label: "1990", date: "1990-06-15" },
    { label: "1995", date: "1995-06-15" },
    { label: "1998", date: "1998-01-01" },
    { label: "2000", date: "2000-01-01" },
    { label: "2005", date: "2005-01-01" },
  ];

  const quickExpectancyPresets = [75, 80, 85, 90];

  const handleReset = () => {
    setBirthDate(DEFAULT_BIRTH_DATE);
    setExpectedLife(DEFAULT_LIFE_EXPECTANCY);
    onUpdate(DEFAULT_BIRTH_DATE, DEFAULT_LIFE_EXPECTANCY);
    triggerSaveFeedback();
  };

  // Max selectable birthdate is today
  const todayIso = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full">
      {/* Top Quick Status & Config Bar */}
      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/80 p-3.5 sm:p-4 backdrop-blur-md shadow-2xl transition-all duration-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Active Configuration Summary */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/90 text-white shadow-inner">
              <Calendar className="h-4 w-4 text-amber-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Birth Date:
                </span>
                <span className="text-sm font-bold text-white font-ticker">
                  {formatDateDisplay(birthDate)}
                </span>
                <span className="inline-flex items-center rounded-full bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                  {ageYears} yrs old
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono mt-0.5">
                <span className="flex items-center gap-1">
                  <HeartPulse className="h-3 w-3 text-rose-500/80" />
                  Target: <strong className="text-neutral-200">{expectedLife} yrs</strong>
                </span>
                <span className="text-neutral-600">•</span>
                <span className="flex items-center gap-1 text-emerald-400/90">
                  <ShieldCheck className="h-3 w-3" />
                  {justSaved ? "Saved to Frontend Cache" : "Cached in Browser"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition border ${
                isExpanded 
                  ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]" 
                  : "bg-neutral-900/90 text-neutral-200 border-neutral-800 hover:border-neutral-700 hover:text-white"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>{isExpanded ? "Close Settings" : "Change Birth Date"}</span>
              {isExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Input & Settings Drawer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="settings-drawer"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-t border-neutral-800/60 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                
                {/* 1. Direct Birth Date Input (5 cols) */}
                <div className="lg:col-span-5 space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300">
                    Enter Your Exact Birth Date:
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="date"
                      value={birthDate}
                      max={todayIso}
                      min="1900-01-01"
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-900/90 px-3.5 py-2.5 text-sm font-semibold font-ticker text-white shadow-inner focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                    />
                  </div>

                  {/* Quick Year Presets */}
                  <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
                    <span className="text-[10px] text-neutral-500 font-mono uppercase">Quick:</span>
                    {quickYearPresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleDateChange(preset.date)}
                        className={`rounded-lg px-2 py-0.5 text-[11px] font-mono transition border ${
                          birthDate.startsWith(preset.label)
                            ? "bg-amber-400/20 border-amber-400/50 text-amber-300"
                            : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Target Life Expectancy (4 cols) */}
                <div className="lg:col-span-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300">
                      Life Expectancy Target:
                    </label>
                    <span className="text-xs font-bold font-ticker text-rose-400">
                      {expectedLife} years
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={40}
                      max={120}
                      value={expectedLife}
                      onChange={(e) => handleExpectancyChange(Number(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer h-2 bg-neutral-900 rounded-lg"
                    />
                    <input
                      type="number"
                      min={1}
                      max={130}
                      value={expectedLife}
                      onChange={(e) => handleExpectancyChange(Number(e.target.value))}
                      className="w-16 rounded-xl border border-neutral-700 bg-neutral-900/90 px-2 py-2 text-center text-xs font-bold font-ticker text-white focus:border-rose-400 focus:outline-none"
                    />
                  </div>

                  {/* Expectancy Quick Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-neutral-500 font-mono uppercase">Target:</span>
                    {quickExpectancyPresets.map((exp) => (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => handleExpectancyChange(exp)}
                        className={`rounded-lg px-2 py-0.5 text-[11px] font-mono transition border ${
                          expectedLife === exp
                            ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                            : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                        }`}
                      >
                        {exp}y
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Actions / Reset / Done (3 cols) */}
                <div className="lg:col-span-3 flex items-center gap-2 justify-end pt-2 md:pt-0">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-xs font-medium text-neutral-400 hover:text-white hover:border-neutral-700 transition"
                    title="Reset to default"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-black hover:bg-neutral-200 transition shadow-lg flex-1 sm:flex-initial justify-center"
                  >
                    <Check className="h-4 w-4" />
                    <span>Apply & Save</span>
                  </button>
                </div>

              </div>

              {/* Info Note */}
              <div className="mt-3.5 flex items-center justify-between text-[11px] text-neutral-500 font-mono border-t border-neutral-900 pt-2.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  Your birth date is stored securely and privately in your browser&apos;s local cache.
                </span>
                <span>Real-time Live Engine</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
