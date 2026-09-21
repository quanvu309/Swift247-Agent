# Plan

Linear: RDS-1020
Source: docs/changes/RDS-1020-monad-rebuild/spec.md
Status: accepted
Date: 2026-09-21

## Files to change, in order

1. `docs/changes/RDS-1020-monad-rebuild/intent.md` (new): problem
2. `docs/changes/RDS-1020-monad-rebuild/spec.md` (new): approach
3. `docs/changes/RDS-1020-monad-rebuild/plan.md` (new): this file
4. Monad kit paths (new): skills, `sdlc.mdc`, `REVIEW.md`, PR template, CI, pre-commit, issue-tracker, templates
5. `AGENTS.md` (new): SAS commands and layout
6. `.linear.toml` (new): `RDS` / `quanvm`
7. `monitoring/bands.yaml` (new): `sw247a` bands
8. `README.md` (edit): replace Magic Patterns boilerplate
9. `package.json` (edit): add `test`
10. `src/product/appRoutes.test.js` (new): red route table tests
11. `src/product/appRoutes.js` (new): route table
12. `src/product/cargoGate.test.js` (new): red cargo gate tests
13. `src/product/cargoGate.js` (new): `decideCargoGate`
14. `src/App.tsx` (edit): render the route table
15. `src/contexts/WorkflowContext.tsx` (edit): call `decideCargoGate`
16. `scripts/assert-product-invariants.mjs` (new): Inter, mark, no Flows label, no U+2014
17. `scripts/assert-no-legacy-routes.mjs` (edit): still requires `/` to `/design`
18. `tsconfig.json` (edit): `allowJs` so App can import the seams

## Seams under test

- Seam: `appPageRoutes`, `ROOT_REDIRECT`, `CATCH_ALL_REDIRECT`, `isPageRoute` in `src/product/appRoutes.js`
- Seam: `decideCargoGate(pendingFindings)` in `src/product/cargoGate.js`

## Tests that must pass before this plan is considered done

- `npm test`
- New test: `/` and `*` redirect to `/design`, `/flows` is not a page route, first mounted path is `/design`
- New test: empty findings clear the parcel (`compliance_ok`, flag skipped). One finding flags the parcel
- `node scripts/assert-no-legacy-routes.mjs`
- `node scripts/assert-product-invariants.mjs`
- `npm run build`

## Rollback

Revert the squash on `main`. Vercel publishes the previous production SHA. Do not leave kit files without the tests that prove the product invariants.

## Notes

Riskiest step first. Route table and cargo gate tests, then the functions, then `App` and `WorkflowContext`. Rejected a page rewrite. Rejected Vitest.
