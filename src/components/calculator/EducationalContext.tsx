'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Brain, Activity, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function Cite({ n, doi }: { n: number; doi?: string }) {
  if (doi) {
    return (
      <a href={`https://doi.org/${doi}`} target="_blank" rel="noopener noreferrer" className="text-primary/70 hover:text-primary text-[11px] align-super ml-0.5 no-underline hover:underline">[{n}]</a>
    );
  }
  return <Link href="/references" className="text-primary/70 hover:text-primary text-[11px] align-super ml-0.5 no-underline hover:underline">[{n}]</Link>;
}

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
            Expand the sections below to learn exactly how caffeine interacts with your sleep architecture. All claims are backed by peer-reviewed research — see our <Link href="/references" className="text-primary hover:underline">full references</Link>.
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
                Caffeine is rapidly and almost completely absorbed (~99% within ~45 minutes).<Cite n={1} doi="10.17226/10219" /> Peak blood levels occur 30-60 minutes after ingestion. It distributes evenly throughout body water and readily crosses the blood-brain barrier.<Cite n={2} />
                <br /><br />
                It is primarily metabolized in the liver by the <strong>CYP1A2 enzyme</strong> into metabolites like paraxanthine (which also has mild stimulant effects). Caffeine follows first-order kinetics, meaning a constant fraction is cleared per unit of time — its half-life averages about 5 hours in healthy adults.<Cite n={1} doi="10.17226/10219" /><Cite n={3} doi="10.3389/fphar.2021.752826" />
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
                  <li><strong className="text-primary">Fast Metabolizers (AA genotype):</strong> ~40-50% of people.<Cite n={4} doi="10.1046/j.1365-2125.1999.00898.x" /> Shorter half-life (~3 hours). Caffeine clears quickly, so morning intake rarely lingers enough to affect bedtime sleep.</li>
                  <li><strong className="text-primary">Average Metabolizers:</strong> The standard baseline. ~5 hour half-life.<Cite n={1} doi="10.17226/10219" /> A 100mg cup of coffee at 8 AM leaves roughly 15mg by 10 PM.</li>
                  <li><strong className="text-primary">Slow Metabolizers (AC or CC genotypes):</strong> Longer half-life (~8-12 hours).<Cite n={5} doi="10.1001/jama.295.10.1135" /> Caffeine lingers much longer, so even an 8 AM cup can leave substantial amounts (30mg+) by the evening, potentially disrupting sleep.</li>
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
                Caffeine is an <strong>adenosine receptor antagonist</strong>. Adenosine builds up while you are awake, creating "sleep pressure". By blocking these receptors, caffeine prolongs wakefulness and interferes with sleep drive.<Cite n={6} doi="10.1016/j.smrv.2016.01.006" />
                <br /><br />
                Even if you "fall asleep fine," lingering caffeine can affect sleep architecture. A meta-analysis of 24 controlled studies found that caffeine, on average:<Cite n={7} doi="10.1016/j.smrv.2023.101764" />
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Reduces total sleep time by ~45 min</li>
                  <li>Lowers sleep efficiency by ~7%</li>
                  <li>Decreases restorative deep/slow-wave sleep (N3 stage) by ~11 min</li>
                  <li>Increases light sleep (N1) and causes micro-awakenings</li>
                </ul>
                <p className="mt-2 text-white/50 text-xs italic">
                  Note: These are pooled averages across studies using various doses and timings. Individual effects depend on dose consumed, timing, and personal sensitivity.
                </p>
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
                  <li><strong>Cut-off time:</strong> A meta-analysis recommends stopping ~107mg of caffeine at least 8.8 hours before bed, and ~217mg at least 13.2 hours before bed.<Cite n={7} doi="10.1016/j.smrv.2023.101764" /> However, a 2025 RCT found 100mg was not disruptive even 4 hours before bed.<Cite n={8} doi="10.1093/sleep/zsae230" /></li>
                  <li><strong>High doses matter most:</strong> 400mg of caffeine taken 6 hours before bed reduced sleep by over an hour — and participants didn&apos;t even notice.<Cite n={9} doi="10.5664/jcsm.3170" /></li>
                  <li><strong>Slow metabolizers:</strong> Move your last intake much earlier or severely cut the dose.</li>
                  <li><strong>Test yourself:</strong> Run this calculator with your real data and track your sleep quality (using an Oura ring, Apple Watch, etc.) to deduce your metabolism speed.</li>
                  <li><strong>Genetic Testing:</strong> A DNA test for CYP1A2 and ADORA2A (sensitivity) can give you precision on your genetic constraints.<Cite n={5} doi="10.1001/jama.295.10.1135" /></li>
                </ul>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}
