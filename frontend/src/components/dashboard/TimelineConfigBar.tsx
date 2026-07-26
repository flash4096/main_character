"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, HeartPulse, User, Check, Edit3, X } from "lucide-react";

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
  const computeAgeFromBirthDate = (bDateStr: string): number => {
    const bDate = new Date(bDateStr);
    const now = new Date();
    let years = now.getFullYear() - bDate.getFullYear();
    if (
      now.getMonth() < bDate.getMonth() ||
      (now.getMonth() === bDate.getMonth() && now.getDate() < bDate.getDate())
    ) {
      years--;
    }
    return Math.max(0, years);
  };

  const [age, setAge] = useState<number>(computeAgeFromBirthDate(currentBirthDate));
  const [expectedLife, setExpectedLife] = useState<number>(currentExpectedLife);
  const [birthDate, setBirthDate] = useState<string>(currentBirthDate);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const savedBirth = localStorage.getItem("memento_user_birth_date");
    if (savedBirth) {
      setIsConfigured(true);
      setIsVisible(false); // Hide by default if already configured!
    }
  }, []);

  const handleAgeChange = (newAge: number) => {
    setAge(newAge);
    const now = new Date();
    const birthYear = now.getFullYear() - newAge;
    const monthStr = String(now.getMonth() + 1).padStart(2, "0");
    const dayStr = String(now.getDate()).padStart(2, "0");
    const calculatedBirthDate = `${birthYear}-${monthStr}-${dayStr}`;
    setBirthDate(calculatedBirthDate);
    onUpdate(calculatedBirthDate, expectedLife);
  };

  const handleBirthDateChange = (newBirthDate: string) => {
    setBirthDate(newBirthDate);
    const newAge = computeAgeFromBirthDate(newBirthDate);
    setAge(newAge);
    onUpdate(newBirthDate, expectedLife);
  };

  const handleLifeChange = (newExpectedLife: number) => {
    setExpectedLife(newExpectedLife);
    onUpdate(birthDate, newExpectedLife);
  };

  const handleApplyAndHide = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsConfigured(true);
    setIsVisible(false);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {isVisible ? (
          <motion.div
            key="config-banner"
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/90 p-5 sm:p-6 backdrop-blur-md shadow-2xl"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-white">
                  <Sparkles className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
                    Enter Your Age to See Your Live Countdown
                  </h3>
                  <p className="text-xs text-neutral-400 font-light mt-0.5">
                    No signup required. Instant real-time calculation.
                  </p>
                </div>
              </div>

              {/* Direct Age & Life Expectancy Inputs */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Age Input */}
                <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-black px-3 py-2">
                  <User className="h-4 w-4 text-neutral-400" />
                  <span className="text-xs text-neutral-400 font-mono">Age:</span>
                  <input
                    type="number"
                    min={0}
                    max={130}
                    value={age}
                    onChange={(e) => handleAgeChange(Number(e.target.value))}
                    className="w-14 bg-transparent text-sm font-bold font-ticker text-white focus:outline-none text-center"
                  />
                  <span className="text-xs text-neutral-500 font-mono">yrs</span>
                </div>

                {/* Target Life Horizon */}
                <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-black px-3 py-2">
                  <HeartPulse className="h-4 w-4 text-neutral-400" />
                  <span className="text-xs text-neutral-400 font-mono">Target:</span>
                  <input
                    type="number"
                    min={1}
                    max={150}
                    value={expectedLife}
                    onChange={(e) => handleLifeChange(Number(e.target.value))}
                    className="w-14 bg-transparent text-sm font-bold font-ticker text-white focus:outline-none text-center"
                  />
                  <span className="text-xs text-neutral-500 font-mono">yrs</span>
                </div>

                {/* Confirm & Hide Button */}
                <button
                  type="button"
                  onClick={handleApplyAndHide}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-black hover:bg-neutral-200 transition"
                >
                  <Check className="h-4 w-4" />
                  <span>Done</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="minimized-bar"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center justify-between rounded-xl border border-neutral-900 bg-neutral-950/60 px-4 py-2 text-xs text-neutral-400 font-mono"
          >
            <div className="flex items-center gap-3">
              <span>Age: <strong className="text-white">{age}</strong></span>
              <span>&bull;</span>
              <span>Target: <strong className="text-white">{expectedLife} Yrs</strong></span>
              <span>&bull;</span>
              <span className="text-neutral-500">Timeline Active</span>
            </div>

            <button
              onClick={() => setIsVisible(true)}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1 text-[11px] text-neutral-300 hover:text-white hover:border-neutral-700 transition"
            >
              <Edit3 className="h-3 w-3" />
              <span>Change Age</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
