import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { decideCargoGate } from './cargoGate.js';

describe('decideCargoGate', () => {
  it('clears a parcel when there are no findings', () => {
    const gate = decideCargoGate([]);
    assert.equal(gate.stage, 'compliance_ok');
    assert.deepEqual(gate.findings, []);
    assert.equal(gate.steps.flag, 'skipped');
    assert.equal(gate.steps.handoff, 'skipped');
    assert.equal(gate.timelineLabel, 'Cleared. No issues');
  });

  it('flags a parcel when a finding exists', () => {
    const finding = { id: 'F1', title: 'Restricted lithium battery' };
    const gate = decideCargoGate([finding]);
    assert.equal(gate.stage, 'flagged');
    assert.deepEqual(gate.findings, [finding]);
    assert.equal(gate.steps.flag, 'running');
    assert.equal(gate.timelineLabel, '1 issues found');
  });
});
