import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SCAN_REDUCED_MOTION_CAPTION, scanMotionMode } from './scanMotion.js';

describe('scan motion', () => {
  it('sweeps when motion is allowed', () => {
    assert.equal(scanMotionMode(false), 'sweep');
  });

  it('jumps to the final frame when motion is reduced', () => {
    assert.equal(scanMotionMode(true), 'final-frame');
  });

  it('keeps a short reduced-motion caption', () => {
    assert.match(SCAN_REDUCED_MOTION_CAPTION, /gate result/i);
    assert.equal(SCAN_REDUCED_MOTION_CAPTION.includes('\u2014'), false);
  });
});
