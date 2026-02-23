'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Brain, Activity, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function EducationalContext() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card className="glass-panel border-white/10 relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-orange-400 via-rose-400 to-fuchsia-500"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-outfit text-xl">
            <Brain className="w-5 h-5 text-fuchsia-400" /> 
            The Science of Caffeine & Sleep
          </CardTitle>
          <CardDescription className="text-white/60">
            Expand the sections below to learn exactly how caffeine interacts with your sleep architecture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-2">
            
            <AccordionItem value="item-1" className="border-white/10 bg-white/5 rounded-lg px-4 border">
              <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-3">
                <div className="flex items-center gap-3 text-left">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span className="font-medium text-[15px]">How Caffeine Pharmacokinetics Works</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-sm leading-relaxed pb-4 pt-1">
                Caffeine is rapidly and almost completely absorbed (~99% within ~45 minutes). Peak blood levels occur 30-60 minutes after ingestion. It distributes evenly throughout body water and readily crosses the blood-brain barrier.
                <br /><br />
                It is primarily metabolized in the liver by the <strong>CYP1A2 enzyme</strong> into metabolites like paraxanthine (which also has mild stimulant effects). Caffeine follows first-order kinetics, meaning a constant fraction is cleared per unit of time (its half-life).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-white/10 bg-white/5 rounded-lg px-4 border">
              <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-3">
                <div className="flex items-center gap-3 text-left">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-[15px]">Metabolism Speeds (CYP1A2 Variants)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-sm leading-relaxed pb-4 pt-1">
                <ul className="space-y-2">
                  <li><strong className="text-primary">Fast Metabolizers (AA genotype):</strong> ~40-50% of people. Shorter half-life (~3 hours). Caffeine clears quickly, so morning intake rarely lingers enough to affect bedtime sleep.</li>
                  <li><strong className="text-primary">Average Metabolizers:</strong> The standard baseline. ~5 hour half-life. A 100mg cup of coffee at 8 AM leaves roughly 15mg by 10 PM.</li>
                  <li><strong className="text-primary">Slow Metabolizers (AC or CC genotypes):</strong> Longer half-life (~8-12 hours). Caffeine lingers much longer, so even an 8 AM cup can leave substantial amounts (30mg+) by the evening, severely disrupting sleep.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-white/10 bg-white/5 rounded-lg px-4 border">
              <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-3">
                <div className="flex items-center gap-3 text-left">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-[15px]">How Caffeine Disrupts Sleep</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-sm leading-relaxed pb-4 pt-1">
                Caffeine is an <strong>adenosine receptor antagonist</strong>. Adenosine builds up while you are awake, creating "sleep pressure". By blocking these receptors, caffeine prolongs wakefulness and interferes with sleep drive.
                <br /><br />
                Even if you "fall asleep fine," lingering caffeine:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Reduces total sleep time (average ~45 min less)</li>
                  <li>Lowers sleep efficiency (~7% reduction)</li>
                  <li>Decreases restorative deep/slow-wave sleep (N3 stage) by ~11 min</li>
                  <li>Increases light sleep (N1) and causes micro-awakenings</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-white/10 bg-white/5 rounded-lg px-4 border">
              <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-3">
                <div className="flex items-center gap-3 text-left">
                  <Info className="w-4 h-4 text-rose-400" />
                  <span className="font-medium text-[15px]">Actionable Tips</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-sm leading-relaxed pb-4 pt-1">
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Cut-off time:</strong> To minimize sleep impact, cut off caffeine 8-12+ hours before bedtime (e.g., no later than 12 PM for a 10 PM bedtime, stricter if you're a slow metabolizer).</li>
                  <li><strong>Slow metabolizers:</strong> Move your last intake much earlier or severely cut the dose.</li>
                  <li><strong>Test yourself:</strong> Run this calculator with your real data and track your sleep quality (using an Oura ring, Apple Watch, etc.) to deduce your metabolism speed.</li>
                  <li><strong>Genetic Testing:</strong> A DNA test for CYP1A2 and ADORA2A (sensitivity) can give you exact precision on your genetic constraints.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}
