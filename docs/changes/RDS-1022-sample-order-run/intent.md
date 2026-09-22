# Intent

Linear: RDS-1022
Author: Cursor cloud agent (assignment)
Status: accepted
Date: 2026-09-22

## Requested by

Quân Vũ, operator, 2026-09-22. Cursor Project assignment on Swift247 Agent.

## What they said

Add a simple SAS demo on https://sw247a.vercel.app (quanvu309/Swift247-Agent, Vercel sw247a / rickvudev).

Quân Vũ asked: one order + one sample document pack. User uploads the pack, runs the flow, gets a result. That is the whole sample.

Follow Monad already on this repo (kit from RDS-1020). One Linear issue on Red Dog Studio, one branch, one PR. Write a how-to then implement.

Do

- One sample order and one document set the user can upload
- Run the existing cargo flow (decideCargoGate / canvas). Show a clear result after the run
- Smallest path that feels real. Client mock is OK if there is still a visible upload + run + result. Do not build a new backend platform
- Keep Swift247 brand, Inter, shadcn tokens, no em dashes
- Flows stays off the product. `/` still opens Flow Design unless this sample needs a tiny run surface next to the canvas

Ship: PR, squash-merge, production READY on sw247a.

## What problem this solves

SAS already decides whether a parcel may go to pickup, but a visitor cannot walk one order from documents to a result. The demo needs a single sample that can be uploaded, run, and read on the canvas.

## Why now

The operator asked for this sample on 2026-09-22, after Monad landed on SAS (RDS-1020).

## Constraints already known

- Official Swift247 marks, Inter, existing shadcn tokens
- No U+2014
- Flows stays unmounted. `/` sends visitors to `/design`
- Client mock is allowed. No new backend
- Vercel project `sw247a`, team `rickvudev`
- Cloud agent branch names must match `cursor/<slug>-e914`
- RDS-1021 Showcase is a different issue

## Explicitly out of scope

- A new OCR, storage, or API platform
- A Showcase marketing page or scan-docs animation (RDS-1021)
- Restoring the Flows landing
- Replacing the existing demo orders
- Changing `/` away from Flow Design
