---
name: tdd
description: Test-first implementation. Use when implementing from plan.md, fixing bugs with a regression test, or when the user mentions TDD or red-green.
---

# TDD

Red before green. One vertical slice at a time. Adapted for Monad Build and Maintain.

## Before any test

1. Read `plan.md` "Tests that must pass" and `AGENTS.md`.
2. Name the **seams** (public boundaries) under test. Prefer existing seams. Confirm with the human if unclear.
3. Do not write tests against private internals.

## Loop

1. Write one failing test that describes user-visible behavior (red).
2. Run it. Show the failure.
3. Write the minimum code to pass (green).
4. Run it. Show the pass.
5. Next slice. Do not bulk-write all tests first.

## Good tests

- Read like a specification: "user can checkout with a valid cart".
- Assert through the public interface the way callers do.
- Expected values are literals or worked examples from the spec. If the test would still pass when every imported function returned `undefined`, rewrite or delete it.
- Test behavior, not implementation.

## Anti-patterns

- Tests coupled to private methods or internal mocks that break on harmless refactors.
- Tautological asserts (`expect(add(a,b)).toBe(a+b)`).
- Horizontal slicing: all tests then all code.
- Tests that only prove "it didn't throw".

## Monad rules

- The first Maintain test is a regression that fails before the fix and passes after. Prefer that failing commit before the fix commit in history when practical.
- Update `plan.md` if new seams or tests appear.
- After green, run `prove-it` on the real surface before claiming done.
- Refactor after green only when the human asks; review catches structure issues.
