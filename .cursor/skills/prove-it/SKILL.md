---
name: prove-it
description: Verify work against the real artifact before claiming done. Use after implementation, before opening or merging a PR, or when the user asks if it works.
---

# Prove it

Done means verified on the matching surface, not "it compiles" or "the agent said so".

## Steps

1. Name the claim you are proving (from `plan.md` or the Linear issue).
2. Run the real check: the commands in `plan.md` / `AGENTS.md`, or the same UI/API path a user would hit.
3. Paste the command and outcome. Redact secrets as `<REDACTED>`.
4. Wrong surface or inconclusive is a fail. Say so. Do not round up to a pass.
5. For bugs, the original repro must go green on the same surface used to reproduce.

## Never

- Declare done from typecheck alone when tests exist
- Declare done from a unit test when the bug was in production wiring
- Hand the human a check you could have run yourself
