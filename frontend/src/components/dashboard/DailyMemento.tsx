"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/types";
import { getRandomQuestion } from "@/lib/api";
import { HelpCircle, RefreshCw } from "lucide-react";

interface DailyMementoProps {
  question: Question | null;
}

export default function DailyMemento({ question: initialQuestion }: DailyMementoProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(initialQuestion);
  const [isRotating, setIsRotating] = useState(false);
  const [secondsUntilNext, setSecondsUntilNext] = useState(30);

  const fetchNextQuestion = async () => {
    setIsRotating(true);
    try {
      const q = await getRandomQuestion();
      setCurrentQuestion(q);
      setSecondsUntilNext(30);
    } catch (e) {
      console.error("Failed to fetch random question:", e);
    } finally {
      setIsRotating(false);
    }
  };

  useEffect(() => {
    // Timer for counting down 30 seconds until next random question
    const timer = setInterval(() => {
      setSecondsUntilNext((prev) => {
        if (prev <= 1) {
          fetchNextQuestion();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!currentQuestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="group relative overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950/80 p-6 sm:p-8 transition-all hover:border-neutral-700/80 my-4"
    >
      <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-300 font-semibold">
          <HelpCircle className="h-4 w-4 text-white" />
          <span>Special Question For You</span>
        </div>
        <button
          onClick={fetchNextQuestion}
          disabled={isRotating}
          title="Get another question"
          className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-[11px] font-mono text-neutral-400 hover:text-white hover:border-neutral-700 transition"
        >
          <RefreshCw className={`h-3 w-3 ${isRotating ? "animate-spin text-white" : ""}`} />
          <span>Next ({secondsUntilNext}s)</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.blockquote
          key={currentQuestion.id + currentQuestion.text}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl font-light text-neutral-100 leading-relaxed tracking-tight my-2"
        >
          &ldquo;{currentQuestion.text}&rdquo;
        </motion.blockquote>
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between border-t border-neutral-900 pt-3 text-[11px] text-neutral-400 font-mono">
        <span>Question #{currentQuestion.id}</span>
        <span className="capitalize text-neutral-400">{currentQuestion.category || "existential"}</span>
      </div>
    </motion.div>
  );
}
