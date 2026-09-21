# Spec

Linear: RDS-1020
Source: docs/changes/RDS-1020-monad-rebuild/intent.md
Status: accepted
Date: 2026-09-21

## Approach

Copy the Monad kit into this product at the paths Monad names. Rewrite `AGENTS.md` for Vite, React, and `node --test`. Keep the live screens.

Name two data shapes.

1. `appPageRoutes` plus `ROOT_REDIRECT` and `CATCH_ALL_REDIRECT`. A table of mounted paths. `App` renders that table. `/` and `*` redirect to `/design`. `/flows` is not a page route.
2. `decideCargoGate(pendingFindings)`. A total function over the findings list. Empty list means `compliance_ok`. Any item means `flagged`. `WorkflowContext` calls it at the decision step.

Do not add Vitest or other test runners. Seams are ESM `.js` so Node 20 can import them. Existing `scripts/assert-no-legacy-routes.mjs` stays. A second assert script checks Inter, the mark favicon, no Flows nav label, and no U+2014 under `src/`.

## Interfaces affected

- `src/App.tsx` reads the route table
- `src/contexts/WorkflowContext.tsx` reads `decideCargoGate`
- New `src/product/appRoutes.js` and `src/product/cargoGate.js`
- New `npm test` and GitHub Actions CI
- Product README, `AGENTS.md`, `REVIEW.md`, `.linear.toml`
- `monitoring/bands.yaml` for `sw247a`

UI strings, sidebar labels, official marks, Inter, and shadcn tokens do not change.

## Open concerns

1. Linear team. Resolved. Swift247 work already uses Red Dog Studio (`RDS-1016`). This issue is RDS-1020.
2. Human merge gate. Resolved by the assignment. This run squash-merges and waits for production READY. Monad's default is that the agent never deploys. The PR body records the deviation.
3. Cloud agents. Monad v1 lists them as out of scope. This run is a cloud agent and still copies the kit.
4. Granola. Resolved. MCP server is not connected. No meeting notes found. Spec follows the assignment and `PRODUCT.md`.
5. Delete `Flows.tsx`. Resolved. Leave it unmounted.

## Explicitly rejected alternatives

- Replace SAS with `product-template/src/greet.js`. Camthoi did that because it had no product yet. SAS already has a live canvas.
- Restyle pages with a second palette. Brand constraints forbid it.
- Mount `/` on the Flows landing. PR 10 and `PRODUCT.md` already send `/` to `/design`. Monad does not define product routes.
- Add Vitest. Extra dependency. Monad's seed uses `node --test`.
- Create a new Linear team named SAS. One issue does not earn a team.

## Risks

- CI starts failing on `main` if `npm test` is red. Keep tests deterministic and free of network.
- A future agent might remount Flows if `App.tsx` is edited by hand. The route table test and `assert-no-legacy-routes.mjs` are the guard.
- Pre-commit `npm test` is slower than a no-op hook. That is the Monad kit behavior.

## Sign-off

Assignment said write the store plan then implement. Treated as accept spec and accept plan for RDS-1020 on 2026-09-21.
