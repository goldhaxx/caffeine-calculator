# Stasis

> Feature: session-2026-07-03-bts-711-ship
> Kind: session
> Last updated: 1783112006
> Session: 4
> Boundary: 2026-07-02T14:56:10-07:00
> Session objective: fix the 24h decay-clipping bug and expose the steady-state caffeine baseline (BTS-711), end to end through ship.

## Accomplished

- **BTS-711 shipped** — PR #4 squash-merged to main (`c443abd`), branch deleted, ticket auto-closed. Full lifecycle: idea → spec → activate → plan → 5 TDD cycles → UI → review → fixes → 2 operator-feedback cycles → /pr → /ship.
- Decay math rebuilt on a continuous-time core (`calculateRemainingAtOffset`, no 24h wrap): curve carries past 24h; 1/3/7-day horizons; "Repeat daily" accumulation; closed-form steady-state baseline (`trough = Σ dose·2^(−Δ/h)/(1−f)`); exact per-day ramp floors.
- Max-effort code review (10 finder angles → 55 candidates → verifier + gap sweep) caught a real math bug: the `(1−f^k)` ramp law overstates day-k floors for multi-dose schedules whose trough precedes a non-earliest dose (day-1 error up to `mg·f` per later dose). Fixed with exact simulation over dose instants, brute-force verified bit-exact.
- Hardening from review: malformed `HH:mm` doses skipped (no Invalid Date render crash), non-array localStorage payloads and bad half-lives degrade to empty/null, cycle-based day labels, wall-clock-aligned 1-day ticks, memoized charts, shared chart theme.
- Operator-feedback round: Decay Timeline + Baseline Ramp-Up merged into one tabbed slot (accessible tablist); in-UI math explainer tooltips with live metabolism-dependent numbers (decay law, bathtub analogy, intake-equals-elimination fixed point via `summarizeSteadyStateMath`, tested).
- Follow-up tickets captured: BTS-712 (kernel unification), BTS-713 (DST labels), BTS-714 (localStorage shape validation), BTS-715 (node test-provider config — /pr gate ran a vacuous bats 0/0).
- Test suite: 47 → 93 vitest tests (all green on main).

## Current State

- **Branch:** main @ `c443abd` (BTS-711 squash-merge), pushed.
- **Tests:** 93/93 passing (`npm test`, vitest — run on main post-merge). Note: `docs-check.sh test-suite-run` is NOT wired for this node (BTS-715); use `npm test` until fixed.
- **Uncommitted changes:** only pre-existing operator hub-sync work — `.ccanvil/scripts/ccanvil-sync.sh` (modified, +455/−47) and untracked `.ccanvil/state/`. Not touched this session.
- **Build status:** clean (`next build` compiles + type-checks; lint clean in all files touched this session).

## Blocked On

- Nothing.

## Next Steps

1. `/idea triage` — 4 untriaged in Linear Triage (BTS-712, BTS-713, BTS-714, BTS-715).
2. Fix BTS-715 first (small config: set the node test-provider so `/pr`'s gate runs vitest, not a vacuous bats pass).
3. `/spec BTS-712 …` — bedtime/safe-sleep kernel unification is the highest user-visible follow-up (headline stat can contradict the chart at the bedtime marker).
4. Context budget is CRITICAL (102.3% of 8000-token rules budget) — trim rules/CLAUDE.md or run `/ccanvil-audit`.
5. Resolve the parked hub-sync work (`ccanvil-sync.sh` + `.ccanvil/state/`) — commit or discard via the hub flow.

## Context Notes

- **Ramp semantics decision:** bars = exact daily *minimum* (not morning pre-first-dose level); closed-form `asymptote·(1−f^k)` retained only as the single-dose special case in tests. Verifier proved exact-fix bit-equal to 1-min brute force across 4 schedule shapes.
- **Day-numbering decision:** cycle-based (`floor(offset/24)+1`), not calendar-midnight — keeps a 1-day chart entirely "Day 1" and aligns with ramp-card day counting and trough instants.
- **Deliberate scope holds (now tickets):** bedtime card/safe-sleep windows stay on the legacy wrap-to-24h kernel per AC-8 (BTS-712); DST drift accepted (BTS-713).
- **Process deviation:** the tabs + math-tooltip round landed as post-`/pr` commits on the already-finalized branch (PR-review-feedback flow) rather than a fresh spec cycle — spec archive carries AC-11/12; re-finalization was manual (push + `gh pr edit`).
- **Zach's mental model, confirmed and encoded:** intake-equals-elimination fixed point ("bathtub with an open drain") — now rendered verbatim-ish in the ramp card's info tooltip with live numbers; elimination % must always be shown as tied to the selected half-life (96.4% @ 5h / 87.5% @ 8h / 99.6% @ 3h).
- **Chrome-extension verification path is broken** (stale tab-group id on every call); visual checks fell back to operator eyeballing the dev server (127.0.0.1:3123, still running in background task br8lsmaxx).

## Determinism Review

- **operations_reviewed:** 9
- **candidates_found:** 3
- **Chart-UI acceptance verification**: Claude verified AC-6/10/11 (controls, tabs, tooltips, reference lines) by build + operator eyeball because no component harness exists and the browser extension was down. Should be a component test harness (testing-library or a Playwright smoke) so UI acceptance criteria are scriptable. Impact: medium.
- **PR body composition**: Claude hand-assembled the PR body twice (heredoc + inline python patch) from spec archive, test counts, and ticket refs. Should be a `docs-check.sh pr-body-render` substrate that composes Summary/Test Plan/Spec deterministically. Impact: medium.
- **Pre-activate stash dance**: Claude manually stashed/popped unrelated operator dirt (`ccanvil-sync.sh`, `.ccanvil/state/`) around `activate`'s clean-tree gate. Should be substrate-owned auto-stash/restore of configured paths in `cmd_activate`. Impact: low.
- (Also born-and-captured this session, not re-captured: BTS-715 — vacuous test dispatcher pass.)

## Evidence Gaps

No evidence gaps this session.

## Manifest Coverage

Manifest coverage: N/A (no allowlist yet).

## Permissions Review Pending

24 DELETE/TRIAGE candidates from settings.local.json + 24 DANGER entries lacking accept_danger rationale.

- `Bash(find /Users/zacharywright/Documents/GitHub/caffeine-calculator/src -type f …)` → DELETE one-shot (stale path — repo moved to ~/projects)
- `Bash(find /Users/zacharywright/Documents/GitHub/caffeine-calculator -type f … *.md …)` → DELETE one-shot (stale path)
- `WebFetch(domain:pmc.ncbi.nlm.nih.gov)` → TRIAGE (research citations)
- `WebFetch(domain:pubmed.ncbi.nlm.nih.gov)` → TRIAGE (research citations)
- `Bash(npx next:*)` → DELETE redundant
- + 19 more

DANGER entries needing rationale (first 5): `Bash(./.ccanvil/scripts/:*)`, `Bash(./.claude/hooks/:*)`, `Bash(.ccanvil/scripts/:*)`, `Bash(.claude/hooks/:*)`, `Bash(ALLOW_DESTRUCTIVE=1 chmod:*)` + 19 more.

Run `/permissions-review` to triage interactively.

## Cross-Session Patterns

First stasis — no prior state to compare.

- `legacy-refs-scan`: 8 hub-owned matches (e.g. `/catchup` in `.ccanvil/guide/command-reference.md`) — next `/ccanvil-pull` will resolve. 21 node-specific matches, concentrated in `.ccanvil/guide/foundations.md` (`/catchup`) and `.ccanvil/init-plan.json` (`/checkpoint`) — preset docs copied at init; clean up node-side or refresh via pull.
- Health flag: rules/context budget CRITICAL at 102.3% (see Next Steps 4).

## Security Review

PASS — static grep over the session diff (`61edd3d..HEAD`, src/ + docs/) for keys/tokens/secrets/PII: no findings. No new external surfaces added (pure client-side math/UI; no network calls, no env vars).

## Memory Candidates

- Feedback: end-users of this app are under-the-hood readers — surface the math (formulas, live numbers, worked fixed-point examples) via tooltips rather than hiding it; graphs alone don't satisfy. (Zach, explicitly, this session.)
- Feedback: prefer consolidating chart real estate — tabbed single slot over stacked cards.
- Project fact: any elimination/retention percentage shown in UI must state the half-life it derives from — an untethered "~96%" confused even the owner.
- (Already written to auto-memory this session: caffeine-calculator node facts — Linear-routed ideas, local specs, vitest suite, dispatcher gap.)

<!-- NODE-SPECIFIC-START -->
<!-- Add project-specific content below this line. -->
<!-- Hub content above is updated via /ccanvil-pull. -->