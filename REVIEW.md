# Review instructions

Two-axis review. Keep Spec and Standards separate.

## Spec axis

Does the diff match `spec.md` and `plan.md`?

- Missing or partial requirements
- Scope creep (behavior not asked for)
- Wrong implementation of a stated requirement

Quote the artifact line for each finding.

## Standards axis

Does the diff match `AGENTS.md` and product conventions?

- Documented standard violations
- Security: injection, auth gaps, secrets or PII in logs
- Judgement smells: mysterious names, duplication, speculative generality, shotgun surgery

Repo standards override generic smells.

## Severity

- Important: break behavior, leak data, breach policy, or miss a plan requirement
- Nit: style and naming

## Cap the nits

At most five nits. Summarize the rest as a count.

## Do not report

Generated files and anything CI already enforces (lint, format, typecheck).

## Prompt

Ask Cursor: "Review this diff with the `review-change` skill against `REVIEW.md`, `spec.md`, and `plan.md`."
