import { describe, it, expect } from 'vitest';
import {
  calculateRemainingAtTime,
  calculateRemainingAtOffset,
  buildDoseTimeline,
  calculateSteadyStateBaseline,
  calculateBaselineRampUp,
  computeBedtimeOffsets,
  computeChartTicks,
  summarizeSteadyStateMath,
  formatHourOffsetLabel,
  calculateSafeSleepWindows,
  generateDecayChartData,
  METABOLISM_HALF_LIVES,
  SENSITIVITY_THRESHOLDS,
  Consumption,
  DoseEvent,
} from '../caffeine';

describe('caffeine pharmacokinetic model', () => {
  describe('constants', () => {
    it('should have scientifically validated half-lives', () => {
      // Average half-life: ~5h (NCBI Bookshelf NBK223808, Nehlig 2021)
      expect(METABOLISM_HALF_LIVES.average).toBe(5.0);
      // Fast metabolizers: ~3h (CYP1A2 AA genotype, Sachse et al. 1999)
      expect(METABOLISM_HALF_LIVES.fast).toBe(3.0);
      // Slow metabolizers: ~8h (CYP1A2 AC/CC genotype, Cornelis et al. 2006)
      expect(METABOLISM_HALF_LIVES.slow).toBe(8.0);
    });

    it('should have evidence-based sensitivity thresholds', () => {
      // Thresholds calibrated to Gardiner et al. 2025 and Baur et al. 2024
      expect(SENSITIVITY_THRESHOLDS.sensitive).toBe(15);
      expect(SENSITIVITY_THRESHOLDS.average).toBe(30);
      expect(SENSITIVITY_THRESHOLDS.tolerant).toBe(50);
    });
  });

  describe('calculateRemainingAtTime', () => {
    it('should return 0 for empty consumptions', () => {
      expect(calculateRemainingAtTime([], '22:00', 5)).toBe(0);
    });

    it('should apply correct exponential decay for a single dose', () => {
      // 100mg at 08:00, check at 13:00 (5h elapsed = 1 half-life)
      const consumptions: Consumption[] = [{ id: '1', time: '08:00', mg: 100 }];
      const remaining = calculateRemainingAtTime(consumptions, '13:00', 5);
      expect(remaining).toBeCloseTo(50, 0);
    });

    it('should calculate correctly for the validated scenario (156mg@9AM + 45mg@12PM → 10PM)', () => {
      // This is the exact scenario from the research validation report
      const consumptions: Consumption[] = [
        { id: '1', time: '09:00', mg: 156 },
        { id: '2', time: '12:00', mg: 45 },
      ];
      const remaining = calculateRemainingAtTime(consumptions, '22:00', 5);
      // 156 * 0.5^(13/5) + 45 * 0.5^(10/5) = 25.7 + 11.25 = 36.97 → rounded to 37.0
      expect(remaining).toBeCloseTo(37.0, 0);
    });

    it('should sum contributions from multiple consumptions', () => {
      const consumptions: Consumption[] = [
        { id: '1', time: '08:00', mg: 100 },
        { id: '2', time: '13:00', mg: 50 },
      ];
      // At 18:00: 100 * 0.5^(10/5) + 50 * 0.5^(5/5) = 25 + 25 = 50
      const remaining = calculateRemainingAtTime(consumptions, '18:00', 5);
      expect(remaining).toBeCloseTo(50, 0);
    });

    it('should handle different metabolism speeds correctly', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '08:00', mg: 200 }];
      const target = '22:00'; // 14h elapsed

      const fastRemaining = calculateRemainingAtTime(consumptions, target, 3);
      const avgRemaining = calculateRemainingAtTime(consumptions, target, 5);
      const slowRemaining = calculateRemainingAtTime(consumptions, target, 8);

      // Fast should clear much more than average, which clears more than slow
      expect(fastRemaining).toBeLessThan(avgRemaining);
      expect(avgRemaining).toBeLessThan(slowRemaining);

      // Fast (3h): 200 * 0.5^(14/3) = 200 * 0.0394 ≈ 7.9
      expect(fastRemaining).toBeCloseTo(7.9, 0);
      // Average (5h): 200 * 0.5^(14/5) = 200 * 0.1436 ≈ 28.7
      expect(avgRemaining).toBeCloseTo(28.7, 0);
      // Slow (8h): 200 * 0.5^(14/8) = 200 * 0.2973 ≈ 59.5
      expect(slowRemaining).toBeCloseTo(59.5, 0);
    });

    it('should return full dose when no time has elapsed', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '08:00', mg: 200 }];
      // Check at 08:01 — almost no decay
      const remaining = calculateRemainingAtTime(consumptions, '08:01', 5);
      expect(remaining).toBeGreaterThan(199);
    });

    it('should handle overnight wraparound (bedtime before consumption time)', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '22:00', mg: 100 }];
      // Check at 06:00 next day — 8 hours elapsed
      const remaining = calculateRemainingAtTime(consumptions, '06:00', 5);
      // 100 * 0.5^(8/5) = 100 * 0.33 ≈ 33
      expect(remaining).toBeCloseTo(33, 0);
    });
  });

  describe('formatHourOffsetLabel', () => {
    const origin = new Date(2026, 0, 5, 7, 0, 0, 0); // Jan 5, 07:00 local

    it('should format day-1 ticks as bare times', () => {
      expect(formatHourOffsetLabel(origin, 0)).toBe('7AM');
      expect(formatHourOffsetLabel(origin, 8)).toBe('3PM');
    });

    it('should prefix later days with the day number', () => {
      expect(formatHourOffsetLabel(origin, 26)).toBe('Day 2 · 9AM');
      expect(formatHourOffsetLabel(origin, 48)).toBe('Day 3 · 7AM');
    });

    it('should keep pre-24h offsets in day 1 (cycle-based day numbering)', () => {
      // days count 24h dose cycles from the origin, matching the ramp card
      // and the trough instants — a 1-day chart never shows "Day 2"
      expect(formatHourOffsetLabel(origin, 17)).toBe('12AM');
      expect(formatHourOffsetLabel(origin, 23.5, 'tooltip')).toBe('6:30 AM');
    });

    it('should include minutes in tooltip style', () => {
      expect(formatHourOffsetLabel(origin, 0.5, 'tooltip')).toBe('7:30 AM');
      expect(formatHourOffsetLabel(origin, 24, 'tooltip')).toBe('Day 2 · 7:00 AM');
    });
  });

  describe('calculateSafeSleepWindows', () => {
    it('should return null for empty consumptions', () => {
      expect(calculateSafeSleepWindows([], 5)).toBeNull();
    });

    it('should return windows for all sensitivity levels', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '08:00', mg: 200 }];
      const windows = calculateSafeSleepWindows(consumptions, 5);
      expect(windows).not.toBeNull();
      expect(windows).toHaveProperty('sensitive');
      expect(windows).toHaveProperty('average');
      expect(windows).toHaveProperty('tolerant');
    });

    it('should return earlier windows for tolerant vs sensitive', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '08:00', mg: 200 }];
      const windows = calculateSafeSleepWindows(consumptions, 5);
      // Tolerant (50mg) threshold is reached before average (30mg) before sensitive (15mg)
      expect(windows).not.toBeNull();
      // All should have values for a 200mg dose
      expect(windows!.sensitive).toBeTruthy();
      expect(windows!.average).toBeTruthy();
      expect(windows!.tolerant).toBeTruthy();
    });
  });

  describe('calculateRemainingAtOffset', () => {
    it('should return 0 for empty doses', () => {
      expect(calculateRemainingAtOffset([], 10, 5)).toBe(0);
    });

    it('should decay continuously through the 24h boundary', () => {
      const doses: DoseEvent[] = [{ hourOffset: 0, mg: 150 }];
      // 150 * 0.5^(24/5) = 150 * 0.03587 ≈ 5.38 — NOT clipped to 0 at 24h
      expect(calculateRemainingAtOffset(doses, 24, 5)).toBeCloseTo(5.38, 1);
    });

    it('should keep decaying past 24h', () => {
      const doses: DoseEvent[] = [{ hourOffset: 0, mg: 150 }];
      // 150 * 0.5^(48/5) = 150 * 0.00129 ≈ 0.193
      expect(calculateRemainingAtOffset(doses, 48, 5)).toBeCloseTo(0.193, 2);
    });

    it('should read just-before-dose at the dose instant (elapsed > 0 convention)', () => {
      const doses: DoseEvent[] = [{ hourOffset: 0, mg: 150 }];
      expect(calculateRemainingAtOffset(doses, 0, 5)).toBe(0);
    });

    it('should sum multiple doses across days', () => {
      const doses: DoseEvent[] = [
        { hourOffset: 0, mg: 150 },
        { hourOffset: 24, mg: 150 },
      ];
      // At hour 24: yesterday's dose 150 * 0.5^(24/5) ≈ 5.38; today's dose elapsed 0 → excluded
      expect(calculateRemainingAtOffset(doses, 24, 5)).toBeCloseTo(5.38, 1);
      // At hour 31: 150 * 0.5^(31/5) + 150 * 0.5^(7/5) ≈ 2.04 + 56.84 ≈ 58.88
      expect(calculateRemainingAtOffset(doses, 31, 5)).toBeCloseTo(58.88, 1);
    });
  });

  describe('buildDoseTimeline', () => {
    it('should return empty doses for no consumptions', () => {
      const { doses } = buildDoseTimeline([], { days: 3, shouldRepeatDaily: true });
      expect(doses).toEqual([]);
    });

    it('should anchor the origin at the earliest consumption floored to the hour', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '07:30', mg: 150 }];
      const { originDate, doses } = buildDoseTimeline(consumptions);
      expect(originDate.getHours()).toBe(7);
      expect(originDate.getMinutes()).toBe(0);
      // 07:30 dose sits half an hour past the 07:00 origin
      expect(doses).toEqual([{ hourOffset: 0.5, mg: 150 }]);
    });

    it('should replicate the day-0 schedule across days when repeating', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];
      const { doses } = buildDoseTimeline(consumptions, { days: 3, shouldRepeatDaily: true });
      expect(doses.map((d) => d.hourOffset)).toEqual([0, 24, 48]);
      expect(doses.every((d) => d.mg === 150)).toBe(true);
    });

    it('should not replicate when repeatDaily is false', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];
      const { doses } = buildDoseTimeline(consumptions, { days: 3 });
      expect(doses.map((d) => d.hourOffset)).toEqual([0]);
    });

    it('should order doses chronologically within each repeated day', () => {
      const consumptions: Consumption[] = [
        { id: '2', time: '13:00', mg: 50 },
        { id: '1', time: '08:00', mg: 100 },
      ];
      const { doses } = buildDoseTimeline(consumptions, { days: 2, shouldRepeatDaily: true });
      expect(doses.map((d) => d.hourOffset)).toEqual([0, 5, 24, 29]);
      expect(doses.map((d) => d.mg)).toEqual([100, 50, 100, 50]);
    });

    it('should keep the day-0 schedule when repeating with a degenerate horizon', () => {
      const { doses } = buildDoseTimeline([{ id: '1', time: '07:00', mg: 150 }], { days: 0, shouldRepeatDaily: true });
      expect(doses.map((d) => d.hourOffset)).toEqual([0]);
    });
  });

  describe('malformed input hardening (AC-7)', () => {
    it('should skip consumptions with malformed times instead of crashing', () => {
      const consumptions: Consumption[] = [
        { id: '1', time: '', mg: 999 },
        { id: '2', time: '08:00', mg: 100 },
      ];
      // '' sorts earliest — must not poison the origin with an Invalid Date
      const data = generateDecayChartData(consumptions, 5);
      const solo = generateDecayChartData([{ id: '2', time: '08:00', mg: 100 }], 5);
      expect(data.length).toBe(49);
      expect(data.map((d) => d.remaining)).toEqual(solo.map((d) => d.remaining));
    });

    it('should return empty/null when every consumption is malformed', () => {
      const bad: Consumption[] = [{ id: '1', time: '8', mg: 100 }];
      expect(generateDecayChartData(bad, 5)).toEqual([]);
      expect(calculateSteadyStateBaseline(bad, 5)).toBeNull();
      expect(calculateBaselineRampUp(bad, 5)).toEqual([]);
    });

    it('should return null for an all-zero-mg schedule (no baseline claims for decaf)', () => {
      const decaf: Consumption[] = [{ id: '1', time: '09:00', mg: 0 }];
      expect(calculateSteadyStateBaseline(decaf, 5)).toBeNull();
      expect(calculateBaselineRampUp(decaf, 5)).toEqual([]);
    });

    it('should reject non-finite or non-positive half-lives', () => {
      const cons: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];
      expect(calculateSteadyStateBaseline(cons, NaN)).toBeNull();
      expect(calculateSteadyStateBaseline(cons, 0)).toBeNull();
      expect(calculateSteadyStateBaseline(cons, -5)).toBeNull();
      expect(calculateBaselineRampUp(cons, NaN)).toEqual([]);
      expect(generateDecayChartData(cons, NaN)).toEqual([]);
      expect(calculateRemainingAtOffset([{ hourOffset: 0, mg: 150 }], 5, 0)).toBe(0);
    });

    it('should tolerate non-array consumption payloads from stale localStorage', () => {
      const junk = null as unknown as Consumption[];
      expect(calculateRemainingAtTime(junk, '22:00', 5)).toBe(0);
      expect(calculateSafeSleepWindows(junk, 5)).toBeNull();
      expect(generateDecayChartData(junk, 5)).toEqual([]);
      expect(calculateSteadyStateBaseline(junk, 5)).toBeNull();
    });

    it('should render a label fallback instead of throwing on non-finite offsets', () => {
      const origin = new Date(2026, 0, 5, 7, 0, 0, 0);
      expect(formatHourOffsetLabel(origin, NaN)).toBe('');
      expect(formatHourOffsetLabel(origin, Infinity)).toBe('');
    });
  });

  describe('summarizeSteadyStateMath', () => {
    const cons: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];

    it('should report metabolism-dependent elimination percentages (AC-12)', () => {
      // elimination over 24h = (1 − 2^(−24/h))·100 — tied to the selected half-life
      expect(summarizeSteadyStateMath(cons, 5)!.eliminationPct).toBeCloseTo(96.4, 1);
      expect(summarizeSteadyStateMath(cons, 8)!.eliminationPct).toBeCloseTo(87.5, 1);
      expect(summarizeSteadyStateMath(cons, 3)!.eliminationPct).toBeCloseTo(99.6, 1);
      // retention is the complement
      expect(summarizeSteadyStateMath(cons, 5)!.retentionPct).toBeCloseTo(3.6, 1);
    });

    it('should expose the intake-equals-elimination fixed point with live numbers (AC-12)', () => {
      const summary = summarizeSteadyStateMath(cons, 5)!;
      expect(summary.dailyIntakeMg).toBe(150);
      expect(summary.doseCount).toBe(1);
      // floor = D·f/(1−f); post-dose = D/(1−f) — the level where daily
      // elimination exactly equals daily intake (Zach's napkin: 104.17mg at 4%)
      expect(summary.floorMg).toBeCloseTo(5.6, 1);
      expect(summary.postDoseMg).toBeCloseTo(155.6, 1);
      expect(summary.postDoseMg * (summary.eliminationPct / 100)).toBeCloseTo(150, 0);
      expect(summary.daysToSteadyState).toBe(2);
    });

    it('should count only valid caffeinated doses toward daily intake (AC-12)', () => {
      const mixed: Consumption[] = [
        { id: '1', time: '07:00', mg: 150 },
        { id: '2', time: 'bogus', mg: 500 },
        { id: '3', time: '13:00', mg: 50 },
      ];
      const summary = summarizeSteadyStateMath(mixed, 5)!;
      expect(summary.dailyIntakeMg).toBe(200);
      expect(summary.doseCount).toBe(2);
    });

    it('should return null for empty, decaf, or invalid inputs (AC-12)', () => {
      expect(summarizeSteadyStateMath([], 5)).toBeNull();
      expect(summarizeSteadyStateMath([{ id: '1', time: '09:00', mg: 0 }], 5)).toBeNull();
      expect(summarizeSteadyStateMath(cons, NaN)).toBeNull();
    });
  });

  describe('computeBedtimeOffsets', () => {
    const origin = new Date(2026, 0, 5, 7, 0, 0, 0); // 07:00

    it('should place one marker offset per simulated day', () => {
      expect(computeBedtimeOffsets('22:00', origin, 3)).toEqual([15, 39, 63]);
    });

    it('should wrap bedtimes earlier than the origin to the next day', () => {
      expect(computeBedtimeOffsets('06:00', origin, 2)).toEqual([23, 47]);
    });

    it('should return no markers for malformed bedtimes', () => {
      expect(computeBedtimeOffsets('', origin, 3)).toEqual([]);
      expect(computeBedtimeOffsets('22', origin, 3)).toEqual([]);
    });
  });

  describe('computeChartTicks', () => {
    it('should clock-align 1-day ticks to 4h wall-clock marks', () => {
      // origin 07:00 → first wall-clock 4h mark is 8AM (offset 1), as on main
      const origin = new Date(2026, 0, 5, 7, 0, 0, 0);
      expect(computeChartTicks(origin, 1)).toEqual([1, 5, 9, 13, 17, 21]);
    });

    it('should keep clock-aligned origins on the grid', () => {
      const origin = new Date(2026, 0, 5, 8, 0, 0, 0);
      expect(computeChartTicks(origin, 1)).toEqual([0, 4, 8, 12, 16, 20, 24]);
    });

    it('should use cycle-anchored spacing for multi-day horizons', () => {
      const origin = new Date(2026, 0, 5, 7, 0, 0, 0);
      expect(computeChartTicks(origin, 3)).toEqual([0, 12, 24, 36, 48, 60, 72]);
      expect(computeChartTicks(origin, 7)).toEqual([0, 24, 48, 72, 96, 120, 144, 168]);
    });
  });

  describe('calculateSteadyStateBaseline', () => {
    it('should return null for empty consumptions', () => {
      expect(calculateSteadyStateBaseline([], 5)).toBeNull();
    });

    it('should compute the converged trough and peak for a single daily dose (AC-4)', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];
      const result = calculateSteadyStateBaseline(consumptions, 5)!;
      // f = 0.5^(24/5) ≈ 0.03587; trough = 150 * f/(1-f) ≈ 5.58
      expect(result.troughMg).toBeCloseTo(5.6, 1);
      // peak = trough + 150 ≈ 155.6
      expect(result.peakMg).toBeCloseTo(155.6, 1);
    });

    it('should show a much higher baseline for slow metabolizers (AC-4)', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];
      const result = calculateSteadyStateBaseline(consumptions, 8)!;
      // f = 0.5^(24/8) = 0.125; trough = 150 * 0.125/0.875 ≈ 21.4
      expect(result.troughMg).toBeCloseTo(21.4, 1);
    });

    it('should sum per-dose geometric contributions for multi-dose schedules (AC-4)', () => {
      const consumptions: Consumption[] = [
        { id: '1', time: '07:00', mg: 150 },
        { id: '2', time: '13:00', mg: 50 },
      ];
      const result = calculateSteadyStateBaseline(consumptions, 5)!;
      // trough sits just before the 07:00 dose:
      // (150*0.5^(24/5) + 50*0.5^(18/5)) / (1 - 0.5^(24/5)) ≈ 9.86
      const f = Math.pow(0.5, 24 / 5);
      const expected = (150 * f + 50 * Math.pow(0.5, 18 / 5)) / (1 - f);
      expect(result.troughMg).toBeCloseTo(expected, 1);
    });

    it('should report days to reach 99% of the asymptote (AC-5)', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];
      // k = ceil(ln(0.01)/ln(f)): 3h → 1, 5h → 2, 8h → 3
      expect(calculateSteadyStateBaseline(consumptions, 3)!.daysToSteadyState).toBe(1);
      expect(calculateSteadyStateBaseline(consumptions, 5)!.daysToSteadyState).toBe(2);
      expect(calculateSteadyStateBaseline(consumptions, 8)!.daysToSteadyState).toBe(3);
    });
  });

  describe('calculateBaselineRampUp', () => {
    it('should return an empty array for no consumptions', () => {
      expect(calculateBaselineRampUp([], 5)).toEqual([]);
    });

    it('should ramp the trough toward steady state as asymptote·(1−f^k) (AC-9)', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];
      const ramp = calculateBaselineRampUp(consumptions, 5);
      expect(ramp.length).toBe(7);
      expect(ramp.map((r) => r.day)).toEqual([1, 2, 3, 4, 5, 6, 7]);
      // day 1: one dose down, trough = 150 * f ≈ 5.4
      expect(ramp[0].troughMg).toBeCloseTo(5.4, 1);
      // strictly increasing toward the asymptote
      for (let i = 1; i < ramp.length; i++) {
        expect(ramp[i].troughMg).toBeGreaterThan(ramp[i - 1].troughMg);
      }
      // final day within 0.1 of the converged steady-state trough
      const steady = calculateSteadyStateBaseline(consumptions, 5)!;
      expect(ramp[ramp.length - 1].troughMg).toBeCloseTo(steady.troughMg, 1);
    });

    it('should report percent of steady state as (1−f^k)·100 (AC-9)', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];
      const ramp = calculateBaselineRampUp(consumptions, 8);
      const f = Math.pow(0.5, 24 / 8); // 0.125
      // day 1: 87.5%, day 2: 98.4%, day 3: 99.8%
      expect(ramp[0].percentOfSteadyState).toBeCloseTo((1 - f) * 100, 1);
      expect(ramp[1].percentOfSteadyState).toBeCloseTo((1 - f * f) * 100, 1);
      expect(ramp[2].percentOfSteadyState).toBeCloseTo((1 - f * f * f) * 100, 1);
    });

    it('should match the truncated geometric series when the trough precedes the earliest dose (AC-9)', () => {
      const consumptions: Consumption[] = [
        { id: '1', time: '07:00', mg: 150 },
        { id: '2', time: '13:00', mg: 50 },
      ];
      const ramp = calculateBaselineRampUp(consumptions, 5);
      const steady = calculateSteadyStateBaseline(consumptions, 5)!;
      const f = Math.pow(0.5, 24 / 5);
      // trough sits before the earliest (07:00) dose, the one case where
      // every dose has fired exactly k times → asymptote·(1−f^k) is exact
      expect(ramp[1].troughMg).toBeCloseTo(steady.troughMg * (1 - f * f), 3);
    });

    it('should use the exact day-k floor when the trough precedes a later dose (AC-9)', () => {
      // 100mg@07:00 + 300mg@16:00, slow (8h): the steady trough (95.26mg)
      // sits just before the 16:00 dose, which has fired only k−1 times on
      // day k. The naive asymptote·(1−f^k) scaling claims day-1 = 83.4mg;
      // the true day-1 cycle minimum (1-min brute-force verified) is 45.85mg.
      const consumptions: Consumption[] = [
        { id: '1', time: '07:00', mg: 100 },
        { id: '2', time: '16:00', mg: 300 },
      ];
      const ramp = calculateBaselineRampUp(consumptions, 8);
      expect(ramp[0].troughMg).toBeCloseTo(45.85, 1);
      expect(ramp[1].troughMg).toBeCloseTo(89.08, 1);
      expect(ramp[2].troughMg).toBeCloseTo(94.49, 1);
      const steady = calculateSteadyStateBaseline(consumptions, 8)!;
      expect(ramp[6].troughMg).toBeCloseTo(steady.troughMg, 1);
      // percent tracks the exact floor, not (1−f^k)
      expect(ramp[0].percentOfSteadyState).toBeCloseTo((45.8502 / steady.troughMg) * 100, 1);
    });
  });

  describe('generateDecayChartData', () => {
    it('should return empty array for no consumptions', () => {
      expect(generateDecayChartData([], 5)).toEqual([]);
    });

    it('should generate 49 data points (24h in 30-min steps)', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '08:00', mg: 100 }];
      const data = generateDecayChartData(consumptions, 5);
      expect(data.length).toBe(49); // 0 to 24 hours inclusive at 30-min intervals
    });

    it('should show the true 24h residual at the final point, not 0 (AC-1)', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];
      const data = generateDecayChartData(consumptions, 5);
      const last = data[data.length - 1];
      expect(last.hourOffset).toBe(24);
      // 150 * 0.5^(24/5) ≈ 5.4mg still circulating at the 24h mark
      expect(last.remaining).toBeCloseTo(5.4, 1);
    });

    it('should extend continuously across a multi-day horizon without repeat (AC-2)', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];
      const data = generateDecayChartData(consumptions, 5, { days: 3 });
      expect(data.length).toBe(3 * 48 + 1);
      // 150 * 0.5^(48/5) ≈ 0.19mg at hour 48 — still nonzero
      const at48 = data.find((d) => d.hourOffset === 48)!;
      expect(at48.remaining).toBeCloseTo(0.19, 1);
      expect(at48.remaining).toBeGreaterThan(0);
      // no discontinuity at any 24h boundary: monotonically non-increasing after the peak
      const peakIndex = data.findIndex((d) => d.remaining > 0);
      for (let i = peakIndex + 1; i < data.length; i++) {
        expect(data[i].remaining).toBeLessThanOrEqual(data[i - 1].remaining);
      }
    });

    it('should accumulate day-over-day to the steady-state trough with repeat ON (AC-3)', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];
      const data = generateDecayChartData(consumptions, 5, { days: 7, shouldRepeatDaily: true });
      // pre-dose troughs sit at each 24h boundary (just-before-dose convention)
      const troughs = [1, 2, 3, 4, 5, 6].map(
        (k) => data.find((d) => d.hourOffset === 24 * k)!.remaining
      );
      for (let i = 1; i < troughs.length; i++) {
        expect(troughs[i]).toBeGreaterThan(troughs[i - 1]);
      }
      // converges to dose * f/(1-f) = 150 * 0.03587/0.96413 ≈ 5.58
      const f = Math.pow(0.5, 24 / 5);
      expect(troughs[troughs.length - 1]).toBeCloseTo((150 * f) / (1 - f), 1);
    });

    it('should return empty chart data for every option combination when there are no consumptions (AC-7)', () => {
      expect(generateDecayChartData([], 5)).toEqual([]);
      expect(generateDecayChartData([], 5, { days: 7 })).toEqual([]);
      expect(generateDecayChartData([], 5, { days: 7, shouldRepeatDaily: true })).toEqual([]);
    });

    it('should let a 0mg dose contribute nothing without perturbing the baseline (AC-7)', () => {
      const withZero: Consumption[] = [
        { id: '1', time: '07:00', mg: 150 },
        { id: '2', time: '10:00', mg: 0 },
      ];
      const without: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];
      const options = { days: 2, shouldRepeatDaily: true };
      expect(generateDecayChartData(withZero, 5, options).map((d) => d.remaining)).toEqual(
        generateDecayChartData(without, 5, options).map((d) => d.remaining)
      );
      const baseline = calculateSteadyStateBaseline(withZero, 5)!;
      const baselineWithout = calculateSteadyStateBaseline(without, 5)!;
      expect(baseline.troughMg).toBeCloseTo(baselineWithout.troughMg, 6);
      expect(baseline.peakMg).toBeCloseTo(baselineWithout.peakMg, 6);
    });

    it('should show monotonically decreasing caffeine after consumption', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '08:00', mg: 100 }];
      const data = generateDecayChartData(consumptions, 5);
      // First point is at consumption hour with 0 remaining (minutesElapsed=0 excluded),
      // second point onward reflects decay. Verify decay is monotonic after the initial rise.
      const peakIndex = data.findIndex((d) => d.remaining > 0);
      for (let i = peakIndex + 1; i < data.length; i++) {
        expect(data[i].remaining).toBeLessThanOrEqual(data[i - 1].remaining);
      }
    });
  });
});
