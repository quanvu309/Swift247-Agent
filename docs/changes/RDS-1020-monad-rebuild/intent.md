# Intent

Linear: RDS-1020
Author: Cursor cloud agent (assignment)
Status: accepted
Date: 2026-09-21

## Requested by

Quân Vu, operator, 2026-09-21. Cursor Project assignment on Swift247 Agent.

## What they said

Rebuild SAS (Swift247 Agent System) at https://sw247a.vercel.app using the monad method. Repo: https://github.com/quanvu309/Swift247-Agent. Vercel project sw247a, team rickvudev. Monad method: https://github.com/quanvu309/monad

Follow poteto-mode.

Write the plan to the project store docs/monad-rebuild.md then implement it. Keep the plan updated as you learn from the monad repo.

Constraints

- Keep Swift247 brand, official marks, Inter, shadcn tokens
- No em dashes
- Flows stays off the product (landing source may remain unmounted). `/` opens Flow Design unless the monad plan changes that for a stated reason
- Check Granola if there is meeting context on monad or sw247a

Ship a PR, squash-merge, wait for production READY on sw247a.

## What problem this solves

SAS is a live ops product with no Monad kit, no `npm test`, and no named seams. Later changes cannot follow the Monad loop. The product must stay the pickup gate, not a marketing homepage.

## Why now

The operator asked to rebuild SAS with Monad on 2026-09-21, the same day the Monad repo was created.

## Constraints already known

- Official Swift247 marks, Inter, existing shadcn tokens
- No U+2014
- Flows stays unmounted. `/` sends visitors to `/design`
- Granola is unavailable in this cloud run
- Vercel project `sw247a`, team `rickvudev`
- Cloud agent branch names must match `cursor/<slug>-e54e`

## Explicitly out of scope

- Visual redesign of Flow Design or other pages
- Restoring the Flows landing as a mounted route
- Replacing SAS `src/` with the Monad greet sample
- A live analytics backend
- Public Monad, monorepo sync, or model calls in CI
