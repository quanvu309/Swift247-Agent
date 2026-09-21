# Spec

Linear: RDS-1021
Source: docs/changes/RDS-1021-showcase-scan-docs/intent.md
Status: accepted
Date: 2026-09-21

## Approach

Add one mounted Showcase page at `/showcase`. Keep `/` and unknown paths on `/design`. Flows stays unmounted.

The page is Persuade-mode content inside the existing AppShell: short pitch for the pickup gate, and a stylized scan over a fake shipment document (AWB or invoice fields). The scan mirrors the cargo-check idea: a light band moves across the document, then a quiet gate result (cleared or needs ops). No live OCR.

Motion uses `framer-motion` already in the repo, or CSS keyframes on the same surface. When `prefers-reduced-motion: reduce` is set, skip the sweep and show the final frame plus a short caption so the page stays usable.

Wire the page through the existing seams: `appPageRoutes`, the `pages` map in `App.tsx`, and a sidebar item in `navGroups`. Prefer Control center lane next to Flow Design. Primary CTA links to `/design`. Brand stays Inter, official marks, existing tokens. No new animation library. No second palette. No U+2014.

Smallest-diff: one new page module, a small scan visual (inline or sibling component), route + nav + tests that assert `/showcase` is mounted and `/` still redirects to `/design`.

## Interfaces affected

- `src/product/appRoutes.js`: add `{ path: '/showcase', page: 'Showcase' }`
- `src/App.tsx`: import and register `Showcase` in `pages`
- `src/data/navigation.ts`: sidebar link labeled Showcase
- New `src/pages/Showcase.tsx` (and optional small scan child under `src/components/`)
- `src/product/*.test.js` and/or assert scripts: route mounted, root still `/design`, Flows still off
- `PRODUCT.md` Operating Context: list `/showcase`

UI of Flow Design, executions, approvals, and other pages does not change.

## Open concerns

1. Route and home. Resolved in grill (A). `/showcase` in-app. `/` stays `/design`.
2. Scan meaning. Resolved in grill (A). Stylized scan over a fake AWB/invoice tied to the cargo-check story, not abstract particles.
3. Reduced motion. Resolved in grill (A). Final frame + short caption.
4. Nav lane. Accepted in this draft: Control center, sibling of Flow Design. Override before accept if wrong.
5. CTA. Accepted in this draft: primary button to `/design`. No fake "Book a demo" or invented metrics.
6. Doc copy. Accepted in this draft: clearly demo fields (no real customer PII). Labels may echo `src/data` shipment vocabulary without quoting invented customers.
7. Motion library. Accepted in this draft: reuse `framer-motion` or CSS only. Do not add Lottie or another dep.

## Explicitly rejected alternatives

- Replace `/` with Showcase (grill B). Breaks PRODUCT.md open-on-canvas rule.
- Public-only page with no sidebar (grill C). Extra shell mode for one page.
- Abstract particle sweep with no readable doc (grill B). Does not show the pickup gate.
- Multi-step storyboard as v1 (grill C). Larger than smallest-diff; can follow later.
- Hide the visual under reduced motion (grill B). Violates usable reduced-motion path.
- Remount Flows as Showcase. Forbidden.
- New animation package. `framer-motion` is already present.

## Risks

- Heavy motion on low-end devices. Keep the scan CSS/transform light; honor reduced-motion.
- Showcase looking like a second homepage. Keep `/` on `/design` and keep pitch short.
- Fake doc mistaken for a real shipment. Label it as demo on the page.
- Route table drift if `App.tsx` gains a page without `appPageRoutes`. Tests must cover both.
- Nav badge noise. Showcase gets no ops/agent badge.

## Sign-off

Quân Vũ accepted in SW Loop, 2026-09-21 ("good"). Gate 1 closed.
