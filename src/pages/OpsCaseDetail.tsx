import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { MessageSquare, Send } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StageBadge } from '../components/StageBadge';
import { FindingsList } from '../components/FindingsList';
import { DocumentList } from '../components/DocumentList';
import { StepTracker } from '../components/StepTracker';
import { TimelineList } from '../components/TimelineList';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Separator } from '../components/ui/Separator';
import { useWorkflow } from '../contexts/WorkflowContext';
import { useSession } from '../contexts/SessionContext';

export function OpsCaseDetail() {
  const { id = '' } = useParams();
  const { getShipment, sendMessage } = useWorkflow();
  const { user, sendingAccount } = useSession();
  const order = getShipment(id);

  const [subject, setSubject] = useState(order?.message?.subject ?? '');
  const [body, setBody] = useState(order?.message?.body ?? '');

  useEffect(() => {
    if (order?.message) {
      setSubject(order.message.subject);
      setBody(order.message.body);
    }
  }, [order?.message?.subject, order?.message?.body, order?.message]);

  if (!order) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-sm font-medium">Order not found</p>
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link to="/approvals">Back to To review</Link>
          </Button>
        </CardContent>
      </Card>);

  }

  const isSent = order.message?.status === 'sent';

  const approve = () => {
    sendMessage(order.id, body, subject, user.name);
    toast.success('Email sent', { description: order.message?.to });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        backTo="/approvals"
        backLabel="To review"
        title={isSent ? 'Email sent' : 'Review the email'}
        meta={<StageBadge stage={order.stage} />}
        description={`${order.trackingNo} · ${order.sender} · ${order.origin} → ${order.destination}`}
        actions={
        <Button variant="outline" asChild>
            <Link to={`/orders/${order.id}`}>View order</Link>
          </Button>
        } />
      

      {isSent ?
      <Alert>
          <AlertTitle>Sent at {order.message?.sentAt}</AlertTitle>
          <AlertDescription>
            Delivered to {order.message?.to}. The order stays on hold until the customer replies.
          </AlertDescription>
        </Alert> :
      null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Why the order is on hold</CardTitle>
            </CardHeader>
            <CardContent>
              <FindingsList findings={order.findings} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <CardTitle className="text-base">Email to the customer</CardTitle>
                </div>
              </div>
              <CardDescription>Edit anything you like. Nothing is sent until you approve.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input id="to" value={order.message?.to ?? order.contactEmail} readOnly className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} disabled={isSent} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  rows={14}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={isSent}
                  className="font-sans leading-relaxed" />
                
              </div>
              <Separator />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  {sendingAccount ?
                  `Sending as ${user.name} from ${sendingAccount.account}` :
                  'No mailbox connected'}
                </p>
                <Button size="lg" onClick={approve} disabled={isSent || !body.trim() || !sendingAccount}>
                  <Send aria-hidden="true" />
                  {isSent ? 'Sent' : 'Approve & send'}
                </Button>
              </div>
            </CardContent>
          </Card>
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
              <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentList docs={order.docs} />
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
    </div>);

}