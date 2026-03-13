# Caffeine Sleep Safety Calculator

A scientifically validated web calculator for caffeine pharmacokinetics, sleep impact estimation, brew dosage calculation, and tolerance reset planning.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4, shadcn/ui components, Framer Motion
- **Charts:** Recharts
- **Testing:** Vitest + Testing Library + jsdom
- **Linting:** ESLint with next config

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build (also runs TypeScript checks)
npm run lint         # Run ESLint
npm test             # Run all tests (vitest run)
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Sleep Calculator (home)
│   ├── coffee/page.tsx     # Brew Calculator
│   ├── tolerance/page.tsx  # Tolerance Reset
│   └── references/page.tsx # Scientific References
├── components/
│   ├── calculator/         # Sleep calculator components
│   ├── coffee/             # Brew calculator components
│   ├── tolerance/          # Tolerance reset components
│   ├── layout/             # Header, navigation
│   └── ui/                 # shadcn/ui primitives
└── lib/
    ├── caffeine.ts         # Pharmacokinetic model (half-life, decay, thresholds)
    ├── coffee-math.ts      # Brew caffeine yield calculations
    ├── tolerance.ts        # Tolerance reset plan generator
    ├── beverage-data.ts    # Beverage database (150+ drinks)
    └── __tests__/          # Unit tests for all lib modules

research/                   # Scientific validation reports
releases/                   # Release plans and completed release notes
```

## Scientific Integrity

All pharmacokinetic constants, sleep quality thresholds, and educational claims are backed by peer-reviewed research. Sources are cited inline throughout the app and listed on the `/references` page. The full validation report lives in `research/`.

**When modifying any scientific constant or threshold:**
1. Cite the peer-reviewed source justifying the change
2. Update the corresponding test to reflect the new value with a comment referencing the source
3. Update `src/app/references/page.tsx` if a new source is added
4. Update `research/` if the change affects the validation report

---

## Test-Driven Development (TDD) — Mandatory Workflow

All code changes in this project **must** follow the Red-Green-Refactor TDD cycle. This is not optional — it is the development methodology for this codebase.

### The TDD Cycle

```
1. RED    — Write a failing test that defines the desired behavior
2. GREEN  — Write the minimum code to make the test pass
3. REFACTOR — Clean up the code while keeping all tests green
```

### Rules

1. **No production code without a failing test first.** Before writing or modifying any logic in `src/lib/` or business logic in components, write a test that captures the expected behavior. Run it. Watch it fail. Then implement.

2. **Tests must be meaningful, not ceremonial.** Each test should assert a specific behavior that matters — a calculation boundary, a known pharmacokinetic value, an edge case. Tests that merely confirm the code does what the code does are worthless.

3. **Test file naming:** Tests live alongside the code they test, under `__tests__/` directories:
   - `src/lib/__tests__/caffeine.test.ts` tests `src/lib/caffeine.ts`
   - `src/lib/__tests__/coffee-math.test.ts` tests `src/lib/coffee-math.ts`
   - Component tests go in `src/components/<area>/__tests__/`

4. **Run tests before committing.** Every commit must pass `npm test`. If tests fail, the commit does not happen.

5. **Scientific constants are tested.** Whenever a constant (half-life, threshold, extraction yield) is used in a calculation, it should have a test that verifies its value and comments the source paper.

6. **Bug fixes start with a regression test.** When fixing a bug, first write a test that reproduces the bug (RED), then fix it (GREEN). This prevents the bug from returning.

7. **Refactoring requires passing tests.** If you want to restructure code, all existing tests must pass before and after the refactor. If they don't, the refactor introduced a behavior change — treat it as a new feature and go through TDD.

### What to Test

| Layer | What to test | Example |
|-------|-------------|---------|
| `src/lib/` (core logic) | Every public function, edge cases, boundary values | Decay calculation at 0h, 5h (half-life), 24h |
| Constants | Values match cited research | `METABOLISM_HALF_LIVES.average === 5.0` |
| Calculations | Known input → known output | `156mg @ 9AM, 5h half-life → ~37mg @ 10PM` |
| Components | User-facing behavior that depends on logic | Status text changes at threshold boundaries |

### What NOT to Test

- Styling, CSS classes, or visual presentation
- Third-party library internals (Recharts, Framer Motion)
- Simple prop-passing components with no logic
- `node_modules`

---

## Release Process

Releases follow semantic versioning (`MAJOR.MINOR.PATCH`) and are tracked in the `releases/` directory.

### Planning a Release

1. Create `releases/release-{version}-plan.md` with:
   - Version number and target date
   - List of features, fixes, or changes planned
   - Any breaking changes noted
   - Testing requirements
   - Acceptance criteria

2. All planned work follows TDD (tests written first).

### Completing a Release

1. All planned work is implemented and all tests pass (`npm test`).
2. Build succeeds (`npm run build`).
3. Create `releases/release-{version}.md` with:
   - Version number and date
   - Summary of all changes (features, fixes, improvements)
   - Breaking changes (if any)
   - List of files changed
   - Test results summary
4. Update `version` in `package.json`.
5. Create a single git commit with a comprehensive message covering all changes in the release.

### Commit Message Format for Releases

```
release: v{VERSION} — {Brief summary}

## Changes
- feat: {description}
- fix: {description}
- ...

## Files Changed
- {file path}: {what changed}

## Test Results
- {N} tests passed, 0 failed

Co-Authored-By: ...
```

### Versioning Rules

- **PATCH** (0.1.x): Bug fixes, threshold adjustments, copy changes
- **MINOR** (0.x.0): New features, new pages, new calculators
- **MAJOR** (x.0.0): Breaking changes to the calculation model, data format changes

---

## Code Conventions

- Use `'use client'` directive on all components with interactivity or browser APIs
- Path alias: `@/` maps to `src/`
- Components use PascalCase filenames; lib modules use kebab-case
- All scientific claims in UI components must include a `<Cite>` component linking to the source
- Prefer editing existing files over creating new ones
