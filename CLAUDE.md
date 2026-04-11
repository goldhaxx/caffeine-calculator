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
npm run build        # Production build (+ TypeScript checks)
npm run lint         # Run ESLint
npm test             # Run all tests (vitest run)
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## Architecture
```
src/
├── app/            # Next.js App Router (page.tsx, coffee/, tolerance/, references/)
├── components/     # calculator/, coffee/, tolerance/, layout/, ui/
└── lib/            # caffeine.ts, coffee-math.ts, tolerance.ts, beverage-data.ts, __tests__/
research/           # Scientific validation reports
releases/           # Release plans and notes
docs/               # spec.md, plan.md, checkpoint.md
```

## Scientific Integrity
All constants and claims are backed by peer-reviewed research. Sources cited inline and on `/references`.
**When modifying any scientific constant:** (1) cite source, (2) update test with source comment, (3) update references page, (4) update `research/` if affected.

## Project-Specific Testing
- Tests in `__tests__/` directories alongside source (e.g., `src/lib/__tests__/caffeine.test.ts`)
- Scientific constants must have tests verifying values with source paper comments
- Component tests in `src/components/<area>/__tests__/`

## Release Process
Semver tracked in `releases/`. Plan in `releases/release-{version}-plan.md`, complete in `releases/release-{version}.md`. PATCH=fixes, MINOR=features, MAJOR=breaking model changes.

## Conventions
- `'use client'` on all interactive components
- `@/` maps to `src/`
- PascalCase component files; kebab-case lib modules
- All scientific claims use `<Cite>` component
- Prefer editing existing files over creating new ones

<!-- HUB-MANAGED-START -->
<!-- Everything above is project-specific (name, stack, commands, architecture). -->
<!-- Everything below is managed by the preset hub and updated via /ccanvil-pull. -->

## Workflow: Specification → Test → Implement → Verify

**Every feature follows this sequence. No exceptions.**

1. **Spec first.** Before coding, define acceptance criteria in `docs/spec.md`. Each criterion must be binary: pass or fail.
2. **Test first.** Write one failing test targeting the first acceptance criterion. Run it. Confirm it fails.
3. **Implement minimally.** Write only enough code to pass the failing test.
4. **Verify.** Run the full test suite. If anything broke, fix it before moving on.
5. **Refactor.** Clean up only after all tests pass. Never refactor and add features simultaneously.
6. **Commit.** One logical change per commit. Message format: `type(scope): description`

## Reference Documents
### Preset Guide — .ccanvil/guide/index.md
**Read when:** Adding or modifying preset commands, rules, agents, skills, hooks, or scripts.

## Do Not
- Do not modify `.ccanvil/guide/foundations.md` without explicit user approval — it is foundational research source material.
- Do not modify files in `generated/`, `dist/`, or dependency directories.
- Do not install new dependencies without stating the reason and alternatives considered.
