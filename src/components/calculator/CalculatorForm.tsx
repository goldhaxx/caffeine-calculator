'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Consumption, MetabolismType, METABOLISM_HALF_LIVES } from '@/lib/caffeine';
import { Plus, X, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface CalculatorFormProps {
  consumptions: Consumption[];
  setConsumptions: (c: Consumption[]) => void;
  bedtime: string;
  setBedtime: (t: string) => void;
  metabolism: MetabolismType;
  setMetabolism: (m: MetabolismType) => void;
}

export function CalculatorForm({
  consumptions,
  setConsumptions,
  bedtime,
  setBedtime,
  metabolism,
  setMetabolism,
}: CalculatorFormProps) {
  const addConsumption = () => {
    setConsumptions([
      ...consumptions,
      { id: Date.now().toString(), time: '08:00', mg: 100 },
    ]);
  };

  const removeConsumption = (id: string) => {
    setConsumptions(consumptions.filter((c) => c.id !== id));
  };

  const updateConsumption = (id: string, field: keyof Consumption, value: string | number) => {
    setConsumptions(
      consumptions.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  return (
    <Card className="glass-panel border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-pink-400 to-blue-400"></div>
      <CardHeader>
        <CardTitle className="font-outfit text-2xl font-bold tracking-tight">Your Intake</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter when and how much caffeine you've consumed today.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold tracking-wide text-foreground/80 uppercase">Consumptions</h3>
            <Button size="sm" variant="outline" onClick={addConsumption} className="rounded-full h-8 px-3 border-white/20 hover:bg-white/10">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          
          <AnimatePresence>
            {consumptions.map((cons, idx) => (
              <motion.div
                key={cons.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10"
              >
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-muted-foreground ml-1">Time</label>
                  <Input
                    type="time"
                    value={cons.time}
                    onChange={(e) => updateConsumption(cons.id, 'time', e.target.value)}
                    className="bg-transparent border-white/20 focus-visible:ring-primary"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-muted-foreground ml-1">Amount (mg)</label>
                  <Input
                    type="number"
                    value={cons.mg}
                    onChange={(e) => updateConsumption(cons.id, 'mg', Number(e.target.value))}
                    className="bg-transparent border-white/20 focus-visible:ring-primary"
                  />
                </div>
                <div className="pt-5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeConsumption(cons.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/20 h-9 w-9"
                    disabled={consumptions.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="space-y-1 pt-4 border-t border-white/10">
          <label className="text-sm font-medium">Target Bedtime</label>
          <Input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="bg-white/5 border-white/20"
          />
        </div>

        <div className="space-y-1 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center">
              Metabolism Speed
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="w-80 p-4 border-white/20 glass-panel">
                  <p className="text-sm mb-2"><strong className="text-primary">Fast (~3h):</strong> ~40-50% of people (CYP1A2 fast). Clears quickly.</p>
                  <p className="text-sm mb-2"><strong className="text-primary">Average (~5h):</strong> Most common.</p>
                  <p className="text-sm"><strong className="text-primary">Slow (~8h+):</strong> Lingers much longer. Even morning coffee disrupts sleep.</p>
                </TooltipContent>
              </Tooltip>
            </label>
          </div>
          <Select value={metabolism} onValueChange={(val: MetabolismType) => setMetabolism(val)}>
            <SelectTrigger className="bg-white/5 border-white/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fast">Fast ({METABOLISM_HALF_LIVES.fast}h half-life)</SelectItem>
              <SelectItem value="average">Average ({METABOLISM_HALF_LIVES.average}h half-life)</SelectItem>
              <SelectItem value="slow">Slow ({METABOLISM_HALF_LIVES.slow}h half-life)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
