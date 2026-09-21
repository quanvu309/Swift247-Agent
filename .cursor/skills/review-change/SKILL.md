---
name: review-change
description: Two-axis review of a branch or PR. Use before merge, when reviewing a diff, or when the user asks for a review against REVIEW.md, spec.md, and plan.md.
---

# Review change

Review along **two axes**. Keep them separate. Do not merge or rerank across axes.

## Spec axis

Against `docs/changes/.../spec.md` and `plan.md` (and the Linear issue if linked):

- Requirements missing or partial
- Behavior in the diff that was not asked for (scope creep)
- Requirements that look implemented but look wrong

Quote the spec or plan line for each finding.

## Standards axis

Against `AGENTS.md`, `REVIEW.md`, and product coding standards:

- Documented standard violations (cite the rule)
- Judgement-call smells when no rule exists: mysterious names, duplicated logic, speculative generality, shotgun surgery, feature envy

Repo standards override generic smells. Skip anything CI already enforces.

If the diff touches UI, also apply `ui-craft` and add a Before / After / Why table for motion and press issues.

## Automated review comments

Treat Bugbot and similar comments skeptically. Each finding is fix, dismiss, or ask:

- Fix: real bug or real Spec/Standards miss
- Dismiss: nit, false positive, or already covered by CI (state why in one line)
- Ask: only when a product preference is required

Do not churn the diff for noise.

## Severity

- Important: breaks behavior, leaks data, breaches policy, or misses a plan requirement
- Nit: style and naming; at most five, then a count

## Report shape

```
## Spec
- ...

## Standards
- ...

## Automated comments
- fix / dismiss / ask: ...

## Summary
Spec: N findings (worst: ...). Standards: N findings (worst: ...).
```

Do not approve or merge. The human merges.
