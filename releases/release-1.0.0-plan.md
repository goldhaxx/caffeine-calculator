# Release Plan: v1.0.0

**Target Date:** March 13, 2026
**Status:** Completed

## Summary

First scientifically validated release. This release establishes the evidence base for all pharmacokinetic models and sleep impact calculations, recalibrates thresholds to match peer-reviewed research, adds inline citations throughout the app, creates a dedicated references page, and introduces the test-driven development infrastructure.

## Planned Changes

### Scientific Validation
- [x] Conduct deep literature review of caffeine pharmacokinetics and sleep impact
- [x] Validate half-life constants (3h/5h/8h) against NCBI, StatPearls, and Nehlig 2021
- [x] Validate first-order kinetics decay model
- [x] Validate sleep architecture claims (45min/7%/11min) against Gardiner 2023 meta-analysis
- [x] Validate bean caffeine content and extraction science
- [x] Validate tolerance reset biology and timeline
- [x] Produce comprehensive research report with full bibliography

### Threshold Recalibration
- [x] Adjust sleep quality thresholds based on Gardiner 2025 and Baur 2024 evidence:
  - Excellent: 10mg → 15mg
  - Good: 20mg → 30mg
  - Fair: 30mg → 50mg
  - Disruptive: >30mg → >50mg
- [x] Update ResultsDashboard.tsx to reflect new thresholds
- [x] Update Safe Sleep Window display labels

### Citations & References
- [x] Add inline `<Cite>` components to EducationalContext.tsx (9 citations)
- [x] Add inline `<Cite>` components to BrewScience.tsx (3 citations)
- [x] Add inline `<Cite>` components to ToleranceEducation.tsx (4 citations)
- [x] Add caveat that meta-analytic sleep numbers are pooled averages
- [x] Create `/references` page with 20 fully cited sources
- [x] Add References link to navigation header

### Testing Infrastructure
- [x] Install Vitest, Testing Library, jsdom
- [x] Create vitest.config.ts and test setup
- [x] Write caffeine.test.ts — 15 tests covering pharmacokinetic model
- [x] Write coffee-math.test.ts — 12 tests covering brew calculations
- [x] Write tolerance.test.ts — 8 tests covering reset plans
- [x] All 35 tests passing

### Project Infrastructure
- [x] Create CLAUDE.md with TDD rules and release process
- [x] Create releases/ directory with plan and release documents
- [x] Create research/ directory with validation report

## Breaking Changes

- Sleep quality thresholds changed. Users who previously saw "Disruptive" for 31-50mg remaining will now see "Fair" or "Good". This is an intentional correction based on scientific evidence.

## Acceptance Criteria

- [x] All 35 tests pass (`npm test`)
- [x] Build succeeds (`npm run build`)
- [x] Every scientific claim has an inline citation linking to a DOI or reference page
- [x] References page lists all 20 sources with active links
- [x] Research report covers all validation findings with full bibliography
