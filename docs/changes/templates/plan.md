# Plan

Linear: <TEAM>-<N>
Source: docs/changes/<TEAM>-<N>-short-slug/spec.md
Status: draft
Date:

## Files to change, in order

1. `path/to/file` (new|edit): why
2. `path/to/test` (new|edit): why

## Seams under test

Public boundaries where tests observe behavior (not private internals). Confirm with the human if new.

- Seam: ...

## Tests that must pass before this plan is considered done

- Command or test name from AGENTS.md
- New test: behavior to cover (red before green via `tdd`)

## Rollback

How to revert if this ships broken.

## Notes

Optional: riskiest step first, migrations, feature flags, why a larger design was rejected (`smallest-diff`).
