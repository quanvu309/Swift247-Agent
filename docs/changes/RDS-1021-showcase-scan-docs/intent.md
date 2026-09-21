# Intent

Linear: RDS-1021
Author: SW Spec
Status: draft
Date: 2026-09-21

## Requested by

Quân Vũ, operator, 2026-09-21. SW Loop room.

## What they said

> Hello, i want to create good Showcase page for this app. This will be have a stunning scan docs animaton

Source: SW Loop, filed as [RDS-1021](https://linear.app/quanvm/issue/RDS-1021).

## What problem this solves

SAS has no Showcase surface. Visitors land on Flow Design. There is nowhere to show the pickup gate story with a scan-docs moment that matches the brand.

## Why now

Quân asked for it in SW Loop on 2026-09-21. Lead sized it normal.

## Constraints already known

- Official Swift247 marks, Inter, existing shadcn tokens. Primary `#5B1A63`.
- No U+2014 em dash.
- Flows stays unmounted. `/` keeps sending visitors to `/design`.
- Honor `prefers-reduced-motion`. Page must stay usable without motion.
- No remounting Flows. No second palette.
- Demo data only. Do not invent customer quotes or metrics.

## Explicitly out of scope

- Remounting `src/pages/Flows.tsx` or making Showcase the new `/` homepage (unless Quân overrides in grill).
- Live document OCR or a real scanner backend.
- Redesigning Flow Design, executions, approvals, or other existing pages.
- A second design system or new animation library unless the spec accepts one.
