---
name: grill-spec
description: Stress-test a draft spec or plan before the human accepts it. Use at the Design or Build accept gate, or when the user says grill, challenge, or sharpen the design.
---

# Grill spec

Interview relentlessly until open decisions are settled. Do not write code.

## Rules

1. Ask the whole **frontier** (every question whose prerequisites are already answered) in one round.
2. Number each question. Give your recommended answer under each.
3. Wait for the human. Then recompute the frontier.
4. Look up facts yourself (codebase, configs, a quick prototype). Only ask the human for product or preference decisions no experiment can settle.
5. If a fork is empirical (behavior, layout, timing), sketch it cheaply and let the result decide. Do not ask the human to guess.
6. Done when the frontier is empty and the human confirms shared understanding.
7. Write accepted answers back into `spec.md` (or `plan.md`) Open concerns / Rejected alternatives / Risks.
8. Prefer `smallest-diff` when choosing among designs.

## Round format

```
Q1 - <title>: <body>

Recommended: <your answer>

---

Q2 - <title>: <body>

Recommended: <your answer>
```

## Always probe

- What breaks if this is wrong?
- What did we reject and why?
- Auth, data, money, migrations, blast radius
- Smallest shippable slice vs speculative generality

Stop when the human accepts the updated artifact.
