"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import TimelineConfigBar from "./TimelineConfigBar";
import LifeClock from "./LifeClock";
import CountdownHero from "./CountdownHero";
import ProgressSection from "./ProgressSection";
import DailyMemento from "./DailyMemento";
import DailyQuote from "./DailyQuote";
import SystemActivityCard from "./SystemActivityCard";
import MainCharacterModal from "./MainCharacterModal";
import { DashboardData, CurrentAge, RemainingLife } from "@/types";
import { getDashboardData } from "@/lib/api";

interface DashboardWrapperProps {
  initialData: DashboardData;
}

export default function DashboardWrapper({ initialData }: DashboardWrapperProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [birthDate, setBirthDate] = useState<string>(initialData.birth_date);
  const [expectedLifeYears, setExpectedLifeYears] = useState<number>(initialData.expected_life_years);
  const [isManifestOpen, setIsManifestOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedBirth = localStorage.getItem("memento_user_birth_date");
    const savedExpectancy = localStorage.getItem("memento_user_life_expectancy");

    const effectiveBirth = savedBirth || birthDate;
    const effectiveExpectancy = savedExpectancy ? Number(savedExpectancy) : expectedLifeYears;

    setBirthDate(effectiveBirth);
    setExpectedLifeYears(effectiveExpectancy);

    recalculateMetrics(effectiveBirth, effectiveExpectancy);
  }, []);

  const recalculateMetrics = (bDateStr: string, expYears: number) => {
    const now = new Date();
    const bDate = new Date(bDateStr);

    const targetDays = expYears * 365.2425;
    const estimatedDeath = new Date(bDate.getTime() + targetDays * 86400 * 1000);
    const remSeconds = Math.max(0, (estimatedDeath.getTime() - now.getTime()) / 1000);
    const isGift = remSeconds <= 0;

    const remDeltaMs = Math.max(0, estimatedDeath.getTime() - now.getTime());
    const totalDaysLeft = Math.floor(remDeltaMs / (86400 * 1000));
    const remYears = Math.floor(totalDaysLeft / 365);
    const remMonths = Math.floor((totalDaysLeft % 365) / 30);
    const remDays = (totalDaysLeft % 365) % 30;

    const diffMs = Math.max(0, now.getTime() - bDate.getTime());
    const totalSeconds = diffMs / 1000;
    const totalYears = totalSeconds / (365.2425 * 86400);

    const updatedAge: CurrentAge = {
      years: Math.max(0, now.getFullYear() - bDate.getFullYear()),
      months: Math.max(0, now.getMonth() - bDate.getMonth()),
      days: Math.max(0, now.getDate() - bDate.getDate()),
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      total_seconds: totalSeconds,
      total_years: totalYears,
    };

    const updatedRemaining: RemainingLife = {
      years: remYears,
      months: remMonths,
      days: remDays,
      total_days: totalDaysLeft,
    };

    setData((prev) => ({
      ...prev,
      birth_date: bDateStr,
      expected_life_years: expYears,
      current_age: updatedAge,
      remaining_life: updatedRemaining,
      remaining_seconds: remSeconds,
      is_gift: isGift,
    }));
  };

  const handleTimelineUpdate = (newBirthDate: string, newExpectedLife: number) => {
    setBirthDate(newBirthDate);
    setExpectedLifeYears(newExpectedLife);
    localStorage.setItem("memento_user_birth_date", newBirthDate);
    localStorage.setItem("memento_user_life_expectancy", newExpectedLife.toString());

    recalculateMetrics(newBirthDate, newExpectedLife);

    getDashboardData(newBirthDate, newExpectedLife)
      .then((serverData) => setData(serverData))
      .catch(() => {});
  };

  return (
    <>
      <Navbar onOpenManifest={() => setIsManifestOpen(true)} />

      <div className="space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Discreet Config Trigger Bar */}
        <TimelineConfigBar
          currentBirthDate={birthDate}
          currentExpectedLife={expectedLifeYears}
          onUpdate={handleTimelineUpdate}
        />

        {/* Desktop Single Viewport Grid Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Left Column (5 Cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Life Clock (Circular Donut Chart) */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-4 backdrop-blur-md shadow-2xl flex-1 flex flex-col justify-center">
              <LifeClock
                birthDateIso={data.birth_date}
                expectedLifeYears={data.expected_life_years}
                currentAgeYears={data.current_age.years}
                remainingLifeYears={data.remaining_life.years}
              />
            </div>

            {/* Temporal Milestones (Year / Month / Day Progress Bars) */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-4 backdrop-blur-md shadow-2xl">
              <ProgressSection initialProgress={data.progress} />
            </div>
          </div>

          {/* Right Column (7 Cols on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Time Remaining (Heartbeat Ticker with Milliseconds) */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-4 backdrop-blur-md shadow-2xl">
              <CountdownHero
                key={`${birthDate}-${expectedLifeYears}-${data.remaining_seconds}`}
                initialRemainingSeconds={data.remaining_seconds}
                isGift={data.is_gift}
                giftMessage={data.gift_message}
              />
            </div>

            {/* Special Question For You (30s Rotation) */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md shadow-2xl">
              <DailyMemento question={data.question} />
            </div>

            {/* Daily Wisdom Quote */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-4 backdrop-blur-md shadow-2xl flex-1 flex flex-col justify-center">
              <DailyQuote quote={data.quote} />
            </div>
          </div>

        </div>

        {/* System Activity & Main Characters Live / Day / Month Section */}
        <div className="mt-6">
          <SystemActivityCard onOpenManifest={() => setIsManifestOpen(true)} />
        </div>
      </div>

      <MainCharacterModal
        isOpen={isManifestOpen}
        onClose={() => setIsManifestOpen(false)}
      />
    </>
  );
}
