# AGENTS.md

## Commands

- Test: `npm test`
- Lint: `npm run lint`
- Build: `npm run build`
- Install: `npm install`
- Dev: `npm run dev`

## Codebase layout

- `src/product/appRoutes.js`: mounted route table. Seam: `ROOT_REDIRECT`, `CATCH_ALL_REDIRECT`, `appPageRoutes`, `isPageRoute`.
- `src/product/cargoGate.js`: pickup gate. Seam: `decideCargoGate(pendingFindings)`.
- `src/product/sampleOrder.js`: sample pack. Seam: `matchSamplePack`, `applySamplePack`, `describeSampleResult`.
- `src/App.tsx`: renders the route table.
- `src/contexts/WorkflowContext.tsx`: demo cargo check. Calls `decideCargoGate` at the decision step.
- `src/pages/FlowDesign.tsx`: canvas. `/` redirects here.
- `src/pages/Flows.tsx`: unmounted landing. Do not add it to `appPageRoutes`.
- `src/data/navigation.ts`: sidebar labels. No Flows item.
- `docs/changes/`: Monad change artifacts per Linear issue (`RDS-<n>-short-slug`)
- `docs/agents/issue-tracker.md`: Linear conventions
- `scripts/assert-no-legacy-routes.mjs` and `scripts/assert-product-invariants.mjs`: product guards

## Standards

- Prefer small pure functions with tests at public seams.
- Red before green for new behavior (`tdd` skill).
- Smallest diff that solves the stated problem (`smallest-diff`).
- Prove on the real surface before claiming done (`prove-it`).
- Comments only for non-obvious why.
- No new dependencies without noting them in the change plan.
- Official Swift247 marks, Inter, and existing shadcn tokens. No second palette.
- No U+2014 em dash in product copy or repo prose.
- `/` and unknown paths send visitors to `/design`. Flows stays unmounted.

## Test coverage

Every new exported function needs a corresponding test. `npm test` must be green before a PR.

## Things the agent gets wrong

- Remounting `src/pages/Flows.tsx` as `/` or `/flows`. The product opens on Flow Design.
- Using `public/image.png` as the Swift247 brand. That file is the SmartKargo wordmark.
