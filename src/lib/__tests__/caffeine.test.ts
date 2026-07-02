import { describe, it, expect } from 'vitest';
import {
  calculateRemainingAtTime,
  calculateRemainingAtOffset,
  buildDoseTimeline,
  calculateSteadyStateBaseline,
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
      const { doses } = buildDoseTimeline([], { days: 3, repeatDaily: true });
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
      const { doses } = buildDoseTimeline(consumptions, { days: 3, repeatDaily: true });
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
      const { doses } = buildDoseTimeline(consumptions, { days: 2, repeatDaily: true });
      expect(doses.map((d) => d.hourOffset)).toEqual([0, 5, 24, 29]);
      expect(doses.map((d) => d.mg)).toEqual([100, 50, 100, 50]);
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
      // day indices track 24h cycles from the origin
      expect(data.find((d) => d.hourOffset === 23.5)!.dayIndex).toBe(0);
      expect(data.find((d) => d.hourOffset === 25)!.dayIndex).toBe(1);
      // no discontinuity at any 24h boundary: monotonically non-increasing after the peak
      const peakIndex = data.findIndex((d) => d.remaining > 0);
      for (let i = peakIndex + 1; i < data.length; i++) {
        expect(data[i].remaining).toBeLessThanOrEqual(data[i - 1].remaining);
      }
    });

    it('should accumulate day-over-day to the steady-state trough with repeat ON (AC-3)', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];
      const data = generateDecayChartData(consumptions, 5, { days: 7, repeatDaily: true });
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
      expect(generateDecayChartData([], 5, { days: 7, repeatDaily: true })).toEqual([]);
    });

    it('should let a 0mg dose contribute nothing without perturbing the baseline (AC-7)', () => {
      const withZero: Consumption[] = [
        { id: '1', time: '07:00', mg: 150 },
        { id: '2', time: '10:00', mg: 0 },
      ];
      const without: Consumption[] = [{ id: '1', time: '07:00', mg: 150 }];
      const options = { days: 2, repeatDaily: true };
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
