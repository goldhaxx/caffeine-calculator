import { describe, it, expect } from 'vitest';
import { calculateTolerancePlan } from '../tolerance';

describe('tolerance reset model', () => {
  describe('cold turkey strategy', () => {
    it('should produce a 14-day plan', () => {
      const plan = calculateTolerancePlan(300, 'cold-turkey');
      expect(plan.totalDays).toBe(14);
      expect(plan.dailySteps.length).toBe(14);
    });

    it('should set all daily doses to 0', () => {
      const plan = calculateTolerancePlan(300, 'cold-turkey');
      plan.dailySteps.forEach((step) => {
        expect(step.dose).toBe(0);
      });
    });

    it('should have acute withdrawal phase in days 1-3', () => {
      // Consistent with Juliano & Griffiths 2004: withdrawal peaks 20-51h
      const plan = calculateTolerancePlan(300, 'cold-turkey');
      for (let i = 0; i < 3; i++) {
        expect(plan.dailySteps[i].notes).toContain('Acute');
      }
    });

    it('should preserve the starting dose', () => {
      const plan = calculateTolerancePlan(400, 'cold-turkey');
      expect(plan.startingDose).toBe(400);
    });
  });

  describe('taper strategy', () => {
    it('should reduce dose by 25% each phase', () => {
      const plan = calculateTolerancePlan(400, 'taper');
      // First phase: 400mg
      expect(plan.dailySteps[0].dose).toBe(400);
      // Second phase (day 11): 400 * 0.75 = 300
      expect(plan.dailySteps[10].dose).toBe(300);
      // Third phase (day 21): 300 * 0.75 = 225
      expect(plan.dailySteps[20].dose).toBe(225);
    });

    it('should end with a washout period of 0mg doses', () => {
      const plan = calculateTolerancePlan(200, 'taper');
      const lastSteps = plan.dailySteps.slice(-5);
      lastSteps.forEach((step) => {
        expect(step.dose).toBe(0);
      });
    });

    it('should eventually reach 0 for any starting dose', () => {
      const plan = calculateTolerancePlan(1000, 'taper');
      const lastStep = plan.dailySteps[plan.dailySteps.length - 1];
      expect(lastStep.dose).toBe(0);
    });

    it('should have a 5-day final washout', () => {
      const plan = calculateTolerancePlan(200, 'taper');
      const washoutSteps = plan.dailySteps.filter((s) => s.dose === 0);
      expect(washoutSteps.length).toBe(5);
    });
  });
});
