import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import type { ProcessSteps } from '../data/flowsLanding';
import { Separator } from './ui/Separator';

const fork = [
  { label: 'Clear', sub: 'Write SmartKargo' },
  { label: 'Flag', sub: 'Draft for CX' }
] as const;

export function PipelineHero({ steps }: { steps: ProcessSteps }) {
  const reduce = usePrefersReducedMotion();

  return (
    <figure
      className="relative w-full overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-sm"
      aria-label="Parcel check pipeline from order created to a clear or flag decision">
      {!reduce ?
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-px bg-primary-foreground/80"
        initial={{ x: '12%' }}
        animate={{ x: ['12%', '88%'] }}
        transition={{ duration: 5.6, repeat: Infinity, ease: 'linear' }} /> :
      null}

      <figcaption className="relative flex items-center justify-between gap-3 border-b border-primary-foreground/15 px-6 py-3 text-[11px] font-medium tracking-[0.14em] text-primary-foreground/80">
        <span>AWB · SAS lane</span>
        <span className="hidden sm:inline">Before pickup</span>
        <span>Clear to fly</span>
      </figcaption>

      <div className="relative flex flex-col gap-8 px-6 py-7 sm:px-8">
        <ol className="relative grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4">
          <span
            aria-hidden="true"
            className="absolute left-[12%] right-[12%] top-4 hidden h-px bg-primary-foreground/20 sm:block" />

          {steps.map((stage) =>
          <li key={stage.order} className="relative flex flex-col gap-2">
              <span className="flex size-8 items-center justify-center rounded-full border border-primary-foreground/25 bg-primary text-[10px] font-medium tabular-nums">
                0{stage.order}
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="font-heading text-sm font-semibold tracking-tight">{stage.shortLabel}</p>
                <p className="text-[11px] text-primary-foreground/80">{stage.shortDetail}</p>
              </div>
            </li>
          )}
        </ol>

        <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-primary-foreground/15">
          {fork.map((end, index) =>
          <div key={end.label} className="relative flex flex-col gap-1 px-4 py-4 sm:px-5">
              {index === 1 ?
              <Separator orientation="vertical" className="absolute inset-y-0 left-0 bg-primary-foreground/15" /> :
              null}
              <p className="text-sm font-semibold tracking-tight">{end.label}</p>
              <p className="text-[11px] text-primary-foreground/80">{end.sub}</p>
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}
