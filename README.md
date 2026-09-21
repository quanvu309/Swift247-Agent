# Swift247 Agent System

SAS is the pickup gate. One agent flow reads shipment documents, applies SmartKargo cargo rules, and either clears the order or drafts a customer message before pickup.

Live: https://sw247a.vercel.app

`/` opens Flow Design. Flows landing source stays in the repo and stays unmounted.

This product follows [Monad](https://github.com/quanvu309/monad). Change artifacts live in `docs/changes/`. Read `AGENTS.md` before editing.

## Commands

```bash
npm install
npm test
npm run dev
npm run build
```

Enable the Monad pre-commit hook:

```bash
git config core.hooksPath .githooks
```
