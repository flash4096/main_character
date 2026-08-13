# Staggered Dashboard Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make dashboard panels reveal in 8 prioritized waves (frame → clock → countdown → lived/remaining details → quote → progress → reflection → ambient) right after the birth date is set via onboarding or changed via the timeline bar, while normal cached-date page loads stay instant with no animation.

**Architecture:** Add a `shouldAnimateReveal` boolean to `DashboardWrapper`, set `true` only by the onboarding-submit and timeline-update handlers. Wrap each wave's JSX (already-existing panel wrapper `div`s) in a `motion.div` using one shared `waveVariants` object where `visible`'s transition delay is computed from a per-instance `custom` wave index (0–7). This sidesteps the fact that waves are not DOM-adjacent (they're split across three grid columns), so Framer Motion's `staggerChildren` doesn't apply — explicit per-instance delay achieves the same cadence regardless of layout position. When `shouldAnimateReveal` is `false`, each `motion.div` uses `initial={false}`, which skips the enter animation and renders at rest immediately.

**Tech Stack:** Next.js 15, React 19, Framer Motion (already a dependency — see `frontend/package.json`), TypeScript, Tailwind CSS.

## Global Constraints

- All changes scoped to `frontend/src/components/dashboard/DashboardWrapper.tsx` — no other component files are modified (per spec's "Where this lives" section). `Footer` (rendered in `frontend/src/app/page.tsx`, outside `DashboardWrapper`) is therefore excluded from the animated waves and stays static — this is a deliberate, documented deviation from the spec's wave-8 description ("SystemActivityCard + Footer"), justified by the scope constraint.
- Wave order is fixed: 1) Navbar + TimelineConfigBar, 2) LifeClock, 3) CountdownHero, 4) CurrentAgeCard + RemainingLifeCard, 5) Daily quote block, 6) ProgressSection, 7) DailyMemento, 8) SystemActivityCard.
- Stagger delay between waves: 130ms (`0.13s`).
- Per-element enter animation: `opacity: 0→1`, `y: 16→0`, `scale: 0.97→1`, spring transition with `bounce: 0.25`, `duration: 0.5`.
- `shouldAnimateReveal` is `true` only right after `OnboardingModal` submits or `TimelineConfigBar` reports a birth date change — never on a normal cached-date mount.
- `tsc --noEmit` and `next lint` must both stay clean after the change (run from `frontend/`).

---

### Task 1: Add staggered reveal animation to `DashboardWrapper`

**Files:**
- Modify: `frontend/src/components/dashboard/DashboardWrapper.tsx`

**Interfaces:**
- Consumes: existing `OnboardingModal` (`isOpen`, `onSubmit: (birthDateIso: string) => void`), `TimelineConfigBar` (`onUpdate: (birthDate: string, expectedLife: number) => void`) — both already imported and wired in this file, no signature changes.
- Produces: no new exports; this is a self-contained internal change to `DashboardWrapper`.

- [ ] **Step 1: Import `motion` from `framer-motion`**

At the top of `frontend/src/components/dashboard/DashboardWrapper.tsx`, add the import alongside the existing imports:

```tsx
import { motion } from "framer-motion";
```

- [ ] **Step 2: Add `shouldAnimateReveal` state and the shared wave variants**

Inside the `DashboardWrapper` component, right after the existing `needsOnboarding` state declaration (currently `const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);`), add:

```tsx
  const [shouldAnimateReveal, setShouldAnimateReveal] = useState<boolean>(false);

  // Reset the reveal flag once the longest wave's animation has finished playing,
  // so it doesn't replay on unrelated re-renders (e.g. live ticking data updates).
  useEffect(() => {
    if (!shouldAnimateReveal) return;
    const timer = setTimeout(() => setShouldAnimateReveal(false), 1500);
    return () => clearTimeout(timer);
  }, [shouldAnimateReveal]);
```

Above the component (module scope, after the imports, before `interface DashboardWrapperProps`), add the shared variants object:

```tsx
const WAVE_STAGGER_SECONDS = 0.13;

const waveVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: (waveIndex: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      bounce: 0.25,
      duration: 0.5,
      delay: waveIndex * WAVE_STAGGER_SECONDS,
    },
  }),
};
```

- [ ] **Step 3: Set `shouldAnimateReveal` to `true` in the onboarding and timeline-update handlers**

Modify `handleTimelineUpdate` — it currently starts with:

```tsx
  const handleTimelineUpdate = useCallback((newBirthDate: string, newExpectedLife: number) => {
    setBirthDate(newBirthDate);
    setExpectedLifeYears(newExpectedLife);
```

Change the first line inside the callback to also flip the reveal flag when the birth date actually changed:

```tsx
  const handleTimelineUpdate = useCallback((newBirthDate: string, newExpectedLife: number) => {
    if (newBirthDate !== birthDate) {
      setShouldAnimateReveal(true);
    }
    setBirthDate(newBirthDate);
    setExpectedLifeYears(newExpectedLife);
```

This requires adding `birthDate` to `handleTimelineUpdate`'s dependency array — it currently reads `[data]`; change it to `[data, birthDate]`.

Modify `handleOnboardingSubmit` — it currently is:

```tsx
  const handleOnboardingSubmit = useCallback((birthDateIso: string) => {
    setNeedsOnboarding(false);
    handleTimelineUpdate(birthDateIso, expectedLifeYears);
  }, [handleTimelineUpdate, expectedLifeYears]);
```

Add the flag set before delegating to `handleTimelineUpdate` (harmless if `handleTimelineUpdate` also sets it — same value):

```tsx
  const handleOnboardingSubmit = useCallback((birthDateIso: string) => {
    setNeedsOnboarding(false);
    setShouldAnimateReveal(true);
    handleTimelineUpdate(birthDateIso, expectedLifeYears);
  }, [handleTimelineUpdate, expectedLifeYears]);
```

- [ ] **Step 4: Wrap wave 1 (Navbar + TimelineConfigBar) in a `motion.div`**

Replace:

```tsx
      <Navbar onOpenManifest={() => setIsManifestOpen(true)} />

      <main className="space-y-3.5 sm:space-y-4 max-w-[1536px] 2xl:max-w-[1640px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Prominent Direct Date & Expectancy Configuration Bar */}
        <TimelineConfigBar
          currentBirthDate={birthDate}
          currentExpectedLife={expectedLifeYears}
          onUpdate={handleTimelineUpdate}
        />
```

with:

```tsx
      <motion.div
        initial={shouldAnimateReveal ? "hidden" : false}
        animate="visible"
        custom={0}
        variants={waveVariants}
      >
        <Navbar onOpenManifest={() => setIsManifestOpen(true)} />
      </motion.div>

      <main className="space-y-3.5 sm:space-y-4 max-w-[1536px] 2xl:max-w-[1640px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Prominent Direct Date & Expectancy Configuration Bar (Wave 1) */}
        <motion.div
          initial={shouldAnimateReveal ? "hidden" : false}
          animate="visible"
          custom={0}
          variants={waveVariants}
        >
          <TimelineConfigBar
            currentBirthDate={birthDate}
            currentExpectedLife={expectedLifeYears}
            onUpdate={handleTimelineUpdate}
          />
        </motion.div>
```

- [ ] **Step 5: Wrap wave 2 (LifeClock) and wave 4a (CurrentAgeCard) in column 1**

Replace:

```tsx
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
```

with:

```tsx
          {/* Column 1: Life Progress & Time Lived (4 Cols) */}
          <div className="md:col-span-1 lg:col-span-4 flex flex-col gap-3.5">
            {/* Life Clock (Circular Donut Chart) — Wave 2 */}
            <motion.div
              initial={shouldAnimateReveal ? "hidden" : false}
              animate="visible"
              custom={1}
              variants={waveVariants}
              className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-3 backdrop-blur-md shadow-2xl flex flex-col justify-center"
            >
              <LifeClock
                key={`clock-${birthDate}-${expectedLifeYears}`}
                birthDateIso={data.birth_date}
                expectedLifeYears={data.expected_life_years}
                currentAgeYears={data.current_age.years}
                remainingLifeYears={data.remaining_life.years}
              />
            </motion.div>

            {/* Time You Have Lived (Exact Elapsed Breakdown) — Wave 4 */}
            <motion.div
              initial={shouldAnimateReveal ? "hidden" : false}
              animate="visible"
              custom={3}
              variants={waveVariants}
            >
              <CurrentAgeCard
                key={`age-${birthDate}`}
                birthDateIso={data.birth_date}
                initialAge={data.current_age}
              />
            </motion.div>
          </div>
```

- [ ] **Step 6: Wrap wave 3 (CountdownHero), wave 4b (RemainingLifeCard), and wave 5 (quote) in column 2**

Replace:

```tsx
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
```

with:

```tsx
          {/* Column 2: Time Remaining Horizon & Countdown (4 Cols) */}
          <div className="md:col-span-1 lg:col-span-4 flex flex-col gap-3.5">
            {/* Countdown Hero (Heartbeat Ticker with Milliseconds) — Wave 3 */}
            <motion.div
              initial={shouldAnimateReveal ? "hidden" : false}
              animate="visible"
              custom={2}
              variants={waveVariants}
              className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-3 backdrop-blur-md shadow-2xl"
            >
              <CountdownHero
                key={`hero-${birthDate}-${expectedLifeYears}-${data.remaining_seconds}`}
                initialRemainingSeconds={data.remaining_seconds}
                isGift={data.is_gift}
                giftMessage={data.gift_message}
              />
            </motion.div>

            {/* Time You Have Left (Remaining Horizon Breakdown) — Wave 4 */}
            <motion.div
              initial={shouldAnimateReveal ? "hidden" : false}
              animate="visible"
              custom={3}
              variants={waveVariants}
            >
              <RemainingLifeCard
                key={`remaining-${birthDate}-${expectedLifeYears}`}
                remainingLife={data.remaining_life}
                expectedLifeYears={data.expected_life_years}
              />
            </motion.div>

            {/* Daily Wisdom Quote — Wave 5 */}
            <motion.div
              initial={shouldAnimateReveal ? "hidden" : false}
              animate="visible"
              custom={4}
              variants={waveVariants}
              className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-3 sm:p-3.5 backdrop-blur-md shadow-2xl"
            >
              <DailyQuote quote={data.quote} />
            </motion.div>
          </div>
```

- [ ] **Step 7: Wrap wave 6 (ProgressSection) and wave 7 (DailyMemento) in column 3**

Replace:

```tsx
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
```

with:

```tsx
          {/* Column 3: Temporal & Age Progress + Philosophical Wisdom (4 Cols) */}
          <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-3.5">
            {/* Temporal Milestones (Age Progress & Year / Month / Day Progress Bars) — Wave 6 */}
            <motion.div
              initial={shouldAnimateReveal ? "hidden" : false}
              animate="visible"
              custom={5}
              variants={waveVariants}
              className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-3 sm:p-3.5 backdrop-blur-md shadow-2xl"
            >
              <ProgressSection
                initialProgress={data.progress}
                birthDateIso={data.birth_date}
              />
            </motion.div>

            {/* Special Existential Question — Wave 7 */}
            <motion.div
              initial={shouldAnimateReveal ? "hidden" : false}
              animate="visible"
              custom={6}
              variants={waveVariants}
              className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md shadow-2xl flex-1 flex flex-col justify-center"
            >
              <DailyMemento question={data.question} />
            </motion.div>
          </div>
```

- [ ] **Step 8: Wrap wave 8 (SystemActivityCard)**

Replace:

```tsx
        {/* System Activity & Main Characters Live Telemetry */}
        <div className="mt-4">
          <SystemActivityCard onOpenManifest={() => setIsManifestOpen(true)} />
        </div>
```

with:

```tsx
        {/* System Activity & Main Characters Live Telemetry — Wave 8 */}
        <motion.div
          initial={shouldAnimateReveal ? "hidden" : false}
          animate="visible"
          custom={7}
          variants={waveVariants}
          className="mt-4"
        >
          <SystemActivityCard onOpenManifest={() => setIsManifestOpen(true)} />
        </motion.div>
```

- [ ] **Step 9: Typecheck**

Run: `cd frontend && npx tsc --noEmit`
Expected: no output, exit code 0.

- [ ] **Step 10: Lint**

Run: `cd frontend && npx next lint`
Expected: `✔ No ESLint warnings or errors`.

- [ ] **Step 11: Manual verification in a real browser**

Use the `run` skill (or manually) to start the dev server, then:
1. Open the app, open devtools console, run `localStorage.clear()`, reload.
2. Confirm `OnboardingModal` appears, submit a date (e.g. `08.11.2002`).
3. Confirm the dashboard panels appear in 8 visible waves in this order: Navbar/TimelineConfigBar → LifeClock → CountdownHero → CurrentAgeCard+RemainingLifeCard → Quote → ProgressSection → DailyMemento → SystemActivityCard, each with a slight upward/scale spring pop, ~130ms apart.
4. Reload the page (birth date now cached). Confirm the dashboard renders instantly with no stagger/fade.
5. Open the `TimelineConfigBar` drawer and change the date. Confirm the reveal animation replays.

If any wave is out of order or the reset timer cuts off the last wave's animation before it finishes, adjust the `1500` ms timeout in Step 2 or the individual `custom` indices, then re-run Steps 9–11.

- [ ] **Step 12: Commit**

```bash
cd /micro_home/Workspace/main_character
git add frontend/src/components/dashboard/DashboardWrapper.tsx
git commit -m "$(cat <<'EOF'
feat: stagger dashboard panel reveal in prioritized waves

Panels now fade/pop in across 8 waves (frame, clock, countdown, lived/
remaining detail, quote, progress, reflection, ambient) right after the
birth date is set via onboarding or changed via the timeline bar, instead
of all rendering at once. Normal cached-date page loads stay instant.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review Notes

- **Spec coverage:** Trigger (onboarding + date change only) — Step 3. Wave order/grouping — Steps 4–8, matching spec's 8-wave list exactly except `Footer`, which is explicitly excluded per the Global Constraints deviation note (spec itself scopes all changes to `DashboardWrapper.tsx`, where `Footer` doesn't live). Animation mechanics (spring, bounce 0.25, 130ms stagger, opacity/y/scale) — Step 2's `waveVariants`. Instant normal-load behavior — `initial={shouldAnimateReveal ? "hidden" : false}` in every wrapper. Verification — Steps 9–11.
- **Placeholder scan:** none found; every step has literal code or literal shell commands.
- **Type consistency:** `waveVariants`'s `visible` callback takes `waveIndex: number` and is invoked via each `motion.div`'s `custom={<literal number>}` prop, matching Framer Motion's convention of passing `custom` through to variant functions. `shouldAnimateReveal` is a single `boolean` used consistently in every wrapper's `initial` prop.
