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
  const mg = Number((fraction * tablet.melatoninPerTabletMg).toFixed(3));
  const mcg = Math.round(mg * 1000);

  return { mg, mcg };
}
