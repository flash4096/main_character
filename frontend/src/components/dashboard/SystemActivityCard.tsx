"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Calendar, Flame, Activity, Sparkles, CheckCircle2, ShieldAlert, ArrowUpRight } from "lucide-react";

interface ActivityItem {
  id: string;
  author: string;
  action: string;
  timeAgo: string;
  type: "mission" | "courage" | "mindset" | "choice";
  streak: number;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    author: "Elena Rostova",
    action: "Authored mission: Stop postponing my creative legacy project",
    timeAgo: "2m ago",
    type: "mission",
    streak: 42,
  },
  {
    id: "2",
    author: "Marcus Vance",
    action: "Chose courage over comfort: Confronted difficult conversation",
    timeAgo: "5m ago",
    type: "courage",
    streak: 18,
  },
  {
    id: "3",
    author: "David Sterling",
    action: "Reclaimed focus: Rejected someone else's agenda for 8 straight hours",
    timeAgo: "12m ago",
    type: "mindset",
    streak: 95,
  },
  {
    id: "4",
    author: "Sophia Ramos",
    action: "Defined Monthly Intention: Master independence of thought",
    timeAgo: "19m ago",
    type: "choice",
    streak: 31,
  },
  {
    id: "5",
    author: "Alex Morgan",
    action: "Refused artificial authority & trusted own judgment in key decision",
    timeAgo: "27m ago",
    type: "mindset",
    streak: 64,
  },
];

export default function SystemActivityCard({ onOpenManifest }: { onOpenManifest: () => void }) {
  const [activeTab, setActiveTab] = useState<"live" | "today" | "month">("live");

  return (
    <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-5 backdrop-blur-md shadow-2xl flex flex-col gap-4">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-900 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-amber-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>Main Character Network</span>
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight mt-0.5">
            System & Temporal Milestones
          </h3>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center rounded-xl bg-neutral-900/90 p-1 border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              activeTab === "live"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-amber-400" />
            <span>Live Now</span>
          </button>

          <button
            onClick={() => setActiveTab("today")}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              activeTab === "today"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Calendar className="h-3.5 w-3.5 text-amber-400" />
            <span>This Day</span>
          </button>

          <button
            onClick={() => setActiveTab("month")}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              activeTab === "month"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>This Month</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-3.5">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>Live in System</span>
            <Users className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1">1,428</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Active Main Characters online</div>
        </div>

        <div className="rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-3.5">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>This Day</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1">4,820</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Missions authored today</div>
        </div>

        <div className="rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-3.5">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>This Month</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          </div>
          <div className="text-xl font-bold text-white mt-1">124,500</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Courageous choices logged</div>
        </div>
      </div>

      {/* Tab Specific Dynamic View */}
      <AnimatePresence mode="wait">
        {activeTab === "live" && (
          <motion.div
            key="live"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-2 pt-1"
          >
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono px-1">
              <span>Recent Main Character Actions</span>
              <span className="text-amber-400/90 font-semibold">Real-time Stream</span>
            </div>

            <div className="space-y-2">
              {MOCK_ACTIVITIES.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-900 bg-neutral-900/30 p-3 text-xs hover:border-neutral-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">{act.author}</span>
                      <span className="text-neutral-400 ml-2 font-light">{act.action}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-neutral-400 font-mono text-[11px]">
                    <span className="bg-neutral-800/80 px-2 py-0.5 rounded-md text-amber-300">
                      {act.streak}d streak
                    </span>
                    <span>{act.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "today" && (
          <motion.div
            key="today"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-xl border border-neutral-800/60 bg-neutral-900/30 p-4 space-y-3"
          >
            <h4 className="text-xs uppercase tracking-widest text-neutral-300 font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-400" />
              <span>This Day&apos;s Focus for Main Characters</span>
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Today, 89% of active Main Characters prioritized personal autonomy over external demands. Top action taken: <span className="text-white font-medium">&ldquo;Walking directly toward fear instead of away from it.&rdquo;</span>
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/50 text-xs">
              <span className="text-neutral-400">Daily Mission Completion Rate:</span>
              <span className="font-mono text-amber-400 font-bold">94.2%</span>
            </div>
          </motion.div>
        )}

        {activeTab === "month" && (
          <motion.div
            key="month"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-xl border border-neutral-800/60 bg-neutral-900/30 p-4 space-y-3"
          >
            <h4 className="text-xs uppercase tracking-widest text-neutral-300 font-semibold flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              <span>This Month&apos;s System Impact</span>
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Main Characters across the world have reclaimed over <span className="text-white font-medium">340,000 hours</span> of personal agency this month alone by breaking free from artificial authority and writing their own script.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/50 text-xs">
              <span className="text-neutral-400">System Growth (Active Authors):</span>
              <span className="font-mono text-emerald-400 font-bold">+24.5% this month</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-900 text-xs">
        <span className="text-neutral-400 font-mono">
          System Status: Operational &bull; Live
        </span>
        <button
          onClick={onOpenManifest}
          className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition group"
        >
          <span>What is Main Character?</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}
