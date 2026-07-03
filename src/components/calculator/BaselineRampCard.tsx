'use client';

import { memo, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BaselineRampDay, Consumption, calculateBaselineRampUp, calculateSteadyStateBaseline } from '@/lib/caffeine';
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { BASELINE_COLOR, CHART_AXIS_STROKE, CHART_GRID_STROKE, CHART_TOOLTIP_STYLE, formatMg } from './chartTheme';

interface BaselineRampCardProps {
  consumptions: Consumption[];
  halfLife: number;
}

export const BaselineRampCard = memo(function BaselineRampCard({ consumptions, halfLife }: BaselineRampCardProps) {
  const ramp = useMemo(() => calculateBaselineRampUp(consumptions, halfLife), [consumptions, halfLife]);
  const steadyState = useMemo(() => calculateSteadyStateBaseline(consumptions, halfLife), [consumptions, halfLife]);

  if (ramp.length === 0 || !steadyState) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card className="glass-panel border-white/10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-primary"></div>
        <CardHeader>
          <CardTitle className="font-outfit text-2xl">Baseline Ramp-Up</CardTitle>
          <CardDescription className="text-white/60">
            If you repeat today&apos;s intake every day, your daily floor builds toward a fixed ceiling — each
            day&apos;s carry-over is itself ~{Math.round((1 - Math.pow(0.5, 24 / halfLife)) * 100)}% eliminated
            by the next morning, so it converges instead of compounding
          </CardDescription>
          <p className="text-sm mt-2">
            <span className="text-emerald-400 font-medium">Settles at {steadyState.troughMg.toFixed(1)} mg</span>
            <span className="text-white/50"> — within 99% by day {steadyState.daysToSteadyState}</span>
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
                  y={steadyState.troughMg}
                  stroke={BASELINE_COLOR}
                  strokeDasharray="4 4"
                  label={{ position: 'insideTopLeft', value: `Steady state ${steadyState.troughMg.toFixed(1)} mg`, fill: BASELINE_COLOR, fontSize: 11 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
