import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Play, RotateCw, XCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StageBadge } from '../components/StageBadge';
import { StepTracker } from '../components/StepTracker';
import { FindingsList } from '../components/FindingsList';
import { DocumentList } from '../components/DocumentList';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { LoadingBlock } from '../components/LoadingBlock';
import { useWorkflow } from '../contexts/WorkflowContext';
import { referenceRules } from '../data/referenceData';
import { stepBlueprint } from '../utils/agent';

export function AgentRunDetail() {
  const { id = '' } = useParams();
  const { getShipment, runCheck } = useWorkflow();
  const shipment = getShipment(id);

  if (!shipment) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-sm font-medium">Run not found</p>
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link to="/executions">Back to executions</Link>
          </Button>
        </CardContent>
      </Card>);

  }

  const stepStatus = (key: string) => shipment.steps.find((s) => s.key === key)?.status ?? 'pending';
  const ocrDone = stepStatus('ocr') === 'done';
  const crossDone = stepStatus('crosscheck') === 'done';
  const decisionDone = stepStatus('decision') === 'done';
  const doneCount = shipment.steps.filter((s) => s.status === 'done').length;
  const passed = decisionDone && shipment.findings.length === 0;

  const checkedRules = referenceRules.filter((r) =>
  shipment.isRestricted ? true : r.category !== 'Restricted items'
  );

  return (
    <div className="space-y-6">
      <PageHeader
        backTo="/executions"
        backLabel="Executions"
        eyebrow={shipment.sender}
        title={shipment.trackingNo}
        description={`${shipment.origin} → ${shipment.destination}, ${shipment.service}`}
        actions={
        <>
            <StageBadge stage={shipment.stage} />
            <Button
            size="sm"
            variant={shipment.stage === 'submitted' ? 'default' : 'outline'}
            onClick={() => runCheck(shipment.id)}
            disabled={shipment.stage === 'checking'}>
            
              {shipment.stage === 'submitted' ?
            <Play className="h-3.5 w-3.5" aria-hidden="true" /> :

            <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
            }
              {shipment.stage === 'submitted' ? 'Run check' : 'Re-run check'}
            </Button>
          </>
        } />
      

      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Progress</CardTitle>
              <CardDescription>
                {doneCount}/{stepBlueprint.length} complete
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={doneCount / stepBlueprint.length * 100} />
              <StepTracker steps={shipment.steps} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentList docs={shipment.docs} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Extracted data</CardTitle>
                </div>
                <Badge variant={ocrDone ? 'secondary' : 'outline'} className="text-[10px] uppercase">
                  {stepStatus('ocr')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {ocrDone ?
              <dl className="grid gap-3 sm:grid-cols-2">
                  {shipment.extracted.map((field) =>
                <div key={field.label} className="rounded-lg border border-border p-3">
                      <dt className="text-xs text-muted-foreground">{field.label}</dt>
                      <dd className="mt-0.5 text-sm font-medium text-foreground">{field.value}</dd>
                      {field.confidence < 0.8 ?
                  <p className="mt-1.5 text-[11px] font-medium text-destructive">Low confidence</p> :
                  null}
                    </div>
                )}
                </dl> :

              <LoadingBlock label="Reading documents…" rows={4} />
              }
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Rule checks</CardTitle>
                </div>
                <Badge variant={crossDone ? 'secondary' : 'outline'} className="text-[10px] uppercase">
                  {stepStatus('crosscheck')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {crossDone ?
              <ul className="divide-y divide-border">
                  {checkedRules.map((rule) => {
                  const hit = shipment.findings.some((f) => f.ruleRef === rule.code);
                  return (
                    <li key={rule.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="truncate text-sm text-foreground">{rule.title}</p>
                          <p className="truncate font-mono text-[11px] text-muted-foreground">{rule.value}</p>
                        </div>
                        {hit ?
                      <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-destructive">
                            <XCircle className="h-3.5 w-3.5" aria-hidden="true" /> Violation
                          </span> :

                      <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Pass
                          </span>
                      }
                      </li>);

                })}
                </ul> :

              <LoadingBlock label="Checking rules…" rows={5} />
              }
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Decision</CardTitle>
                </div>
                <Badge variant={decisionDone ? 'secondary' : 'outline'} className="text-[10px] uppercase">
                  {stepStatus('decision')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {decisionDone ?
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={
                passed ?
                'flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4' :
                'flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4'
                }>
                
                  {passed ?
                <CheckCircle2 className="h-5 w-5 text-foreground" aria-hidden="true" /> :

                <XCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
                }
                  <div>
                    <p className="text-sm font-medium">
                      {passed ? 'YES. Cleared for pickup' : `NO. ${shipment.findings.length} issues`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {passed ?
                    'Status written to SmartKargo. Courier can collect.' :
                    'A customer message was drafted for CX review.'}
                    </p>
                  </div>
                </motion.div> :

              <LoadingBlock label="Evaluating…" rows={1} />
              }

              <FindingsList findings={shipment.findings} />

              {shipment.findings.length > 0 && decisionDone ?
              <div className="flex flex-wrap gap-2">
                  <Button size="sm" asChild>
                    <Link to={`/approvals/${shipment.id}`}>Open in CX approvals</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/orders/${shipment.id}`}>View order</Link>
                  </Button>
                </div> :
              null}

              {passed ?
              <Button size="sm" asChild>
                  <Link to="/connections">Update order status</Link>
                </Button> :
              null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

}