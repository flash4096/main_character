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
    <div className="p-4 sm:p-4.5">
      <div className="flex items-center justify-between border-b border-neutral-900 pb-2 mb-2.5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-300 font-semibold">
          <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
          <span>Existential Question For You</span>
        </div>
        <button
          onClick={fetchNextQuestion}
          disabled={isRotating}
          title="Get another question"
          className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 text-[10px] font-mono text-neutral-400 hover:text-white hover:border-neutral-700 transition"
        >
          <RefreshCw className={`h-2.5 w-2.5 ${isRotating ? "animate-spin text-white" : ""}`} />
          <span>Next ({secondsUntilNext}s)</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.blockquote
          key={currentQuestion.id + currentQuestion.text}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="text-sm sm:text-base font-light text-neutral-100 leading-relaxed tracking-tight my-1.5"
        >
          &ldquo;{currentQuestion.text}&rdquo;
        </motion.blockquote>
      </AnimatePresence>

      <div className="mt-2.5 flex items-center justify-between border-t border-neutral-900 pt-2 text-[10px] text-neutral-400 font-mono">
        <span>Question #{currentQuestion.id}</span>
        <span className="capitalize text-neutral-400">{currentQuestion.category || "existential"}</span>
      </div>
    </div>
  );
}
