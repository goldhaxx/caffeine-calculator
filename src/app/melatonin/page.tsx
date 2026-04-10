'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Scale } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function MelatoninPage() {
  const [mounted, setMounted] = useState(false);

  // Will be expanded in Step 4 with form state and localStorage in Step 6
  useState(() => { setMounted(true); });

  if (!mounted) {
    return <div className="min-h-screen bg-background flex justify-center items-center">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
    </div>;
  }

  return (
    <main className="min-h-screen pb-20 relative px-4 md:px-8">
      <Header />

      {/* Background decorations - indigo/violet for melatonin */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 via-background to-background pointer-events-none -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto pt-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-2 backdrop-blur-md shadow-lg shadow-indigo-500/5">
            <Pill className="w-6 h-6 text-indigo-400 mr-2" />
            <Scale className="w-5 h-5 text-violet-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight text-foreground">
            Melatonin <span className="bg-gradient-to-r from-indigo-300 to-violet-500 bg-clip-text text-transparent">Microdose</span> Calculator
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Precisely convert between tablet weight and melatonin dose for accurate milligram-scale microdosing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Left Column: Form (Step 4) */}
          <div className="lg:col-span-5 space-y-6">
          </div>

          {/* Right Column: Results (Step 4) */}
          <div className="lg:col-span-7">
          </div>
        </div>
      </div>
    </main>
  );
}
