"use client";

import { useEffect, useState } from "react";
import TimelineConfigBar from "./TimelineConfigBar";
import CountdownHero from "./CountdownHero";
import CurrentAgeCard from "./CurrentAgeCard";
import RemainingLifeCard from "./RemainingLifeCard";
import ProgressSection from "./ProgressSection";
import DailyMemento from "./DailyMemento";
import DailyQuote from "./DailyQuote";
import { DashboardData, CurrentAge, RemainingLife } from "@/types";
import { getDashboardData } from "@/lib/api";

interface DashboardWrapperProps {
  initialData: DashboardData;
}

export default function DashboardWrapper({ initialData }: DashboardWrapperProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [birthDate, setBirthDate] = useState<string>(initialData.birth_date);
  const [expectedLifeYears, setExpectedLifeYears] = useState<number>(initialData.expected_life_years);

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
    <div className="space-y-10">
      {/* Timeline Input Bar */}
      <TimelineConfigBar
        currentBirthDate={birthDate}
        currentExpectedLife={expectedLifeYears}
        onUpdate={handleTimelineUpdate}
      />

      {/* 1. Life Countdown (Hero) */}
      <CountdownHero
        key={`${birthDate}-${expectedLifeYears}-${data.remaining_seconds}`}
        initialRemainingSeconds={data.remaining_seconds}
        isGift={data.is_gift}
        giftMessage={data.gift_message}
      />

      {/* 2. Special Question For You (Placed DIRECTLY UNDER countdown) */}
      <section>
        <DailyMemento question={data.question} />
      </section>

      {/* 3. Grid for Current Age & Expected Remaining Life */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CurrentAgeCard
          key={data.birth_date}
          birthDateIso={data.birth_date}
          initialAge={data.current_age}
        />
        <RemainingLifeCard
          remainingLife={data.remaining_life}
          expectedLifeYears={data.expected_life_years}
        />
      </section>

      {/* 4. Temporal Milestones */}
      <section>
        <ProgressSection initialProgress={data.progress} />
      </section>

      {/* 5. Daily Wisdom Quote */}
      <section>
        <DailyQuote quote={data.quote} />
      </section>
    </div>
  );
}
