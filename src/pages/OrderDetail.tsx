import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { MessageSquare, Upload } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StageBadge } from '../components/StageBadge';
import { DocumentList } from '../components/DocumentList';
import { FindingsList } from '../components/FindingsList';
import { TimelineList } from '../components/TimelineList';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Checkbox } from '../components/ui/Checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/Dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useWorkflow } from '../contexts/WorkflowContext';
import { DocType } from '../types/cargo';
import { docLabels } from '../utils/agent';
import { formatVnd } from '../utils/format';
import { useScreenInit } from '../useScreenInit.js';

export function OrderDetail() {
  const { id = '' } = useParams();
  const { getShipment, resubmitDocuments, runCheck } = useWorkflow();
  const navigate = useNavigate();
  const order = getShipment(id);
  const screenInit = useScreenInit();
  const [tab, setTab] = useState<string>(screenInit.tab ?? 'uploads');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DocType[]>([]);

  if (!order) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-sm font-medium">Order not found</p>
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link to="/orders">Back to orders</Link>
          </Button>
        </CardContent>
      </Card>);

  }

  const missingDocs = order.docs.filter((d) => d.status === 'missing' || d.status === 'invalid').map((d) => d.type);
  const facts = [
  { label: 'Route', value: `${order.origin} → ${order.destination}` },
  { label: 'Service', value: `${order.service}, ${order.pickupAt}` },
  { label: 'Parcel', value: `${order.pieces} pc, ${order.weightKg} kg` },
  { label: 'Declared value', value: formatVnd(order.declaredValue) },
  { label: 'COD', value: order.codAmount ? formatVnd(order.codAmount) : 'None' },
  { label: 'Channel', value: order.channel }];


  const submit = () => {
    resubmitDocuments(order.id, selected);
    setOpen(false);
    setSelected([]);
    toast.success('Re-uploaded', { description: 'Checking again.' });
    navigate(`/executions/${order.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        backTo="/orders"
        backLabel="Orders"
        eyebrow={`${order.sender}, ${order.channel}`}
        title={order.trackingNo}
        description={order.itemCategory}
        actions={
        <>
            <StageBadge stage={order.stage} />
            {order.stage === 'draft' ?
          <Button size="sm" onClick={() => runCheck(order.id)}>
                Run check
              </Button> :
          null}
            {order.stage === 'awaiting_shipper' ?
          <Button size="sm" onClick={() => setOpen(true)}>
                <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                Documents received
              </Button> :
          null}
          </>
        } />
      

      {order.stage === 'awaiting_shipper' ?
      <Alert variant="destructive">
          <AlertTitle>Waiting on the customer</AlertTitle>
          <AlertDescription>
            {missingDocs.length} item(s) requested on {order.message?.sentAt ?? 'today'} via {order.message?.channel}.
            Pickup is on hold.
          </AlertDescription>
        </Alert> :
      null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact) =>
        <div key={fact.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{fact.label}</p>
            <p className="mt-1 text-sm font-medium text-foreground">{fact.value}</p>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="uploads">Uploads</TabsTrigger>
            <TabsTrigger value="issues">Issues ({order.findings.length})</TabsTrigger>
            <TabsTrigger value="message">Message</TabsTrigger>
          </TabsList>
          <TabsContent value="uploads" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer uploads</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentList docs={order.docs} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="issues" className="mt-4">
            <FindingsList findings={order.findings} />
          </TabsContent>
          <TabsContent value="message" className="mt-4">
            {order.message?.status === 'sent' ?
            <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <CardTitle className="text-base">{order.message.subject}</CardTitle>
                  </div>
                  <CardDescription>
                    {order.message.channel} → {order.message.to} at {order.message.sentAt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
                    {order.message.body}
                  </pre>
                </CardContent>
              </Card> :

            <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                No message yet.
              </p>
            }
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <TimelineList events={order.timeline} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Documents received</DialogTitle>
            <DialogDescription>Mark what the customer sent. The check runs again.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {missingDocs.length ?
            missingDocs.map((doc) =>
            <label
              key={doc}
              htmlFor={`resubmit-${doc}`}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent/60">
              
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
              Re-check
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

}