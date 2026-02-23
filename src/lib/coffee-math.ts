export type BeanType = 'arabica' | 'robusta' | 'blend';
export type RoastLevel = 'light' | 'medium' | 'dark';
export type BrewMethod = 'espresso' | 'aeropress' | 'drip' | 'french_press' | 'cold_brew';

export interface BrewParameters {
    beanType: BeanType;
    robustaPercentage: number; // 0 to 100. If 'arabica', this is 0. If 'robusta', 100.
    roastLevel: RoastLevel;
    weightGrams: number;
    brewMethod: BrewMethod;
    waterTempC: number;
    brewTimeSeconds: number;
}

// 1. BEAN CONSTANTS (% of mass that is caffeine)
export const BEAN_CAFFEINE_PERCENTAGE = {
    arabica: 0.012, // ~1.2%
    robusta: 0.022, // ~2.2%
};

// 2. ROAST CONSTANTS (Density modifier. Dark roast loses mass, so more beans per gram)
export const ROAST_DENSITY_MODIFIER = {
    light: 1.00,
    medium: 1.02,
    dark: 1.05,
};

// 3. METHOD EXTRACTION CONSTANTS (Base max extraction potential)
export const BREW_METHOD_YIELD = {
    espresso: 0.80,
    aeropress: 0.85,
    french_press: 0.85,
    drip: 0.90,
    cold_brew: 0.95,
};

/**
 * Calculates the total caffeine in a brewed cup of coffee based on scientific variables.
 */
export function calculateBrewCaffeine(params: BrewParameters): number {
    if (params.weightGrams <= 0) return 0;

    // 1. Calculate the blended bean base multiplier
    // e.g. 100% Arabica = 0.012. 50/50 blend = 0.017.
    const robustaFraction = params.robustaPercentage / 100;
    const arabicaFraction = 1 - robustaFraction;
    const blendedCaffeinePercentage =
        (arabicaFraction * BEAN_CAFFEINE_PERCENTAGE.arabica) +
        (robustaFraction * BEAN_CAFFEINE_PERCENTAGE.robusta);

    // 2. Calculate theoretical maximum caffeine in the dry grounds (in mg)
    const theoreticalMaxMg = params.weightGrams * 1000 * blendedCaffeinePercentage;

    // 3. Apply Roast Density Modifier (Dark roasts have slightly more caffeine per gram of weight)
    const roastAdjustedMaxMg = theoreticalMaxMg * ROAST_DENSITY_MODIFIER[params.roastLevel];

    // 4. Calculate Extraction Efficiency based on Method, Time, and Temp
    const methodBaseYield = BREW_METHOD_YIELD[params.brewMethod];

    // Temp Modifier (Standardize around 93C/200F for hot brews)
    let tempModifier = 1.0;
    if (params.brewMethod === 'cold_brew') {
        // Cold brew uses room/cold temp, it relies entirely on time (12-24h).
        tempModifier = 1.0;
    } else {
        // For hot brews, cooler water dramatically lowers yield.
        if (params.waterTempC < 85) {
            tempModifier = 0.85; // Too cool
        } else if (params.waterTempC < 90) {
            tempModifier = 0.95; // Slightly cool
        } else if (params.waterTempC > 96) {
            tempModifier = 1.05; // Very hot, extracts more (and more bitterness)
        }
    }

    // Time Modifier
    let timeModifier = 1.0;
    if (params.brewMethod === 'cold_brew') {
        // Cold brew expects 12+ hours (43200 seconds). If they do less, yield drops.
        if (params.brewTimeSeconds < 36000) timeModifier = 0.8; // Under 10 hours
    } else if (params.brewMethod === 'espresso') {
        // Espresso expects 25-35s. 
        if (params.brewTimeSeconds < 20) timeModifier = 0.85; // Ristretto/Under-extracted
        if (params.brewTimeSeconds > 40) timeModifier = 1.1; // Lungo/Over-extracted
    } else if (params.brewMethod === 'aeropress') {
        // Aeropress can be 30s to 4m.
        if (params.brewTimeSeconds < 60) timeModifier = 0.80; // Fast push
        else if (params.brewTimeSeconds > 120) timeModifier = 1.05; // Full steep
    } else {
        // Drip / French Press usually 3-5 mins (180-300s).
        if (params.brewTimeSeconds < 120) timeModifier = 0.75; // Massively under-steeped
    }

    // Final yield calculation
    const finalCaffeineMg = roastAdjustedMaxMg * methodBaseYield * tempModifier * timeModifier;

    // Return rounded to nearest whole mg
    return Math.round(finalCaffeineMg);
}

// Helper to convert F to C
export function fahrenheitToCelsius(f: number): number {
    return (f - 32) * 5 / 9;
}

// Helper to convert C to F
export function celsiusToFahrenheit(c: number): number {
    return (c * 9 / 5) + 32;
}
