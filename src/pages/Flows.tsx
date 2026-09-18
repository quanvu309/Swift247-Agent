import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { animate, motion } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { PipelineHero } from '../components/PipelineHero';
import { StageBadge } from '../components/StageBadge';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig } from
'../components/ui/Chart';
import { Switch } from '../components/ui/CSwitch';
import { useWorkflow } from '../contexts/WorkflowContext';
import { FlowSummary, flowKpis, flows as initialFlows, runVolume14d } from '../data/flows';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { cn } from '../utils/cn';

const chartConfig = {
  cleared: { label: 'Cleared', color: 'var(--chart-2)' },
  flagged: { label: 'Flagged', color: 'var(--brand-orange)' }
} satisfies ChartConfig;

function CountUp({ value, format, duration = 0.9 }: {value: number;format: (n: number) => string;duration?: number;}) {
  const reduce = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setShown(value);
      return;
    }
    const control = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: setShown
    });
    return () => control.stop();
  }, [value, duration, reduce]);

  return <>{format(shown)}</>;
}

function sectionMotion(index: number, reduce: boolean) {
  if (reduce) return {};
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: index * 0.06, ease: 'easeOut' }
  };
}

export function Flows() {
  const reduce = usePrefersReducedMotion();
  const navigate = useNavigate();
  const { shipments } = useWorkflow();
  const [rows, setRows] = useState<FlowSummary[]>(initialFlows);
  const kpis = flowKpis(rows);

  const recent = [...shipments].
  sort((a, b) => b.createdAt.localeCompare(a.createdAt)).
  slice(0, 6);

  const toggleStatus = (id: string) => {
    setRows((current) =>
    current.map((flow) => {
      if (flow.id !== id || flow.status === 'draft') return flow;
      return { ...flow, status: flow.status === 'active' ? 'paused' : 'active' };
    })
    );
  };

  return (
    <div className="space-y-8">
      <motion.section {...sectionMotion(0, reduce)} className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="flex flex-col justify-center gap-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Swift247 Agent System
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-[2.35rem] md:leading-tight">
            Every parcel checked before pickup.
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            One flow reads the documents, checks the rules, and either clears the order or drafts a customer message.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/design">Open Flow Design</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/executions">See executions</Link>
            </Button>
          </div>
        </div>
        <PipelineHero />
      </motion.section>

      <motion.section {...sectionMotion(1, reduce)} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
        {
          label: 'Orders checked 7d',
          value: <CountUp value={kpis.orders7d} format={(n) => Math.round(n).toLocaleString()} />,
          hint: kpis.ordersDelta
        },
        {
          label: 'Auto-cleared rate',
          value: <CountUp value={kpis.passRate * 100} format={(n) => `${n.toFixed(1)}%`} />,
          hint: kpis.passDelta
        },
        {
          label: 'Avg check time',
          value: <CountUp value={kpis.avgSeconds} format={(n) => `${n.toFixed(1)}s`} />,
          hint: kpis.timeDelta
        },
        {
          label: 'CX hours saved',
          value: <CountUp value={kpis.hoursSaved} format={(n) => n.toFixed(1)} />,
          hint: kpis.hoursDelta
        }].
        map((kpi) =>
        <Card key={kpi.label}>
            <CardContent className="space-y-1 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{kpi.label}</p>
              <p className="font-heading text-2xl font-semibold tracking-tight text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.hint}</p>
            </CardContent>
          </Card>
        )}
      </motion.section>

      <motion.section {...sectionMotion(2, reduce)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle className="text-base">Run volume</CardTitle>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-[2px] bg-[var(--chart-2)]" />
                Cleared
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-[2px] bg-[var(--brand-orange)]" />
                Flagged
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
              <BarChart accessibilityLayer data={runVolume14d} barCategoryGap="18%">
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent className="sr-only" />} />
                <Bar
                  dataKey="cleared"
                  stackId="runs"
                  fill="var(--color-cleared)"
                  radius={[0, 0, 3, 3]}
                  isAnimationActive={!reduce}
                  animationDuration={700} />
                
                <Bar
                  dataKey="flagged"
                  stackId="runs"
                  fill="var(--color-flagged)"
                  radius={[3, 3, 0, 0]}
                  isAnimationActive={!reduce}
                  animationDuration={700} />
                
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section {...sectionMotion(3, reduce)} className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium text-foreground">Flows</h2>
            <p className="mt-1 text-sm text-muted-foreground">{rows.length} in this workspace</p>
          </div>
          <Button size="sm" asChild>
            <Link to="/design">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              New flow
            </Link>
          </Button>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {rows.map((flow) =>
          <button
            key={flow.id}
            type="button"
            onClick={() => navigate(`/design?flow=${flow.id}`)}
            className="flex w-full items-center gap-4 py-3.5 text-left outline-none transition-colors hover:bg-accent/40 focus-visible:bg-accent/40">
            
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{flow.name}</p>
                  <Badge variant="outline" className="h-5 font-normal">
                    {flow.status}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {flow.description}. {flow.trigger}. {flow.owner}
                </p>
              </div>
              <div className="hidden shrink-0 items-center gap-6 sm:flex">
                <div className="w-20">
                  <p className="font-mono text-xs tabular-nums text-foreground">{flow.runs7d.toLocaleString()}</p>
                  <p className="text-[11px] text-muted-foreground">runs 7d</p>
                </div>
                <div className="w-28">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Pass</span>
                    <span className="font-mono tabular-nums text-foreground">{Math.round(flow.passRate * 100)}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                    className="h-full rounded-full bg-[var(--chart-2)]"
                    style={{ width: `${Math.round(flow.passRate * 100)}%` }} />
                  
                  </div>
                </div>
                <p className="w-24 text-right text-xs text-muted-foreground">{flow.lastRunAt}</p>
              </div>
              <div
              className="shrink-0"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}>
              
                {flow.status === 'draft' ?
              <span className="text-xs text-muted-foreground">Draft</span> :

              <Switch
                size="sm"
                checked={flow.status === 'active'}
                onCheckedChange={() => toggleStatus(flow.id)}
                aria-label={`${flow.name} ${flow.status === 'active' ? 'active' : 'paused'}`} />

              }
              </div>
            </button>
          )}
        </div>
      </motion.section>

      <motion.section {...sectionMotion(4, reduce)} className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium text-foreground">Recent executions</h2>
            <p className="mt-1 text-sm text-muted-foreground">Live from the current demo run</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/executions">
              All executions
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {recent.map((shipment) =>
          <Link
            key={shipment.id}
            to={`/executions/${shipment.id}`}
            className={cn(
              'flex items-center justify-between gap-3 py-3 transition-colors hover:bg-accent/40'
            )}>
            
              <div className="min-w-0">
                <p className="font-mono text-sm font-medium text-foreground">{shipment.trackingNo}</p>
                <p className="truncate text-xs text-muted-foreground">{shipment.sender}</p>
              </div>
              <StageBadge stage={shipment.stage} />
            </Link>
          )}
        </div>
      </motion.section>
    </div>);

}
