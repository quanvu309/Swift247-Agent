import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, Clock, Loader2, Play, RotateCw, Upload } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StageBadge } from '../components/StageBadge';
import { DocumentList } from '../components/DocumentList';
import { FindingsList } from '../components/FindingsList';
import { StepTracker } from '../components/StepTracker';
import { TimelineList } from '../components/TimelineList';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Checkbox } from '../components/ui/Checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/Dialog';
import { useWorkflow } from '../contexts/WorkflowContext';
import { DocType, Shipment } from '../types/cargo';
import { docLabels } from '../utils/agent';
import { formatVnd } from '../utils/format';
import { cn } from '../utils/cn';

function Outcome({ order }: {order: Shipment;}) {
  const n = order.findings.length;
  const view =
  order.stage === 'compliance_ok' || order.stage === 'accepted' ?
  {
    icon: CheckCircle2,
    tone: 'border-chart-2/40 bg-chart-2/[0.06]',
    iconTone: 'text-chart-2',
    title: order.stage === 'accepted' ? 'Picked up by the courier' : 'Cleared for pickup',
    text: 'All documents are present and every value matches SmartKargo.'
  } :
  order.stage === 'flagged' ?
  {
    icon: AlertTriangle,
    tone: 'border-destructive/30 bg-destructive/[0.04]',
    iconTone: 'text-destructive',
    title: n === 1 ? 'On hold: 1 issue to fix' : `On hold: ${n} issues to fix`,
    text: order.message ? 'A request email is drafted. Operations must approve it before it goes out.' : 'Pickup is on hold.'
  } :
  order.stage === 'awaiting_shipper' ?
  {
    icon: Clock,
    tone: 'border-chart-5/40 bg-chart-5/[0.06]',
    iconTone: 'text-chart-5',
    title: 'Waiting on the customer',
    text: `Email sent ${order.message?.sentAt ? `at ${order.message.sentAt}` : ''} to ${order.message?.to ?? 'the customer'}. Pickup stays on hold.`
  } :
  order.stage === 'checking' ?
  {
    icon: Loader2,
    tone: 'border-brand-orange/30 bg-brand-orange/[0.04]',
    iconTone: 'text-brand-orange animate-spin motion-reduce:animate-none',
    title: 'The agent is checking this order',
    text: 'Reading documents and matching them against SmartKargo.'
  } :
  {
    icon: Play,
    tone: 'border-dashed border-border',
    iconTone: 'text-muted-foreground',
    title: 'Not checked yet',
    text: 'Run the check once the documents are in.'
  };
  const Icon = view.icon;
  return (
    <div role="status" className={cn('flex items-start gap-4 rounded-2xl border p-5', view.tone)}>
      <Icon className={cn('mt-0.5 h-7 w-7 shrink-0', view.iconTone)} aria-hidden="true" />
      <div>
        <p className="text-lg font-semibold text-foreground">{view.title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{view.text}</p>
      </div>
    </div>);

}

export function OrderDetail() {
  const { id = '' } = useParams();
  const { getShipment, resubmitDocuments, runCheck } = useWorkflow();
  const order = getShipment(id);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DocType[]>([]);

  if (!order) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="text-sm font-medium">Order not found</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link to="/orders">Back to orders</Link>
        </Button>
      </div>);

  }

  const missingDocs = Array.from(
    new Set([
    ...order.docs.filter((d) => d.status === 'missing' || d.status === 'invalid').map((d) => d.type),
    ...order.findings.map((f) => f.requiredDoc).filter((d): d is DocType => Boolean(d))]
    )
  );
  const facts = [
  { label: 'Order no.', value: order.orderRef, mono: true },
  { label: 'Route', value: `${order.origin} → ${order.destination}` },
  { label: 'Service', value: `${order.service}, pickup ${order.pickupAt}` },
  { label: 'Parcel', value: `${order.pieces} piece, ${order.weightKg} kg` },
  { label: 'Item', value: order.itemCategory },
  { label: 'Declared value', value: formatVnd(order.declaredValue) },
  { label: 'COD', value: order.codAmount ? formatVnd(order.codAmount) : 'None' },
  { label: 'Channel', value: order.channel }];

  const decisionDone = order.steps.find((s) => s.key === 'decision')?.status === 'done';

  const submit = () => {
    resubmitDocuments(order.id, selected);
    setOpen(false);
    setSelected([]);
    toast.success('Documents received', { description: 'The agent is checking again.' });
  };

  const primary =
  order.stage === 'draft' || order.stage === 'submitted' ?
  <Button onClick={() => runCheck(order.id)}>
        <Play aria-hidden="true" />
        Run check
      </Button> :
  order.stage === 'flagged' && order.message ?
  <Button asChild>
        <Link to={`/approvals/${order.id}`}>
          Review the email
          <ArrowRight aria-hidden="true" />
        </Link>
      </Button> :
  order.stage === 'awaiting_shipper' ?
  <Button onClick={() => setOpen(true)}>
        <Upload aria-hidden="true" />
        Documents received
      </Button> :
  null;

  return (
    <div className="space-y-6">
      <PageHeader
        backTo="/orders"
        backLabel="Orders"
        title={order.trackingNo}
        meta={<StageBadge stage={order.stage} />}
        description={`${order.sender} · ${order.origin} → ${order.destination}, ${order.service}`}
        actions={
        <>
            {decisionDone ?
          <Button variant="ghost" onClick={() => runCheck(order.id)}>
                <RotateCw aria-hidden="true" />
                Check again
              </Button> :
          null}
            {primary}
          </>
        } />


      <Outcome order={order} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {order.findings.length ?
          <Card>
              <CardHeader>
                <CardTitle className="text-base">What needs fixing</CardTitle>
              </CardHeader>
              <CardContent>
                <FindingsList findings={order.findings} />
              </CardContent>
            </Card> :
          null}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentList docs={order.docs} />
            </CardContent>
          </Card>

          {order.extracted.length ?
          <Card>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl p-6 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span>
                    <span className="block text-base font-semibold text-foreground">Data read from the documents</span>
                    <span className="block text-sm text-muted-foreground">{order.extracted.length} values</span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <dl className="grid gap-x-6 gap-y-3 px-6 pb-6 sm:grid-cols-2">
                  {order.extracted.map((field) =>
                <div key={field.label} className="border-t border-border pt-3">
                      <dt className="text-xs text-muted-foreground">{field.label}</dt>
                      <dd className="mt-0.5 break-words text-sm font-medium text-foreground">{field.value}</dd>
                    </div>
                )}
                </dl>
              </details>
            </Card> :
          null}

          {order.message ?
          <Card>
              <CardHeader>
                <CardTitle className="text-base">Email to the customer</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {order.message.status === 'sent' ? `Sent at ${order.message.sentAt}` : 'Draft, not sent yet'} ·{' '}
                  {order.message.to}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-foreground">{order.message.subject}</p>
                <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-6 text-muted-foreground">
                  {order.message.body}
                </pre>
              </CardContent>
            </Card> :
          null}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Agent progress</CardTitle>
            </CardHeader>
            <CardContent>
              <StepTracker steps={order.steps} compact />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2.5 text-sm">
                {facts.map((fact) =>
                <div key={fact.label} className="flex justify-between gap-4">
                    <dt className="shrink-0 text-muted-foreground">{fact.label}</dt>
                    <dd className={cn('text-right text-foreground', fact.mono && 'font-mono text-[13px]')}>{fact.value}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <TimelineList events={order.timeline} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Documents received</DialogTitle>
            <DialogDescription>Tick what the customer sent. The agent checks the order again.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {missingDocs.length ?
            missingDocs.map((doc) =>
            <label
              key={doc}
              htmlFor={`resubmit-${doc}`}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/60">

                  <Checkbox
                id={`resubmit-${doc}`}
                checked={selected.includes(doc)}
                onCheckedChange={() =>
                setSelected((prev) => prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc])
                } />

                  <span className="text-sm font-medium">{docLabels[doc].en}</span>
                </label>
            ) :

            <p className="text-sm text-muted-foreground">Nothing outstanding.</p>
            }
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!selected.length}>
              Check again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

}
