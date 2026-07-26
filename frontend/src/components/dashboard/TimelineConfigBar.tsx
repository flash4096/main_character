"use client";

import { useState } from "react";
import { Calendar, HeartPulse, Sparkles } from "lucide-react";

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
  const [birthDate, setBirthDate] = useState(currentBirthDate);
  const [expectedLife, setExpectedLife] = useState(currentExpectedLife);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(birthDate, Number(expectedLife));
    setIsOpen(false);
  };

  return (
    <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-950/90 p-4 sm:p-5 backdrop-blur-md transition-all">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white font-semibold">
              Personalized Timeline Parameters
            </h3>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Born: <span className="font-mono text-neutral-200">{birthDate}</span> &bull; Target Horizon: <span className="font-mono text-neutral-200">{expectedLife} Years</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full border border-neutral-700 bg-white px-4 py-1.5 text-xs font-semibold text-black hover:bg-neutral-200 transition"
        >
          {isOpen ? "Close Editor" : "Set Birth Date & Life Horizon"}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSave} className="mt-4 border-t border-neutral-900 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
              Date of Birth
            </label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 h-4 w-4 text-neutral-500" />
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-black py-2 pl-9 pr-3 text-xs text-white focus:border-white focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
              Expected Life (Years)
            </label>
            <div className="relative flex items-center">
              <HeartPulse className="absolute left-3 h-4 w-4 text-neutral-500" />
              <input
                type="number"
                required
                min={1}
                max={150}
                value={expectedLife}
                onChange={(e) => setExpectedLife(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-800 bg-black py-2 pl-9 pr-3 text-xs text-white focus:border-white focus:outline-none transition"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-white py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition"
            >
              Update Countdown
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
