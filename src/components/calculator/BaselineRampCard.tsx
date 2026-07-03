'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Consumption, calculateBaselineRampUp, calculateSteadyStateBaseline } from '@/lib/caffeine';
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';

interface BaselineRampCardProps {
  consumptions: Consumption[];
  halfLife: number;
}

export function BaselineRampCard({ consumptions, halfLife }: BaselineRampCardProps) {
  const ramp = calculateBaselineRampUp(consumptions, halfLife);
  const steadyState = calculateSteadyStateBaseline(consumptions, halfLife);

  if (ramp.length === 0 || !steadyState) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card className="glass-panel border-white/10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-primary"></div>
        <CardHeader>
          <CardTitle className="font-outfit text-2xl">Baseline Ramp-Up</CardTitle>
          <CardDescription className="text-white/60">
            If you repeat today&apos;s intake every day, your pre-dose floor builds day over day
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(day) => `Day ${day}`}
                />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                  formatter={(val?: number | string | (number | string)[]) => [`${Number(val ?? 0).toFixed(1)} mg`, 'Morning floor']}
                  labelFormatter={(day) => `Day ${day}`}
                />
                <Bar dataKey="troughMg" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={26} />
                <ReferenceLine
                  y={steadyState.troughMg}
                  stroke="#34d399"
                  strokeDasharray="4 4"
                  label={{ position: 'insideTopLeft', value: `Steady state ${steadyState.troughMg.toFixed(1)} mg`, fill: '#34d399', fontSize: 11 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
