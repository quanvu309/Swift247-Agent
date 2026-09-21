---
name: change-docs
description: Write or update Monad change artifacts (intent, spec, plan) before coding. Use when starting a Linear issue, planning work, or when docs/changes is missing for non-trivial work.
---

# Change docs

For any change that is not a one-line fix:

1. Confirm the Linear id and create `docs/changes/<TEAM>-<N>-short-slug/` if missing.
2. Write artifacts in order: `intent.md` -> `spec.md` -> `plan.md`.
3. Use the templates under the product (copied from Monad kit templates). Put `Linear: <id>` at the top of each file.
4. Do not write implementation code until the human accepts `plan.md`.
5. Intent states the problem, not the solution.
6. Spec must list open concerns and rejected alternatives. Empty open concerns is a failure; dig harder. Before the human accepts the spec, offer a `grill-spec` round.
7. Plan must list files in order, seams under test, tests that must pass, and rollback. Before the human accepts the plan, offer a short `grill-spec` pass on risks and seams.

Skip artifacts only when the human labels the issue `tiny` and the change is one file with no auth, money, or migration risk.
