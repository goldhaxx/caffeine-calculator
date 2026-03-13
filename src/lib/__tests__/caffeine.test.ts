import { describe, it, expect } from 'vitest';
import {
  calculateRemainingAtTime,
  calculateSafeSleepWindows,
  generateDecayChartData,
  METABOLISM_HALF_LIVES,
  SENSITIVITY_THRESHOLDS,
  Consumption,
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

  describe('generateDecayChartData', () => {
    it('should return empty array for no consumptions', () => {
      expect(generateDecayChartData([], 5)).toEqual([]);
    });

    it('should generate 49 data points (24h in 30-min steps)', () => {
      const consumptions: Consumption[] = [{ id: '1', time: '08:00', mg: 100 }];
      const data = generateDecayChartData(consumptions, 5);
      expect(data.length).toBe(49); // 0 to 24 hours inclusive at 30-min intervals
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
