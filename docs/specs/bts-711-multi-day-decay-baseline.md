# Feature: Multi-Day Decay & Steady-State Baseline

> Feature: bts-711-multi-day-decay-baseline
> Work: linear:BTS-711
> Created: 1783029892
> Subject: Multi-Day Decay & Steady-State Baseline
> Status: Complete

## Summary

The Decay Timeline hard-clips at the 24h boundary: `calculateRemainingAtTime` operates on time-of-day strings and wraps elapsed time into `[0, 24h)`, so at exactly 24h a dose's contribution is skipped and the curve drops to 0mg (150mg @ 7:00am → 5.8mg at 6:30am, then 0mg at 7:00am). In reality, with half-life `h` a fraction `f = 2^(−24/h)` of every dose survives each day (~3.6% at 5h), and a repeating daily routine converges geometrically to a steady-state baseline: trough `= Σ dose·2^(−Δ/h) / (1−f)` ≈ 5.6mg for 150mg/day at 5h — and ~21.4mg for a slow metabolizer (8h). This feature makes decay continuous past 24h, simulates a repeating daily routine over a multi-day horizon, and surfaces the converged baseline floor so users can see the caffeine level their body never drops below.

## Job To Be Done

**When** I consume caffeine on a daily routine,
**I want to** see the decay curve carry over past 24 hours and accumulate day over day,
**So that** I can see the steady-state baseline caffeine my body settles into and judge my true floor at wake/bedtime.

## Acceptance Criteria

Each criterion is independently testable. Binary pass/fail.

- [ ] **AC-1 (clipping fix):** Given a single 150mg dose at 07:00 with 5h half-life, when 1-day chart data is generated, then the final point (24h after dose) is ≈5.4mg (`150·2^(−24/5)`, ±0.1), not 0.
- [ ] **AC-2 (continuous multi-day decay):** Given the same dose with a 3-day horizon and repeat OFF, then remaining at hour 48 is ≈0.19mg (`150·2^(−48/5)`, ±0.05) and the series is monotonically non-increasing after the peak — no discontinuity at any 24h boundary.
- [ ] **AC-3 (accumulation):** Given 150mg at 07:00 with repeat ON, 5h half-life, 7-day horizon, then the pre-dose trough strictly increases day over day and the final-day trough is within 0.1mg of `150·f/(1−f)` ≈ 5.6mg.
- [ ] **AC-4 (closed-form baseline):** `calculateSteadyStateBaseline([{time:'07:00', mg:150}], 5)` returns trough ≈5.6mg (±0.1); with halfLife 8 returns ≈21.4mg (±0.1); multi-dose schedules sum per-dose geometric contributions.
- [ ] **AC-5 (days to steady state):** `daysToSteadyState` (smallest k where the trough reaches ≥99% of the asymptote, i.e. `ceil(ln(0.01)/ln(f))`) returns 1 for 3h, 2 for 5h, 3 for 8h half-life.
- [ ] **AC-6 (UI controls):** The Decay Timeline card gains a horizon selector (1 / 3 / 7 days) and a "Repeat daily" toggle. Defaults (1 day, repeat off) preserve the current single-day layout. With repeat ON, a horizontal reference line marks the steady-state trough and a stat displays "Baseline: X mg" plus days-to-steady-state.
- [ ] **AC-7 (edge — empty/zero/malformed):** Empty consumptions → chart data `[]` and `calculateSteadyStateBaseline` returns `null`; a 0mg dose contributes 0 at every point; an all-zero-mg schedule → `null` (no baseline claims for decaf); malformed time strings (`''`, `'8'`, non-`HH:mm`) are skipped rather than crashing the render (no Invalid Date / NaN reaching the UI); non-finite or non-positive `halfLife` → `null`/`[]`/0; UI renders without error in all cases.
- [ ] **AC-8 (regression):** All pre-existing tests in `src/lib/__tests__/caffeine.test.ts` pass unchanged; `calculateRemainingAtTime` and `calculateSafeSleepWindows` keep their current single-day semantics for the bedtime card and sleep windows.
- [ ] **AC-9 (ramp-up data):** `calculateBaselineRampUp(consumptions, halfLife)` returns one entry per day `{day, troughMg, percentOfSteadyState}` for 7 days, where `troughMg` is the **exact minimum** of the day-k cycle (evaluated just-before each dose instant in `(24(k−1), 24k]` — for a single daily dose this equals `asymptote·(1−f^k)`, day 1 ≈ 5.4mg ±0.1 for 150mg @ 5h; for multi-dose schedules it must match a continuous simulation, NOT the `(1−f^k)` scaling, which overstates day-1 by `mg·f` per later-in-day dose). Values strictly increase, the final day is within 0.1mg of the steady-state trough, and `percentOfSteadyState = troughMg/asymptote·100`. Empty consumptions → `[]`.
- [ ] **AC-10 (ramp-up card):** A "Baseline Ramp-Up" card, driven by the same Your Intake inputs, visualizes day-over-day trough growth toward steady state ("if you repeat today's intake daily") with per-day mg values and the converged baseline annotated. Hidden when there are no consumptions.
- [ ] **AC-11 (tabbed slot — operator feedback):** Decay Timeline and Baseline Ramp-Up share one position: a tab control (`role="tablist"`/`role="tab"`, `aria-selected`) switches which card renders. Default tab is Decay Timeline; each card keeps its internal controls; the ramp tab is hidden when the schedule has no valid caffeinated dose (steady state null).
- [ ] **AC-12 (surfaced math — operator feedback):** `summarizeSteadyStateMath(consumptions, halfLife)` returns the live explainer ingredients — `dailyIntakeMg` (valid doses only), `retentionPct`/`eliminationPct` (metabolism-dependent: elimination ≈ 96.4% @ 5h, 87.5% @ 8h, 99.6% @ 3h, ±0.1), `floorMg`/`postDoseMg` (= steady-state trough/peak), `daysToSteadyState`, `doseCount`; null for empty/decaf/malformed/bad-half-life inputs. Both cards expose an Info tooltip rendering the bathtub / intake-equals-elimination explanation from these values, and the ramp card's visible copy states the selected half-life explicitly so the elimination % reads as metabolism-dependent.

## Affected Files

| File | Change |
|------|--------|
| `src/lib/caffeine.ts` | Modified — continuous-time decay core (hour offsets, no 24h wrap), multi-day/repeat chart generator, `calculateSteadyStateBaseline` |
| `src/lib/__tests__/caffeine.test.ts` | Modified — new suites for AC-1…AC-5, AC-7 |
| `src/components/calculator/ResultsDashboard.tsx` | Modified — horizon selector, repeat toggle, baseline ReferenceLine + stat, day-aware axis/tooltip labels, ramp-up card mount |
| `src/components/calculator/BaselineRampCard.tsx` | New — day-over-day baseline ramp-up visualization (AC-10) |
| `src/components/calculator/InfoTip.tsx` | New — shared info-icon tooltip shell for the math explainers (AC-12) |
| `src/components/calculator/chartTheme.ts` | New — shared chart tooltip/axis/grid/baseline styling |

## Dependencies

- **Requires:** nothing new — recharts, date-fns, vitest already present.
- **Blocked by:** none.

## Out of Scope

- No changes to bedtime residual, safe-sleep windows, tolerance/melatonin/coffee modules, or `page.tsx` state (view controls are local to `ResultsDashboard`).
- No persistence of the new view controls to localStorage.
- No per-day schedule variation (weekday vs weekend) — the routine repeats identically.
- No absorption-phase modeling (instant absorption stays, per existing model).

## Implementation Notes

- Core model: represent each dose as a continuous hour offset from the simulation origin (earliest dose, floored to the hour — matches `generateDecayChartData` today). Remaining at offset `t` = `Σ mg·2^(−(t−t_dose)/h)` for `t > t_dose`. Repeat ON replicates the day-0 schedule at +24h·k for each simulated day k.
- Keep the existing per-dose `elapsed > 0` convention: a sample at exactly a dose instant reads just-before-dose, which makes 24h·k samples natural trough readings (AC-3).
- Steady state closed form: `f = 2^(−24/h)`; contribution of dose j at in-day time t is `mg_j·2^(−((t−t_j) mod 24)/h)/(1−f)`; trough = min over just-before-dose instants, evaluated analytically (no long simulation).
- Chart: switch XAxis to numeric `hourOffset` (`type="number"`) so multi-day domains don't duplicate category labels; tick/tooltip formatter derives "Day N h:mm AM" from offset + origin. Render the bedtime marker per simulated day.
- Follow the existing test style in `src/lib/__tests__/caffeine.test.ts` (expected-value comments citing the formula).
- `generateDecayChartData(consumptions, halfLife)` with no extra args must return the current 49-point shape (AC-8) — extend via an optional options argument.

<!-- NODE-SPECIFIC-START -->
<!-- Add project-specific content below this line. -->
<!-- Hub content above is updated via /ccanvil-pull. -->
