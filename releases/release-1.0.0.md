# Release: v1.0.0

**Date:** March 13, 2026
**Type:** Major (first validated release)

## Summary

First scientifically validated release of the Caffeine Sleep Safety Calculator. All pharmacokinetic models, sleep quality thresholds, and educational claims have been validated against peer-reviewed research. Sleep quality thresholds recalibrated to match the best available evidence. Inline citations added throughout the app. Test-driven development infrastructure established.

## Changes

### Features
- **Scientific References Page** (`/references`): New page listing all 20 peer-reviewed sources with authors, journal, year, DOI links, and "Used for" annotations. Includes methodology note and limitations/disclaimers section.
- **Navigation**: Added "References" link with BookOpen icon to the header navigation bar.
- **Inline Citations**: All educational content sections now include superscript citation markers linking to DOI or the references page.
  - EducationalContext.tsx: 9 citations across pharmacokinetics, metabolism, sleep disruption, and tips sections
  - BrewScience.tsx: 3 citations for bean content, roast stability, and water solubility
  - ToleranceEducation.tsx: 4 citations for receptor biology, withdrawal, and reset timeline

### Fixes
- **Sleep Quality Thresholds Recalibrated**: Previous thresholds were overly conservative based on scientific evidence.
  - Excellent: ≤10mg → **≤15mg** (well below any measurable effect per Baur 2024)
  - Good: ≤20mg → **≤30mg** (below cardiac autonomic threshold per Baur 2024)
  - Fair: ≤30mg → **≤50mg** (below Gardiner 2025's 100mg/4h no-effect finding)
  - Disruptive: >30mg → **>50mg** (approaching concentrations where RCTs demonstrate effects)
- **Meta-analytic caveat added**: Sleep architecture numbers (−45min, −7%, −11min) now include a note that these are pooled averages across various doses and timings, not predictions for any specific scenario.
- **Sleep impact message threshold**: Adjusted from >20mg to >30mg for the adenosine receptor blocking message.

### Infrastructure
- **Test Framework**: Installed Vitest + Testing Library + jsdom. Created vitest.config.ts with path aliases and jsdom environment.
- **Test Suite**: 35 tests across 3 test files:
  - `caffeine.test.ts`: 15 tests — half-life constants, decay calculations, validated scenario (156mg@9AM + 45mg@12PM), metabolism speed comparisons, overnight wraparound, safe sleep windows, chart data generation
  - `coffee-math.test.ts`: 12 tests — bean caffeine percentages, roast modifiers, extraction yields, brew calculations, temperature effects, blend interpolation, unit conversions
  - `tolerance.test.ts`: 8 tests — cold turkey 14-day plan, taper dose reductions, washout period, withdrawal phases
- **CLAUDE.md**: Project documentation with mandatory TDD workflow, release process, code conventions, and scientific integrity rules.
- **Research Report**: `research/caffeine-sleep-scientific-validation_2026-03-13.md` — comprehensive validation of all models against 22 cited sources.
- **Release Process**: `releases/` directory established with plan and release document templates.

## Files Changed

| File | Change |
|------|--------|
| `CLAUDE.md` | Created — project rules, TDD methodology, release process |
| `package.json` | Added test scripts, Vitest + Testing Library devDependencies |
| `vitest.config.ts` | Created — Vitest config with jsdom, path aliases |
| `src/__tests__/setup.ts` | Created — test setup with jest-dom matchers |
| `src/lib/caffeine.ts` | Sensitivity thresholds recalibrated (15/30/50) |
| `src/lib/__tests__/caffeine.test.ts` | Created — 15 tests for pharmacokinetic model |
| `src/lib/__tests__/coffee-math.test.ts` | Created — 12 tests for brew calculations |
| `src/lib/__tests__/tolerance.test.ts` | Created — 8 tests for tolerance reset |
| `src/components/calculator/ResultsDashboard.tsx` | Updated thresholds, labels, and message conditions |
| `src/components/calculator/EducationalContext.tsx` | Added Cite components and inline citations |
| `src/components/coffee/BrewScience.tsx` | Added Cite components and inline citations |
| `src/components/tolerance/ToleranceEducation.tsx` | Added Cite components and inline citations |
| `src/app/references/page.tsx` | Created — full bibliography page with 20 sources |
| `src/components/layout/Header.tsx` | Added References nav link |
| `research/caffeine-sleep-scientific-validation_2026-03-13.md` | Created — full validation report |
| `releases/release-1.0.0-plan.md` | Created — release plan |
| `releases/release-1.0.0.md` | Created — this document |

## Breaking Changes

Sleep quality thresholds changed. Caffeine levels between 31–50mg at bedtime that were previously labeled "Disruptive" are now labeled "Fair" or "Good". This is an intentional correction justified by Gardiner et al. (2025, SLEEP) and Baur et al. (2024, J Sleep Research).

## Test Results

```
35 tests passed, 0 failed (3 test files)
- caffeine.test.ts:    15 passed
- coffee-math.test.ts: 12 passed
- tolerance.test.ts:    8 passed
```

## Key References

- Gardiner et al. (2025). *SLEEP*. DOI: 10.1093/sleep/zsae230 — basis for threshold recalibration
- Baur et al. (2024). *J Sleep Research*. DOI: 10.1111/jsr.14140 — plasma concentration thresholds
- Gardiner et al. (2023). *Sleep Medicine Reviews*. DOI: 10.1016/j.smrv.2023.101764 — meta-analytic sleep effects
- Drake et al. (2013). *J Clinical Sleep Medicine*. DOI: 10.5664/jcsm.3170 — dose-timing landmark study
