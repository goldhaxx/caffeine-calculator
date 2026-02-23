'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToleranceStrategy } from '@/lib/tolerance';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ToleranceCalculatorProps {
  currentIntake: number;
  setCurrentIntake: (val: number) => void;
  strategy: ToleranceStrategy;
  setStrategy: (s: ToleranceStrategy) => void;
}

export function ToleranceCalculator({
  currentIntake,
  setCurrentIntake,
  strategy,
  setStrategy
}: ToleranceCalculatorProps) {
  return (
    <Card className="glass-panel border-white/10 relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"></div>
      <CardHeader>
        <CardTitle className="font-outfit text-2xl font-bold tracking-tight">Your Intake</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your current daily caffeine consumption to generate a reset plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center">
            Daily Average (mg)
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-1.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="w-64 p-3 border-white/20 glass-panel">
                <p className="text-sm">Enter the total amount of caffeine you typically consume in a 24-hour period.</p>
              </TooltipContent>
            </Tooltip>
          </label>
          <Input
            type="number"
            value={currentIntake}
            onChange={(e) => setCurrentIntake(Number(e.target.value))}
            className="bg-white/5 border-white/20 text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none h-12"
            placeholder="e.g. 300"
          />
        </div>

        <div className="space-y-1 pt-2">
          <label className="text-sm font-medium flex items-center mb-1">
            Reset Strategy
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-1.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="w-80 p-4 border-white/20 glass-panel">
                <p className="text-sm mb-2"><strong className="text-primary">Taper Down:</strong> Gradually reduce your caffeine intake by 25% every 10 days to minimize withdrawal symptoms.</p>
                <p className="text-sm"><strong className="text-primary">Cold Turkey:</strong> Stop completely. Uncomfortable withdrawal for a few days, but resets adenosine receptors faster (~14 days).</p>
              </TooltipContent>
            </Tooltip>
          </label>
          <Select value={strategy} onValueChange={(val: ToleranceStrategy) => setStrategy(val)}>
            <SelectTrigger className="bg-white/5 border-white/20 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="taper">Taper Down (Recommended)</SelectItem>
              <SelectItem value="cold-turkey">Cold Turkey (Fast Reset)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
