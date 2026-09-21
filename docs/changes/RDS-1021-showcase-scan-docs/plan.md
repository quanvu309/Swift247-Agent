# Plan

Linear: RDS-1021
Source: docs/changes/RDS-1021-showcase-scan-docs/spec.md
Status: accepted
Date: 2026-09-21

## Files to change, in order

1. `docs/changes/RDS-1021-showcase-scan-docs/plan.md` (new): this file
2. `src/product/appRoutes.test.js` (edit): assert `/showcase` is a page route and still assert `/` redirects to `/design`, Flows unmounted
3. `src/product/appRoutes.js` (edit): add `{ path: '/showcase', page: 'Showcase' }` (keep `/design` first)
4. `src/components/ShowcaseScanDoc.tsx` (new): fake AWB/invoice card, scan light band via `framer-motion` or CSS, final gate result, `prefers-reduced-motion` jumps to final frame + caption
5. `src/pages/Showcase.tsx` (new): Persuade pitch inside AppShell, demo label on the doc, primary CTA to `/design`, compose `ShowcaseScanDoc`
6. `src/App.tsx` (edit): import `Showcase` and register it in `pages`
7. `src/data/navigation.ts` (edit): Control center item sibling of Flow Design, label Showcase, icon `Sparkles` or `ScanSearch`, no badge
8. `PRODUCT.md` (edit): Operating Context lists `/showcase`

No new dependency. No change to Flow Design, Flows, cargo gate, or other pages.

## Seams under test

- Seam: `appPageRoutes`, `ROOT_REDIRECT`, `CATCH_ALL_REDIRECT`, `isPageRoute` in `src/product/appRoutes.js`
- Seam: Showcase mount path `/showcase` registered in `appPageRoutes` and `App.tsx` `pages` map
- Seam (optional pure helper if extracted): reduced-motion choice for the scan (animate vs final-frame). Prefer a tiny exported helper with a unit test rather than asserting DOM motion.

## Tests that must pass before this plan is considered done

- `npm test`
- New/extended test: `isPageRoute('/showcase')` is true and an `appPageRoutes` entry has `page: 'Showcase'`
- Existing tests still green: `/` and `*` redirect to `/design`, Flows not mounted, `/design` remains first page route
- `node scripts/assert-no-legacy-routes.mjs`
- `node scripts/assert-product-invariants.mjs`
- `npm run lint`
- `npm run build`
- Prove-it (after plan accept + code): open `/showcase` on preview, confirm scan or reduced-motion final frame, CTA to `/design`, sidebar Showcase link, `/` still lands on `/design`

## Rollback

Revert the PR squash on `main` (or delete the branch before merge). Vercel publishes the previous production SHA. No data migration.

## Notes

Riskiest step first: red route test for `/showcase`, then green the route table, then page + scan visual, then nav and PRODUCT.md.

Rejected: new animation package, remounting Flows, replacing `/` with Showcase, abstract particle-only scan (spec).

Visible scan band must use solid `bg-primary` / `bg-ring` or inline rgba/hsla (`#5B1A63`, `#8E1F6E`). Opacity slash utilities (`bg-primary/N`, `via-primary/N`) do not exist in the built CSS and are banned for this scan.

TDD order for implementation: fail `appRoutes.test.js` on `/showcase`, update `appRoutes.js`, build page modules, wire `App.tsx` and nav last.

## Sign-off

Quân Vũ accepted Gate 2 in SW Loop, 2026-09-21. Status moved from draft to accepted.
