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
  normalizeDateIso,
  parseDateToParts,
  getCachedCustomLifeExpectancyEnabled,
  setCachedCustomLifeExpectancyEnabled,
  DEFAULT_BIRTH_DATE,
  DEFAULT_LIFE_EXPECTANCY
} from "@/lib/calculations";

// Formats raw digit input into "DD.MM.YYYY" as the user types
function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return [day, month, year].filter(Boolean).join(".");
}

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
  const [birthDate, setBirthDate] = useState<string>(normalizeDateIso(currentBirthDate || DEFAULT_BIRTH_DATE));
  const [expectedLife, setExpectedLife] = useState<number>(currentExpectedLife || DEFAULT_LIFE_EXPECTANCY);
  const [isCustomExpectancyEnabled, setIsCustomExpectancyEnabled] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const [dateText, setDateText] = useState<string>("");

  useEffect(() => {
    if (currentBirthDate) {
      const normalized = normalizeDateIso(currentBirthDate);
      setBirthDate(normalized);
    }
    if (currentExpectedLife) setExpectedLife(currentExpectedLife);
    setIsCustomExpectancyEnabled(getCachedCustomLifeExpectancyEnabled());
  }, [currentBirthDate, currentExpectedLife]);

  const currentAgeObj = calculateCurrentAge(birthDate);
  const ageYears = currentAgeObj.years;

  // Keep the text field in sync with the active birth date (e.g. after preset/reset)
  useEffect(() => {
    const { day, month, year } = parseDateToParts(birthDate);
    setDateText(
      `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`
    );
  }, [birthDate]);

  const handleDateChange = (newDate: string) => {
    if (!newDate) return;
    const normalized = normalizeDateIso(newDate);
    setBirthDate(normalized);
    onUpdate(normalized, expectedLife);
    triggerSaveFeedback();
  };

  const handleDateTextChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    const formatted = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
      .filter(Boolean)
      .join(".");
    setDateText(formatted);
    if (digits.length === 8) {
      handleDateChange(formatted);
    }
  };

  const handleExpectancyChange = (newExp: number) => {
    const clamped = Math.max(1, Math.min(130, newExp));
    setExpectedLife(clamped);
    onUpdate(birthDate, clamped);
    triggerSaveFeedback();
  };

  const handleToggleCustomExpectancy = () => {
    const nextState = !isCustomExpectancyEnabled;
    setIsCustomExpectancyEnabled(nextState);
    setCachedCustomLifeExpectancyEnabled(nextState);
    if (!nextState) {
      setExpectedLife(DEFAULT_LIFE_EXPECTANCY);
      onUpdate(birthDate, DEFAULT_LIFE_EXPECTANCY);
    } else {
      onUpdate(birthDate, expectedLife);
    }
    triggerSaveFeedback();
  };

  const triggerSaveFeedback = () => {
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const quickYearPresets = [
    { label: "08 Nov 2002", date: "2002-11-08" },
    { label: "1998", date: "1998-01-01" },
    { label: "2000", date: "2000-01-01" },
    { label: "2005", date: "2005-01-01" },
    { label: "1995", date: "1995-06-15" },
    { label: "1990", date: "1990-06-15" },
  ];

  const quickExpectancyPresets = [75, 80, 85, 90];

  const handleReset = () => {
    setBirthDate(DEFAULT_BIRTH_DATE);
    setExpectedLife(DEFAULT_LIFE_EXPECTANCY);
    setIsCustomExpectancyEnabled(false);
    setCachedCustomLifeExpectancyEnabled(false);
    onUpdate(DEFAULT_BIRTH_DATE, DEFAULT_LIFE_EXPECTANCY);
    triggerSaveFeedback();
  };

  return (
    <div className="w-full">
      {/* Top Quick Status & Config Bar */}
      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/80 p-2.5 sm:p-3 backdrop-blur-md shadow-2xl transition-all duration-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          
          {/* Active Configuration Summary */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/90 text-white shadow-inner">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Birth Date:
                </span>
                <span className="text-xs sm:text-sm font-bold text-white font-ticker">
                  {formatDateDisplay(birthDate)}
                </span>
                <span className="inline-flex items-center rounded-full bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[9px] font-mono text-amber-300">
                  {ageYears} yrs old
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] text-neutral-400 font-mono mt-0.5">
                <span className="flex items-center gap-1">
                  <HeartPulse className="h-2.5 w-2.5 text-rose-500/80" />
                  Target: <strong className="text-neutral-200">{expectedLife} yrs</strong>
                  {!isCustomExpectancyEnabled && (
                    <span className="text-[9px] text-neutral-500 ml-0.5">(Default)</span>
                  )}
                </span>
                <span className="text-neutral-600">•</span>
                <span className="flex items-center gap-1 text-emerald-400/90">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  {justSaved ? "Saved" : "Cached"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition border ${
                isExpanded 
                  ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.15)]" 
                  : "bg-neutral-900/90 text-neutral-200 border-neutral-800 hover:border-neutral-700 hover:text-white"
              }`}
            >
              <Sliders className="h-3 w-3" />
              <span>{isExpanded ? "Close" : "Change Date / Expectancy"}</span>
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3 text-neutral-400" />
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
                
                {/* 1. Direct Numeric Date Entry (6 cols) */}
                <div className="lg:col-span-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Date of Birth (DD.MM.YYYY):
                    </label>
                    <span className="text-xs font-bold font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                      {formatDateDisplay(birthDate)} ({ageYears} yrs)
                    </span>
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="08.11.2002"
                    value={dateText}
                    onChange={(e) => handleDateTextChange(e.target.value)}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm font-bold font-ticker tracking-wider text-white shadow-inner focus:border-amber-400 focus:outline-none text-center"
                  />

                  {/* Direct Input & Quick Presets */}
                  <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
                    <span className="text-[10px] text-neutral-500 font-mono uppercase">Quick:</span>
                    {quickYearPresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleDateChange(preset.date)}
                        className={`rounded-lg px-2 py-0.5 text-[11px] font-mono transition border whitespace-nowrap ${
                          birthDate === preset.date
                            ? "bg-amber-400/20 border-amber-400/50 text-amber-300 font-bold"
                            : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Target Life Expectancy (4 cols) - Disabled by default with toggle */}
                <div className="lg:col-span-4 space-y-2 rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <HeartPulse className="h-3.5 w-3.5 text-rose-400" />
                      <label className="text-xs font-medium uppercase tracking-wider text-neutral-300 cursor-pointer" onClick={handleToggleCustomExpectancy}>
                        Life Expectancy Target
                      </label>
                    </div>
                    
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isCustomExpectancyEnabled}
                      onClick={handleToggleCustomExpectancy}
                      title={isCustomExpectancyEnabled ? "Disable custom target (use default 73y)" : "Enable custom target"}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isCustomExpectancyEnabled ? "bg-rose-500" : "bg-neutral-800"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isCustomExpectancyEnabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {!isCustomExpectancyEnabled ? (
                    <div className="flex flex-col gap-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span>Standard Benchmark: <strong className="text-neutral-200">{DEFAULT_LIFE_EXPECTANCY} yrs</strong></span>
                        <span className="text-[10px] text-neutral-500 font-mono">Turn off</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 leading-tight">
                        Target disabled. Using standard global benchmark ({DEFAULT_LIFE_EXPECTANCY}y). Toggle switch to customize.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-neutral-400 font-mono">Custom Target:</span>
                        <span className="text-xs font-bold font-ticker text-rose-400">
                          {expectedLife} years
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <input
                          type="range"
                          min={40}
                          max={120}
                          value={expectedLife}
                          onChange={(e) => handleExpectancyChange(Number(e.target.value))}
                          className="w-full accent-rose-500 cursor-pointer h-2 bg-neutral-950 rounded-lg"
                        />
                        <input
                          type="number"
                          min={1}
                          max={130}
                          value={expectedLife}
                          onChange={(e) => handleExpectancyChange(Number(e.target.value))}
                          className="w-14 rounded-lg border border-neutral-700 bg-neutral-950 px-1.5 py-1 text-center text-xs font-bold font-ticker text-white focus:border-rose-400 focus:outline-none"
                        />
                      </div>

                      {/* Expectancy Quick Buttons */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] text-neutral-500 font-mono uppercase">Quick:</span>
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
                  )}
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
