'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { WeightToDoseResult, DoseToWeightResult } from '@/lib/melatonin-math';

interface MelatoninResultsProps {
  weightToDose: WeightToDoseResult | null;
  doseToWeight: DoseToWeightResult | null;
}

export function MelatoninResults({ weightToDose, doseToWeight }: MelatoninResultsProps) {
  return (
    <div className="space-y-6">
      {weightToDose !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          data-testid="dose-result-panel"
        >
          <Card className="glass-panel border-white/10 relative overflow-hidden flex flex-col items-center justify-center p-8 text-center min-h-[250px]">
            <div className="absolute top-0 left-0 w-full h-[200px] bg-indigo-500/10 blur-[80px] -z-10 rounded-full" />
            <p className="text-white/60 font-outfit uppercase tracking-widest text-sm mb-4">Melatonin Content</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-7xl font-bold font-outfit tracking-tighter text-foreground drop-shadow-md">
                {weightToDose.mcg}
              </span>
              <span className="text-muted-foreground text-2xl">mcg</span>
            </div>
            <p className="text-muted-foreground text-lg">
              {weightToDose.mg} mg
            </p>
          </Card>
        </motion.div>
      )}

      {doseToWeight !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          data-testid="weight-result-panel"
        >
          <Card className="glass-panel border-white/10 relative overflow-hidden flex flex-col items-center justify-center p-8 text-center min-h-[250px]">
            <div className="absolute top-0 left-0 w-full h-[200px] bg-violet-500/10 blur-[80px] -z-10 rounded-full" />
            <p className="text-white/60 font-outfit uppercase tracking-widest text-sm mb-4">Required Weight</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-7xl font-bold font-outfit tracking-tighter text-foreground drop-shadow-md">
                {doseToWeight.grams}
              </span>
              <span className="text-muted-foreground text-2xl">g</span>
            </div>
            <p className="text-muted-foreground text-lg">
              {doseToWeight.percentOfTablet}% of tablet
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
