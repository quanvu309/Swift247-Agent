---
name: diagnose
description: Hard bug and performance diagnosis. Use when something is broken, flaky, slow, or the user says diagnose or debug. Build a tight feedback loop before hypothesizing.
---

# Diagnose

Do not theorize before you have a **tight, red-capable loop**.

## Phase 1: Feedback loop

Build one command you can run that:

- Hits the bug path
- Asserts the user's exact symptom (not merely "didn't crash")
- Is fast and deterministic enough to debug against

Preferred order: failing test, then curl/script, then CLI fixture, then browser script, then throwaway harness.

Show the command and its (redacted) output at least once. Redact secrets as `<REDACTED>`.

If you cannot build a loop, stop, list what you tried, and ask for environment access or a redacted artifact. Do not proceed to Phase 2.

## Phase 2: Reproduce and minimise

Run until red on the user's symptom. Shrink inputs until the smallest scenario still fails.

## Phase 3: Fix

Use `tdd` and `smallest-diff`: failing regression first, then the smallest fix the evidence justifies, then green. No belt-and-suspenders "might help" changes. Wire the regression into `plan.md` Tests that must pass.

If two or more fixes that share the same premise have already failed, stop. Question the premise. Take a census of what still holds the wrong state before writing another fix.

## Phase 4: Prove and learn

Run `prove-it` on the same surface as the repro. Then: if the same mistake could recur, add one line under `AGENTS.md` "Things the agent gets wrong". If it already happened in another product, promote to a Monad skill.

## Never

- Guess from reading code without a red loop
- Paste secrets into chat or commits
- Call the bug fixed without the loop going green
