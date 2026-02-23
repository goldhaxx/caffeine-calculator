'use client';

import { useState, useEffect } from 'react';
import { BrewCalculatorForm } from '@/components/coffee/BrewCalculatorForm';
import { BrewResults } from '@/components/coffee/BrewResults';
import { BrewScience } from '@/components/coffee/BrewScience';
import { BrewParameters, calculateBrewCaffeine } from '@/lib/coffee-math';
import { motion } from 'framer-motion';
import { Coffee, FlaskConical } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function CoffeePage() {
  const [mounted, setMounted] = useState(false);
  
  // Default recipe: Classic 18g double espresso
  const [params, setParams] = useState<BrewParameters>({
    beanType: 'arabica',
    robustaPercentage: 0,
    roastLevel: 'medium',
    weightGrams: 18,
    brewMethod: 'espresso',
    waterTempC: 93, // ~200F
    brewTimeSeconds: 30,
  });

  const caffeineMg = calculateBrewCaffeine(params);

  // Load state from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('brew-calc-params');
    if (saved) {
      try {
        setParams(JSON.parse(saved));
      } catch (e) {}
    }
    setMounted(true);
  }, []);

  // Save state to local storage when it branches
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('brew-calc-params', JSON.stringify(params));
    }
  }, [params, mounted]);

  if (!mounted) {
    return <div className="min-h-screen bg-background flex justify-center items-center">
      <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
    </div>;
  }

  return (
    <main className="min-h-screen pb-20 relative px-4 md:px-8">
      <Header />
      
      {/* Background decorations - warmer tones for coffee */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-amber-500/10 via-background to-background pointer-events-none -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto pt-8 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-2 backdrop-blur-md shadow-lg shadow-amber-500/5">
            <Coffee className="w-6 h-6 text-amber-500 mr-2" />
            <FlaskConical className="w-5 h-5 text-orange-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight text-foreground">
            Coffee Brew <span className="bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">Caffeine</span> Calculator
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Stop guessing your intake. Precisely calculate the caffeine yield of your home brew based on scientific constants.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-5 space-y-6">
            <BrewCalculatorForm 
              params={params}
              setParams={setParams}
            />
          </div>

          {/* Right Column: Results Dashboard */}
          <div className="lg:col-span-7">
            <BrewResults caffeineMg={caffeineMg} />
          </div>
        </div>

        <BrewScience />
      </div>
    </main>
  );
}
