# Spec

Linear: RDS-1022
Source: docs/changes/RDS-1022-sample-order-run/intent.md
Status: accepted
Date: 2026-09-22

## Approach

Add one sample shipment and one downloadable document pack. Put a small run panel on Flow Design. The user uploads files in the browser, the panel attaches those names to the sample order, then `WorkflowContext.runCheck` calls existing `decideCargoGate`.

Name the data shape in `src/product/sampleOrder.js`.

1. `SAMPLE_PACK` is three files: `declaration.pdf` (ITEM_DECLARATION), `invoice.pdf` (INVOICE), `parcel-photo.jpg` (PARCEL_PHOTO). `SW247-sample-pack.zip` is the same pack as one file.
2. `matchSamplePack(fileNames)` compares basenames, case-insensitive. Nested paths use the basename. The zip name counts as a complete pack.
3. `findingsForSamplePack(match)` returns `[]` when complete. Each missing file becomes a critical OCR finding with `requiredDoc`.
4. `applySamplePack(shipment, fileNames, uploadedAt)` writes `submitted`, updates `docs`, and sets `pendingFindings` from the match.
5. `describeSampleResult(stage, findings)` is the copy the panel shows: idle, attached, checking, cleared, or flagged.

Complete pack plus `decideCargoGate` yields `compliance_ok`. Incomplete pack yields `flagged`. Files are not uploaded to a server. Bytes are not parsed.

The sample order is `SW247-SAMPLE-01` / `shp-sample`: cotton shirts, SGN to HAN, same-day, not restricted, value under the KYC threshold. It is added to `initialShipments`. The other demo orders stay.

The panel sits on the canvas (React Flow `Panel`). No new route. `/` stays `/design`. Flows stays unmounted.

While the sample is not `draft`, the canvas binds to it so node status and the result stay on the same order.

## Interfaces affected

- New `src/product/sampleOrder.js` (seam) and tests
- `src/data/shipments.ts` adds the sample shipment
- `src/contexts/WorkflowContext.tsx` exposes `attachSamplePack` and `resetSampleOrder`
- `src/pages/FlowDesign.tsx` mounts the panel
- `public/sample-order/` holds the pack files
- `AGENTS.md` names the new seam
- `PRODUCT.md` mentions the sample run on Flow Design

`decideCargoGate` and `appPageRoutes` do not change.

## Open concerns

1. New route vs panel. Resolved. Panel on Flow Design. `/` stays `/design`.
2. Replace existing demo orders. Resolved. Add one sample. Leave o1-o5.
3. Require a complete pack before Run. Resolved. Run with missing files is the flagged path. That is the honest gate.
4. Zip vs three files. Resolved. Either is a complete pack.
5. File bytes. Resolved. Match names only. Do not send files off the machine.
6. Human merge gate. Resolved by the assignment. This run squash-merges and waits for production READY. The PR body records the deviation.
7. RDS-1021 Showcase. Resolved. Out of scope. Do not add `/showcase` or a scan animation.
8. Granola. Resolved. MCP server is not connected.

## Explicitly rejected alternatives

- New `/sample` or `/showcase` route. Assignment allows a tiny surface next to the canvas. A route would fight RDS-1020 and RDS-1021.
- Real OCR or blob storage. Assignment forbids a new backend.
- Deleting the other demo shipments. Larger than the problem.
- Running only when the pack is complete. Hides the flagged result.
- Parsing PDF bytes in the client. Extra code. Names are enough for a mock.
- Changing the canvas Test button into the sample run. Leave Test. The panel has its own Run.

## Risks

- Canvas `activeShipment` prefers flagged orders, so a cleared sample can disappear from the nodes. Bind the canvas to the sample once it leaves `draft`.
- A visitor may upload random files and expect OCR. Copy must say the sample pack is matched by file name.
- RDS-1021 may also edit `appRoutes` / `FlowDesign`. Stay off those route files except existing canvas wiring.

## Sign-off

Assignment said write the store how-to then implement. Treated as accept spec and accept plan for RDS-1022 on 2026-09-22.
