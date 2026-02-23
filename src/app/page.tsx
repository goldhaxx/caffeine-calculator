'use client';

import { useState, useEffect } from 'react';
import { CalculatorForm } from '@/components/calculator/CalculatorForm';
import { ResultsDashboard } from '@/components/calculator/ResultsDashboard';
import { EducationalContext } from '@/components/calculator/EducationalContext';
import { Consumption, MetabolismType } from '@/lib/caffeine';
import { motion } from 'framer-motion';
import { Coffee, Moon } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [consumptions, setConsumptions] = useState<Consumption[]>([
    { id: '1', time: '08:00', mg: 100 },
    { id: '2', time: '13:00', mg: 50 },
  ]);
  const [bedtime, setBedtime] = useState('22:00');
  const [metabolism, setMetabolism] = useState<MetabolismType>('average');

  // Prevent hydration errors and load initial state
  useEffect(() => {
    const savedConsumptions = localStorage.getItem('sleep-calc-consumptions');
    const savedBedtime = localStorage.getItem('sleep-calc-bedtime');
    const savedMetabolism = localStorage.getItem('sleep-calc-metabolism');

    if (savedConsumptions) {
      try { setConsumptions(JSON.parse(savedConsumptions)); } catch (e) {}
    }
    if (savedBedtime) setBedtime(savedBedtime);
    if (savedMetabolism) setMetabolism(savedMetabolism as MetabolismType);

    setMounted(true);
  }, []);

  // Save to local storage when state changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sleep-calc-consumptions', JSON.stringify(consumptions));
      localStorage.setItem('sleep-calc-bedtime', bedtime);
      localStorage.setItem('sleep-calc-metabolism', metabolism);
    }
  }, [consumptions, bedtime, metabolism, mounted]);

  if (!mounted) {
    return <div className="min-h-screen bg-background flex justify-center items-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
    </div>;
  }

  return (
    <main className="min-h-screen pb-20 relative px-4 md:px-8">
      <Header />
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto pt-16 space-y-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-2 backdrop-blur-md shadow-lg shadow-primary/5">
            <Coffee className="w-6 h-6 text-primary mr-2" />
            <Moon className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight text-foreground">
            Caffeine <span className="animated-gradient-text">Sleep Safety</span> Calculator
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover exactly how much caffeine remains in your system at bedtime. Optimize your coffee habit for deeper, more restorative sleep without guessing.
          </p>
        </motion.div>

        {/* Main Application Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <CalculatorForm 
              consumptions={consumptions}
              setConsumptions={setConsumptions}
              bedtime={bedtime}
              setBedtime={setBedtime}
              metabolism={metabolism}
              setMetabolism={setMetabolism}
            />
          </div>

          {/* Right Column: Dashboard & Chart */}
          <div className="lg:col-span-7">
            <ResultsDashboard 
              consumptions={consumptions}
              bedtime={bedtime}
              metabolism={metabolism}
            />
          </div>
        </div>

        {/* Educational Section at Bottom */}
        <EducationalContext />
      </div>
    </main>
  );
}
