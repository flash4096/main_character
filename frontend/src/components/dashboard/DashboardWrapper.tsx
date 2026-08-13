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
import OnboardingModal from "./OnboardingModal";
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
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);

  // Initialize from frontend cache (localStorage) on client mount
  useEffect(() => {
    const cachedBirth = getCachedBirthDate();
    const cachedExpectancy = getCachedLifeExpectancy();

    if (!cachedBirth) {
      setNeedsOnboarding(true);
    }

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

  const handleOnboardingSubmit = useCallback((birthDateIso: string) => {
    setNeedsOnboarding(false);
    handleTimelineUpdate(birthDateIso, expectedLifeYears);
  }, [handleTimelineUpdate, expectedLifeYears]);

  return (
    <>
      <OnboardingModal isOpen={needsOnboarding} onSubmit={handleOnboardingSubmit} />

      <Navbar onOpenManifest={() => setIsManifestOpen(true)} />

      <main className="space-y-3.5 sm:space-y-4 max-w-[1536px] 2xl:max-w-[1640px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Prominent Direct Date & Expectancy Configuration Bar */}
        <TimelineConfigBar
          currentBirthDate={birthDate}
          currentExpectedLife={expectedLifeYears}
          onUpdate={handleTimelineUpdate}
        />

        {/* High-Density Command Center (3-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
          
          {/* Column 1: Life Progress & Time Lived (4 Cols) */}
          <div className="md:col-span-1 lg:col-span-4 flex flex-col gap-3.5">
            {/* Life Clock (Circular Donut Chart) */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-3 backdrop-blur-md shadow-2xl flex flex-col justify-center">
              <LifeClock
                key={`clock-${birthDate}-${expectedLifeYears}`}
                birthDateIso={data.birth_date}
                expectedLifeYears={data.expected_life_years}
                currentAgeYears={data.current_age.years}
                remainingLifeYears={data.remaining_life.years}
              />
            </div>

            {/* Time You Have Lived (Exact Elapsed Breakdown) */}
            <CurrentAgeCard
              key={`age-${birthDate}`}
              birthDateIso={data.birth_date}
              initialAge={data.current_age}
            />
          </div>

          {/* Column 2: Time Remaining Horizon & Countdown (4 Cols) */}
          <div className="md:col-span-1 lg:col-span-4 flex flex-col gap-3.5">
            {/* Countdown Hero (Heartbeat Ticker with Milliseconds) */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-3 backdrop-blur-md shadow-2xl">
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

            {/* Daily Wisdom Quote */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-3 sm:p-3.5 backdrop-blur-md shadow-2xl">
              <DailyQuote quote={data.quote} />
            </div>
          </div>

          {/* Column 3: Temporal & Age Progress + Philosophical Wisdom (4 Cols) */}
          <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-3.5">
            {/* Temporal Milestones (Age Progress & Year / Month / Day Progress Bars) */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-3 sm:p-3.5 backdrop-blur-md shadow-2xl">
              <ProgressSection
                initialProgress={data.progress}
                birthDateIso={data.birth_date}
              />
            </div>

            {/* Special Existential Question */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md shadow-2xl flex-1 flex flex-col justify-center">
              <DailyMemento question={data.question} />
            </div>
          </div>

        </div>

        {/* System Activity & Main Characters Live Telemetry */}
        <div className="mt-4">
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
