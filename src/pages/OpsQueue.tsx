import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Mail } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/Button';
import { useWorkflow } from '../contexts/WorkflowContext';
import { Shipment } from '../types/cargo';

function ReviewRow({ order }: {order: Shipment;}) {
  const [first, ...rest] = order.findings;
  return (
    <li className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <Mail className="h-[18px] w-[18px]" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-mono font-medium text-foreground">{order.trackingNo}</span>
          <span className="text-muted-foreground">{order.sender}</span>
        </p>
        <p className="mt-0.5 text-sm text-foreground">
          {first?.title ?? 'Needs a look'}
          {rest.length ? <span className="text-muted-foreground"> and {rest.length} more</span> : null}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">Pickup {order.pickupAt}</p>
      </div>
      <Button asChild className="shrink-0">
        <Link to={`/approvals/${order.id}`}>
          Review email
          <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </li>);

}

export function OpsQueue() {
  const { shipments } = useWorkflow();
  const pending = shipments.filter((s) => s.stage === 'flagged' && s.message);
  const sent = shipments.filter((s) => s.stage === 'awaiting_shipper');

  return (
    <div className="space-y-8">
      <PageHeader
        title="To review"
        description="The agent drafted these emails. Nothing reaches a customer until you approve it." />


      <section aria-labelledby="needs-approval" className="space-y-3">
        <h2 id="needs-approval" className="flex items-center gap-2 text-base font-semibold text-foreground">
          Needs your approval
          <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-white">{pending.length}</span>
        </h2>
        {pending.length ?
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {pending.map((order) =>
          <ReviewRow key={order.id} order={order} />
          )}
          </ul> :

        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
            <CheckCircle2 className="h-7 w-7 text-chart-2" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">All caught up</p>
            <p className="text-sm text-muted-foreground">New drafts appear here when the agent holds an order.</p>
          </div>
        }
      </section>

      <section aria-labelledby="waiting" className="space-y-3">
        <h2 id="waiting" className="text-base font-semibold text-foreground">
          Waiting on the customer
        </h2>
        {sent.length ?
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {sent.map((order) =>
          <li key={order.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chart-5/10 text-chart-5">
                  <Clock className="h-[18px] w-[18px]" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                    <span className="font-mono font-medium text-foreground">{order.trackingNo}</span>
                    <span className="text-muted-foreground">{order.sender}</span>
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    Emailed {order.message?.to} at {order.message?.sentAt}
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link to={`/orders/${order.id}`}>Open order</Link>
                </Button>
              </li>
          )}
          </ul> :

        <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">
            No emails waiting on a reply.
          </p>
        }
      </section>
    </div>);

}
