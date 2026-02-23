'use client';

import { useState } from 'react';
import { ToleranceCalculator } from '@/components/tolerance/ToleranceCalculator';
import { ToleranceDashboard } from '@/components/tolerance/ToleranceDashboard';
import { ToleranceEducation } from '@/components/tolerance/ToleranceEducation';
import { calculateTolerancePlan, ToleranceStrategy } from '@/lib/tolerance';
import { motion } from 'framer-motion';
import { Activity, Beaker } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function TolerancePage() {
  const [currentIntake, setCurrentIntake] = useState<number>(300);
  const [strategy, setStrategy] = useState<ToleranceStrategy>('taper');

  const plan = calculateTolerancePlan(currentIntake, strategy);

  return (
    <main className="min-h-screen pb-20 relative px-4 md:px-8">
      <Header />
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-500/10 via-background to-background pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto pt-16 space-y-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-2 backdrop-blur-md shadow-lg shadow-emerald-500/5">
            <Activity className="w-6 h-6 text-emerald-400 mr-2" />
            <Beaker className="w-5 h-5 text-teal-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight text-foreground">
            Caffeine <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Tolerance</span> Reset
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Manage your caffeine dependence cycle. Generate a scientifically-backed plan to downregulate adenosine receptors and restore your natural sensitivity.
          </p>
        </motion.div>

        {/* Main Application Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 h-full">
            <ToleranceCalculator 
              currentIntake={currentIntake}
              setCurrentIntake={setCurrentIntake}
              strategy={strategy}
              setStrategy={setStrategy}
            />
          </div>

          {/* Right Column: Dashboard */}
          <div className="lg:col-span-8">
            <ToleranceDashboard plan={plan} />
          </div>
        </div>

        {/* Educational Section at Bottom */}
        <ToleranceEducation />
      </div>
    </main>
  );
}
