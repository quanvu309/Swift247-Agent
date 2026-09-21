---
name: shipping-check
description: Before claiming work is done or opening a PR, verify tests, plan fidelity, and PR checklist. Use when finishing implementation or preparing a pull request.
---

# Shipping check

Before you say the work is done:

1. Run the commands listed under "Tests that must pass" in `plan.md` (or the test command in `AGENTS.md` for tiny changes). Paste the output.
2. Confirm the diff still matches `plan.md`. If not, update `plan.md` in the same change and say what drifted.
3. Confirm the PR (or draft PR body) has: Linear id, links to intent/spec/plan when they exist, test output, and "Plan still matches diff: yes/no".
4. Do not claim CI will catch it later. Local green is required before push.
5. Run `prove-it` on the matching surface. Paste the command and outcome.
6. Run or request a `review-change` pass (Spec + Standards) before asking the human to merge.
7. Do not deploy. Do not merge unless the human asks.
