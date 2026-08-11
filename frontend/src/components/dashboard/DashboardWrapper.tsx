"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "./Navbar";
import TimelineConfigBar from "./TimelineConfigBar";
import LifeClock from "./LifeClock";
import CountdownHero from "./CountdownHero";
import CurrentAgeCard from "./CurrentAgeCard";
import RemainingLifeCard from "./RemainingLifeCard";
import ProgressSection from "./ProgressSection";
import DailyMemento from "./DailyMemento";
import DailyQuote from "./DailyQuote";
import SystemActivityCard from "./SystemActivityCard";
import MainCharacterModal from "./MainCharacterModal";
import { DashboardData } from "@/types";
import { 
  getCachedBirthDate, 
  setCachedBirthDate, 
  getCachedLifeExpectancy, 
  setCachedLifeExpectancy,
  computeFullDashboard,
  normalizeDateIso,
  DEFAULT_BIRTH_DATE,
  DEFAULT_LIFE_EXPECTANCY
} from "@/lib/calculations";
import { getDashboardData } from "@/lib/api";

interface DashboardWrapperProps {
  initialData: DashboardData;
}

export default function DashboardWrapper({ initialData }: DashboardWrapperProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [birthDate, setBirthDate] = useState<string>(normalizeDateIso(initialData.birth_date || DEFAULT_BIRTH_DATE));
  const [expectedLifeYears, setExpectedLifeYears] = useState<number>(
    initialData.expected_life_years || DEFAULT_LIFE_EXPECTANCY
  );
  const [isManifestOpen, setIsManifestOpen] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Initialize from frontend cache (localStorage) on client mount
  useEffect(() => {
    const cachedBirth = getCachedBirthDate();
    const cachedExpectancy = getCachedLifeExpectancy();

    const activeBirth = normalizeDateIso(cachedBirth || initialData.birth_date || DEFAULT_BIRTH_DATE);
    const activeExpectancy = cachedExpectancy || initialData.expected_life_years || DEFAULT_LIFE_EXPECTANCY;

    setBirthDate(activeBirth);
    setExpectedLifeYears(activeExpectancy);

    // If not cached yet, seed the cache
    if (!cachedBirth) setCachedBirthDate(activeBirth);
    if (!cachedExpectancy) setCachedLifeExpectancy(activeExpectancy);

    // Compute fresh metrics
    const updated = computeFullDashboard(activeBirth, activeExpectancy, initialData);
    setData(updated);
    setIsHydrated(true);

    // Optional background sync with backend if available
    getDashboardData(activeBirth, activeExpectancy)
      .then((serverData) => {
        setData((prev) => ({
          ...serverData,
          question: serverData.question || prev.question,
          quote: serverData.quote || prev.quote,
        }));
      })
      .catch(() => {
        // Fallback works purely client-side
      });
  }, [initialData]);

  // Handler when user edits date or life expectancy
  const handleTimelineUpdate = useCallback((newBirthDate: string, newExpectedLife: number) => {
    setBirthDate(newBirthDate);
    setExpectedLifeYears(newExpectedLife);

    // Instantly save to frontend cache
    setCachedBirthDate(newBirthDate);
    setCachedLifeExpectancy(newExpectedLife);

    // Instantly recalculate client-side
    const recalculated = computeFullDashboard(newBirthDate, newExpectedLife, data);
    setData(recalculated);

    // Sync in background without blocking UI
    getDashboardData(newBirthDate, newExpectedLife)
      .then((serverData) => {
        setData((prev) => ({
          ...serverData,
          question: serverData.question || prev.question,
          quote: serverData.quote || prev.quote,
        }));
      })
      .catch(() => {});
  }, [data]);

  return (
    <>
      <Navbar onOpenManifest={() => setIsManifestOpen(true)} />

      <main className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Prominent Direct Date & Expectancy Configuration Bar */}
        <TimelineConfigBar
          currentBirthDate={birthDate}
          currentExpectedLife={expectedLifeYears}
          onUpdate={handleTimelineUpdate}
        />

        {/* Hero Statistics Section (Dual Column Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Column: Life Progress & Time Lived (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Life Clock (Circular Donut Chart) */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-4 backdrop-blur-md shadow-2xl flex flex-col justify-center">
              <LifeClock
                key={`clock-${birthDate}-${expectedLifeYears}`}
                birthDateIso={data.birth_date}
                expectedLifeYears={data.expected_life_years}
                currentAgeYears={data.current_age.years}
                remainingLifeYears={data.remaining_life.years}
              />
            </div>

            {/* Time You Have Lived (Exact Breakdown) */}
            <CurrentAgeCard
              key={`age-${birthDate}`}
              birthDateIso={data.birth_date}
              initialAge={data.current_age}
            />

            {/* Temporal Milestones (Year / Month / Day Progress Bars) */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-4 sm:p-5 backdrop-blur-md shadow-2xl">
              <ProgressSection initialProgress={data.progress} />
            </div>
          </div>

          {/* Right Column: Time Remaining & Philosophical Wisdom (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Countdown Hero (Heartbeat Ticker with Milliseconds) */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-4 backdrop-blur-md shadow-2xl">
              <CountdownHero
                key={`hero-${birthDate}-${expectedLifeYears}-${data.remaining_seconds}`}
                initialRemainingSeconds={data.remaining_seconds}
                isGift={data.is_gift}
                giftMessage={data.gift_message}
              />
            </div>

            {/* Time You Have Left (Remaining Horizon Breakdown) */}
            <RemainingLifeCard
              key={`remaining-${birthDate}-${expectedLifeYears}`}
              remainingLife={data.remaining_life}
              expectedLifeYears={data.expected_life_years}
            />

            {/* Special Existential Question */}
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
        <div className="mt-8">
          <SystemActivityCard onOpenManifest={() => setIsManifestOpen(true)} />
        </div>
      </main>

      <MainCharacterModal
        isOpen={isManifestOpen}
        onClose={() => setIsManifestOpen(false)}
      />
    </>
  );
}
