'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { BeanType, RoastLevel, BrewMethod, BrewParameters } from '@/lib/coffee-math';
import { useState } from 'react';

interface BrewCalculatorFormProps {
  params: BrewParameters;
  setParams: (params: BrewParameters | ((p: BrewParameters) => BrewParameters)) => void;
}

export function BrewCalculatorForm({ params, setParams }: BrewCalculatorFormProps) {
  const [metricTemp, setMetricTemp] = useState(true);
  const [timeUnit, setTimeUnit] = useState<'seconds' | 'minutes' | 'hours'>(
    params.brewMethod === 'cold_brew' ? 'hours' : 
    params.brewMethod === 'espresso' ? 'seconds' : 
    'minutes'
  );
  const [localTime, setLocalTime] = useState<string>(() => {
    if (!params.brewTimeSeconds) return '';
    if (params.brewMethod === 'cold_brew') return (params.brewTimeSeconds / 3600).toString();
    if (params.brewMethod === 'espresso') return params.brewTimeSeconds.toString();
    return (params.brewTimeSeconds / 60).toString();
  });

  const updateParam = (key: keyof BrewParameters, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleTimeUnitChange = (newUnit: 'seconds' | 'minutes' | 'hours') => {
    setTimeUnit(newUnit);
    if (params.brewTimeSeconds) {
      if (newUnit === 'hours') setLocalTime(+(params.brewTimeSeconds / 3600).toFixed(3) + '');
      else if (newUnit === 'minutes') setLocalTime(+(params.brewTimeSeconds / 60).toFixed(3) + '');
      else setLocalTime(params.brewTimeSeconds.toString());
    } else {
      setLocalTime('');
    }
  };

  const handleBrewMethodChange = (val: string) => {
    const method = val as BrewMethod;
    updateParam('brewMethod', method);
    if (method === 'cold_brew') handleTimeUnitChange('hours');
    else if (method === 'espresso') handleTimeUnitChange('seconds');
    else handleTimeUnitChange('minutes');
  };

  const handleTimeChange = (valStr: string) => {
    setLocalTime(valStr);
    const val = Number(valStr);
    if (!isNaN(val) && valStr !== '') {
      const inSeconds = timeUnit === 'hours' ? val * 3600 :
                        timeUnit === 'minutes' ? val * 60 :
                        val;
      updateParam('brewTimeSeconds', inSeconds);
    } else if (valStr === '') {
      updateParam('brewTimeSeconds', 0);
    }
  };

  const handleBeanChange = (val: string) => {
    updateParam('beanType', val as BeanType);
    if (val === 'arabica') updateParam('robustaPercentage', 0);
    if (val === 'robusta') updateParam('robustaPercentage', 100);
    if (val === 'blend') updateParam('robustaPercentage', 50); // Default 50/50 starting point
  };

  return (
    <Card className="glass-panel border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-500"></div>
      <CardHeader>
        <CardTitle className="font-outfit text-2xl font-bold tracking-tight">Brew Parameters</CardTitle>
        <CardDescription className="text-white/60">
          Dial in your variables to calculate extraction yield.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Bean Type & Blend */}
        <div className="space-y-3 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center">
              Bean Species
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="w-80 p-3 border-white/20 glass-panel text-white">
                  <p className="text-sm">Robusta beans naturally contain almost double the caffeine (~2.2%) compared to Arabica (~1.2%).</p>
                </TooltipContent>
              </Tooltip>
            </label>
          </div>
          <Select value={params.beanType} onValueChange={handleBeanChange}>
            <SelectTrigger className="bg-white/5 border-white/20 focus:ring-amber-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arabica">100% Arabica (Lower Caffeine, Sweet)</SelectItem>
              <SelectItem value="robusta">100% Robusta (High Caffeine, Bitter)</SelectItem>
              <SelectItem value="blend">Espresso Blend (Mix)</SelectItem>
            </SelectContent>
          </Select>

          {params.beanType === 'blend' && (
            <div className="pt-2 space-y-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Arabica ({100 - params.robustaPercentage}%)</span>
                <span>Robusta ({params.robustaPercentage}%)</span>
              </div>
              <Slider 
                value={[params.robustaPercentage]} 
                onValueChange={(val) => updateParam('robustaPercentage', val[0])}
                max={100} 
                step={5}
                className="[&>[data-radix-slider-thumb]]:bg-amber-500 [&>[data-radix-slider-track]]:bg-white/10 [&>[role=slider]]:border-none"
              />
            </div>
          )}
        </div>

        {/* Roast level */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center">
              Roast Level
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="w-80 p-3 border-white/20 glass-panel text-white">
                  <p className="text-sm">Dark roasting burns off mass/moisture, so beans weigh less. Therefore, 20g of dark roast requires <em>more physical beans</em> than 20g of light roast, yielding slightly more caffeine by weight.</p>
                </TooltipContent>
              </Tooltip>
            </label>
            <Select value={params.roastLevel} onValueChange={(val) => updateParam('roastLevel', val as RoastLevel)}>
              <SelectTrigger className="bg-white/5 border-white/20 focus:ring-amber-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light Roast</SelectItem>
                <SelectItem value="medium">Medium Roast</SelectItem>
                <SelectItem value="dark">Dark Roast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Coffee Weight (grams)</label>
            <Input 
              type="number" 
              value={params.weightGrams || ''} 
              onChange={(e) => updateParam('weightGrams', Number(e.target.value))}
              placeholder="e.g. 18"
              className="bg-white/5 border-white/20 focus-visible:ring-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Method, Temp, Time */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center">
              Brew Method
            </label>
            <Select value={params.brewMethod} onValueChange={handleBrewMethodChange}>
              <SelectTrigger className="bg-white/5 border-white/20 focus:ring-amber-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="espresso">Espresso (Fast, ~80% yields)</SelectItem>
                <SelectItem value="aeropress">AeroPress (Variable steep)</SelectItem>
                <SelectItem value="french_press">French Press (Immersion)</SelectItem>
                <SelectItem value="drip">Drip / Pour Over (High yield)</SelectItem>
                <SelectItem value="cold_brew">Cold Brew (Slow, ~95% yields)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`grid gap-4 transition-all duration-300 ${params.brewMethod === 'cold_brew' ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {params.brewMethod !== 'cold_brew' && (
              <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium flex items-center">
                    Water Temp
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-3 border-white/20 glass-panel text-white">
                        <p className="text-sm">Hotter water ({'>'}90°C) extracts caffeine efficiently. Cooler water (e.g. for some AeroPress recipes) stalls extraction significantly.</p>
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <button 
                    onClick={() => setMetricTemp(!metricTemp)}
                    className="text-xs text-amber-500 hover:text-amber-400 select-none cursor-pointer transition-colors"
                  >
                    °{metricTemp ? 'C' : 'F'}
                  </button>
                </div>
                <Input 
                  type="number" 
                  value={metricTemp ? params.waterTempC : Math.round((params.waterTempC * 9/5) + 32)} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateParam('waterTempC', metricTemp ? val : (val - 32) * 5/9);
                  }}
                  className="bg-white/5 border-white/20 focus-visible:ring-amber-500 font-mono transition-all"
                />
              </div>
            )}

            <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-300">
              <label className="text-sm font-medium flex items-center">
                Brew Time
              </label>
              <div className="flex rounded-md shadow-sm">
                <Input 
                  type="text" 
                  inputMode="decimal"
                  value={localTime} 
                  onChange={(e) => handleTimeChange(e.target.value)}
                  placeholder="e.g. 5"
                  className="bg-white/5 border-white/20 focus-visible:ring-amber-500 font-mono rounded-r-none border-r-0 z-10 hover:bg-white/10 transition-colors"
                />
                <Select value={timeUnit} onValueChange={(val: any) => handleTimeUnitChange(val)}>
                  <SelectTrigger className="w-[120px] bg-white/10 hover:bg-white/20 border-white/20 focus:ring-amber-500 rounded-l-none border-l border-white/20 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
