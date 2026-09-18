import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowUpRight, PlugZap, RefreshCw, Search } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StageBadge } from '../components/StageBadge';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useWorkflow } from '../contexts/WorkflowContext';
import { Shipment } from '../types/cargo';
import { formatVnd } from '../utils/format';

type Filter = 'all' | 'open' | 'action' | 'done';

function matchesFilter(order: Shipment, filter: Filter): boolean {
  if (filter === 'all') return true;
  if (filter === 'action') return order.stage === 'awaiting_shipper' || order.stage === 'draft';
  if (filter === 'done') return order.stage === 'accepted' || order.stage === 'compliance_ok';
  return ['submitted', 'checking', 'flagged'].includes(order.stage);
}

export function Orders() {
  const { shipments } = useWorkflow();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const rows = shipments.filter(
    (order) =>
    matchesFilter(order, filter) && (
    order.trackingNo.toLowerCase().includes(query.toLowerCase()) ||
    order.sender.toLowerCase().includes(query.toLowerCase()) ||
    order.itemCategory.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Integration"
        title="Orders"
        actions={
        <>
            <Badge variant="secondary" className="gap-1.5">
              <PlugZap className="h-3 w-3" aria-hidden="true" />
              Synced 2 min ago
            </Badge>
            <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Orders synced', { description: 'Pulled from SmartKargo' })}>
            
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Sync
            </Button>
          </>
        } />
      

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">In check</TabsTrigger>
            <TabsTrigger value="action">Waiting on customer</TabsTrigger>
            <TabsTrigger value="done">Cleared</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tracking no., sender, item"
            aria-label="Search orders"
            className="pl-9" />
          
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {rows.length ?
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((order) =>
              <TableRow key={order.id}>
                    <TableCell>
                      <Link to={`/shipper/${order.id}`} className="font-mono text-xs font-medium hover:underline">
                        {order.trackingNo}
                      </Link>
                      <p className="text-[11px] text-muted-foreground">
                        {order.sender}, {order.channel}
                      </p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {order.origin} → {order.destination}
                      <p className="text-xs text-muted-foreground">
                        {order.service}, {order.pickupAt}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-[220px] text-sm">
                      <span className="line-clamp-1">{order.itemCategory}</span>
                      {order.isRestricted ?
                  <span className="font-mono text-[11px] text-destructive">{order.restrictedType}</span> :
                  null}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right text-sm tabular-nums">
                      {formatVnd(order.declaredValue)}
                      {order.codAmount ?
                  <p className="font-mono text-[11px] text-muted-foreground">COD {formatVnd(order.codAmount)}</p> :
                  null}
                    </TableCell>
                    <TableCell>
                      <StageBadge stage={order.stage} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon-sm" asChild>
                        <Link to={`/shipper/${order.id}`} aria-label={`Open ${order.trackingNo}`}>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
              )}
              </TableBody>
            </Table> :

          <div className="px-6 py-16 text-center">
              <p className="text-sm font-medium text-foreground">No orders here</p>
              <p className="mt-1 text-sm text-muted-foreground">Try clearing the filters.</p>
            </div>
          }
        </CardContent>
      </Card>
    </div>);

}