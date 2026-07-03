'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Consumption, MetabolismType, METABOLISM_HALF_LIVES, calculateRemainingAtTime, calculateSafeSleepWindows, calculateSteadyStateBaseline, computeBedtimeOffsets, computeChartTicks, formatHourOffsetLabel, generateDecayChartData } from '@/lib/caffeine';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';
import { Repeat } from 'lucide-react';
import { BaselineRampCard } from './BaselineRampCard';
import { BASELINE_COLOR, CHART_AXIS_STROKE, CHART_GRID_STROKE, CHART_TOOLTIP_STYLE, formatMg } from './chartTheme';

interface ResultsDashboardProps {
  consumptions: Consumption[];
  bedtime: string;
  metabolism: MetabolismType;
}

type HorizonDays = 1 | 3 | 7;

export function ResultsDashboard({ consumptions, bedtime, metabolism }: ResultsDashboardProps) {
  const halfLife = METABOLISM_HALF_LIVES[metabolism];
  const [horizonDays, setHorizonDays] = useState<HorizonDays>(1);
  const [shouldRepeatDaily, setShouldRepeatDaily] = useState(false);

  const remainingAtBedtime = calculateRemainingAtTime(consumptions, bedtime, halfLife);
  const safeWindows = calculateSafeSleepWindows(consumptions, halfLife);

  // memoized: recharts re-lays-out whenever the data array identity changes,
  // and this recomputes on every keystroke in unrelated inputs otherwise
  const chartData = useMemo(
    () => generateDecayChartData(consumptions, halfLife, { days: horizonDays, shouldRepeatDaily }),
    [consumptions, halfLife, horizonDays, shouldRepeatDaily]
  );
  const baseline = useMemo(
    () => (shouldRepeatDaily ? calculateSteadyStateBaseline(consumptions, halfLife) : null),
    [consumptions, halfLife, shouldRepeatDaily]
  );

  const chartOrigin = chartData.length > 0 ? chartData[0].actualTime : null;
  const ticks = chartOrigin ? computeChartTicks(chartOrigin, horizonDays) : [];
  const bedtimeOffsets = chartOrigin ? computeBedtimeOffsets(bedtime, chartOrigin, horizonDays) : [];

  const getStatusColor = (amount: number) => {
    if (amount <= 15) return 'text-emerald-400';
    if (amount <= 30) return 'text-yellow-400';
    if (amount <= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const statusText = remainingAtBedtime <= 15
    ? 'Excellent'
    : remainingAtBedtime <= 30
      ? 'Good'
      : remainingAtBedtime <= 50
        ? 'Fair'
        : 'Disruptive';

  const formatTime12h = (time24h: string | number) => {
    if (!time24h) return '';
    const [hours, minutes] = String(time24h).split(':');
    if (!hours || !minutes) return String(time24h);
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-panel border-white/10 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-outfit text-muted-foreground">At Bedtime ({formatTime12h(bedtime)})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold font-outfit tracking-tighter">
                  {remainingAtBedtime.toFixed(1)}
                </span>
                <span className="text-muted-foreground text-lg">mg</span>
              </div>
              <p className={`mt-2 font-medium ${getStatusColor(remainingAtBedtime)}`}>
                Sleep Quality: {statusText}
              </p>
              <p className="text-sm text-white/50 mt-1">
                {(remainingAtBedtime > 30) && "Caffeine blocks adenosine receptors, delaying sleep onset and reducing deep sleep."}
                {(remainingAtBedtime <= 30) && "Minimal caffeine remaining. Sleep architecture should be largely unaffected."}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-panel border-white/10 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-outfit text-muted-foreground">Safe Sleep Window</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-1">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-sm text-foreground/80">Sensitive (&lt;15mg)</span>
                  <span className="font-semibold">{safeWindows?.sensitive ? `After ${safeWindows.sensitive}` : 'Not tonight'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-sm text-foreground/80">Average (&lt;30mg)</span>
                  <span className="font-semibold text-primary">{safeWindows?.average ? `After ${safeWindows.average}` : 'Not tonight'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/80">Tolerant (&lt;50mg)</span>
                  <span className="font-semibold">{safeWindows?.tolerant ? `After ${safeWindows.tolerant}` : 'Not tonight'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Chart Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-panel border-white/10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-primary"></div>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="font-outfit text-2xl">Decay Timeline</CardTitle>
                <CardDescription className="text-white/60">
                  Visualizing the ({METABOLISM_HALF_LIVES[metabolism]}h) elimination half-life curve
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={String(horizonDays)} onValueChange={(val) => setHorizonDays(Number(val) as HorizonDays)}>
                  <SelectTrigger className="h-8 w-[104px] bg-white/5 border-white/20 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant={shouldRepeatDaily ? 'default' : 'outline'}
                  onClick={() => setShouldRepeatDaily(!shouldRepeatDaily)}
                  className={`h-8 rounded-full px-3 text-xs ${shouldRepeatDaily ? '' : 'border-white/20 hover:bg-white/10'}`}
                >
                  <Repeat className="h-3.5 w-3.5 mr-1.5" /> Repeat daily
                </Button>
              </div>
            </div>
            {baseline && (
              <p className="text-sm mt-2">
                <span className="text-emerald-400 font-medium">Baseline: {baseline.troughMg.toFixed(1)} mg</span>
                <span className="text-white/50"> — the floor this routine settles into, reached after ~{baseline.daysToSteadyState} day{baseline.daysToSteadyState === 1 ? '' : 's'}</span>
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRemaining" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
                  <XAxis
                    dataKey="hourOffset"
                    type="number"
                    domain={[0, horizonDays * 24]}
                    ticks={ticks}
                    interval={0}
                    stroke={CHART_AXIS_STROKE}
                    fontSize={horizonDays === 1 ? 12 : 10}
                    tickLine={false}
                    tickFormatter={(val) => (chartOrigin ? formatHourOffsetLabel(chartOrigin, Number(val)) : '')}
                  />
                  <YAxis stroke={CHART_AXIS_STROKE} fontSize={12} />
                  <Tooltip
                    {...CHART_TOOLTIP_STYLE}
                    formatter={(val?: number | string | (number | string)[]) => [formatMg(val), 'Remaining']}
                    labelFormatter={(label) => (chartOrigin ? formatHourOffsetLabel(chartOrigin, Number(label), 'tooltip') : '')}
                  />
                  <Area
                    type="monotone"
                    dataKey="remaining"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRemaining)"
                  />
                  {/* Bedtime markers — one per simulated day */}
                  {bedtimeOffsets.map((offset, index) => (
                    <ReferenceLine
                      key={`bedtime-${offset}`}
                      x={offset}
                      stroke="hsl(var(--destructive))"
                      strokeDasharray="3 3"
                      label={index === 0 ? { position: 'top', value: 'Bedtime', fill: 'hsl(var(--destructive))', fontSize: 12 } : undefined}
                    />
                  ))}
                  {/* Steady-state baseline floor (daily routine asymptote) */}
                  {baseline && (
                    <ReferenceLine
                      y={baseline.troughMg}
                      stroke={BASELINE_COLOR}
                      strokeDasharray="4 4"
                      label={{ position: 'insideTopRight', value: `Baseline ${baseline.troughMg.toFixed(1)} mg`, fill: BASELINE_COLOR, fontSize: 11 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Baseline Ramp-Up — day-over-day floor if today's intake repeats daily */}
      <BaselineRampCard consumptions={consumptions} halfLife={halfLife} />
    </div>
  );
}
