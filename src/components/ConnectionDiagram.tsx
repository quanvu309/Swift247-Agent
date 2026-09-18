import React from 'react';
import { ArrowLeftRight, Check } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { cn } from '../utils/cn';

interface ConnectionDiagramProps {
  env: string;
  latencyMs: number;
  uptime: string;
  lastSync: string;
}

const envLabel: Record<string, string> = {
  prod: 'Production',
  uat: 'UAT',
  sandbox: 'Sandbox'
};

/** Visual handshake between the control center and SmartKargo. */
export function ConnectionDiagram({ env, latencyMs, uptime, lastSync }: ConnectionDiagramProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col items-stretch gap-4 p-5 sm:flex-row sm:items-center">
          {/* Left system */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card p-1">
              <img src="/swift247-mark.png" alt="" className="h-full w-full object-contain" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">Control Center</p>
              <p className="truncate text-xs text-muted-foreground">Compliance agent</p>
            </div>
          </div>

          {/* Pipe */}
          <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <div className="relative flex w-full items-center">
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
              <span className="mx-2 flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-chart-2" aria-hidden="true" />
                <ArrowLeftRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              </span>
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              {envLabel[env] ?? env}
            </p>
          </div>

          {/* Right system */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
            <div className="min-w-0 text-right">
              <p className="truncate text-sm font-medium text-foreground">SmartKargo</p>
              <p className="truncate text-xs text-muted-foreground">Cargo platform</p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card p-1.5">
              <img
                src="/image-2.png"
                alt="SmartKargo"
                className="h-full w-full object-contain" />
              
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-border border-t border-border sm:grid-cols-4">
          {[
          { label: 'Status', value: 'Healthy', tone: true },
          { label: 'Latency', value: `${latencyMs} ms` },
          { label: 'Uptime 30d', value: uptime },
          { label: 'Last sync', value: lastSync }].
          map((item) =>
          <div key={item.label} className="px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                {item.label}
              </p>
              <p
              className={cn(
                'mt-0.5 flex items-center gap-1 font-mono text-sm',
                item.tone ? 'text-chart-2' : 'text-foreground'
              )}>
              
                {item.tone ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                {item.value}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>);

}