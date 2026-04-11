# Implementation Plan: Melatonin Microdose Calculator

> Feature: melatonin-microdose-calculator
> Created: 1775796607
> Spec hash: c86fefff
> Based on: docs/spec.md

## Objective

Add a bidirectional melatonin microdose calculator at `/melatonin/` — pure math library, page, form, results, nav link, and localStorage persistence.

## Sequence

### Step 1: Core math — `calculateWeightToDose` (AC-1, AC-3, AC-4, AC-5)
- **Test:** Write tests for `calculateWeightToDose`: known-value conversion (AC-1), over-tablet-weight input returns >melatoninPerTabletMg (AC-3), zero/negative inputs return null (AC-4), zero tabletWeightG returns null (AC-5).
- **Implement:** Create `src/lib/melatonin-math.ts` with types (`TabletConfig`, `WeightToDoseResult`) and `calculateWeightToDose` function. Follow `coffee-math.ts` shape: types block, then named exports.
- **Files:** `src/lib/melatonin-math.ts` (new), `src/lib/__tests__/melatonin-math.test.ts` (new)
- **Verify:** `npm test -- melatonin-math`

### Step 2: Core math — `calculateDoseToWeight` (AC-2, AC-4, AC-5)
- **Test:** Add tests for `calculateDoseToWeight`: known-value conversion (AC-2), zero/negative inputs return null (AC-4), zero tabletWeightG returns null (AC-5).
- **Implement:** Add `DoseToWeightResult` type and `calculateDoseToWeight` function to `melatonin-math.ts`.
- **Files:** `src/lib/melatonin-math.ts` (modify), `src/lib/__tests__/melatonin-math.test.ts` (modify)
- **Verify:** `npm test -- melatonin-math`

### Step 3: Page route and heading (AC-6)
- **Test:** Component test — `/melatonin` route renders without crashing, heading contains "Melatonin".
- **Implement:** Create `src/app/melatonin/page.tsx` following `coffee/page.tsx` structure: `'use client'`, Header, gradient background (indigo/violet), heading. Minimal — no form or results yet.
- **Files:** `src/app/melatonin/page.tsx` (new)
- **Verify:** `npm test` + dev server manual check

### Step 4: Form component with tablet config and conversion inputs (AC-7, AC-8, AC-9)
- **Test:** Component tests — dose result panel visible when measured weight entered and hidden when removed (AC-7); weight result panel visible when target dose entered and hidden when removed (AC-8); non-numeric input shows no result panel and no error (AC-9).
- **Implement:** Create `MelatoninForm.tsx` (tablet config fields + conversion inputs) and `MelatoninResults.tsx` (conditional result panels). Wire into page with `useState`, derived values via `calculateWeightToDose`/`calculateDoseToWeight`, conditional rendering (`result !== null &&`).
- **Files:** `src/components/melatonin/MelatoninForm.tsx` (new), `src/components/melatonin/MelatoninResults.tsx` (new), `src/app/melatonin/page.tsx` (modify)
- **Verify:** `npm test` + dev server manual check

### Step 5: Navigation link (AC-10)
- **Test:** Verify Header renders a link to `/melatonin` with label.
- **Implement:** Add melatonin entry to `links` array in `Header.tsx` — use `Pill` icon from lucide-react, indigo color family (`text-indigo-400`, `bg-indigo-500/10 text-indigo-400 border-indigo-500/20`).
- **Files:** `src/components/layout/Header.tsx` (modify)
- **Verify:** `npm test` + dev server — confirm nav pill appears and routes correctly

### Step 6: localStorage persistence (AC-11)
- **Test:** Component test — on mount, tablet config restored from localStorage; changing config persists to localStorage.
- **Implement:** Add `useEffect` pair in page component (same pattern as `coffee/page.tsx`): load from `melatonin-tablet-config` on mount with fallback defaults, save on config change. Guard with `mounted` state to avoid SSR hydration mismatch.
- **Files:** `src/app/melatonin/page.tsx` (modify)
- **Verify:** `npm test` + dev server — set values, reload, confirm persistence

## Risks

- **Floating-point rounding:** The spec requires specific decimal precision (3dp mg, 4dp grams). Mitigate with explicit `Number().toFixed()` in calculation functions, verified by AC-1 and AC-2 test values.
- **SSR hydration mismatch:** localStorage reads during SSR will cause React hydration errors. Mitigate with `mounted` guard pattern (already used in `coffee/page.tsx`).

## Definition of Done

- [ ] All 11 acceptance criteria from spec pass
- [ ] All existing tests still pass (`npm test`)
- [ ] No type errors (`npm run build`)
- [ ] Code reviewed (run /review)
