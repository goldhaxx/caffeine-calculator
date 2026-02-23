'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface BrewResultsProps {
  caffeineMg: number;
}

export function BrewResults({ caffeineMg }: BrewResultsProps) {
  
  // Standard comparisons
  const redBulls = (caffeineMg / 80).toFixed(1);
  const espressoShots = (caffeineMg / 64).toFixed(1);
  const teas = (caffeineMg / 40).toFixed(1);
  
  // Strength classification
  let strengthLabel = '';
  let colorClass = '';
  if (caffeineMg < 50) {
    strengthLabel = 'Mild';
    colorClass = 'text-green-400';
  } else if (caffeineMg < 120) {
    strengthLabel = 'Moderate';
    colorClass = 'text-yellow-400';
  } else if (caffeineMg < 250) {
    strengthLabel = 'Strong';
    colorClass = 'text-orange-400';
  } else {
    strengthLabel = 'Extreme';
    colorClass = 'text-red-500';
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <Card className="glass-panel border-white/10 h-full relative overflow-hidden flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
          <div className="absolute top-0 left-0 w-full h-[200px] bg-amber-500/10 blur-[80px] -z-10 rounded-full"></div>
          
          <p className="text-white/60 font-outfit uppercase tracking-widest text-sm mb-4">Estimated Caffeine</p>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-8xl font-bold font-outfit tracking-tighter text-foreground drop-shadow-md">
              {caffeineMg}
            </span>
            <span className="text-muted-foreground text-2xl">mg</span>
          </div>

          <div className={`mt-2 font-medium text-lg uppercase tracking-wider ${colorClass} px-4 py-1 rounded-full bg-white/5 border border-white/10`}>
            {strengthLabel} Dose
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-panel border-white/10 p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">{redBulls}x</p>
            <p className="text-sm text-white/60 mt-1">Std. Energy Drinks<br/><span className="text-xs opacity-50">(80mg ea)</span></p>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-panel border-white/10 p-4 text-center">
            <p className="text-3xl font-bold text-amber-500">{espressoShots}x</p>
            <p className="text-sm text-white/60 mt-1">Single Espressos<br/><span className="text-xs opacity-50">(64mg ea)</span></p>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-panel border-white/10 p-4 text-center">
            <p className="text-3xl font-bold text-green-400">{teas}x</p>
            <p className="text-sm text-white/60 mt-1">Black Teas<br/><span className="text-xs opacity-50">(40mg ea)</span></p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
