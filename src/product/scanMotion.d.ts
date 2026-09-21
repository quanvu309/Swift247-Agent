export const SCAN_REDUCED_MOTION_CAPTION: string;

export function scanMotionMode(prefersReducedMotion: boolean): 'final-frame' | 'sweep';
