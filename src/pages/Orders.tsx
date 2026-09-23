import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StageBadge } from '../components/StageBadge';
import { Input } from '../components/ui/Input';
import { useWorkflow } from '../contexts/WorkflowContext';
import { Shipment } from '../types/cargo';
import { formatVnd } from '../utils/format';
import { cn } from '../utils/cn';

type Filter = 'all' | 'hold' | 'waiting' | 'cleared' | 'new';

const FILTERS: {id: Filter;label: string;match: (s: Shipment) => boolean;}[] = [
{ id: 'all', label: 'All', match: () => true },
{ id: 'hold', label: 'On hold', match: (s) => s.stage === 'flagged' },
{ id: 'waiting', label: 'Waiting on customer', match: (s) => s.stage === 'awaiting_shipper' },
{ id: 'cleared', label: 'Cleared', match: (s) => s.stage === 'compliance_ok' || s.stage === 'accepted' },
{ id: 'new', label: 'Not checked', match: (s) => ['draft', 'submitted', 'checking'].includes(s.stage) }];


export function Orders() {
  const { shipments } = useWorkflow();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const active = FILTERS.find((f) => f.id === filter) ?? FILTERS[0];
  const q = query.trim().toLowerCase();
  const rows = shipments.filter(
    (order) =>
    active.match(order) && (
    !q ||
    order.trackingNo.toLowerCase().includes(q) ||
    order.orderRef.toLowerCase().includes(q) ||
    order.sender.toLowerCase().includes(q) ||
    order.itemCategory.toLowerCase().includes(q))
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Every order the agent has seen, with its pickup status." />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Filter orders" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const count = shipments.filter(f.match).length;
            const on = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  on ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:bg-muted'
                )}>

                {f.label}
                <span className={cn('text-xs tabular-nums', on ? 'text-primary-foreground/80' : 'text-muted-foreground')}>{count}</span>
              </button>);

          })}
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracking, order, sender"
            aria-label="Search orders"
            className="h-10 rounded-full bg-background pl-9" />

        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {rows.length ?
        <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th scope="col" className="px-5 py-3 font-medium">Order</th>
                <th scope="col" className="hidden px-5 py-3 font-medium md:table-cell">Route</th>
                <th scope="col" className="hidden px-5 py-3 font-medium lg:table-cell">Item</th>
                <th scope="col" className="hidden px-5 py-3 text-right font-medium sm:table-cell">Value</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
                <th scope="col" className="w-10"><span className="sr-only">Open</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((order) =>
            <tr
              key={order.id}
              tabIndex={0}
              onClick={() => navigate(`/orders/${order.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/orders/${order.id}`);
              }}
              aria-label={`Open ${order.trackingNo}`}
              className="cursor-pointer transition-colors hover:bg-muted/50 focus-visible:bg-muted/60 focus-visible:outline-none">

                  <td className="px-5 py-3.5">
                    <p className="whitespace-nowrap font-mono text-[13px] font-medium text-foreground">{order.trackingNo}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.sender} · {order.channel}
                    </p>
                  </td>
                  <td className="hidden whitespace-nowrap px-5 py-3.5 md:table-cell">
                    <p className="text-foreground">
                      {order.origin} → {order.destination}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.service}</p>
                  </td>
                  <td className="hidden max-w-[220px] px-5 py-3.5 lg:table-cell">
                    <p className="truncate text-foreground">{order.itemCategory}</p>
                  </td>
                  <td className="hidden whitespace-nowrap px-5 py-3.5 text-right tabular-nums sm:table-cell">
                    <p className="text-foreground">{formatVnd(order.declaredValue)}</p>
                    {order.codAmount ? <p className="text-xs text-muted-foreground">COD</p> : null}
                  </td>
                  <td className="px-5 py-3.5">
                    <StageBadge stage={order.stage} />
                  </td>
                  <td className="pr-4">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </td>
                </tr>
            )}
            </tbody>
          </table> :

        <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-foreground">No orders match</p>
            <p className="mt-1 text-sm text-muted-foreground">Try another filter or clear the search.</p>
          </div>
        }
      </div>
    </div>);

}
