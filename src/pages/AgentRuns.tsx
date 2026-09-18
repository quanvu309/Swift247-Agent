import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Play, Terminal, Timer } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StageBadge } from '../components/StageBadge';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { Separator } from '../components/ui/Separator';
import { useWorkflow } from '../contexts/WorkflowContext';
import { stepBlueprint } from '../utils/agent';
import { Actor } from '../types/cargo';
import { cn } from '../utils/cn';

const actorTag: Record<Actor, string> = {
  customer: 'customer',
  agent: 'agent',
  cx: 'cx',
  smartkargo: 'kargo'
};

export function AgentRuns() {
  const { shipments, runCheck } = useWorkflow();

  const queue = shipments.filter((s) => s.stage === 'submitted' || s.stage === 'checking');
  const recent = shipments.filter((s) => s.stage !== 'submitted' && s.stage !== 'checking' && s.stage !== 'draft');

  const log = shipments.
  flatMap((order) =>
  order.timeline.map((ev) => ({
    id: `${order.id}-${ev.id}`,
    at: ev.at,
    actor: actorTag[ev.actor],
    tracking: order.trackingNo,
    label: ev.label,
    tone: /issue|flag|missing|invalid/i.test(ev.label) ?
    'warn' :
    /fail|error/i.test(ev.label) ?
    'error' :
    'info'
  }))
  ).
  sort((a, b) => b.at.localeCompare(a.at)).
  slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI agent"
        title="Executions" />
      

      <div className="grid gap-4 md:grid-cols-3">
        {[
        { label: 'Queued', value: queue.length, hint: 'Waiting or running' },
        { label: 'Cleared', value: shipments.filter((s) => s.stage === 'compliance_ok' || s.stage === 'accepted').length, hint: 'No issues found' },
        { label: 'Flagged', value: shipments.filter((s) => s.stage === 'flagged' || s.stage === 'awaiting_shipper').length, hint: 'Needs customer action' }].
        map((stat) =>
        <StatCard key={stat.label} label={stat.label} value={stat.value} hint={stat.hint} />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {queue.length ?
          queue.map((shipment) => {
            const done = shipment.steps.filter((s) => s.status === 'done').length;
            const running = shipment.steps.find((s) => s.status === 'running');
            return (
              <div key={shipment.id} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm font-medium">{shipment.trackingNo}</p>
                        <StageBadge stage={shipment.stage} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {shipment.sender}, {shipment.origin} → {shipment.destination}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {shipment.stage === 'submitted' ?
                    <Button size="sm" onClick={() => runCheck(shipment.id)}>
                          <Play className="h-3.5 w-3.5" aria-hidden="true" />
                          Run check
                        </Button> :

                    <Badge variant="secondary" className="gap-1">
                          <Timer className="h-3 w-3" aria-hidden="true" />
                          {running ? running.label : 'Running'}
                        </Badge>
                    }
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/agent/${shipment.id}`}>Open run</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Progress value={done / stepBlueprint.length * 100} />
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {done}/{stepBlueprint.length} complete
                    </p>
                  </div>
                </div>);

          }) :

          <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
              Queue is empty.
            </p>
          }
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Completed</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {recent.map((shipment) =>
          <Link
            key={shipment.id}
            to={`/agent/${shipment.id}`}
            className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-accent/50">
            
              <div className="flex min-w-0 items-center gap-3">
                <Bot className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-mono text-sm font-medium">{shipment.trackingNo}</p>
                  <p className="truncate text-xs text-muted-foreground">{shipment.sender}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">risk {shipment.riskScore}</span>
                <Separator orientation="vertical" className="h-5" />
                <span className="font-mono text-xs text-muted-foreground">{shipment.findings.length} issues</span>
                <StageBadge stage={shipment.stage} />
              </div>
            </Link>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <CardTitle className="text-base">Log</CardTitle>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            last {log.length} events
          </span>
        </CardHeader>
        <CardContent>
          <ol className="divide-y divide-border rounded-lg border border-border bg-muted/30">
            {log.length ?
            log.map((entry) =>
            <li key={entry.id} className="flex items-start gap-3 px-3 py-2">
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{entry.at}</span>
                  <span
                className={cn(
                  'shrink-0 rounded px-1 font-mono text-[10px] uppercase',
                  entry.tone === 'error' ?
                  'bg-destructive/10 text-destructive' :
                  entry.tone === 'warn' ?
                  'bg-brand-orange/10 text-brand-orange' :
                  'bg-secondary text-secondary-foreground'
                )}>
                
                    {entry.actor}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-foreground">
                    {entry.tracking} {entry.label}
                  </span>
                </li>
            ) :

            <li className="px-3 py-6 text-center font-mono text-[11px] text-muted-foreground">No events yet</li>
            }
          </ol>
        </CardContent>
      </Card>
    </div>);

}