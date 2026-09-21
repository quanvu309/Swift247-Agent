import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { SCAN_REDUCED_MOTION_CAPTION, scanMotionMode } from '../product/scanMotion.js';
import { Badge } from './ui/Badge';

const SCAN_SWEEP_SECONDS = 2.3;
const SCAN_BAND_PX = 10;

const demoFields = [
  { label: 'AWB', value: 'SW247-DEMO-0001' },
  { label: 'Order', value: 'DEMO-ORD-0001' },
  { label: 'Lane', value: 'SGN to HAN' },
  { label: 'Service', value: 'Same-day' },
  { label: 'Channel', value: 'Swift247 app' },
  { label: 'Item', value: 'Clothing, 2 items' },
  { label: 'Weight', value: '2.1 kg' },
  { label: 'Declared value', value: 'Demo amount' },
  { label: 'Shipper', value: 'Demo shipper' },
  { label: 'Consignee', value: 'Demo consignee' }
] as const;

export function ShowcaseScanDoc() {
  const reduce = usePrefersReducedMotion();
  const mode = scanMotionMode(reduce);
  const [swept, setSwept] = useState(mode === 'final-frame');
  const showResult = mode === 'final-frame' || swept;

  useEffect(() => {
    if (mode === 'final-frame') setSwept(true);
  }, [mode]);

  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary px-5 py-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
            Demo air waybill
          </p>
          <p className="font-heading text-sm font-semibold tracking-tight text-foreground">
            Invoice and AWB fields
          </p>
        </div>
        <Badge variant="secondary">Demo</Badge>
      </div>

      <div className="relative overflow-hidden">
        {mode === 'sweep' && !swept ?
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 z-10"
          style={{
            height: SCAN_BAND_PX,
            backgroundColor: '#5B1A63',
            boxShadow: '0 12px 18px rgba(142, 31, 110, 0.45)'
          }}
          initial={{ top: -SCAN_BAND_PX }}
          animate={{ top: '100%' }}
          transition={{ duration: SCAN_SWEEP_SECONDS, ease: [0.4, 0, 0.2, 1] }}
          onAnimationComplete={() => setSwept(true)} /> :
        null}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 px-5 py-5 sm:px-6">
          {demoFields.map((field) =>
          <div key={field.label} className="min-w-0 space-y-1">
              <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                {field.label}
              </dt>
              <dd className="truncate font-mono text-sm text-foreground">{field.value}</dd>
            </div>
          )}
        </dl>

        <div className="border-t border-border px-5 py-4 sm:px-6" aria-live="polite">
          {showResult ?
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-foreground">Cleared. No issues</p>
                <p className="text-xs text-muted-foreground">Demo gate. Courier can collect.</p>
              </div>
            </div> :

          <p className="text-sm text-muted-foreground">Reading the demo file.</p>
          }
        </div>
      </div>

      {mode === 'final-frame' ?
      <figcaption className="border-t border-border px-5 py-3 text-xs text-muted-foreground sm:px-6">
          {SCAN_REDUCED_MOTION_CAPTION}
        </figcaption> :
      null}
    </figure>
  );
}
