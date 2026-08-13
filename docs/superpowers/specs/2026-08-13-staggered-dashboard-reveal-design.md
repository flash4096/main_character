# Staggered Dashboard Reveal — Design

## Problem

The dashboard (`DashboardWrapper`) currently renders every panel — clock, countdown,
age card, remaining-life card, progress bars, quote, existential question, system
activity feed — all at once. Right after a user enters their birth date for the first
time (or changes it), this produces a "cockpit dashboard" effect: too much information
appearing simultaneously, competing for attention with no guidance on what to look at
first.

## Goal

Reveal the dashboard panels in prioritized waves after the birth date is set (first
onboarding or a date change), so the most valuable/orienting information appears
first and supporting detail follows a beat later. Regular page loads (cached birth
date, no changes) must stay instant — no animation delay.

## Non-goals

- No change to panel content, data, or layout/grid structure.
- No animation on every normal page load — only right after the birth date is
  established or changed.
- No new dependencies — implemented with Framer Motion, already used throughout
  the dashboard (`MainCharacterModal`, `OnboardingModal`, `TimelineConfigBar`).

## Trigger: `shouldAnimateReveal`

`DashboardWrapper` gets a new boolean state, `shouldAnimateReveal`:

- Set to `true` when `OnboardingModal` submits a birth date (first-time entry).
- Set to `true` when `TimelineConfigBar`'s `onUpdate` fires with a changed birth date
  (`handleTimelineUpdate`).
- Stays `false` on normal mount when a birth date is already cached and unchanged —
  the existing hydration effect in `DashboardWrapper` does not set this flag.
- Resets back to `false` once the reveal animation has played through once, so it
  doesn't replay on subsequent re-renders (e.g. live ticking data updates).

When `false`, the wave wrapper uses `initial={false}` so Framer Motion skips the
enter animation entirely and content is visible immediately at full opacity/position.

## Wave grouping & order

Priority order (most orienting → most supplementary), implemented as 8 waves:

1. **Frame** — `Navbar` + `TimelineConfigBar`
2. **Primary visual anchor** — `LifeClock`
3. **Emotional hook** — `CountdownHero`
4. **Supporting detail (lived / remaining)** — `CurrentAgeCard` + `RemainingLifeCard`
5. **Wisdom quote** — Castaneda quote block (already living under `CountdownHero` in
   column 2)
6. **Progress bars** — `ProgressSection`
7. **Reflection prompt** — `DailyMemento`
8. **Ambient/system** — `SystemActivityCard` + `Footer`

Within a wave, elements appear together (no perceptible stagger between siblings in
the same wave — that's handled by nesting them in one `motion.div` per wave). Between
waves, Framer Motion's `staggerChildren: 0.13` (130ms) on the parent container
produces the step-by-step cadence.

## Animation mechanics

- Parent container: `motion.div` with `variants` object `{ hidden: {}, visible: { transition: { staggerChildren: 0.13 } } }`, `initial={shouldAnimateReveal ? "hidden" : false}`, `animate="visible"`.
- Each wave: `motion.div` with `variants = { hidden: { opacity: 0, y: 16, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.25, duration: 0.5 } } }`.
- No manual `setTimeout` sequencing — Framer Motion's built-in `staggerChildren` drives the cadence declaratively.

## Where this lives

All changes are scoped to `DashboardWrapper.tsx`: wrap the existing 3-column grid's
wave-groupings in `motion.div`s with the variants above, driven by
`shouldAnimateReveal`. No changes needed inside individual panel components
(`LifeClock`, `CountdownHero`, etc.) — they remain dumb children of the animated
wrapper.

## Testing / verification

- Manual verification via `webapp-testing`/Playwright: clear localStorage, load app,
  submit onboarding date, confirm panels appear in the 8-wave order with visible
  stagger.
- Reload the page afterward (birth date now cached) and confirm the dashboard
  renders instantly with no stagger.
- Change the date via `TimelineConfigBar` and confirm the reveal replays.
- `tsc --noEmit` and `next lint` must stay clean.
