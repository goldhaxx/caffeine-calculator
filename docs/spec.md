# Feature: Melatonin Microdose Calculator

> Feature: melatonin-microdose-calculator
> Created: 1744156800
> Status: In Progress

## Summary

A bidirectional conversion calculator at `/melatonin/` that lets users who microdose melatonin translate between tablet weight (measured on a milligram scale) and exact melatonin content. The core problem: most tablets are 5–10 mg, but evidence-backed therapeutic doses are 300–600 mcg. Users cut tablets and weigh fragments — this tool converts measured weight to dose and target dose to required weight, given user-configurable tablet specs.

## Job To Be Done

**When** I want to take a precise low melatonin dose using a milligram scale to weigh a tablet fragment,
**I want to** enter either my measured fragment weight or my target dose and see the equivalent value instantly,
**So that** I can dose accurately without guessing.

## Acceptance Criteria

Each criterion is independently testable. Binary pass/fail.

- [ ] **AC-1:** Given `tabletWeightG = 0.365`, `melatoninPerTabletMg = 10`, when `measuredWeightG = 0.109`, then `calculateWeightToDose` returns `{ mg: 2.986, mcg: 2986 }` (mg to 3 decimal places, mcg rounded to whole number).
- [ ] **AC-2:** Given `tabletWeightG = 0.365`, `melatoninPerTabletMg = 10`, when `targetDoseMcg = 500`, then `calculateDoseToWeight` returns `{ grams: 0.0183, percentOfTablet: 5.00 }` (grams to 4 decimal places, percent to 2 decimal places).
- [ ] **AC-3:** When `measuredWeightG` exceeds `tabletWeightG`, `calculateWeightToDose` returns a `melatoninMg` greater than `melatoninPerTabletMg` without throwing (no upper clamp).
- [ ] **AC-4 (error):** When any input is zero or negative, both calculation functions return `null`.
- [ ] **AC-5 (error):** When `tabletWeightG` is zero, both calculation functions return `null` (prevents division by zero).
- [ ] **AC-6:** The `/melatonin` route renders without crashing and displays a page heading containing "Melatonin".
- [ ] **AC-7:** Given valid tablet config and a measured weight input, the dose result panel becomes visible without a form submission; removing the input hides the result panel.
- [ ] **AC-8:** Given valid tablet config and a target dose input, the weight result panel becomes visible without a form submission; removing the input hides the result panel.
- [ ] **AC-9:** When a non-numeric string is entered in any numeric input field, the result panel does not display and no calculation error is thrown.
- [ ] **AC-10:** The `/melatonin` route is linked in the `Header` component nav alongside the existing routes.
- [ ] **AC-11:** On page load, tablet config fields (`tabletWeightG`, `melatoninPerTabletMg`) are restored from localStorage if previously saved. Changing either value persists it to localStorage immediately.

## Affected Files

| File | Change |
|------|--------|
| `src/lib/melatonin-math.ts` | New — pure calculation functions and types |
| `src/lib/__tests__/melatonin-math.test.ts` | New — unit tests for AC-1 through AC-5 |
| `src/app/melatonin/page.tsx` | New — route page, same structure as `src/app/coffee/page.tsx` |
| `src/components/melatonin/MelatoninForm.tsx` | New — tablet config + conversion inputs |
| `src/components/melatonin/MelatoninResults.tsx` | New — result panels for both directions |
| `src/components/layout/Header.tsx` | Modified — add `/melatonin` nav link |

## Dependencies

- **Requires:** No new npm dependencies. Uses existing shadcn/ui (`Card`, `Input`), Framer Motion, and Lucide icons already present.
- **Blocked by:** Nothing.

## Out of Scope

- Melatonin pharmacokinetics (half-life, sleep-onset timing, decay charts) — unit conversion only.
- Preset tablet library or brand lookup — user always enters their own tablet specs.
- Dose recommendations or warnings — calculator is neutral on what dose to take.
- Dose recommendations or safety warnings — calculator is neutral on what dose to take.

## Implementation Notes

- Follow the same module shape as `src/lib/coffee-math.ts`: export a types block, named constants, and pure exported functions. No default exports.
- Follow the same page structure as `src/app/coffee/page.tsx`: `'use client'`, `useState` for inputs, derived values computed inline, two-column `lg:grid-cols-12` layout.
- Use indigo/violet as the accent color family to distinguish the page visually (blue is sleep, amber is coffee, emerald is tolerance).
- `MelatoninForm` manages both tablet config fields and conversion inputs; active conversion direction is determined by which input has a value.
- Result panels use conditional rendering (`value !== null &&`) to satisfy AC-7 and AC-8 without extra boolean state.
- Calculation functions return `null` on invalid input; page components guard against passing `null` into display.
- Persist tablet config to localStorage under key `melatonin-tablet-config`. Restore on mount with fallback defaults (`tabletWeightG: 0.365`, `melatoninPerTabletMg: 10`). Conversion inputs (measured weight, target dose) are NOT persisted.
- Add `/melatonin` nav entry to `Header.tsx` following the exact same object shape as existing entries.
