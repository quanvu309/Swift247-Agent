---
name: smallest-diff
description: Prefer the smallest change that solves the problem. Use when designing an approach, tempted to add abstractions, or reviewing scope creep in a plan or diff.
---

# Smallest diff

Bias to deletion and the smallest change that solves the stated problem.

## Rules

1. State the problem in one sentence from `intent.md` or the Linear issue.
2. List the smallest set of files and symbols that must change. Prefer edit over new layer.
3. Remove dead weight before adding. Delete unused code in the blast radius when safe.
4. Do not add speculative generality, future hooks, or "while we're here" scope.
5. If two approaches work, pick the one with fewer moving parts and less shared mutable state.
6. Encode a repeated instruction as a test, lint, or skill line, not as more prose in the same PR.

## In Monad

- Call this out in `plan.md` Notes when you rejected a larger design.
- `review-change` Spec axis flags scope creep against this rule.
