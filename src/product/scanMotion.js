export const SCAN_REDUCED_MOTION_CAPTION =
  'Motion reduced. The gate result is shown without the scan sweep.';

export function scanMotionMode(prefersReducedMotion) {
  return prefersReducedMotion ? 'final-frame' : 'sweep';
}
