'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Activity, Clock, FlaskConical } from 'lucide-react';
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

export function ToleranceEducation() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card className="glass-panel border-white/10 relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-500"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-outfit text-xl">
            <FlaskConical className="w-5 h-5 text-teal-400" />
            The Science of Caffeine Tolerance
          </CardTitle>
          <CardDescription className="text-white/60">
            Expand the sections below to understand the biological mechanisms of caffeine dependence and how to effectively reset it. See our <Link href="/references" className="text-primary hover:underline">full references</Link>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-2">

            <AccordionItem value="item-1" className="border-white/10 bg-white/5 rounded-lg px-4 border">
              <AccordionTrigger className="hover:no-underline hover:text-emerald-400 transition-colors py-3">
                <div className="flex items-center gap-3 text-left">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-[15px]">Adenosine Receptors: The Root of Tolerance</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-sm leading-relaxed pb-4 pt-1">
                Caffeine is an adenosine receptor antagonist. It works by binding to your brain&apos;s A1 and A2A adenosine receptors without activating them, essentially blocking the chemical (adenosine) that makes you feel tired.<Cite n={12} />
                <br /><br />
                However, when these receptors are constantly blocked, the brain compensates by creating <em>more</em> of them (upregulation) to ensure adenosine can still do its job.<Cite n={12} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-white/10 bg-white/5 rounded-lg px-4 border">
              <AccordionTrigger className="hover:no-underline hover:text-teal-400 transition-colors py-3">
                <div className="flex items-center gap-3 text-left">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span className="font-medium text-[15px]">Why You Need More to Feel the Same</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-sm leading-relaxed pb-4 pt-1">
                Because of upregulation, after chronic caffeine exposure, you now have an excess of adenosine receptors. This means you have to consume a higher dose of caffeine just to block enough receptors to feel normal or alert.<Cite n={12} />
                <br /><br />
                If you miss a dose, all those extra receptors are suddenly flooded with adenosine, leading to withdrawal symptoms like fatigue, headaches, and irritability.<Cite n={13} doi="10.1007/s00213-004-2000-x" />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-white/10 bg-white/5 rounded-lg px-4 border">
              <AccordionTrigger className="hover:no-underline hover:text-cyan-400 transition-colors py-3">
                <div className="flex items-center gap-3 text-left">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="font-medium text-[15px]">The Timeline to Baseline</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-sm leading-relaxed pb-4 pt-1">
                Scientific studies indicate that to reverse tolerance, the extra adenosine receptors need to downregulate and return to their original density.<Cite n={12} />
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Acute Withdrawal:</strong> Headaches and extreme fatigue mostly subside within 2 to 9 days of quitting cold turkey.<Cite n={13} doi="10.1007/s00213-004-2000-x" /></li>
                  <li><strong>Full Receptor Reset:</strong> Studies show receptor density returns completely to control levels within roughly 7-14 days of no caffeine.<Cite n={12} /></li>
                  <li><strong>Tapering approach:</strong> For those consuming very high amounts, tapering by ~25% every 1-2 weeks reduces withdrawal severity at the cost of a longer timeline.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}
