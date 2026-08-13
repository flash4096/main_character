"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Compass, ShieldCheck, Target, Flame, ArrowRight, Gamepad2 } from "lucide-react";

interface MainCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MainCharacterModal({ isOpen, onClose }: MainCharacterModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl my-auto text-neutral-200"
          >
            {/* Ambient Background Gradient Accent */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-amber-500/10 via-amber-700/5 to-transparent blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-orange-500/10 via-amber-900/5 to-transparent blur-3xl" />

            {/* Header / Top Controls */}
            <div className="flex items-center justify-between border-b border-neutral-900 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-amber-400">
                    The Core Philosophy
                  </h3>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                    Who is Main Character?
                  </h2>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800 hover:text-white transition"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="mt-6 space-y-5 text-sm sm:text-base leading-relaxed text-neutral-300 font-light">
              <p className="text-base sm:text-lg text-neutral-100 font-normal border-l-2 border-amber-500/80 pl-4 py-1">
                Main Character is a mindset, a way of acting, and a way of life.
              </p>

              <div className="space-y-3.5 divide-y divide-neutral-900/60">
                <div className="pt-2 flex items-start gap-3">
                  <Target className="h-5 w-5 text-amber-400/80 shrink-0 mt-0.5" />
                  <p>
                    It is the mindset where you put yourself first. Where you assign roles, create missions, and set the direction — instead of being controlled by someone else’s agenda.
                  </p>
                </div>

                <div className="pt-3.5 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-amber-400/80 shrink-0 mt-0.5" />
                  <p>
                    Where you have no idols and no artificial authorities. Where you trust your own judgment, think independently, and cannot be manipulated by bullshit.
                  </p>
                </div>

                <div className="pt-3.5 flex items-start gap-3">
                  <Compass className="h-5 w-5 text-amber-400/80 shrink-0 mt-0.5" />
                  <p>
                    Where you play your own game, not someone else’s.
                  </p>
                </div>

                <div className="pt-3.5 flex items-start gap-3">
                  <Flame className="h-5 w-5 text-amber-400/80 shrink-0 mt-0.5" />
                  <p>
                    Where you write your own script through your intentions, choices, and actions — instead of letting life write the script for you.
                  </p>
                </div>

                <div className="pt-3.5 flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-amber-400/80 shrink-0 mt-0.5" />
                  <p>
                    It is the path of the person who walks toward fear instead of away from it. The person who chooses courage over comfort, experience over hesitation, and lives a truly authentic life.
                  </p>
                </div>

                <div className="pt-3.5 flex items-start gap-3">
                  <Gamepad2 className="h-5 w-5 text-amber-400/80 shrink-0 mt-0.5" />
                  <p>
                    Where you treat everything as a game. Nothing is that serious — that lightness is what lets you take bigger swings, shrug off losses, and keep playing until you win.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-neutral-200 font-medium italic">
                Main Character is someone who takes ownership of their story.
              </div>

              {/* High-impact Brand Quote Card */}
              <div className="mt-6 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-neutral-900 to-amber-950/20 p-5 shadow-lg relative overflow-hidden">
                <div className="text-xs uppercase tracking-widest text-amber-400/90 font-mono mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Brand Manifesto</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-white leading-snug tracking-tight font-sans">
                  &ldquo;Main Character is the person who stops being a background character in someone else’s story and becomes the author of their own.&rdquo;
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-full bg-amber-400 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-black hover:bg-amber-300 transition shadow-[0_0_20px_rgba(251,191,36,0.3)]"
              >
                Become the Author
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
