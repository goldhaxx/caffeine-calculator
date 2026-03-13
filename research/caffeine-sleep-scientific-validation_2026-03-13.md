# Caffeine & Sleep: Scientific Validation Report

> **Purpose:** Validate every scientific claim, threshold, and model used in the Caffeine Sleep Safety Calculator against peer-reviewed literature.
>
> **Date:** March 2026
>
> **Methodology:** Claims were cross-referenced against randomized controlled trials, systematic reviews, meta-analyses, and pharmacokinetic studies published in peer-reviewed journals. Only findings from controlled studies or authoritative pharmacological references are cited.

---

## Table of Contents

1. [Pharmacokinetic Model Validation](#1-pharmacokinetic-model-validation)
2. [Sleep Quality Thresholds](#2-sleep-quality-thresholds)
3. [Sleep Architecture Effects](#3-sleep-architecture-effects)
4. [Caffeine Timing and the "2PM Cutoff"](#4-caffeine-timing-and-the-2pm-cutoff)
5. [Caffeine Tolerance and Sleep](#5-caffeine-tolerance-and-sleep)
6. [Brewing & Extraction Science](#6-brewing--extraction-science)
7. [Tolerance Reset Biology](#7-tolerance-reset-biology)
8. [Scenario Validation](#8-scenario-validation)
9. [Summary of Findings & Recommendations](#9-summary-of-findings--recommendations)
10. [Bibliography](#10-bibliography)

---

## 1. Pharmacokinetic Model Validation

### 1.1 Average Half-Life: 5 Hours

**App claim:** The average elimination half-life of caffeine is 5 hours.

**Verdict: ACCURATE**

The NCBI Bookshelf pharmacology reference states: *"The mean half-life of caffeine in plasma of healthy individuals is about 5 hours"* with a population range of 1.5–9.5 hours and healthy adults typically falling between 3–7 hours [1]. StatPearls confirms caffeine has a half-life of *"3 to 5 hours"* [2]. A 2021 systematic pharmacokinetic analysis across multiple studies found a half-life of approximately 4 hours with clearance of 0.078 L/h/kg, consistent with the 3–7 hour population range [3].

Five hours is the standard textbook value used in pharmacology and is the most defensible single number for average metabolism.

### 1.2 Fast Metabolizers: 3-Hour Half-Life

**App claim:** CYP1A2 AA genotype ("fast metabolizers"), representing ~40–50% of the population, have a half-life of approximately 3 hours.

**Verdict: REASONABLE**

CYP1A2 AA homozygotes show significantly faster caffeine clearance. Population genetics data indicate the AA genotype is present in approximately 40–50% of individuals of European ancestry [4]. The overall population range extends as low as 1.5 hours [1]. Tobacco smoking induces CYP1A2 activity and reduces caffeine half-life by 30–50%, which can bring average half-life down to ~2.5–3.5 hours [1][5].

Three hours sits at the faster end of the healthy-adult range and is a reasonable representation for fast metabolizers.

### 1.3 Slow Metabolizers: 8-Hour Half-Life

**App claim:** CYP1A2 AC or CC genotype individuals ("slow metabolizers") have a half-life of approximately 8 hours.

**Verdict: ACCURATE**

Slow metabolizers (AC/CC genotypes) consistently show half-lives of 7–10 hours in pharmacogenomic studies [4][5]. Oral contraceptive use approximately doubles caffeine half-life (~10 hours) [1][6]. Pregnancy in the third trimester can extend half-life to 15 hours or longer [1][2]. Liver disease also significantly prolongs elimination [2].

Eight hours is an appropriate value for slow metabolizers without additional complicating factors.

### 1.4 First-Order Kinetics (Exponential Decay)

**App model:** `remaining = dose × 0.5^(hours / halfLife)`

**Verdict: ACCURATE**

Caffeine elimination follows first-order kinetics at normal dietary doses (up to ~400mg), meaning a constant fraction is eliminated per unit time. This is well-established pharmacological fact. A 2021 systematic analysis confirmed caffeine follows linear pharmacokinetics at dietary doses, where increasing doses produce proportional plasma concentration increases [3]. The one-compartment open model with first-order elimination is the standard pharmacokinetic model for caffeine [7][8].

At very high doses (>500mg), caffeine metabolism shifts toward saturation (zero-order) kinetics, but this is outside normal dietary intake [1].

### 1.5 Peak Absorption: 30–60 Minutes

**App claim:** Caffeine reaches peak blood levels 30–60 minutes after ingestion, with ~99% absorbed within 45 minutes.

**Verdict: ACCURATE**

The NCBI pharmacology reference states: *"Caffeine is 99 percent absorbed within 45 minutes of ingestion"* with peak plasma concentrations occurring between 15–120 minutes (typical: 30–75 minutes) [1]. StatPearls corroborates that peak blood concentration occurs within 30–60 minutes [2].

### 1.6 Factors Affecting Half-Life

The app mentions CYP1A2 genotype but does not computationally model other factors. For reference, the established modifiers are:

| Factor | Effect on Half-Life | Source |
|--------|-------------------|--------|
| CYP1A2 AA genotype | ~2–4 hours | [4][5] |
| CYP1A2 AC/CC genotype | ~7–10 hours | [4][5] |
| Smoking | Reduced 30–50% | [1][5] |
| Oral contraceptives | Approximately doubled (~10h) | [1][6] |
| Pregnancy (3rd trimester) | Extended to ~15 hours | [1][2] |
| Liver disease | Significantly prolonged | [2] |
| Age (elderly) | ~33% longer | [9] |
| Obesity | No significant change | [1] |

---

## 2. Sleep Quality Thresholds

### 2.1 Current App Thresholds

The app classifies sleep quality based on milligrams of caffeine remaining at bedtime:

| Remaining mg | Label |
|---|---|
| ≤10 | Excellent |
| ≤20 | Good |
| ≤30 | Fair |
| >30 | Disruptive |

### 2.2 What the Science Says

**There is no single universally established "mg remaining" threshold for sleep disruption.** The research literature uses administered doses and plasma concentrations rather than estimated body burden. However, we can triangulate from the best available evidence:

**Gardiner et al. (2025)** conducted the most rigorous dose-timing RCT to date: 100mg of caffeine consumed 4 hours before bedtime produced **no significant effect on polysomnographic sleep measures** [10]. With a 5-hour half-life, 100mg at 4 hours before bed corresponds to approximately 57mg remaining at bedtime. This establishes that **~57mg remaining is not significantly disruptive** for average-sensitivity healthy young men.

**Baur et al. (2024)** established plasma concentration thresholds using pulsatile-release caffeine in 21 healthy young men [11]:
- **~7.3 µmol/L** (~1.4 mg/L): threshold above which EEG delta activity (deep sleep marker) is significantly attenuated
- **~4.3 µmol/L** (~0.84 mg/L): threshold for cardiac autonomic effects during sleep
- **~4.9 µmol/L** (~0.95 mg/L): threshold for parasympathetic activity changes during NREM sleep

Converting to approximate mg remaining (using volume of distribution ~0.7 L/kg for a 70kg person = 49L):
- Deep sleep disruption: ~7.3 µmol/L × 49L × 0.194 mg/µmol ≈ **69mg**
- Cardiac autonomic effects: ~4.3 µmol/L × 49L × 0.194 mg/µmol ≈ **41mg**

**Landolt et al. (1995)** found that 200mg consumed at 7:10 AM affected sleep EEG power spectra at night, when salivary caffeine had declined to ~3 µmol/L [12]. This suggests subtle EEG effects can occur even at low concentrations, though subjective sleep quality was not dramatically affected.

### 2.3 Recommended Thresholds

Based on Gardiner 2025 (no disruption at ~57mg remaining), Baur 2024 (cardiac effects at ~41mg for 70kg, deep sleep at ~69mg), and Landolt 1995 (subtle EEG effects at low levels):

| Remaining mg | Label | Rationale |
|---|---|---|
| ≤15 | Excellent | Well below any measured effect threshold [10][11] |
| ≤30 | Good | Below cardiac autonomic threshold for most adults [11] |
| ≤50 | Fair | Below Gardiner's 100mg/4h no-effect finding (~57mg remaining) [10] |
| >50 | Disruptive | Approaching concentrations where controlled studies demonstrate effects [10][11][13] |

**Important caveat:** These thresholds assume average body weight (~70kg). Plasma concentration depends on body mass. A 50kg person with 50mg remaining has a meaningfully higher plasma concentration (~5.3 µmol/L) than a 90kg person with the same amount (~4.1 µmol/L), which would place them on different sides of the Baur threshold [11].

---

## 3. Sleep Architecture Effects

### 3.1 App Claims

The app states caffeine causes:
- "~45 min less total sleep"
- "~7% reduction in sleep efficiency"
- "~11 min less deep/slow-wave sleep (N3)"
- "Increases light sleep (N1) and micro-awakenings"

### 3.2 Validation

**All four claims come from the Gardiner et al. (2023) meta-analysis** of 24 controlled studies [13]. The exact pooled estimates were:

| Measure | Effect | 95% CI |
|---|---|---|
| Total sleep time | −45.3 min | −61.0 to −29.6 |
| Sleep efficiency | −7.0% | −10.1 to −3.8 |
| Sleep onset latency | +9.4 min | +3.4 to +15.4 |
| Wake after sleep onset | +12.0 min | +5.4 to +18.6 |
| N1 (light sleep) | +6.1 min (+1.7%) | — |
| N3/N4 (deep sleep) | −11.4 min (−1.4%) | — |

**These numbers are accurately reported in the app.** However, they represent **pooled averages across various doses (typically 100–400mg) and timings (0–6 hours before bed)**, not effects specific to any particular residual caffeine level at bedtime.

The app should clarify that these are meta-analytic averages from studies predominantly using moderate-to-high doses relatively close to bedtime, not guaranteed outcomes for every scenario.

### 3.3 Dose-Specific Effects from Gardiner 2025

The Gardiner et al. (2025) RCT provides dose-specific data [10]:

**100mg caffeine:**
- No significant disruption at any timing (4h, 8h, 12h before bed)

**400mg caffeine at 4h before bed:**
- Total sleep time: −50.6 min
- Sleep onset latency: +14.2 min
- Sleep efficiency: −9.5%
- Awakenings: +1.4/hour

**400mg caffeine at 8h before bed:**
- Sleep efficiency: −6.9%
- Other measures not statistically significant

**400mg caffeine at 12h before bed:**
- Significant delays in sleep initiation
- Some architecture changes persisted

---

## 4. Caffeine Timing and the "2PM Cutoff"

### 4.1 App Claim

The app advises: *"Cut off caffeine 8–12+ hours before bedtime (e.g., no later than 12 PM for a 10 PM bedtime)."*

### 4.2 What the Research Says

**The optimal cutoff is dose-dependent, not a single fixed time.**

**Gardiner et al. (2023) meta-analysis** modeled dose-timing relationships and recommended [13]:
- For ~107mg (standard cup of coffee): consume ≥**8.8 hours** before bedtime
- For ~217mg (large coffee or double): consume ≥**13.2 hours** before bedtime

**Drake et al. (2013)** demonstrated that **400mg consumed 6 hours before bedtime** still reduced total sleep time by more than 1 hour [14]. Critically, participants were subjectively unaware of the disruption — they could not perceive how much sleep they were losing, despite objective PSG showing >60 minutes of lost sleep.

**Gardiner et al. (2025)** found that **100mg was not disruptive even at 4 hours before bed** [10]. This suggests small doses late in the day are tolerable for most people.

### 4.3 Verdict

The "2PM cutoff" (8 hours before a 10PM bedtime) is a reasonable rule of thumb for moderate caffeine intake (150–200mg). For lower doses (~100mg), a later cutoff (up to 6PM) appears safe. For higher doses (300mg+), the cutoff should be even earlier — potentially before noon.

The app's recommendation of "8–12+ hours" is well-calibrated to the Gardiner 2023 meta-analytic recommendations.

---

## 5. Caffeine Tolerance and Sleep

### 5.1 App Framework

The app uses a sensitivity tier system: sensitive (<10mg), average (<20mg), tolerant (<30mg).

### 5.2 Does Tolerance Develop to Sleep Disruption?

**Partial tolerance develops, but it is incomplete.**

**Gardiner et al. (2025)** explicitly noted: *"Moderate habitual caffeine consumers remain susceptible to sleep disruption when consuming a high dose (400mg) of caffeine"* [10]. Tolerance was incomplete.

**Weibel et al. (2021)** studied habitual consumers taking 3×150mg daily for 10 days and found that daily caffeine intake still delayed REM sleep onset and worsened subjective sleep quality ratings, even in habitual consumers [15].

**Stucky & Landolt (2025)** analyzed 485,511 UK Biobank participants and found that high habitual caffeine consumption reduced total sleep time by **11–13 minutes per night**, though deep sleep intensity increased as a compensatory adaptation [16].

**Reichert et al. (2021)** found daily caffeine (3×150mg) did not produce clear-cut changes in nighttime sleep structure when measured 8–15 hours after the last dose, though EEG power density in the sigma range was reduced, suggesting subclinical changes persist [17].

### 5.3 Verdict

The app's sensitivity tier approach is a pragmatic way to model individual variation. Regular caffeine consumers develop partial but not complete tolerance to sleep-disrupting effects. The ADORA2A gene (adenosine receptor sensitivity) also contributes to individual variation independently of metabolism speed [6].

---

## 6. Brewing & Extraction Science

### 6.1 Bean Caffeine Content

**App values:** Arabica: 1.2% by mass. Robusta: 2.2% by mass.

**Verdict: ACCURATE**

Arabica (Coffea arabica) typically contains 1.0–1.5% caffeine by dry mass, with 1.2% as the standard reference value. Robusta (Coffea canephora) contains 1.8–2.5%, with 2.2% as the standard reference. The approximately 2:1 ratio of Robusta to Arabica caffeine content is well-established in food science literature [18][19].

### 6.2 Roast Level and Caffeine

**App claim:** Caffeine is thermally stable through roasting; dark roasts have slightly more caffeine per gram due to water mass loss.

**Verdict: ACCURATE**

Caffeine is chemically stable up to approximately 235°C (455°F), which is within typical roasting temperatures but near the upper limit for dark roasts [18]. The sublimation point of caffeine is 178°C at atmospheric pressure, but sublimation rates are slow enough that caffeine loss during normal roasting is minimal (typically <5%) [19]. Because beans lose 15–20% of their mass during dark roasting (primarily water), a gram of dark roast beans contains slightly more caffeine than a gram of light roast beans — the app's density modifier of 1.02 (medium) and 1.05 (dark) is a reasonable approximation of this effect.

### 6.3 Extraction Yields

**App values:** Espresso 80%, Aeropress 85%, French Press 85%, Drip 90%, Cold Brew 95%.

**Verdict: REASONABLE APPROXIMATIONS**

Caffeine is among the first compounds extracted during brewing due to its high water solubility (~21.7 g/L at 25°C, increasing with temperature) [18]. Extraction efficiency depends on grind size, water-to-coffee ratio, contact time, temperature, and agitation. Published extraction studies show wide ranges, but the app's relative ordering (espresso < immersion < drip < cold brew) is consistent with general extraction principles. Exact percentages vary significantly by preparation method and are harder to pin to a single study, but these values are defensible as typical-case estimates.

### 6.4 Temperature Effects

**App model:** Below 85°C: 85% efficiency. Below 90°C: 95%. Above 96°C: 105%.

**Verdict: REASONABLE**

The Specialty Coffee Association recommends a brew temperature of 90–96°C (195–205°F) for optimal extraction [20]. Water temperature directly affects extraction rate — lower temperatures extract caffeine more slowly, requiring longer brew times to compensate. The app's stepwise model is a reasonable simplification of the continuous temperature-extraction relationship.

---

## 7. Tolerance Reset Biology

### 7.1 Adenosine Receptor Mechanism

**App claim:** Caffeine blocks A1 and A2A adenosine receptors; chronic use causes receptor upregulation; cessation allows receptors to return to baseline.

**Verdict: ACCURATE**

Caffeine is a non-selective adenosine receptor antagonist, primarily acting on A1 and A2A subtypes in the brain [1][2]. Chronic caffeine administration leads to upregulation of adenosine receptors, which is the biological basis of tolerance [21]. This upregulation also explains withdrawal symptoms: when caffeine is removed, the excess receptors are unblocked, causing heightened adenosine signaling (fatigue, headaches) [21].

### 7.2 Withdrawal Timeline

**App claim:** Acute withdrawal (headaches, fatigue) in days 1–3; sub-acute phase days 4–9; full receptor reset by days 10–14.

**Verdict: GENERALLY ACCURATE**

A comprehensive review by Juliano & Griffiths (2004) found that caffeine withdrawal symptoms typically begin 12–24 hours after cessation, peak at 20–51 hours, and may last 2–9 days [22]. The most common symptoms are headache (50% incidence), fatigue, decreased energy, drowsiness, and irritability.

Studies on adenosine receptor density suggest receptors return to baseline levels within approximately 7–14 days of complete caffeine abstinence [21]. The app's 14-day cold-turkey timeline is consistent with the upper bound of this range.

### 7.3 Tapering Strategy

**App model:** Reduce by 25% every 10 days until below 10mg, then 5-day washout.

**Verdict: REASONABLE**

There is limited controlled-trial evidence specifically comparing tapering protocols for caffeine. The general pharmacological principle of gradual dose reduction to minimize withdrawal is well-established. The 25% reduction rate is conservative and should minimize withdrawal symptoms. Some clinical guidelines suggest 10–25% reduction per week [22], making the app's approach (25% every 10 days, roughly equivalent to 17.5% per week) appropriately cautious.

---

## 8. Scenario Validation

### The Specific Scenario

- 156mg caffeine at 9:00 AM
- 45mg caffeine at 12:00 PM
- Bedtime at 10:00 PM
- Average (5h) half-life metabolism

### Math Verification

```
156mg at 9AM → 13 hours elapsed → 156 × 0.5^(13/5) = 156 × 0.159 = 24.8mg
45mg at 12PM → 10 hours elapsed → 45 × 0.5^(10/5)  = 45 × 0.25  = 11.3mg
                                                        Total: ~36.1mg
```

The exponential decay calculation is mathematically correct.

### Is 36mg at Bedtime Disruptive?

**For most average-sensitivity adults: No, 36mg is unlikely to cause significant sleep disruption.**

Evidence:
1. **Gardiner et al. (2025):** 100mg at 4h before bed (~57mg remaining at bedtime) caused no significant disruption [10]
2. **Baur et al. (2024):** Deep sleep disruption begins at ~7.3 µmol/L, corresponding to ~69mg for a 70kg person. 36mg produces ~3.8 µmol/L — well below this threshold [11]
3. **Plasma concentration:** For a 70kg person, 36mg ≈ 0.73 mg/L ≈ 3.8 µmol/L, which is below the EEG disruption threshold but approaching the lower cardiac autonomic threshold (~4.3 µmol/L) [11]

**For sensitive individuals or lighter body weight:** 36mg may produce subtle effects. For a 50kg person, the same amount produces ~5.3 µmol/L, which exceeds the cardiac autonomic threshold [11].

**Previous app classification:** "Disruptive" (>30mg)
**Recommended classification:** "Good" (≤30mg) or "Fair" (31–50mg), depending on revised thresholds

This scenario — roughly 2 cups of coffee consumed by noon with a 10PM bedtime — represents a moderate, responsible caffeine pattern that the scientific evidence suggests is compatible with good sleep for the majority of average-metabolism adults.

---

## 9. Summary of Findings & Recommendations

### What the App Gets Right

| Component | Accuracy |
|---|---|
| 5-hour average half-life | Confirmed by multiple pharmacological references [1][2][3] |
| First-order kinetics model | Standard pharmacokinetics, correct at dietary doses [3][7][8] |
| CYP1A2 genotype categories | Consistent with population genetics data [4][5] |
| 30-60 min peak absorption | Confirmed across pharmacokinetic literature [1][2] |
| Adenosine receptor mechanism | Textbook pharmacology [1][2][21] |
| Meta-analytic sleep effects (45min/7%/11min) | Directly from Gardiner 2023 meta-analysis [13] |
| Bean caffeine content (1.2%/2.2%) | Standard food science values [18][19] |
| Roast-level caffeine stability | Confirmed [18][19] |
| 14-day tolerance reset | Consistent with receptor studies [21][22] |

### What Needs Adjustment

| Component | Issue | Recommendation |
|---|---|---|
| Sleep quality thresholds | "Disruptive" at >30mg is too aggressive based on Gardiner 2025 and Baur 2024 | Raise thresholds: Excellent ≤15, Good ≤30, Fair ≤50, Disruptive >50 |
| Sleep architecture claims | Presented without context that they are meta-analytic averages | Add citation and caveat about dose/timing variability |
| No citations | All scientific claims lack source attribution | Add inline citations and bibliography |
| Body weight not modeled | Plasma concentration depends on body mass | Note as a limitation; consider future implementation |

---

## 10. Bibliography

1. Institute of Medicine (US). "Pharmacology of Caffeine." In: *Caffeine for the Sustainment of Mental Task Performance*. National Academies Press, 2001. NCBI Bookshelf: NBK223808. https://www.ncbi.nlm.nih.gov/books/NBK223808/

2. Bordeaux B, Bhatt M, Bhatt F. "Caffeine." *StatPearls*. Treasure Island, FL: StatPearls Publishing; 2024. NCBI Bookshelf: NBK519490. https://www.ncbi.nlm.nih.gov/books/NBK519490/

3. Nehlig A. "Pharmacokinetics of Caffeine: A Systematic Analysis of Reported Data and Relevance to Its Use in Clinical Pharmacology." *Frontiers in Pharmacology*. 2021;12:752826. DOI: [10.3389/fphar.2021.752826](https://doi.org/10.3389/fphar.2021.752826)

4. Sachse C, Brockmöller J, Bauer S, Roots I. "Functional significance of a C→A polymorphism in intron 1 of the cytochrome P450 CYP1A2 gene tested with caffeine." *British Journal of Clinical Pharmacology*. 1999;47(4):445-449. DOI: [10.1046/j.1365-2125.1999.00898.x](https://doi.org/10.1046/j.1365-2125.1999.00898.x)

5. Cornelis MC, El-Sohemy A, Kabagambe EK, Campos H. "Coffee, CYP1A2 genotype, and risk of myocardial infarction." *JAMA*. 2006;295(10):1135-1141. DOI: [10.1001/jama.295.10.1135](https://doi.org/10.1001/jama.295.10.1135)

6. Clark I, Landolt HP. "Coffee, caffeine, and sleep: A systematic review of epidemiological studies and randomized controlled trials." *Sleep Medicine Reviews*. 2017;31:70-78. DOI: [10.1016/j.smrv.2016.01.006](https://doi.org/10.1016/j.smrv.2016.01.006)

7. Bonati M, Latini R, Galletti F, et al. "Caffeine disposition after oral doses." *Clinical Pharmacology & Therapeutics*. 1982;32(1):98-106. DOI: [10.1038/clpt.1982.132](https://doi.org/10.1038/clpt.1982.132)

8. Blanchard J, Sawers SJA. "The absolute bioavailability of caffeine in man." *European Journal of Clinical Pharmacology*. 1983;24(1):93-98. DOI: [10.1007/BF00613933](https://doi.org/10.1007/BF00613933)

9. Carrier J, Paquet J, Fernandez-Bolanos M, et al. "Effects of caffeine on daytime recovery sleep: A double challenge to the sleep-wake cycle in aging." *Sleep Medicine*. 2009;10(9):1016-1024. DOI: [10.1016/j.sleep.2009.01.001](https://doi.org/10.1016/j.sleep.2009.01.001)

10. Gardiner C, Weakley J, Burke LM, Roach GD, Sargent C, Scanlan AT, et al. "Dose and timing effects of caffeine on subsequent sleep: a randomized clinical crossover trial." *SLEEP*. 2025;48(4):zsae230. DOI: [10.1093/sleep/zsae230](https://doi.org/10.1093/sleep/zsae230)

11. Baur DM, Dornbierer DA, Landolt HP, et al. "Concentration-effect relationships of plasma caffeine on EEG delta power and cardiac autonomic activity during human sleep." *Journal of Sleep Research*. 2024;33(3):e14140. DOI: [10.1111/jsr.14140](https://doi.org/10.1111/jsr.14140)

12. Landolt HP, Werth E, Borbely AA, Dijk DJ. "Caffeine intake (200 mg) in the morning affects human sleep and EEG power spectra at night." *Brain Research*. 1995;675(1-2):67-74. DOI: [10.1016/0006-8993(95)00040-W](https://doi.org/10.1016/0006-8993(95)00040-W)

13. Gardiner C, Weakley J, Burke LM, Roach GD, Sargent C, Halson SL, et al. "The effect of caffeine on subsequent sleep: A systematic review and meta-analysis." *Sleep Medicine Reviews*. 2023;69:101764. DOI: [10.1016/j.smrv.2023.101764](https://doi.org/10.1016/j.smrv.2023.101764)

14. Drake C, Roehrs T, Shambroom J, Roth T. "Caffeine Effects on Sleep Taken 0, 3, or 6 Hours before Going to Bed." *Journal of Clinical Sleep Medicine*. 2013;9(11):1195-1200. DOI: [10.5664/jcsm.3170](https://doi.org/10.5664/jcsm.3170)

15. Weibel J, Lin YS, Landolt HP, et al. "Regular Caffeine Intake Delays REM Sleep Promotion and Attenuates Sleep Quality in Healthy Men." *Journal of Biological Rhythms*. 2021;36(4):384-394. DOI: [10.1177/07487304211013995](https://doi.org/10.1177/07487304211013995)

16. Stucky B, Henckel L, Heinzer R, Landolt HP, et al. "Community-based causal evidence that high habitual caffeine consumption alters distinct polysomnography-derived sleep variables." *Journal of Psychopharmacology*. 2025. DOI: [10.1177/02698811251368364](https://doi.org/10.1177/02698811251368364)

17. Reichert CF, Deboer T, Landolt HP, et al. "Challenging the sleep homeostat: effects of daily caffeine on sleep and EEG power spectra." *Scientific Reports*. 2021;11:4876. DOI: [10.1038/s41598-021-84088-x](https://doi.org/10.1038/s41598-021-84088-x)

18. Farah A. "Coffee Constituents." In: *Coffee: Production, Quality and Chemistry*. Royal Society of Chemistry, 2019. DOI: [10.1039/9781782622437](https://doi.org/10.1039/9781782622437)

19. Heckman MA, Weil J, Gonzalez de Mejia E. "Caffeine (1, 3, 7-trimethylxanthine) in Foods: A Comprehensive Review on Consumption, Functionality, Safety, and Regulatory Matters." *Journal of Food Science*. 2010;75(3):R77-R87. DOI: [10.1111/j.1750-3841.2010.01561.x](https://doi.org/10.1111/j.1750-3841.2010.01561.x)

20. Specialty Coffee Association. "SCA Standards: Golden Cup." https://sca.coffee/research/coffee-standards

21. Fredholm BB, Bättig K, Holmén J, Nehlig A, Zvartau EE. "Actions of caffeine in the brain with special reference to factors that contribute to its widespread use." *Pharmacological Reviews*. 1999;51(1):83-133. PMID: [10049999](https://pubmed.ncbi.nlm.nih.gov/10049999/)

22. Juliano LM, Griffiths RR. "A critical review of caffeine withdrawal: empirical validation of symptoms and signs, incidence, severity, and associated features." *Psychopharmacology*. 2004;176(1):1-29. DOI: [10.1007/s00213-004-2000-x](https://doi.org/10.1007/s00213-004-2000-x)
