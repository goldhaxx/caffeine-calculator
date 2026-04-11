import { describe, it, expect } from 'vitest';
import {
  calculateWeightToDose,
  calculateDoseToWeight,
  type TabletConfig,
} from '../melatonin-math';

const defaultTablet: TabletConfig = {
  tabletWeightG: 0.365,
  melatoninPerTabletMg: 10,
};

describe('melatonin microdose calculator', () => {
  describe('calculateWeightToDose', () => {
    it('converts measured weight to melatonin dose with correct precision (AC-1)', () => {
      // 0.109g of a 0.365g/10mg tablet → 2.986mg / 2986mcg
      const result = calculateWeightToDose(defaultTablet, 0.109);
      expect(result).not.toBeNull();
      expect(result!.mg).toBe(2.986);
      expect(result!.mcg).toBe(2986);
    });

    it('does not clamp when measured weight exceeds tablet weight (AC-3)', () => {
      // 0.400g exceeds 0.365g tablet → should return >10mg
      const result = calculateWeightToDose(defaultTablet, 0.400);
      expect(result).not.toBeNull();
      expect(result!.mg).toBeGreaterThan(defaultTablet.melatoninPerTabletMg);
    });

    it('returns null for zero measured weight (AC-4)', () => {
      expect(calculateWeightToDose(defaultTablet, 0)).toBeNull();
    });

    it('returns null for negative measured weight (AC-4)', () => {
      expect(calculateWeightToDose(defaultTablet, -0.05)).toBeNull();
    });

    it('returns null when tablet weight is zero (AC-5)', () => {
      const zeroTablet: TabletConfig = { tabletWeightG: 0, melatoninPerTabletMg: 10 };
      expect(calculateWeightToDose(zeroTablet, 0.109)).toBeNull();
    });

    it('returns null when melatonin per tablet is zero (AC-4)', () => {
      const zeroMel: TabletConfig = { tabletWeightG: 0.365, melatoninPerTabletMg: 0 };
      expect(calculateWeightToDose(zeroMel, 0.109)).toBeNull();
    });

    it('returns null when melatonin per tablet is negative (AC-4)', () => {
      const negMel: TabletConfig = { tabletWeightG: 0.365, melatoninPerTabletMg: -5 };
      expect(calculateWeightToDose(negMel, 0.109)).toBeNull();
    });
  });

  describe('calculateDoseToWeight', () => {
    it('converts target dose to required weight with correct precision (AC-2)', () => {
      // 500mcg target from 0.365g/10mg tablet → 0.0183g / 5.00%
      const result = calculateDoseToWeight(defaultTablet, 500);
      expect(result).not.toBeNull();
      expect(result!.grams).toBe(0.0183);
      expect(result!.percentOfTablet).toBe(5.0);
    });

    it('returns null for zero target dose (AC-4)', () => {
      expect(calculateDoseToWeight(defaultTablet, 0)).toBeNull();
    });

    it('returns null for negative target dose (AC-4)', () => {
      expect(calculateDoseToWeight(defaultTablet, -300)).toBeNull();
    });

    it('returns null when tablet weight is zero (AC-5)', () => {
      const zeroTablet: TabletConfig = { tabletWeightG: 0, melatoninPerTabletMg: 10 };
      expect(calculateDoseToWeight(zeroTablet, 500)).toBeNull();
    });

    it('returns null when melatonin per tablet is zero (AC-4)', () => {
      const zeroMel: TabletConfig = { tabletWeightG: 0.365, melatoninPerTabletMg: 0 };
      expect(calculateDoseToWeight(zeroMel, 500)).toBeNull();
    });
  });
});
