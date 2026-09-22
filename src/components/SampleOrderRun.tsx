import React, { useId, useState } from 'react';
import { Download, Play, RotateCcw, Upload } from 'lucide-react';
import { StageBadge } from './StageBadge';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { useWorkflow } from '../contexts/WorkflowContext';
import {
  SAMPLE_ORDER_ID,
  SAMPLE_PACK_HREF,
  describeSampleResult
} from '../product/sampleOrder.js';
import { cn } from '../utils/cn';

export function SampleOrderRun() {
  const { getShipment, attachSamplePack, resetSampleOrder, runCheck } = useWorkflow();
  const order = getShipment(SAMPLE_ORDER_ID);
  const inputId = useId();
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [inputKey, setInputKey] = useState(0);

  if (!order) return null;

  const result = describeSampleResult(order.stage, order.findings);
  const running = order.stage === 'checking';

  const onFiles = (list: FileList | null) => {
    const names = Array.from(list ?? []).map((file) => file.name);
    setFileNames(names);
  };

  const onRun = () => {
    attachSamplePack(fileNames);
    runCheck(SAMPLE_ORDER_ID);
  };

  const onReset = () => {
    setFileNames([]);
    setInputKey((key) => key + 1);
    resetSampleOrder();
  };

  return (
    <Card className="w-[280px] border-border bg-background/95 shadow-sm backdrop-blur">
      <CardHeader className="gap-1 p-3 pb-2">
        <p className="text-[11px] text-muted-foreground">Sample order</p>
        <CardTitle className="font-mono text-sm">{order.trackingNo}</CardTitle>
        <CardDescription>
          {order.itemCategory}. {order.origin} → {order.destination}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-3 pt-0">
        <Button variant="link" size="sm" className="h-auto px-0" asChild>
          <a href={SAMPLE_PACK_HREF} download>
            <Download aria-hidden="true" />
            Download sample pack
          </a>
        </Button>

        <div>
          <label htmlFor={inputId} className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            Upload pack
          </label>
          <Input
            key={inputKey}
            id={inputId}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.zip,application/pdf,image/jpeg,application/zip"
            aria-describedby={`${inputId}-hint`}
            className="h-auto py-1.5 text-xs"
            onChange={(event) => onFiles(event.target.files)}
          />
          <p id={`${inputId}-hint`} className="mt-1.5 text-[11px] leading-4 text-muted-foreground">
            Use declaration.pdf, invoice.pdf, and parcel-photo.jpg, or the zip. Matched by file name. Files stay on this
            device.
          </p>
        </div>

        {fileNames.length ?
          <ul className="flex flex-col gap-1 font-mono text-[11px] text-muted-foreground">
            {fileNames.map((name) =>
            <li key={name} className="truncate">
                {name}
              </li>
            )}
          </ul> :
        null}

        <div className="flex gap-1.5">
          <Button size="sm" onClick={onRun} disabled={running}>
            <Play aria-hidden="true" />
            Run check
          </Button>
          <Button size="sm" variant="outline" onClick={onReset} disabled={running}>
            <RotateCcw aria-hidden="true" />
            Reset
          </Button>
        </div>

        <div
          role="status"
          data-testid="sample-run-result"
          className="rounded-md border border-border px-2.5 py-2">
          
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                'text-sm font-medium',
                result.tone === 'flagged' && 'text-destructive',
                result.tone === 'cleared' && 'text-foreground'
              )}>
              
              {result.headline}
            </p>
            {order.stage !== 'draft' ? <StageBadge stage={order.stage} /> : null}
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{result.detail}</p>
          {order.findings.length ?
            <ul className="mt-2 flex flex-col gap-1 text-xs text-foreground">
              {order.findings.map((finding) =>
              <li key={finding.id}>{finding.title}</li>
              )}
            </ul> :
          null}
        </div>
      </CardContent>
    </Card>);

}
