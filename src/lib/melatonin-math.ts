/** Round to N decimal places using integer math to avoid floating-point drift. */
function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export interface TabletConfig {
  tabletWeightG: number;
  melatoninPerTabletMg: number;
}

export interface WeightToDoseResult {
  mg: number;
  mcg: number;
}

/**
 * Converts a measured tablet fragment weight to melatonin dose.
 * Returns null if any input is zero or negative.
 */
export function calculateWeightToDose(
  tablet: TabletConfig,
  measuredWeightG: number
): WeightToDoseResult | null {
  if (
    tablet.tabletWeightG <= 0 ||
    tablet.melatoninPerTabletMg <= 0 ||
    measuredWeightG <= 0
  ) {
    return null;
  }

  const fraction = measuredWeightG / tablet.tabletWeightG;
  const mg = roundTo(fraction * tablet.melatoninPerTabletMg, 3);
  const mcg = Math.round(mg * 1000);

  return { mg, mcg };
}

export interface DoseToWeightResult {
  grams: number;
  percentOfTablet: number;
}

/**
 * Converts a target melatonin dose (in mcg) to required tablet weight.
 * Returns null if any input is zero or negative.
 */
export function calculateDoseToWeight(
  tablet: TabletConfig,
  targetDoseMcg: number
): DoseToWeightResult | null {
  if (
    tablet.tabletWeightG <= 0 ||
    tablet.melatoninPerTabletMg <= 0 ||
    targetDoseMcg <= 0
  ) {
    return null;
  }

  const targetDoseMg = targetDoseMcg / 1000;
  const fraction = targetDoseMg / tablet.melatoninPerTabletMg;
  const grams = roundTo(fraction * tablet.tabletWeightG, 4);
  const percentOfTablet = roundTo(fraction * 100, 2);

  return { grams, percentOfTablet };
}
