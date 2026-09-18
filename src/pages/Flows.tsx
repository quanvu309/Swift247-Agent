import React from 'react';
import { Link } from 'react-router-dom';
import { motion, type MotionProps } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PipelineHero } from '../components/PipelineHero';
import { Button } from '../components/ui/Button';
import { flows, type FlowSummary } from '../data/flows';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { cn } from '../utils/cn';

const values = [
  {
    n: '01',
    title: 'Documents become facts',
    copy: 'The agent reads the ID, invoice, packing list, and item photo. Low-confidence fields surface in the run. They do not silently pass.'
  },
  {
    n: '02',
    title: 'Rules fire before pickup',
    copy: 'Dangerous goods, restricted items, and destination limits are checked against SmartKargo before a driver is assigned.'
  },
  {
    n: '03',
    title: 'CX only sees exceptions',
    copy: 'A clean order is cleared. A problem becomes a drafted customer message in Approvals. Pickup stays on schedule.'
  }
];

const steps = [
  {
    n: '01',
    title: 'The order arrives',
    copy: 'App, website, Shopee, TikTok Shop, or the partner counter. The lane starts when the shipper submits.'
  },
  {
    n: '02',
    title: 'The agent reads',
    copy: 'Every attached file is extracted. Names, goods, batteries, liquids. The record is what the documents say, not what the form guessed.'
  },
  {
    n: '03',
    title: 'The rules decide',
    copy: 'Reference data from SmartKargo is applied once. Pass, or flag. No informal exception on the dock.'
  },
  {
    n: '04',
    title: 'The lane ends',
    copy: 'Clear writes the order status. Flag drafts the ask and waits for CX. The truck does not leave on an unchecked file.'
  }
];

function reveal(reduce: boolean, delay = 0): MotionProps {
  if (reduce) return { initial: false };
  return {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.28 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }
  };
}

function statusLabel(status: FlowSummary['status']) {
  if (status === 'active') return 'Live';
  if (status === 'paused') return 'Paused';
  return 'Draft';
}

export function Flows() {
  const reduce = usePrefersReducedMotion();
  const featured = flows[0];
  const rest = flows.slice(1);

  return (
    <div className="sas-landing">
      <section className="relative overflow-hidden px-5 pb-16 pt-8 md:px-8 md:pb-20 md:pt-10 lg:px-12">
        <div aria-hidden="true" className="sas-pack-grid pointer-events-none absolute inset-0" />

        <div className="relative mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <motion.div
            {...(reduce ?
            { initial: false } :
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            })}>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--brand-magenta)]">
              Swift247 Agent System
            </p>
            <h1 className="font-heading mt-5 max-w-[14ch] text-[2.45rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.65rem]">
              Every parcel checked before pickup.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
              One agent flow reads the documents, applies the cargo rules, and either clears the order or drafts the customer message. CX steps in only when the file is unsure.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild className="h-11 rounded-full px-5">
                <Link to="/design?flow=full">
                  Open the default flow
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-11 rounded-full px-5">
                <a href="#how">How it works</a>
              </Button>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-6 text-muted-foreground">
              SAS sits between the shipper and SmartKargo. The truck does not leave on an unchecked file.
            </p>
          </motion.div>

          <motion.div
            {...(reduce ?
            { initial: false } :
            {
              initial: { opacity: 0, y: 28 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }
            })}>
            <PipelineHero />
          </motion.div>
        </div>
      </section>

      <section aria-labelledby="value-heading">
        <div className="border-y border-border">
          <div className="mx-auto grid max-w-[1180px] lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
            <div className="flex flex-col justify-between gap-8 bg-[var(--brand-lavender)] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--brand-magenta)]">Value</p>
                <h2 id="value-heading" className="font-heading mt-4 max-w-[12ch] text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  Pickup stays honest.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                The platform is not a run counter. It is the check that has to happen before a parcel is allowed on a truck.
              </p>
            </div>
            <div className="grid sm:grid-cols-3">
              {values.map((item, index) =>
              <motion.article
                key={item.n}
                {...reveal(reduce, index * 0.08)}
                className={cn(
                  'flex flex-col justify-between gap-10 px-5 py-10 text-white md:px-6 lg:py-16',
                  index === 0 && 'bg-[var(--brand-purple)]',
                  index === 1 && 'bg-[var(--brand-magenta)]',
                  index === 2 && 'bg-[var(--brand-orange)] text-foreground'
                )}>
                <p className={cn(
                  'font-mono text-[11px] tracking-[0.2em]',
                  index === 2 ? 'text-foreground/55' : 'text-white/55'
                )}>
                  {item.n}
                </p>
                <div>
                  <h3 className="font-heading text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className={cn('mt-3 text-sm leading-6', index === 2 ? 'text-foreground/80' : 'text-white/80')}>
                    {item.copy}
                  </p>
                </div>
              </motion.article>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="how" aria-labelledby="how-heading" className="px-5 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <motion.div {...reveal(reduce)} className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--brand-magenta)]">How it works</p>
            <h2 id="how-heading" className="font-heading mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Four beats. Then a gate.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              The same language as the canvas. Order, read, rules, decide. Then clear or flag.
            </p>
          </motion.div>

          <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 top-5 hidden h-px bg-border xl:block" />

            {steps.map((step, index) =>
            <motion.li key={step.n} {...reveal(reduce, index * 0.07)} className="relative">
                <span className="relative z-[1] mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background font-mono text-xs tracking-wider text-foreground">
                  {step.n}
                </span>
                <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.copy}</p>
              </motion.li>
            )}
          </ol>
        </div>
      </section>

      <section id="lanes" aria-labelledby="lanes-heading" className="border-t border-border px-5 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <motion.div {...reveal(reduce)} className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--brand-magenta)]">Lanes</p>
              <h2 id="lanes-heading" className="font-heading mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Flows as products.
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Each lane is a way the agent can run. Open one to see the canvas.
              </p>
            </div>
            <Button variant="outline" asChild className="rounded-full">
              <Link to="/design">Open Flow Design</Link>
            </Button>
          </motion.div>

          {featured ?
          <motion.div {...reveal(reduce, 0.08)} className="mt-10">
              <Link
                to={`/design?flow=${featured.id}`}
                className="group grid overflow-hidden rounded-[1.25rem] border border-border bg-[var(--brand-lavender)] transition-colors hover:border-[var(--brand-magenta)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <div className="flex flex-col justify-between gap-8 px-6 py-8 md:px-8 md:py-10">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--brand-magenta)]">
                      01 · {statusLabel(featured.status)}
                    </p>
                    <h3 className="font-heading mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                      {featured.name}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{featured.promise}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{featured.outcome}</p>
                    <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-magenta)]">
                      Open this flow
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-end gap-3 border-t border-border px-6 py-8 md:px-8 lg:border-l lg:border-t-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">On this lane</p>
                  <ol className="space-y-2">
                    {featured.steps.map((step, index) =>
                    <li key={step} className="flex items-baseline gap-3 text-sm text-foreground">
                        <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
                        {step}
                      </li>
                    )}
                  </ol>
                  <p className="mt-4 text-xs leading-5 text-muted-foreground">
                    Trigger {featured.trigger}. {featured.channels.join(', ')}.
                  </p>
                </div>
              </Link>
            </motion.div> :
          null}

          <ul className="mt-4 divide-y divide-border border-y border-border">
            {rest.map((flow, index) =>
            <motion.li key={flow.id} {...reveal(reduce, 0.04 * index)}>
                <Link
                  to={`/design?flow=${flow.id}`}
                  className="group flex flex-col gap-4 py-6 transition-colors hover:bg-[var(--brand-lavender)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:gap-8">
                  <p className="w-16 shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    0{index + 2}
                  </p>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">{flow.name}</h3>
                      <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {statusLabel(flow.status)}
                      </span>
                    </div>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{flow.promise}</p>
                    <p className="mt-2 text-sm text-foreground">{flow.outcome}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-[var(--brand-magenta)]">
                    Open flow
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </motion.li>
            )}
          </ul>
        </div>
      </section>

      <section className="bg-[var(--brand-purple)] px-5 py-14 text-white md:px-8 md:py-16 lg:px-12">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--brand-orange)]">Next</p>
            <p className="font-heading mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
              Exceptions stay in Approvals. Pickup stays on the clock.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            <Link to="/design?flow=full" className="underline-offset-4 hover:text-white hover:underline">
              Default flow
            </Link>
            <Link to="/executions" className="underline-offset-4 hover:text-white hover:underline">
              Executions
            </Link>
            <Link to="/approvals" className="underline-offset-4 hover:text-white hover:underline">
              Approvals
            </Link>
            <Link to="/connections" className="underline-offset-4 hover:text-white hover:underline">
              Connection & sync
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
