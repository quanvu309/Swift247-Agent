---
name: secure-change
description: Apply baseline security when creating or changing endpoints, auth, data handling, logs, or secrets. Use whenever touching security-sensitive code.
---

# Secure change

When you create or change code that handles requests, data, or credentials:

1. Secrets never enter git, logs, error messages, or client bundles.
2. New endpoints require the product's existing auth. No anonymous routes outside documented health checks.
3. Do not log PII or secrets. Redact tokens and personal identifiers.
4. Validate inputs at the boundary. Reject unknown fields when the product already does.
5. Do not weaken existing auth, authorization, or validation without calling it out in `spec.md` Open concerns and waiting for human acceptance.
6. Prefer the product's existing patterns for crypto, sessions, and money. Do not invent new ones without an explicit plan step.
