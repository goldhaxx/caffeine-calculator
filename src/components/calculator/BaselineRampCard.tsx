'use client';

import { memo, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BaselineRampDay, Consumption, SteadyStateMathSummary, calculateBaselineRampUp } from '@/lib/caffeine';
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { BASELINE_COLOR, CHART_AXIS_STROKE, CHART_GRID_STROKE, CHART_TOOLTIP_STYLE, formatMg } from './chartTheme';
import { InfoTip } from './InfoTip';

interface BaselineRampCardProps {
  consumptions: Consumption[];
  halfLife: number;
  mathSummary: SteadyStateMathSummary;
}

export const BaselineRampCard = memo(function BaselineRampCard({ consumptions, halfLife, mathSummary }: BaselineRampCardProps) {
  const ramp = useMemo(() => calculateBaselineRampUp(consumptions, halfLife), [consumptions, halfLife]);

  if (ramp.length === 0) return null;

  const intakeMg = Math.round(mathSummary.dailyIntakeMg);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card className="glass-panel border-white/10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-primary"></div>
        <CardHeader>
          <CardTitle className="font-outfit text-2xl flex items-center gap-2">
            Baseline Ramp-Up
            <InfoTip label="Why the baseline settles instead of compounding">
              <p className="text-sm mb-2"><strong className="text-primary">Why it settles instead of compounding.</strong> Half-life decay is percentage-based — like a bathtub with an open drain: the fuller it is, the faster it drains.</p>
              <p className="text-sm mb-2">
                At your {halfLife}h half-life, <strong className="text-primary">{mathSummary.eliminationPct.toFixed(1)}%</strong> of
                whatever is in your blood clears every 24h — only {mathSummary.retentionPct.toFixed(1)}% carries to the next morning.
                (Slower metabolisms clear less per day, so their baseline builds higher.)
              </p>
              <p className="text-sm mb-2">
                Repeating {intakeMg} mg daily, the level climbs only until your body eliminates exactly {intakeMg} mg
                per day — the same amount you add.
                {mathSummary.doseCount === 1 && (
                  <> That balance sits at {mathSummary.postDoseMg.toFixed(1)} mg right after your dose:
                  {' '}{mathSummary.eliminationPct.toFixed(1)}% × {mathSummary.postDoseMg.toFixed(1)} mg ≈ {intakeMg} mg cleared per day.</>
                )}
                {' '}In = out → a steady floor of {mathSummary.floorMg.toFixed(1)} mg, not runaway build-up.
              </p>
              <p className="text-xs text-white/50">
                floor = dose × f/(1−f) summed per daily dose, where f = 2^(−24/half-life). 99% converged in {mathSummary.daysToSteadyState} day{mathSummary.daysToSteadyState === 1 ? '' : 's'}.
              </p>
            </InfoTip>
          </CardTitle>
          <CardDescription className="text-white/60">
            If you repeat today&apos;s intake every day, your daily floor builds toward a fixed ceiling — at your
            {' '}{halfLife}h half-life, {mathSummary.eliminationPct.toFixed(1)}% of what&apos;s on board clears every 24h
          </CardDescription>
          <p className="text-sm mt-2">
            <span className="text-emerald-400 font-medium">Settles at {mathSummary.floorMg.toFixed(1)} mg</span>
            <span className="text-white/50"> — within 99% by day {mathSummary.daysToSteadyState}</span>
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ramp} margin={{ top: 18, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke={CHART_AXIS_STROKE}
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(day) => `Day ${day}`}
                />
                <YAxis stroke={CHART_AXIS_STROKE} fontSize={11} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  {...CHART_TOOLTIP_STYLE}
                  formatter={(
                    val?: number | string | (number | string)[],
                    _name?: unknown,
                    item?: { payload?: BaselineRampDay }
                  ) => {
                    const percent = item?.payload?.percentOfSteadyState;
                    const settled = percent === undefined ? '' : ` · ${percent.toFixed(1)}% settled`;
                    return [`${formatMg(val)}${settled}`, 'Daily floor'];
                  }}
                  labelFormatter={(day) => `Day ${day}`}
                />
                <Bar dataKey="troughMg" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={26} />
                <ReferenceLine
                  y={mathSummary.floorMg}
                  stroke={BASELINE_COLOR}
                  strokeDasharray="4 4"
                  label={{ position: 'insideTopLeft', value: `Steady state ${mathSummary.floorMg.toFixed(1)} mg`, fill: BASELINE_COLOR, fontSize: 11 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
