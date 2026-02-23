'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TolerancePlan } from '@/lib/tolerance';
import { motion } from 'framer-motion';
import { Calendar, Activity, ZapOff } from 'lucide-react';

interface ToleranceDashboardProps {
  plan: TolerancePlan;
}

export function ToleranceDashboard({ plan }: ToleranceDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-panel border-white/10 h-full">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Duration</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold font-outfit tracking-tighter">{plan.totalDays}</span>
                  <span className="text-muted-foreground font-medium">days</span>
                </div>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <Calendar className="w-6 h-6 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-panel border-white/10 h-full">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Starting Dose</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold font-outfit tracking-tighter">{plan.startingDose}</span>
                  <span className="text-muted-foreground font-medium">mg</span>
                </div>
              </div>
              <div className="p-4 bg-amber-500/10 rounded-full border border-amber-500/20">
                <ZapOff className="w-6 h-6 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-panel border-white/10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-primary"></div>
          <CardHeader>
            <CardTitle className="font-outfit text-2xl flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Your Reset Plan Timeline
            </CardTitle>
            <CardDescription className="text-white/60">
              A day-by-day protocol to downregulate adenosine receptors back to baseline.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mt-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {plan.dailySteps.map((step, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Day</span>
                    <span className="text-xl font-bold text-foreground">{step.day}</span>
                  </div>
                  
                  <div className="bg-black/20 px-3 py-1.5 rounded-md min-w-[100px] text-center border border-white/5">
                    <span className="font-mono font-bold text-lg text-emerald-400">{step.dose}</span>
                    <span className="text-xs text-muted-foreground ml-1">mg</span>
                  </div>
                  
                  <div className="text-sm text-white/70 flex-1 ml-2">
                    {step.notes}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
