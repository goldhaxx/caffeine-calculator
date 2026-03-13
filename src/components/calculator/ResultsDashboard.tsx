'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Consumption, MetabolismType, METABOLISM_HALF_LIVES, calculateRemainingAtTime, calculateSafeSleepWindows, generateDecayChartData } from '@/lib/caffeine';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

interface ResultsDashboardProps {
  consumptions: Consumption[];
  bedtime: string;
  metabolism: MetabolismType;
}

export function ResultsDashboard({ consumptions, bedtime, metabolism }: ResultsDashboardProps) {
  const halfLife = METABOLISM_HALF_LIVES[metabolism];
  
  const remainingAtBedtime = calculateRemainingAtTime(consumptions, bedtime, halfLife);
  const safeWindows = calculateSafeSleepWindows(consumptions, halfLife);
  const chartData = generateDecayChartData(consumptions, halfLife);

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
            <CardTitle className="font-outfit text-2xl">Decay Timeline</CardTitle>
            <CardDescription className="text-white/60">
              Visualizing the ({METABOLISM_HALF_LIVES[metabolism]}h) elimination half-life curve
            </CardDescription>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis 
                    dataKey="timeStr" 
                    stroke="rgba(255,255,255,0.5)" 
                    fontSize={12}
                    interval={0}
                    tickLine={false}
                    tickFormatter={(val) => {
                      const [hStr, mStr] = String(val).split(':');
                      if (!hStr || !mStr) return '';
                      const h = parseInt(hStr, 10);
                      if (mStr === '00' && h % 4 === 0) {
                        return `${h % 12 || 12}${h >= 12 ? 'PM' : 'AM'}`;
                      }
                      return '';
                    }}
                  />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                    formatter={(val: any) => [`${Number(val).toFixed(1)} mg`, 'Remaining']}
                    labelFormatter={(label) => formatTime12h(label)}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="remaining" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRemaining)" 
                  />
                  {/* Bedtime Marker */}
                  <ReferenceLine x={bedtime} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ position: 'top', value: 'Bedtime', fill: 'hsl(var(--destructive))', fontSize: 12 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
