# Plan

Linear: RDS-1022
Source: docs/changes/RDS-1022-sample-order-run/spec.md
Status: accepted
Date: 2026-09-22

## Files to change, in order

1. `docs/changes/RDS-1022-sample-order-run/intent.md` (new): problem
2. `docs/changes/RDS-1022-sample-order-run/spec.md` (new): approach
3. `docs/changes/RDS-1022-sample-order-run/plan.md` (new): this file
4. `src/product/sampleOrder.test.js` (new): red pack match, apply, result copy, gate composition
5. `src/product/sampleOrder.js` (new): `matchSamplePack`, `findingsForSamplePack`, `applySamplePack`, `describeSampleResult`
6. `src/product/sampleOrder.d.ts` (new): types for TS callers
7. `public/sample-order/` (new): `declaration.pdf`, `invoice.pdf`, `parcel-photo.jpg`, `SW247-sample-pack.zip`
8. `src/data/shipments.ts` (edit): add `createSampleShipment()` using `SAMPLE_PACK`
9. `src/contexts/WorkflowContext.tsx` (edit): `attachSamplePack`, `resetSampleOrder`
10. `src/components/SampleOrderRun.tsx` (new): upload, run, result panel
11. `src/pages/FlowDesign.tsx` (edit): mount the panel; bind canvas to the sample after it leaves draft
12. `AGENTS.md` (edit): name the sampleOrder seam
13. `PRODUCT.md` (edit): sample run lives on Flow Design

## Seams under test

- Seam: `matchSamplePack`, `findingsForSamplePack`, `applySamplePack`, `describeSampleResult` in `src/product/sampleOrder.js`
- Seam: `decideCargoGate` (existing). Complete pack -> `compliance_ok`. Incomplete pack -> `flagged`
- Seam: `appPageRoutes` (existing, unchanged). No `/flows`. `/` is `/design`

## Tests that must pass before this plan is considered done

- `npm test`
- New test: three expected names match complete
- New test: zip name matches complete
- New test: case-insensitive basename and nested path
- New test: missing invoice yields a finding with `requiredDoc: INVOICE`
- New test: `applySamplePack` plus `decideCargoGate` clears or flags
- New test: `describeSampleResult` copy for idle, checking, cleared, flagged
- `node scripts/assert-no-legacy-routes.mjs`
- `node scripts/assert-product-invariants.mjs`
- `npm run build`

## Rollback

Revert the squash on `main`. Vercel publishes the previous production SHA.

## Notes

Riskiest step first. Pack matching tests, then the functions, then the panel. Rejected a new route (`smallest-diff`). Rejected a backend. Files never leave the browser.
