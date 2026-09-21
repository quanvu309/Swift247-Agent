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

### Motion criteria (amendment, pick 2)

Quân asked for a stronger paper-scan feel on the same PR. Concrete bar for `ShowcaseScanDoc`:

1. **Paper frame.** Demo AWB sits on a clear sheet: card border, light paper shadow, readable field rows. Demo label stays visible so it is not mistaken for a real shipment.
2. **Scan band.** One vertical sweep, top to bottom. Band height about 8 to 12px (or ~3 to 4% of the sheet height). Must be **visibly opaque** in the built CSS: use solid `bg-primary` / `bg-ring` or an inline `rgba`/`hsla` that renders. Do not use Tailwind opacity modifiers such as `bg-primary/25` or `via-primary/70` unless those utilities are confirmed present in the built stylesheet. Soft trail behind the band is allowed only if it also paints. No particle field, no second palette glow.
3. **Timing.** Sweep about 2 to 2.5s once per cycle. After the band finishes, hold the gate result ("Cleared" or equivalent) on screen at least 1.5s before any loop restart.
4. **Reduced motion (grill A, unchanged).** If `prefers-reduced-motion: reduce`, skip the sweep. Show the final frame plus short caption immediately. Page stays usable.
5. **Deps.** Still `framer-motion` or CSS only. No Lottie or new packages.
6. **Prove bar.** Live `/showcase` must show a moving band the eye can follow. Status text change alone is a fail.

## Interfaces affected

- `src/product/appRoutes.js`: add `{ path: '/showcase', page: 'Showcase' }`
- `src/App.tsx`: import and register `Showcase` in `pages`
- `src/data/navigation.ts`: sidebar link labeled Showcase
- New `src/pages/Showcase.tsx` (and optional small scan child under `src/components/`)
- `src/components/ShowcaseScanDoc.tsx`: motion must meet the criteria above
- `src/product/*.test.js` and/or assert scripts: route mounted, root still `/design`, Flows still off
- `PRODUCT.md` Operating Context: list `/showcase`

UI of Flow Design, executions, approvals, and other pages does not change.

## Open concerns

1. Route and home. Resolved in grill (A). `/showcase` in-app. `/` stays `/design`.
2. Scan meaning. Resolved in grill (A). Stylized scan over a fake AWB/invoice tied to the cargo-check story, not abstract particles.
3. Reduced motion. Resolved in grill (A). Final frame + short caption. Unchanged by pick 2.
4. Nav lane. Accepted: Control center, sibling of Flow Design.
5. CTA. Accepted: primary button to `/design`. No fake "Book a demo" or invented metrics.
6. Doc copy. Accepted: clearly demo fields (no real customer PII).
7. Motion library. Accepted: reuse `framer-motion` or CSS only.
8. Motion intensity. Resolved. Pick 2 + Lead bar. Prove GREEN on `8d351e4` (visible solid band).

## Explicitly rejected alternatives

- Replace `/` with Showcase (grill B). Breaks PRODUCT.md open-on-canvas rule.
- Public-only page with no sidebar (grill C). Extra shell mode for one page.
- Abstract particle sweep with no readable doc (grill B). Does not show the pickup gate.
- Multi-step storyboard as v1 (grill C). Larger than smallest-diff; can follow later.
- Hide the visual under reduced motion (grill B). Violates usable reduced-motion path.
- Remount Flows as Showcase. Forbidden.
- New animation package. `framer-motion` is already present.
- Accept the thin first-cut sweep as final (pick 1). Rejected by Quân pick 2.
- Merge thin cut and file a follow-up only (pick 3). Rejected by Quân pick 2.
- Invisible scan via missing `bg-primary/N` utilities. Ship block. Fail prove-it.

## Risks

- Heavy motion on low-end devices. Keep the scan CSS/transform light; honor reduced-motion.
- Showcase looking like a second homepage. Keep `/` on `/design` and keep pitch short.
- Fake doc mistaken for a real shipment. Label it as demo on the page.
- Route table drift if `App.tsx` gains a page without `appPageRoutes`. Tests must cover both.
- Nav badge noise. Showcase gets no ops/agent badge.
- Band still invisible after revise if opacity utilities are used again. Prove-it must confirm a visible moving band, not only status copy.

## Sign-off

Quân Vũ accepted Gate 1 in SW Loop, 2026-09-21 ("good").
Motion amendment (pick 2): Lead locked as bar; Prove GREEN on `8d351e4`. Spec Review pass.
