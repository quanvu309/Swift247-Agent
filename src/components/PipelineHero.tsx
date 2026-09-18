import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { cn } from '../utils/cn';

const stages = [
  { n: '01', label: 'Order', sub: 'Created' },
  { n: '02', label: 'Read', sub: 'Documents' },
  { n: '03', label: 'Check', sub: 'Rules' },
  { n: '04', label: 'Decide', sub: 'Clear or flag' }
];

const fork = [
  { n: 'A', label: 'Clear', sub: 'Write SmartKargo' },
  { n: 'B', label: 'Flag', sub: 'Draft for CX' }
];

export function PipelineHero() {
  const reduce = usePrefersReducedMotion();

  return (
    <figure
      className="relative overflow-hidden rounded-[1.25rem] bg-[var(--brand-purple)] text-white shadow-[0_24px_80px_-28px_rgba(91,26,99,0.65)]"
      aria-label="Parcel check pipeline from order created to a clear or flag decision">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 0 10px, transparent 6px, rgb(91 26 99) 7px)',
          backgroundSize: '100% 20px',
          backgroundRepeat: 'repeat-y'
        }} />

      <div
        aria-hidden="true"
        className="sas-grain pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light" />

      {!reduce ?
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-px bg-[var(--brand-orange)]/80 shadow-[0_0_18px_var(--brand-orange)]"
        initial={{ left: '8%' }}
        animate={{ left: ['8%', '92%'] }}
        transition={{ duration: 5.6, repeat: Infinity, ease: 'linear' }} /> :
      null}

      <figcaption className="relative flex items-center justify-between gap-3 border-b border-white/10 px-7 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
        <span>AWB · SAS lane</span>
        <span className="hidden sm:inline">Before pickup</span>
        <span>Clear to fly</span>
      </figcaption>

      <div className="relative px-6 pb-6 pt-7 sm:px-8">
        <p className="mb-6 max-w-sm text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--brand-orange)]">
          One parcel. One decision.
        </p>

        <ol className="relative grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4">
          <span
            aria-hidden="true"
            className="absolute left-[12%] right-[12%] top-[15px] hidden h-px bg-white/20 sm:block" />

          {!reduce ?
          <motion.span
            aria-hidden="true"
            className="absolute top-[12px] hidden h-1.5 w-1.5 rounded-full bg-[var(--brand-orange)] shadow-[0_0_12px_var(--brand-orange)] sm:block"
            initial={{ left: '12%' }}
            animate={{ left: ['12%', '84%'] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }} /> :
          null}

          {stages.map((stage, index) =>
          <li key={stage.n} className="relative">
              <motion.span
                className={cn(
                  'mb-3 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white/25 bg-[var(--brand-purple)] font-mono text-[10px] tracking-wider text-white'
                )}
                animate={reduce ? undefined : { scale: index === 3 ? [1, 1.08, 1] : 1 }}
                transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeOut' }}>
                {stage.n}
              </motion.span>
              <p className="font-heading text-sm font-semibold tracking-tight">{stage.label}</p>
              <p className="mt-0.5 text-[11px] text-white/60">{stage.sub}</p>
            </li>
          )}
        </ol>

        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10">
          {fork.map((end) =>
          <div key={end.n} className="bg-[var(--brand-purple)] px-4 py-4 sm:px-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">{end.n}</p>
              <p className="mt-1 text-sm font-semibold tracking-tight">{end.label}</p>
              <p className="mt-0.5 text-[11px] text-white/60">{end.sub}</p>
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}
