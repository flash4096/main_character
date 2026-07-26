"use client";

import { useEffect, useState } from "react";
import TimelineConfigBar from "./TimelineConfigBar";
import CountdownHero from "./CountdownHero";
import CurrentAgeCard from "./CurrentAgeCard";
import RemainingLifeCard from "./RemainingLifeCard";
import ProgressSection from "./ProgressSection";
import DailyMemento from "./DailyMemento";
import DailyQuote from "./DailyQuote";
import { DashboardData } from "@/types";
import { getDashboardData } from "@/lib/api";

interface DashboardWrapperProps {
  initialData: DashboardData;
}

export default function DashboardWrapper({ initialData }: DashboardWrapperProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [birthDate, setBirthDate] = useState<string>(initialData.birth_date);
  const [expectedLifeYears, setExpectedLifeYears] = useState<number>(initialData.expected_life_years);

  useEffect(() => {
    // Check local storage for user saved birth date
    const savedBirth = localStorage.getItem("memento_user_birth_date");
    const savedExpectancy = localStorage.getItem("memento_user_life_expectancy");

    if (savedBirth) {
      setBirthDate(savedBirth);
    }
    if (savedExpectancy) {
      setExpectedLifeYears(Number(savedExpectancy));
    }

    if (savedBirth || savedExpectancy) {
      fetchUpdatedData(savedBirth || birthDate, savedExpectancy ? Number(savedExpectancy) : expectedLifeYears);
    }
  }, []);

  const fetchUpdatedData = async (bDate: string, lifeExp: number) => {
    try {
      const updated = await getDashboardData(bDate, lifeExp);
      setData(updated);
    } catch (err) {
      console.error("Failed to update dashboard data:", err);
    }
  };

  const handleTimelineUpdate = (newBirthDate: string, newExpectedLife: number) => {
    setBirthDate(newBirthDate);
    setExpectedLifeYears(newExpectedLife);
    localStorage.setItem("memento_user_birth_date", newBirthDate);
    localStorage.setItem("memento_user_life_expectancy", newExpectedLife.toString());
    fetchUpdatedData(newBirthDate, newExpectedLife);
  };

  return (
    <div className="space-y-10">
      {/* Interactive Timeline Birth Data Configurator */}
      <TimelineConfigBar
        currentBirthDate={birthDate}
        currentExpectedLife={expectedLifeYears}
        onUpdate={handleTimelineUpdate}
      />

      {/* 1. Countdown Hero (Largest Element on Page) */}
      <CountdownHero
        key={data.remaining_seconds}
        initialRemainingSeconds={data.remaining_seconds}
        isGift={data.is_gift}
        giftMessage={data.gift_message}
      />

      {/* 2. Grid for Current Age & Expected Remaining Life */}
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

      {/* 3. Temporal Milestones (Year, Month, Day Progress Bars) */}
      <section>
        <ProgressSection initialProgress={data.progress} />
      </section>

      {/* 4. Existential Question (rotates every minute) & Daily Wisdom */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyMemento question={data.question} />
        <DailyQuote quote={data.quote} />
      </section>
    </div>
  );
}
