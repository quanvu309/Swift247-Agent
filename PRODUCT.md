# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Ops, CX, and product stakeholders at Swift247. They open Flow Design to see how SAS gates a parcel, then move into executions and approvals. Inferred from the live app. Not a customer interview.

## Product Purpose

SAS is the Swift247 Agent System. One agent flow reads shipment documents, applies SmartKargo cargo rules, and either clears the order or drafts a customer message before pickup. Success is an honest gate. A truck does not leave on an unchecked file.

The product opens on Flow Design. There is no Flows landing or run-volume homepage. Flow Design has a sample order run: upload one document pack, run the cargo gate, and read the result.

## Positioning

The product sits between the shipper and SmartKargo. CX sees exceptions only. Neighboring ops tools count runs. This one decides whether a parcel is allowed on a truck.

## Operating Context

Vite SPA at https://sw247a.vercel.app. Sticky desktop sidebar. Routes:

- `/` redirects to `/design`
- `/design?flow=<id>` canvas (default `full`)
- `/executions`, `/approvals`, `/connections`, `/orders`, `/account`

Demo data lives in `src/data`. There is no live analytics backend.

## Capabilities and Constraints

- `/` sends visitors to `/design`. Keep `?flow=<id>` on the canvas. Default template is `full`.
- The sample order run stays on `/design`. Do not add a sample-only route.
- Sidebar has no Flows item. Remaining URLs still match their labels.
- No Flows landing, no second homepage, and no run-volume or KPI Flows page.
- Sticky desktop sidebar stays.
- Official Swift247 marks (`public/swift247-logo.png`, `public/swift247-mark.png`) and Inter stay.
- Copy has no em dash (U+2014).
- Reduced-motion paths must remain usable.

## Brand Commitments

- Name. Swift247 Agent System (SAS).
- Marks. Official logo and S-mark only. Do not use `public/image.png` as the Swift247 brand. That file is the SmartKargo wordmark.
- Type. Inter for UI and headings. Geist Mono for canvas and measurement labels.
- Palette. Existing CSS variables in `src/index.css`. Primary is `#5B1A63`. Magenta ring `#8E1F6E`. Orange `#F26522`. Destructive `#E23C2C`. Lavender wash `#F6F1F8`.
- Components. Existing shadcn-style primitives in `src/components/ui`. Semantic tokens (`bg-background`, `bg-primary`, `text-muted-foreground`). Do not invent a second design system.

## Evidence on Hand

- Live production. https://sw247a.vercel.app
- Flow copy and steps. `src/data/flows.ts` plus `src/data/flowTemplates.ts`
- Brand assets. `public/swift247-logo.png`, `public/swift247-mark.png`
- No customer quotes, press, or measured conversion data. Do not fabricate them.

## Product Principles

- Open on the canvas. Keep the gate honest.
- Prefer one primary action per region.
- Brand lives in marks, Inter, and the existing tokens. Not in a second palette.
- Demo numbers are not the story.

## Accessibility & Inclusion

WCAG AA contrast for body text. Honor `prefers-reduced-motion`. Keep visible focus rings from the existing Button and link styles. Touch targets on primary CTAs should stay usable on a phone.
