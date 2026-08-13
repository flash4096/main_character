"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, Sparkles } from "lucide-react";
import { normalizeDateIso, formatDateDisplay } from "@/lib/calculations";

interface OnboardingModalProps {
  isOpen: boolean;
  onSubmit: (birthDateIso: string) => void;
}

// Formats raw digit input into "DD.MM.YYYY" as the user types
function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return [day, month, year].filter(Boolean).join(".");
}

export default function OnboardingModal({ isOpen, onSubmit }: OnboardingModalProps) {
  const [text, setText] = useState<string>("");

  const digitCount = text.replace(/\D/g, "").length;
  const isComplete = digitCount === 8;
  const previewIso = isComplete ? normalizeDateIso(text) : null;

  const handleChange = (raw: string) => {
    setText(formatDateInput(raw));
  };

  const handleSubmit = () => {
    if (!isComplete || !previewIso) return;
    onSubmit(previewIso);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-neutral-200"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-amber-500/10 via-amber-700/5 to-transparent blur-3xl" />

            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-amber-400">
                  Welcome
                </h3>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  When were you born?
                </h2>
              </div>
            </div>

            <p className="text-sm text-neutral-400 mb-5 leading-relaxed">
              Enter your date of birth to see your life, measured in the time you have lived and
              the time you have left.
            </p>

            <div className="mb-6">
              <label className="block text-[10px] text-neutral-500 font-mono uppercase mb-1.5">
                Date of Birth (DD.MM.YYYY)
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                placeholder="08.11.2002"
                value={text}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-3 text-lg font-bold tracking-wider text-white shadow-inner focus:border-amber-400 focus:outline-none text-center"
              />
              <p className="mt-2 h-4 text-center text-xs font-mono text-amber-300">
                {previewIso ? formatDateDisplay(previewIso) : " "}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isComplete}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-black hover:bg-amber-300 transition shadow-[0_0_20px_rgba(251,191,36,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-400"
            >
              <Calendar className="h-4 w-4" />
              <span>Begin</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-4 text-center text-[10px] text-neutral-500 font-mono">
              Stored securely and privately in your browser&apos;s local cache.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
