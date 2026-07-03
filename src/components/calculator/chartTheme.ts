// Shared recharts styling for the calculator's charts — one source of truth
// so the Decay Timeline and Baseline Ramp-Up tooltips can't drift apart.
export const CHART_TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: 'hsl(var(--card))', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px' },
  itemStyle: { color: 'hsl(var(--primary))' },
  labelStyle: { color: 'rgba(255,255,255,0.8)' },
} as const;

export const CHART_AXIS_STROKE = 'rgba(255,255,255,0.5)';
export const CHART_GRID_STROKE = 'rgba(255,255,255,0.1)';
export const BASELINE_COLOR = '#34d399'; // emerald — the steady-state floor entity across cards

export function formatMg(value?: number | string | (number | string)[]): string {
  return `${Number(value ?? 0).toFixed(1)} mg`;
}
