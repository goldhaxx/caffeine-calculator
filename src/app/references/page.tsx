'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';

interface Reference {
  id: number;
  authors: string;
  title: string;
  journal: string;
  year: number;
  detail: string;
  doi?: string;
  url: string;
  usedFor: string;
}

const references: Reference[] = [
  {
    id: 1,
    authors: 'Institute of Medicine (US)',
    title: 'Pharmacology of Caffeine',
    journal: 'Caffeine for the Sustainment of Mental Task Performance. National Academies Press',
    year: 2001,
    detail: 'NCBI Bookshelf: NBK223808',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK223808/',
    usedFor: 'Caffeine half-life (5h average), absorption kinetics, factors affecting metabolism',
  },
  {
    id: 2,
    authors: 'Bordeaux B, Bhatt M, Bhatt F',
    title: 'Caffeine',
    journal: 'StatPearls. Treasure Island, FL: StatPearls Publishing',
    year: 2024,
    detail: 'NCBI Bookshelf: NBK519490',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK519490/',
    usedFor: 'Half-life confirmation (3–5h), peak absorption timing, pregnancy/liver effects',
  },
  {
    id: 3,
    authors: 'Nehlig A',
    title: 'Pharmacokinetics of Caffeine: A Systematic Analysis of Reported Data and Relevance to Its Use in Clinical Pharmacology',
    journal: 'Frontiers in Pharmacology',
    year: 2021,
    detail: '12:752826',
    doi: '10.3389/fphar.2021.752826',
    url: 'https://doi.org/10.3389/fphar.2021.752826',
    usedFor: 'Systematic validation of first-order kinetics model and population half-life range',
  },
  {
    id: 4,
    authors: 'Sachse C, Brockmöller J, Bauer S, Roots I',
    title: 'Functional significance of a C→A polymorphism in intron 1 of the cytochrome P450 CYP1A2 gene tested with caffeine',
    journal: 'British Journal of Clinical Pharmacology',
    year: 1999,
    detail: '47(4):445-449',
    doi: '10.1046/j.1365-2125.1999.00898.x',
    url: 'https://doi.org/10.1046/j.1365-2125.1999.00898.x',
    usedFor: 'CYP1A2 AA genotype prevalence (~40–50%) and fast metabolizer classification',
  },
  {
    id: 5,
    authors: 'Cornelis MC, El-Sohemy A, Kabagambe EK, Campos H',
    title: 'Coffee, CYP1A2 genotype, and risk of myocardial infarction',
    journal: 'JAMA',
    year: 2006,
    detail: '295(10):1135-1141',
    doi: '10.1001/jama.295.10.1135',
    url: 'https://doi.org/10.1001/jama.295.10.1135',
    usedFor: 'CYP1A2 genotype categories (fast/slow metabolizer) and clinical significance',
  },
  {
    id: 6,
    authors: 'Clark I, Landolt HP',
    title: 'Coffee, caffeine, and sleep: A systematic review of epidemiological studies and randomized controlled trials',
    journal: 'Sleep Medicine Reviews',
    year: 2017,
    detail: '31:70-78',
    doi: '10.1016/j.smrv.2016.01.006',
    url: 'https://doi.org/10.1016/j.smrv.2016.01.006',
    usedFor: 'Systematic evidence that caffeine prolongs sleep latency, reduces efficiency, and disrupts sleep architecture',
  },
  {
    id: 7,
    authors: 'Gardiner C, Weakley J, Burke LM, Roach GD, Sargent C, Halson SL, et al.',
    title: 'The effect of caffeine on subsequent sleep: A systematic review and meta-analysis',
    journal: 'Sleep Medicine Reviews',
    year: 2023,
    detail: '69:101764',
    doi: '10.1016/j.smrv.2023.101764',
    url: 'https://doi.org/10.1016/j.smrv.2023.101764',
    usedFor: 'Meta-analytic sleep effects: −45 min TST, −7% efficiency, −11 min deep sleep. Dose-timing cutoff recommendations (8.8–13.2h)',
  },
  {
    id: 8,
    authors: 'Gardiner C, Weakley J, Burke LM, Roach GD, Sargent C, Scanlan AT, et al.',
    title: 'Dose and timing effects of caffeine on subsequent sleep: a randomized clinical crossover trial',
    journal: 'SLEEP',
    year: 2025,
    detail: '48(4):zsae230',
    doi: '10.1093/sleep/zsae230',
    url: 'https://doi.org/10.1093/sleep/zsae230',
    usedFor: 'Key threshold evidence: 100mg at 4h before bed = no disruption; 400mg at 4h = significant disruption. Basis for revised sleep quality thresholds',
  },
  {
    id: 9,
    authors: 'Drake C, Roehrs T, Shambroom J, Roth T',
    title: 'Caffeine Effects on Sleep Taken 0, 3, or 6 Hours before Going to Bed',
    journal: 'Journal of Clinical Sleep Medicine',
    year: 2013,
    detail: '9(11):1195-1200',
    doi: '10.5664/jcsm.3170',
    url: 'https://doi.org/10.5664/jcsm.3170',
    usedFor: 'Landmark finding: 400mg caffeine 6h before bed reduced sleep >1h, and participants were unaware of the disruption',
  },
  {
    id: 10,
    authors: 'Heckman MA, Weil J, Gonzalez de Mejia E',
    title: 'Caffeine (1, 3, 7-trimethylxanthine) in Foods: A Comprehensive Review on Consumption, Functionality, Safety, and Regulatory Matters',
    journal: 'Journal of Food Science',
    year: 2010,
    detail: '75(3):R77-R87',
    doi: '10.1111/j.1750-3841.2010.01561.x',
    url: 'https://doi.org/10.1111/j.1750-3841.2010.01561.x',
    usedFor: 'Bean caffeine content (Arabica 1.2%, Robusta 2.2%), caffeine thermal stability, water solubility',
  },
  {
    id: 11,
    authors: 'Specialty Coffee Association',
    title: 'SCA Standards: Golden Cup',
    journal: 'SCA Research',
    year: 2024,
    detail: '',
    url: 'https://sca.coffee/research/coffee-standards',
    usedFor: 'Recommended brew temperature range (90–96°C / 195–205°F)',
  },
  {
    id: 12,
    authors: 'Fredholm BB, Bättig K, Holmén J, Nehlig A, Zvartau EE',
    title: 'Actions of caffeine in the brain with special reference to factors that contribute to its widespread use',
    journal: 'Pharmacological Reviews',
    year: 1999,
    detail: '51(1):83-133',
    url: 'https://pubmed.ncbi.nlm.nih.gov/10049999/',
    usedFor: 'Adenosine receptor antagonism mechanism, receptor upregulation during chronic use, tolerance biology',
  },
  {
    id: 13,
    authors: 'Juliano LM, Griffiths RR',
    title: 'A critical review of caffeine withdrawal: empirical validation of symptoms and signs, incidence, severity, and associated features',
    journal: 'Psychopharmacology',
    year: 2004,
    detail: '176(1):1-29',
    doi: '10.1007/s00213-004-2000-x',
    url: 'https://doi.org/10.1007/s00213-004-2000-x',
    usedFor: 'Withdrawal symptom timeline (onset 12–24h, peak 20–51h, duration 2–9 days), headache incidence (50%)',
  },
  {
    id: 14,
    authors: 'Baur DM, Dornbierer DA, Landolt HP, et al.',
    title: 'Concentration-effect relationships of plasma caffeine on EEG delta power and cardiac autonomic activity during human sleep',
    journal: 'Journal of Sleep Research',
    year: 2024,
    detail: '33(3):e14140',
    doi: '10.1111/jsr.14140',
    url: 'https://doi.org/10.1111/jsr.14140',
    usedFor: 'Plasma concentration thresholds for deep sleep disruption (~7.3 µmol/L) and cardiac autonomic effects (~4.3 µmol/L)',
  },
  {
    id: 15,
    authors: 'Landolt HP, Werth E, Borbely AA, Dijk DJ',
    title: 'Caffeine intake (200 mg) in the morning affects human sleep and EEG power spectra at night',
    journal: 'Brain Research',
    year: 1995,
    detail: '675(1-2):67-74',
    doi: '10.1016/0006-8993(95)00040-W',
    url: 'https://doi.org/10.1016/0006-8993(95)00040-W',
    usedFor: 'Evidence that morning caffeine can produce subtle EEG effects at night even at low residual concentrations',
  },
  {
    id: 16,
    authors: 'Weibel J, Lin YS, Landolt HP, et al.',
    title: 'Regular Caffeine Intake Delays REM Sleep Promotion and Attenuates Sleep Quality in Healthy Men',
    journal: 'Journal of Biological Rhythms',
    year: 2021,
    detail: '36(4):384-394',
    doi: '10.1177/07487304211013995',
    url: 'https://doi.org/10.1177/07487304211013995',
    usedFor: 'Evidence that habitual caffeine use delays REM sleep and worsens subjective quality — tolerance is incomplete',
  },
  {
    id: 17,
    authors: 'Stucky B, Henckel L, Heinzer R, Landolt HP, et al.',
    title: 'Community-based causal evidence that high habitual caffeine consumption alters distinct polysomnography-derived sleep variables',
    journal: 'Journal of Psychopharmacology',
    year: 2025,
    detail: '',
    doi: '10.1177/02698811251368364',
    url: 'https://doi.org/10.1177/02698811251368364',
    usedFor: 'Large-scale evidence (N=485,511): habitual caffeine reduces total sleep by 11–13 min/night',
  },
  {
    id: 18,
    authors: 'Reichert CF, Deboer T, Landolt HP, et al.',
    title: 'Challenging the sleep homeostat: effects of daily caffeine on sleep and EEG power spectra',
    journal: 'Scientific Reports',
    year: 2021,
    detail: '11:4876',
    doi: '10.1038/s41598-021-84088-x',
    url: 'https://doi.org/10.1038/s41598-021-84088-x',
    usedFor: 'Daily caffeine (3×150mg) shows subclinical EEG changes even when gross sleep structure appears preserved',
  },
  {
    id: 19,
    authors: 'Bonati M, Latini R, Galletti F, et al.',
    title: 'Caffeine disposition after oral doses',
    journal: 'Clinical Pharmacology & Therapeutics',
    year: 1982,
    detail: '32(1):98-106',
    doi: '10.1038/clpt.1982.132',
    url: 'https://doi.org/10.1038/clpt.1982.132',
    usedFor: 'First-order kinetics validation and one-compartment pharmacokinetic model for caffeine',
  },
  {
    id: 20,
    authors: 'Blanchard J, Sawers SJA',
    title: 'The absolute bioavailability of caffeine in man',
    journal: 'European Journal of Clinical Pharmacology',
    year: 1983,
    detail: '24(1):93-98',
    doi: '10.1007/BF00613933',
    url: 'https://doi.org/10.1007/BF00613933',
    usedFor: 'Near-complete oral bioavailability of caffeine (~99%), supporting the first-order kinetics model',
  },
];

export default function ReferencesPage() {
  return (
    <main className="min-h-screen pb-20 relative px-4 md:px-8">
      <Header />
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto pt-16 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-2 backdrop-blur-md shadow-lg shadow-primary/5">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight text-foreground">
            Scientific <span className="animated-gradient-text">References</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every claim in this calculator is backed by peer-reviewed research. Below is the complete bibliography of studies, reviews, and pharmacological references that inform our models and thresholds.
          </p>
        </motion.div>

        {/* Methodology Note */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-panel border-white/10">
            <CardContent className="pt-6">
              <p className="text-sm text-white/60 leading-relaxed">
                <strong className="text-white/80">Methodology:</strong> The pharmacokinetic model, sleep quality thresholds, and educational content were validated against randomized controlled trials, systematic reviews, meta-analyses, and authoritative pharmacological references published in peer-reviewed journals. Sleep quality thresholds are calibrated to Gardiner et al. (2025) and Baur et al. (2024), which provide the most recent dose-response and plasma-concentration evidence. See our full validation report in the project&apos;s <code className="text-primary/80 bg-white/5 px-1.5 py-0.5 rounded text-xs">research/</code> directory.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* References List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="space-y-4">
            {references.map((ref, index) => (
              <motion.div
                key={ref.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card className="glass-panel border-white/10 hover:border-white/20 transition-colors">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex gap-4">
                      <span className="text-primary font-outfit font-bold text-lg min-w-[2rem] text-right">
                        {ref.id}.
                      </span>
                      <div className="space-y-1.5 min-w-0">
                        <p className="text-sm text-foreground leading-relaxed">
                          <span className="text-white/90">{ref.authors}</span>
                          {' '}({ref.year}).{' '}
                          <span className="text-white font-medium">&ldquo;{ref.title}.&rdquo;</span>
                          {' '}
                          <em className="text-white/70">{ref.journal}</em>
                          {ref.detail && <span className="text-white/50">; {ref.detail}</span>}
                          {ref.doi && (
                            <span className="text-white/50">. DOI: {ref.doi}</span>
                          )}
                        </p>
                        <p className="text-xs text-white/40 leading-relaxed">
                          <span className="text-primary/60 font-medium">Used for:</span> {ref.usedFor}
                        </p>
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary transition-colors mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View source
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Limitations Note */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-panel border-white/10 mt-8">
            <CardHeader>
              <CardTitle className="font-outfit text-lg text-white/80">Limitations & Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-white/60 leading-relaxed">
                <strong className="text-white/80">Individual variation:</strong> Caffeine metabolism varies significantly between individuals due to genetics (CYP1A2, ADORA2A), medications, smoking status, pregnancy, and liver function. This calculator uses population-average models and should be considered an estimate, not a medical recommendation.
              </p>
              <p className="text-sm text-white/60 leading-relaxed">
                <strong className="text-white/80">Body weight:</strong> Plasma caffeine concentration depends on body mass (volume of distribution ~0.7 L/kg). The current model does not adjust for body weight, which means the same mg remaining produces higher plasma concentrations in lighter individuals. This is a known limitation.
              </p>
              <p className="text-sm text-white/60 leading-relaxed">
                <strong className="text-white/80">Meta-analytic averages:</strong> Sleep architecture effects cited (−45 min total sleep, −7% efficiency, −11 min deep sleep) are pooled averages from studies using various doses and timings, not predictions for any specific scenario.
              </p>
              <p className="text-sm text-white/60 leading-relaxed">
                <strong className="text-white/80">Not medical advice:</strong> This tool is for educational purposes. Consult a healthcare professional for personalized caffeine or sleep guidance.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
