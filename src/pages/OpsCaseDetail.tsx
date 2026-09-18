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
import { Badge } from '../components/ui/Badge';
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
            <Link to="/approvals">Back to approvals</Link>
          </Button>
        </CardContent>
      </Card>);

  }

  const isSent = order.message?.status === 'sent';

  const approve = () => {
    sendMessage(order.id, body, subject, user.name);
    toast.success('Message sent', { description: `${order.message?.channel} → ${order.message?.to}` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        backTo="/approvals"
        backLabel="Approvals"
        eyebrow={order.sender}
        title={order.trackingNo}
        description={`${order.origin} → ${order.destination}, ${order.service}`}
        actions={
        <>
            <StageBadge stage={order.stage} />
            <Button variant="outline" size="sm" asChild>
              <Link to={`/executions/${order.id}`}>View run</Link>
            </Button>
          </>
        } />
      

      {isSent ?
      <Alert>
          <AlertTitle>Already sent</AlertTitle>
          <AlertDescription>
            {order.message?.channel} → {order.message?.to} at {order.message?.sentAt}. Waiting on the customer.
          </AlertDescription>
        </Alert> :

      <Alert variant="destructive">
          <AlertTitle>{order.findings.length} issues flagged</AlertTitle>
          <AlertDescription>Check the draft, edit if needed, then send.</AlertDescription>
        </Alert>
      }

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Issues</CardTitle>
              <CardDescription>Found by the agent</CardDescription>
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
                  <CardTitle className="text-base">Draft message</CardTitle>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {order.message?.channel ?? 'Zalo'}
                </Badge>
              </div>
              <CardDescription>Nothing is sent until you approve it</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Input id="to" value={order.message?.to ?? order.contactPhone} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channel">Channel</Label>
                  <Input id="channel" value={`${order.message?.channel ?? 'Zalo'} + app push`} readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Title</Label>
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
                <Button onClick={approve} disabled={isSent || !body.trim() || !sendingAccount}>
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  {isSent ? 'Sent' : 'Approve & send'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <StepTracker steps={order.steps} compact />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Uploads</CardTitle>
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