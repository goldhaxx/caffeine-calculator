# Implementation Plan: Multi-Day Decay & Steady-State Baseline

> Feature: bts-711-multi-day-decay-baseline
> Work: linear:BTS-711
> Created: 1783040801
> Spec hash: 6dadb7c5
> Based on: docs/spec.md

## Objective

Make caffeine decay continuous past the 24h boundary, simulate a repeating daily routine over a 1/3/7-day horizon, and surface the closed-form steady-state baseline in the Decay Timeline card.

## Sequence

Each step is one red-green-refactor cycle. Test command: `npm test` (vitest run).

### Step 1: Continuous-time decay core
- **Test:** `calculateRemainingAtOffset([{hourOffset: 0, mg: 150}], 24, 5)` ≈ 5.4 (`150·2^(−24/5)`); at 48 ≈ 0.19; at 0 → 0 (just-before-dose convention, `elapsed > 0`); empty doses → 0. Cite formulas in comments per existing test style.
- **Implement:** New `DoseEvent { hourOffset, mg }` type and pure `calculateRemainingAtOffset(doses, targetHour, halfLife)` in `src/lib/caffeine.ts` — plain exponential sum over continuous hour offsets, no time-of-day wrapping.
- **Files:** `src/lib/caffeine.ts`, `src/lib/__tests__/caffeine.test.ts`
- **Verify:** New tests green; all existing tests untouched and green.

### Step 2: Dose timeline expansion
- **Test:** `buildDoseTimeline(consumptions, { days: 3, repeatDaily: true })` for 150mg @ 07:00 → offsets [0, 24, 48] from an origin of 07:00 floored to the hour; `repeatDaily: false` → [0]; a 07:30 dose lands at offset 0.5; empty consumptions → empty doses.
- **Implement:** `buildDoseTimeline(consumptions, options)` returning `{ originDate, doses: DoseEvent[] }`. Origin = earliest consumption floored to the hour (matches `generateDecayChartData` today). Repeat replicates the day-0 schedule at +24h·k for k < days.
- **Files:** `src/lib/caffeine.ts`, `src/lib/__tests__/caffeine.test.ts`
- **Verify:** `npm test` green.

### Step 3: Multi-day chart data (AC-1, AC-2, AC-3)
- **Test:** (a) default call `generateDecayChartData(cons, 5)` still returns 49 points AND final point ≈ 5.4mg not 0 (AC-1); (b) `{ days: 3 }` → 145 points, hour-48 value ≈ 0.19mg, monotonically non-increasing after peak with no 24h-boundary discontinuity (AC-2); (c) `{ days: 7, repeatDaily: true }` → troughs at 24h·k strictly increasing and final trough within 0.1 of `150·f/(1−f)` ≈ 5.6 (AC-3).
- **Implement:** Rebuild `generateDecayChartData(consumptions, halfLife, options?)` on Steps 1–2: sample 30-min steps over `days·48` intervals, add `dayIndex` to each point, keep `{ timeStr, remaining, hourOffset, actualTime }` shape. Delegate remaining-value math to `calculateRemainingAtOffset`.
- **Files:** `src/lib/caffeine.ts`, `src/lib/__tests__/caffeine.test.ts`
- **Verify:** `npm test` green, including the pre-existing 49-point and monotonicity tests unchanged (AC-8).

### Step 4: Closed-form steady state (AC-4, AC-5)
- **Test:** `calculateSteadyStateBaseline([{time:'07:00', mg:150}], 5)` → troughMg ≈ 5.6 ±0.1; halfLife 8 → ≈ 21.4 ±0.1; empty → null; two-dose schedule matches hand-computed geometric sum; `daysToSteadyState` = 1/2/3 for half-lives 3/5/8.
- **Implement:** `calculateSteadyStateBaseline(consumptions, halfLife)` → `{ troughMg, peakMg, daysToSteadyState } | null`. Steady state at in-day time t: `Σ mg_j·2^(−((t−t_j) mod 24)/h)/(1−f)`, `f = 2^(−24/h)`. Trough = min over just-before-dose instants; peak = max over just-after-dose instants (decay is monotone between doses, so extrema sit at dose instants — no simulation). `daysToSteadyState = ceil(ln(0.01)/ln(f))` (≥99% of asymptote).
- **Files:** `src/lib/caffeine.ts`, `src/lib/__tests__/caffeine.test.ts`
- **Verify:** `npm test` green.

### Step 5: Edge-case sweep (AC-7)
- **Test:** empty consumptions → `generateDecayChartData` returns `[]` for every options combination; 0mg dose contributes 0 at all points and doesn't perturb trough/peak.
- **Implement:** Only what the tests force (guards likely already fall out of Steps 1–4).
- **Files:** `src/lib/__tests__/caffeine.test.ts` (+ guards in `src/lib/caffeine.ts` if red)
- **Verify:** `npm test` green.

### Step 6: Day-aware label helper
- **Test:** a pure formatter maps `hourOffset` + origin to tick/tooltip labels — e.g. offset 0 → "7AM", offset 26 (origin 07:00) → "Day 2 · 9AM"; day boundaries labeled; sub-day offsets format as h:mm AM/PM for tooltips.
- **Implement:** `formatHourOffsetLabel(originDate, hourOffset, opts?)` in `src/lib/caffeine.ts` so the Recharts formatters in the dashboard stay one-liners.
- **Files:** `src/lib/caffeine.ts`, `src/lib/__tests__/caffeine.test.ts`
- **Verify:** `npm test` green.

### Step 7: Dashboard UI (AC-6)
- **Test:** no component test harness exists — verification is `npm run lint`, `npm run build` (type-check), then visual check via dev server on 127.0.0.1.
- **Implement:** In `ResultsDashboard.tsx`: local state for horizon (1/3/7) + "Repeat daily" toggle rendered in the Decay Timeline card header (shadcn `Select`/`Button` per existing idiom); switch XAxis to numeric `hourOffset` (`type="number"`) with `formatHourOffsetLabel` ticks; bedtime `ReferenceLine` per simulated day at computed offsets; when repeat ON add horizontal `ReferenceLine y={troughMg}` labeled "Baseline" plus a stat line "Baseline: X mg · steady after N days" from `calculateSteadyStateBaseline`. Defaults (1 day, repeat off) preserve today's layout.
- **Files:** `src/components/calculator/ResultsDashboard.tsx`
- **Verify:** lint + build clean; dev-server visual check of all four control combinations; existing single-day view unchanged by default.

### Step 8: Baseline ramp-up data (AC-9) — added after operator scope extension
- **Test:** `calculateBaselineRampUp([{time:'07:00', mg:150}], 5)` → 7 entries; day-1 trough ≈ 150·f ≈ 5.4 ±0.1; strictly increasing; final within 0.1 of the steady-state trough; `percentOfSteadyState = (1−f^k)·100`; empty → `[]`.
- **Implement:** `calculateBaselineRampUp(consumptions, halfLife, days = 7)` in `src/lib/caffeine.ts` — trough after k days = steady-state trough × `(1−f^k)` (per-dose geometric series truncates identically, so the asymptote scales).
- **Files:** `src/lib/caffeine.ts`, `src/lib/__tests__/caffeine.test.ts`
- **Verify:** `npm test` green.

### Step 9: Baseline Ramp-Up card (AC-10)
- **Test:** no component harness — verify via `npm run lint`, `npm run build`, operator visual check.
- **Implement:** New `src/components/calculator/BaselineRampCard.tsx` (recharts bar/line of per-day troughs, steady-state reference, per-day mg labels, "if you repeat today's intake daily" framing), mounted in `ResultsDashboard` below the Decay Timeline card; hidden when consumptions are empty.
- **Files:** `src/components/calculator/BaselineRampCard.tsx`, `src/components/calculator/ResultsDashboard.tsx`
- **Verify:** lint + build clean; operator eyeballs the card.

## Risks

- **Numeric XAxis migration:** the bedtime marker currently matches the categorical `timeStr`; switching to a numeric axis breaks `x={bedtime}` silently. Mitigation: compute bedtime hour-offsets explicitly (Step 7) and visually verify the marker lands on the right tick.
- **Default-view regression:** the 1-day chart is the product's core surface. Mitigation: AC-8 pins the pre-existing tests; default options must reproduce the 49-point shape byte-for-byte except the corrected final value.
- **Float tolerance:** convergence assertions compare against closed forms. Mitigation: `toBeCloseTo` with explicit ±0.1 bounds from the spec.
- **Recharts 3.x API drift:** `ReferenceLine` label props differ from v2 examples. Mitigation: follow the working `ReferenceLine` already in the file.

## Definition of Done

- [ ] All acceptance criteria from spec pass
- [ ] All existing tests still pass
- [ ] No type errors
- [ ] Code reviewed (run /review)

<!-- NODE-SPECIFIC-START -->
<!-- Add project-specific content below this line. -->
<!-- Hub content above is updated via /ccanvil-pull. -->

## Post-Review Addendum (max-effort code review: 10 finder angles + verify + sweep)

Applied on-branch: exact per-day ramp floors (the `(1−f^k)` law was wrong for
multi-dose schedules — brute-force verified), malformed-input hardening
(times, half-life, non-array localStorage payloads), cycle-based day labels,
wall-clock-aligned 1-day ticks, `computeBedtimeOffsets`/`computeChartTicks`
as tested lib helpers, memoized charts + shared chart theme, honest baseline
copy, convention renames. Deferred to follow-up tickets: bedtime/safe-sleep
kernel unification, DST-aware labels, page-level localStorage shape guards.