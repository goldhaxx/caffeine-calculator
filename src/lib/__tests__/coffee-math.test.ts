import { describe, it, expect } from 'vitest';
import {
  calculateBrewCaffeine,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  BEAN_CAFFEINE_PERCENTAGE,
  ROAST_DENSITY_MODIFIER,
  BREW_METHOD_YIELD,
  BrewParameters,
} from '../coffee-math';

describe('coffee brewing science model', () => {
  describe('constants', () => {
    it('should have scientifically validated bean caffeine percentages', () => {
      // Arabica: ~1.2% (Heckman et al. 2010)
      expect(BEAN_CAFFEINE_PERCENTAGE.arabica).toBe(0.012);
      // Robusta: ~2.2% (Heckman et al. 2010)
      expect(BEAN_CAFFEINE_PERCENTAGE.robusta).toBe(0.022);
      // Robusta should be roughly 1.8x Arabica
      expect(BEAN_CAFFEINE_PERCENTAGE.robusta / BEAN_CAFFEINE_PERCENTAGE.arabica).toBeCloseTo(1.83, 1);
    });

    it('should have roast modifiers reflecting mass loss during roasting', () => {
      expect(ROAST_DENSITY_MODIFIER.light).toBe(1.00);
      expect(ROAST_DENSITY_MODIFIER.medium).toBeGreaterThan(1.00);
      expect(ROAST_DENSITY_MODIFIER.dark).toBeGreaterThan(ROAST_DENSITY_MODIFIER.medium);
    });

    it('should order extraction yields from espresso (lowest) to cold brew (highest)', () => {
      expect(BREW_METHOD_YIELD.espresso).toBeLessThan(BREW_METHOD_YIELD.aeropress);
      expect(BREW_METHOD_YIELD.drip).toBeLessThan(BREW_METHOD_YIELD.cold_brew);
    });
  });

  describe('calculateBrewCaffeine', () => {
    it('should return 0 for zero grams', () => {
      const params: BrewParameters = {
        beanType: 'arabica',
        robustaPercentage: 0,
        roastLevel: 'medium',
        weightGrams: 0,
        brewMethod: 'drip',
        waterTempC: 93,
        brewTimeSeconds: 240,
      };
      expect(calculateBrewCaffeine(params)).toBe(0);
    });

    it('should calculate arabica aeropress correctly (validated scenario)', () => {
      // 15g medium roast arabica, aeropress, 94C, 90s
      const params: BrewParameters = {
        beanType: 'arabica',
        robustaPercentage: 0,
        roastLevel: 'medium',
        weightGrams: 15,
        brewMethod: 'aeropress',
        waterTempC: 94,
        brewTimeSeconds: 90,
      };
      const result = calculateBrewCaffeine(params);
      // 15 * 1000 * 0.012 = 180mg theoretical
      // * 1.02 (medium roast) = 183.6
      // * 0.85 (aeropress) = 156.06
      // * 1.0 (94C is in normal range) = 156.06
      // * 1.0 (90s is between 60-120s, normal range) = 156.06
      expect(result).toBe(156);
    });

    it('should produce more caffeine from robusta than arabica', () => {
      const base: BrewParameters = {
        beanType: 'arabica',
        robustaPercentage: 0,
        roastLevel: 'medium',
        weightGrams: 18,
        brewMethod: 'drip',
        waterTempC: 93,
        brewTimeSeconds: 240,
      };
      const arabicaResult = calculateBrewCaffeine(base);
      const robustaResult = calculateBrewCaffeine({ ...base, beanType: 'robusta', robustaPercentage: 100 });
      expect(robustaResult).toBeGreaterThan(arabicaResult);
    });

    it('should produce more caffeine from cold brew than espresso with same beans', () => {
      const base: BrewParameters = {
        beanType: 'arabica',
        robustaPercentage: 0,
        roastLevel: 'medium',
        weightGrams: 20,
        brewMethod: 'espresso',
        waterTempC: 93,
        brewTimeSeconds: 30,
      };
      const espresso = calculateBrewCaffeine(base);
      const coldBrew = calculateBrewCaffeine({
        ...base,
        brewMethod: 'cold_brew',
        waterTempC: 20,
        brewTimeSeconds: 43200, // 12 hours
      });
      expect(coldBrew).toBeGreaterThan(espresso);
    });

    it('should reduce yield for below-optimal water temperatures', () => {
      const base: BrewParameters = {
        beanType: 'arabica',
        robustaPercentage: 0,
        roastLevel: 'medium',
        weightGrams: 18,
        brewMethod: 'drip',
        waterTempC: 93,
        brewTimeSeconds: 240,
      };
      const normalTemp = calculateBrewCaffeine(base);
      const coolTemp = calculateBrewCaffeine({ ...base, waterTempC: 80 });
      expect(coolTemp).toBeLessThan(normalTemp);
    });

    it('should blend caffeine linearly for 50/50 blend', () => {
      const params: BrewParameters = {
        beanType: 'blend',
        robustaPercentage: 50,
        roastLevel: 'light',
        weightGrams: 20,
        brewMethod: 'drip',
        waterTempC: 93,
        brewTimeSeconds: 240,
      };
      const result = calculateBrewCaffeine(params);
      // Blended percentage: (0.5 * 0.012) + (0.5 * 0.022) = 0.017
      // 20 * 1000 * 0.017 = 340mg theoretical
      // * 1.0 (light) * 0.9 (drip) * 1.0 (93C) * 1.0 (240s) = 306
      expect(result).toBe(306);
    });
  });

  describe('temperature conversions', () => {
    it('should correctly convert F to C', () => {
      expect(fahrenheitToCelsius(212)).toBeCloseTo(100, 1); // boiling
      expect(fahrenheitToCelsius(32)).toBeCloseTo(0, 1); // freezing
      expect(fahrenheitToCelsius(200)).toBeCloseTo(93.3, 1); // brew temp
    });

    it('should correctly convert C to F', () => {
      expect(celsiusToFahrenheit(100)).toBeCloseTo(212, 1);
      expect(celsiusToFahrenheit(0)).toBeCloseTo(32, 1);
      expect(celsiusToFahrenheit(93)).toBeCloseTo(199.4, 1);
    });

    it('should round-trip correctly', () => {
      const original = 93;
      expect(fahrenheitToCelsius(celsiusToFahrenheit(original))).toBeCloseTo(original, 5);
    });
  });
});
