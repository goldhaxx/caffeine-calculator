'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { TabletConfig } from '@/lib/melatonin-math';

interface MelatoninFormProps {
  tabletConfig: TabletConfig;
  setTabletConfig: (config: TabletConfig | ((c: TabletConfig) => TabletConfig)) => void;
  measuredWeight: string;
  setMeasuredWeight: (value: string) => void;
  targetDose: string;
  setTargetDose: (value: string) => void;
}

export function MelatoninForm({
  tabletConfig,
  setTabletConfig,
  measuredWeight,
  setMeasuredWeight,
  targetDose,
  setTargetDose,
}: MelatoninFormProps) {
  return (
    <div className="space-y-6">
      {/* Tablet Configuration */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-outfit text-foreground flex items-center gap-2">
            Tablet Configuration
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="text-white">
                <p>Enter the specs from your melatonin tablet packaging.</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Tablet Weight (grams)
            </label>
            <Input
              type="number"
              step="0.001"
              min="0"
              value={tabletConfig.tabletWeightG || ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setTabletConfig((prev) => ({
                  ...prev,
                  tabletWeightG: isNaN(val) ? 0 : val,
                }));
              }}
              placeholder="e.g. 0.365"
              className="bg-white/5 border-white/10"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Melatonin per Tablet (mg)
            </label>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={tabletConfig.melatoninPerTabletMg || ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setTabletConfig((prev) => ({
                  ...prev,
                  melatoninPerTabletMg: isNaN(val) ? 0 : val,
                }));
              }}
              placeholder="e.g. 10"
              className="bg-white/5 border-white/10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Weight → Dose */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-outfit text-foreground">
            Weight → Dose
          </CardTitle>
        </CardHeader>
        <CardContent>
          <label className="text-sm text-muted-foreground mb-1.5 block">
            Measured Fragment Weight (grams)
          </label>
          <Input
            type="number"
            step="0.001"
            min="0"
            data-testid="measured-weight-input"
            value={measuredWeight}
            onChange={(e) => setMeasuredWeight(e.target.value)}
            placeholder="e.g. 0.011"
            className="bg-white/5 border-white/10"
          />
        </CardContent>
      </Card>

      {/* Dose → Weight */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-outfit text-foreground">
            Dose → Weight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <label className="text-sm text-muted-foreground mb-1.5 block">
            Target Dose (micrograms)
          </label>
          <Input
            type="number"
            step="1"
            min="0"
            data-testid="target-dose-input"
            value={targetDose}
            onChange={(e) => setTargetDose(e.target.value)}
            placeholder="e.g. 300"
            className="bg-white/5 border-white/10"
          />
        </CardContent>
      </Card>
    </div>
  );
}
