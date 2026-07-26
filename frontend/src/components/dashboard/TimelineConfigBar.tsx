"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, HeartPulse, User, Check, Edit3 } from "lucide-react";

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
  const [isVisible, setIsVisible] = useState<boolean>(false); // Start collapsed / hidden by default so dashboard is clean!

  useEffect(() => {
    setAge(computeAgeFromBirthDate(currentBirthDate));
    setBirthDate(currentBirthDate);
  }, [currentBirthDate]);

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

  const handleLifeChange = (newExpectedLife: number) => {
    setExpectedLife(newExpectedLife);
    onUpdate(birthDate, newExpectedLife);
  };

  const handleDone = () => {
    setIsVisible(false);
  };

  return (
    <div className="w-full">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="config-banner"
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="mb-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/90 p-5 sm:p-6 backdrop-blur-md shadow-2xl"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-white">
                  <Sparkles className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
                    Adjust Your Age & Life Expectancy
                  </h3>
                  <p className="text-xs text-neutral-400 font-light mt-0.5">
                    Real-time calculation. No signup required.
                  </p>
                </div>
              </div>

              {/* Direct Age & Life Expectancy Inputs */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
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

                <button
                  type="button"
                  onClick={handleDone}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-black hover:bg-neutral-200 transition"
                >
                  <Check className="h-4 w-4" />
                  <span>Done</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discrete "Adjust Age" trigger if user wants to open inputs */}
      {!isVisible && (
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsVisible(true)}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white font-mono transition py-1 px-2 rounded-lg hover:bg-neutral-900/50"
          >
            <Edit3 className="h-3 w-3" />
            <span>Set Age ({age})</span>
          </button>
        </div>
      )}
    </div>
  );
}
