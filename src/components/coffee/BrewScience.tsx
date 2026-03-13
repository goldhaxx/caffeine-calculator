'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Microscope, Beaker, Flame, Droplets, ThermometerSun } from 'lucide-react';
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

export function BrewScience() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card className="glass-panel border-white/10 relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-orange-400 via-rose-400 to-fuchsia-500"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-outfit text-xl">
            <Microscope className="w-5 h-5 text-fuchsia-400" />
            The Science of Extraction
          </CardTitle>
          <CardDescription className="text-white/60">
            How physics, chemistry, and biology intertwine to pull caffeine from beans to your cup. See our <Link href="/references" className="text-primary hover:underline">full references</Link>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-2">

            <AccordionItem value="item-1" className="border-white/10 bg-white/5 rounded-lg px-4 border">
              <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-3">
                <div className="flex items-center gap-3 text-left">
                  <Beaker className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-[15px]">Arabica vs Robusta (Biology)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-sm leading-relaxed pb-4 pt-1">
                The species of the coffee tree is the ultimate ceiling on caffeine. Arabica beans contain about 1.2% caffeine by mass, while Robusta beans evolved in lower, hotter altitudes and produce nearly double (~2.2%) as a natural defense mechanism against insects.<Cite n={10} doi="10.1111/j.1750-3841.2010.01561.x" />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-white/10 bg-white/5 rounded-lg px-4 border">
              <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-3">
                <div className="flex items-center gap-3 text-left">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-[15px]">The Dark Roast Myth</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-sm leading-relaxed pb-4 pt-1">
                A common myth states light roasts have more caffeine because it hasn&apos;t been "burned off." In reality, caffeine is chemically stable up to 455°F (235°C), surviving the roasting process.<Cite n={10} doi="10.1111/j.1750-3841.2010.01561.x" />
                <br /><br />
                However, beans lose water mass during roasting (15-20%). Because dark roasts weigh less individually, it takes <em>more physical beans</em> to hit a 20g dose than a light roast. Therefore, <strong>dark roast has slightly more caffeine by weight</strong>.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-white/10 bg-white/5 rounded-lg px-4 border">
              <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-3">
                <div className="flex items-center gap-3 text-left">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-[15px]">Time & Method (Extraction Yield)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-sm leading-relaxed pb-4 pt-1">
                You never extract 100% of the caffeine in the grounds. Caffeine is highly water-soluble (~21.7 g/L at 25°C), meaning it extracts early in the brew.<Cite n={10} doi="10.1111/j.1750-3841.2010.01561.x" />
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Fast Methods (Espresso/Aeropress):</strong> Extract ~80-85% of available caffeine in ~30-60 seconds.</li>
                  <li><strong>Slow Methods (Drip/Pour Over):</strong> Constant fresh water running over the beans for 3+ minutes washes out up to ~90% of available caffeine.</li>
                  <li><strong>Cold Brew:</strong> 12-24 hours of steeping extracts nearly 95%+, creating a highly caffeinated concentrate.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-white/10 bg-white/5 rounded-lg px-4 border">
              <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-3">
                <div className="flex items-center gap-3 text-left">
                  <ThermometerSun className="w-4 h-4 text-red-400" />
                  <span className="font-medium text-[15px]">Water Temperature</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-sm leading-relaxed pb-4 pt-1">
                Water temperature is thermal energy acting as a solvent. The Specialty Coffee Association recommends 90-96°C (195-205°F) for optimal extraction.<Cite n={11} />
                <br /><br />
                Using cooler water (e.g. 175°F / 80°C for an Aeropress recipe) significantly stalls the extraction rate. You must vastly increase your brew time (steep longer) to compensate for the lost thermal energy, otherwise you will leave significant caffeine behind in the grinds.
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}
