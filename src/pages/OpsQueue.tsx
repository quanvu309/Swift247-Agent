import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageSquareWarning, ShieldAlert } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StageBadge } from '../components/StageBadge';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { useWorkflow } from '../contexts/WorkflowContext';
export function OpsQueue() {
  const { shipments } = useWorkflow();
  const pending = shipments.filter((s) => s.stage === 'flagged');
  const sent = shipments.filter((s) => s.stage === 'awaiting_shipper');
  return <div className="space-y-6">
      <PageHeader eyebrow="Operations" title="Approvals" actions={<Badge variant={pending.length ? 'destructive' : 'secondary'} className="gap-1">
            <Bell className="h-3 w-3" aria-hidden="true" />
            {pending.length} to review
          </Badge>} />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquareWarning className="h-4 w-4 text-destructive" aria-hidden="true" />
            <CardTitle className="text-base">To review</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {pending.length ? <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Issues</TableHead>
                  <TableHead className="text-right">Risk</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead className="w-28" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((order) => <TableRow key={order.id}>
                    <TableCell>
                      <p className="font-mono text-xs font-medium">{order.trackingNo}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.sender}, {order.channel}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {order.findings.slice(0, 3).map((f) => <Badge key={f.id} variant={f.severity === 'critical' ? 'destructive' : 'secondary'} className="font-mono text-[10px]">
                            {f.ruleRef}
                          </Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="flex items-center justify-end gap-1 font-mono text-xs">
                        <ShieldAlert className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
                        {order.riskScore}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{order.pickupAt}</TableCell>
                    <TableCell>
                      <Button size="sm" asChild>
                        <Link to={`/approvals/${order.id}`}>Review</Link>
                      </Button>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table> : <div className="px-6 py-14 text-center">
              <div className="mx-auto h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <p className="mt-2 text-sm font-medium">Queue is clear</p>
            </div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sent to customers</CardTitle>
          <CardDescription>Waiting for a re-upload</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {sent.length ? sent.map((order) => <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-medium">{order.trackingNo}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {order.message?.channel} → {order.message?.to} at {order.message?.sentAt}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StageBadge stage={order.stage} />
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/approvals/${order.id}`}>Open</Link>
                  </Button>
                </div>
              </div>) : <p className="px-6 py-10 text-center text-sm text-muted-foreground">Nothing outstanding.</p>}
        </CardContent>
      </Card>
    </div>;
}