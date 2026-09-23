import React from 'react';
import { Check, CircleDashed, Loader2, MinusCircle } from 'lucide-react';
import { AgentStep } from '../types/cargo';
import { cn } from '../utils/cn';

function StatusIcon({ status }: {status: AgentStep['status'];}) {
  if (status === 'done') return <Check className="h-3.5 w-3.5" aria-hidden="true" />;
  if (status === 'running') return <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />;
  if (status === 'skipped') return <MinusCircle className="h-3.5 w-3.5" aria-hidden="true" />;
  return <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />;
}

export function StepTracker({ steps, compact = false }: {steps: AgentStep[];compact?: boolean;}) {
  return (
    <ol className="space-y-0" aria-label="Workflow progress">
      {steps.map((step, i) =>
      <li key={step.key} className="relative flex gap-3 pb-4 last:pb-0">
          {i < steps.length - 1 ?
        <span
          aria-hidden="true"
          className={cn(
            'absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-px',
            step.status === 'done' ? 'bg-foreground/40' : 'bg-border'
          )} /> :

        null}
          <span
          className={cn(
            'relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
            step.status === 'done' && 'border-transparent bg-primary text-primary-foreground',
            step.status === 'running' && 'border-transparent bg-brand-orange text-white',
            step.status === 'pending' && 'border-border bg-background text-muted-foreground',
            step.status === 'skipped' && 'border-dashed border-border bg-muted text-muted-foreground'
          )}>
          
            <StatusIcon status={step.status} />
          </span>
          <div className="min-w-0 pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-foreground">{step.label}</p>
              {step.owner === 'cx' ?
            <span className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                  Ops
                </span> :
            null}
              {step.status === 'running' ?
            <span className="rounded-md bg-brand-orange/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-brand-orange">
                  Running
                </span> :
            null}
            </div>
            {!compact ? <p className="text-xs text-muted-foreground">{step.detail}</p> : null}
          </div>
        </li>
      )}
    </ol>);

}