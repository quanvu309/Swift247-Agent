import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { decideCargoGate } from './cargoGate.js';
import {
  SAMPLE_PACK,
  SAMPLE_PACK_HREF,
  SAMPLE_PACK_ZIP,
  applySamplePack,
  describeSampleResult,
  findingsForSamplePack,
  matchSamplePack
} from './sampleOrder.js';

const completeNames = SAMPLE_PACK.map((item) => item.fileName);

describe('matchSamplePack', () => {
  it('treats the three expected names as a complete pack', () => {
    const match = matchSamplePack(completeNames);
    assert.equal(match.complete, true);
    assert.deepEqual(match.missing, []);
    assert.deepEqual(match.matched, completeNames);
  });

  it('treats the sample zip as a complete pack', () => {
    const match = matchSamplePack([SAMPLE_PACK_ZIP]);
    assert.equal(match.complete, true);
    assert.equal(match.via, 'zip');
    assert.deepEqual(match.missing, []);
  });

  it('matches case-insensitive basenames and nested paths', () => {
    const match = matchSamplePack(['Folder/Declaration.PDF', 'INVOICE.PDF', 'tmp/parcel-photo.JPG']);
    assert.equal(match.complete, true);
  });

  it('lists missing files when the invoice is absent', () => {
    const match = matchSamplePack(['declaration.pdf', 'parcel-photo.jpg']);
    assert.equal(match.complete, false);
    assert.deepEqual(match.missing, ['invoice.pdf']);
  });
});

describe('findingsForSamplePack', () => {
  it('returns no findings for a complete pack', () => {
    assert.deepEqual(findingsForSamplePack(matchSamplePack(completeNames)), []);
  });

  it('flags a missing invoice with requiredDoc INVOICE', () => {
    const findings = findingsForSamplePack(matchSamplePack(['declaration.pdf', 'parcel-photo.jpg']));
    assert.equal(findings.length, 1);
    assert.equal(findings[0].requiredDoc, 'INVOICE');
    assert.equal(findings[0].code, 'MISSING_INVOICE');
  });
});

describe('applySamplePack', () => {
  const base = {
    id: 'shp-sample',
    stage: 'draft',
    docs: [],
    pendingFindings: [{ id: 'old' }],
    findings: [{ id: 'old' }]
  };

  it('clears the cargo gate when the pack is complete', () => {
    const next = applySamplePack(base, completeNames, '10:00');
    assert.equal(next.stage, 'submitted');
    const gate = decideCargoGate(next.pendingFindings);
    assert.equal(gate.stage, 'compliance_ok');
    assert.equal(gate.timelineLabel, 'Cleared. No issues');
    assert.equal(
      next.docs.every((doc) => doc.status === 'processing'),
      true
    );
  });

  it('flags the cargo gate when a pack file is missing', () => {
    const next = applySamplePack(base, [], '10:00');
    const gate = decideCargoGate(next.pendingFindings);
    assert.equal(gate.stage, 'flagged');
    assert.equal(gate.findings.length, 3);
  });
});

describe('describeSampleResult', () => {
  it('asks for an upload while idle', () => {
    const result = describeSampleResult('draft', []);
    assert.equal(result.tone, 'idle');
    assert.equal(result.headline, 'Upload the sample pack');
  });

  it('reports checking while the flow runs', () => {
    const result = describeSampleResult('checking', []);
    assert.equal(result.tone, 'running');
    assert.equal(result.headline, 'Checking documents');
  });

  it('reports a cleared parcel', () => {
    const result = describeSampleResult('compliance_ok', []);
    assert.equal(result.tone, 'cleared');
    assert.equal(result.headline, 'Cleared. No issues');
    assert.equal(result.detail, 'This parcel may go to pickup.');
  });

  it('reports a flagged parcel with a count', () => {
    const result = describeSampleResult('flagged', [{ id: 'a' }, { id: 'b' }]);
    assert.equal(result.tone, 'flagged');
    assert.equal(result.headline, '2 issues found');
  });
});

describe('sample pack public path', () => {
  it('serves the zip from /sample-order', () => {
    assert.equal(SAMPLE_PACK_HREF, '/sample-order/SW247-sample-pack.zip');
  });
});
