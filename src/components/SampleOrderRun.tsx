import { useId, useState, type DragEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Play,
  RotateCcw,
  UploadCloud,
  XCircle } from
'lucide-react';
import { Button } from './ui/Button';
import { useWorkflow } from '../contexts/WorkflowContext';
import { DEMO_SCENARIOS, DOC_NAMES } from '../product/demoScenarios.js';
import { readFile, type ReadResult } from '../utils/readFiles';
import { formatVnd } from '../utils/format';
import { cn } from '../utils/cn';
import type { Shipment } from '../types/cargo';

const METHOD_LABEL: Record<ReadResult['method'], string> = {
  json: 'JSON',
  pdf: 'PDF',
  ocr: 'Photo OCR',
  unsupported: 'Unsupported'
};

type Tone = 'idle' | 'running' | 'cleared' | 'flagged';

function describe(order: Shipment, reading: boolean): {tone: Tone;headline: string;detail: string;} {
  if (reading) return { tone: 'running', headline: 'Reading documents', detail: 'Extracting text from each file.' };
  if (order.stage === 'checking') {
    return { tone: 'running', headline: 'Checking the order', detail: 'Matching the documents against SmartKargo.' };
  }
  if (order.stage === 'compliance_ok' || order.stage === 'accepted') {
    return { tone: 'cleared', headline: 'Cleared for pickup', detail: 'Status written to SmartKargo. The shipment is accepted.' };
  }
  if (order.stage === 'flagged' || order.stage === 'awaiting_shipper') {
    const n = order.findings.length;
    return {
      tone: 'flagged',
      headline: n === 1 ? 'On hold: 1 issue' : `On hold: ${n} issues`,
      detail: 'A request email is drafted and waiting for Operations to approve.'
    };
  }
  return { tone: 'idle', headline: 'No result yet', detail: 'Upload the documents and run the check.' };
}

function Step({ n, title, children }: {n: number;title: string;children: ReactNode;}) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>);

}

export function SampleOrderRun() {
  const { getShipment, activeDemoId, setActiveDemoId, applyDemoScan, resetDemoOrder, runCheck } = useWorkflow();
  const order = getShipment(activeDemoId);
  const scenario = DEMO_SCENARIOS.find((s) => s.id === activeDemoId) ?? DEMO_SCENARIOS[0];
  const inputId = useId();
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<(ReadResult | null)[]>([]);
  const [reading, setReading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [inputKey, setInputKey] = useState(0);

  if (!order) return null;

  const busy = reading || order.stage === 'checking';
  const result = describe(order, reading);

  const clearFiles = () => {
    setFiles([]);
    setResults([]);
    setInputKey((key) => key + 1);
  };

  const onPick = (id: string) => {
    if (busy || id === activeDemoId) return;
    clearFiles();
    setActiveDemoId(id);
  };

  const takeFiles = (list: FileList | null) => {
    setFiles(Array.from(list ?? []));
    setResults([]);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (!busy) takeFiles(event.dataTransfer.files);
  };

  const onRun = async () => {
    if (!files.length) return;
    setReading(true);
    const out: ReadResult[] = [];
    setResults(files.map(() => null));
    for (const [index, file] of files.entries()) {
      out[index] = await readFile(file);
      setResults((prev) => prev.map((r, i) => i === index ? out[index] : r));
    }
    setReading(false);
    applyDemoScan(order.id, out);
    runCheck(order.id);
  };

  const onReset = () => {
    clearFiles();
    resetDemoOrder(order.id);
  };

  return (
    <div className="grid items-start gap-5 lg:grid-cols-3">
      <Step n={1} title="Choose a scenario">
        <div role="radiogroup" aria-label="Demo scenario" className="space-y-2">
          {DEMO_SCENARIOS.map((s) => {
            const selected = s.id === activeDemoId;
            return (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={busy}
                onClick={() => onPick(s.id)}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60',
                  selected ? 'border-primary bg-primary/[0.04] ring-1 ring-primary' : 'border-border hover:border-ring/40 hover:bg-muted/50'
                )}>

                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold',
                    selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>

                  {s.letter}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">{s.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{s.summary}</span>
                </span>
              </button>);

          })}
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-xl bg-muted/60 p-3.5 text-sm">
          <dt className="text-muted-foreground">Tracking</dt>
          <dd className="font-mono text-foreground">{order.trackingNo}</dd>
          <dt className="text-muted-foreground">Order no.</dt>
          <dd className="font-mono text-foreground">{order.orderRef}</dd>
          <dt className="text-muted-foreground">Sender</dt>
          <dd className="truncate text-foreground">{order.sender}</dd>
          <dt className="text-muted-foreground">Route</dt>
          <dd className="text-foreground">
            {order.origin} → {order.destination}, {order.service}
          </dd>
          <dt className="text-muted-foreground">COD</dt>
          <dd className="text-foreground">{formatVnd(order.codAmount)}</dd>
        </dl>
      </Step>

      <Step n={2} title="Upload the documents">
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            if (!busy) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors duration-150',
            'focus-within:ring-2 focus-within:ring-ring',
            dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-ring/50 hover:bg-muted/40',
            busy && 'pointer-events-none opacity-60'
          )}>

          <UploadCloud className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium text-foreground">
            {files.length ? `${files.length} file${files.length > 1 ? 's' : ''} selected` : 'Choose files or drop them here'}
          </span>
          <span className="text-xs text-muted-foreground">Declaration, invoice, parcel photo, sender ID</span>
          <input
            key={inputKey}
            id={inputId}
            type="file"
            multiple
            disabled={busy}
            accept=".json,.pdf,.jpg,.jpeg,.png,application/json,application/pdf,image/jpeg,image/png"
            className="sr-only"
            onChange={(event) => takeFiles(event.target.files)} />

        </label>

        <a
          href={scenario.packHref}
          download
          className="inline-flex cursor-pointer items-center gap-1.5 rounded text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">

          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Download sample pack {scenario.letter}
        </a>

        {files.length ?
        <ul className="divide-y divide-border rounded-xl border border-border" aria-label="Uploaded files">
            {files.map((file, index) => {
            const r = results[index];
            const pending = reading && !r;
            const key = r?.fields.orderRef || r?.fields.idNumber || r?.fields.trackingNo;
            return (
              <li key={`${file.name}-${index}`} className="flex items-start gap-2.5 px-3 py-2.5">
                  {pending ?
                <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-brand-orange motion-reduce:animate-none" aria-hidden="true" /> :
                r && !r.type ?
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" /> :
                r ?
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-chart-2" aria-hidden="true" /> :
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">
                      {r?.type ? DOC_NAMES[r.type]?.en ?? r.type : r ? 'Not recognised' : file.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r?.type ? `${key ? `${key} · ` : ''}read from ${METHOD_LABEL[r.method]}` : file.name}
                    </p>
                  </div>
                </li>);

          })}
          </ul> :
        null}

        <div className="flex items-center gap-2">
          <Button className="flex-1" onClick={onRun} disabled={busy || !files.length}>
            {busy ?
            <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> :
            <Play aria-hidden="true" />}
            {busy ? 'Checking…' : 'Run check'}
          </Button>
          <Button variant="ghost" onClick={onReset} disabled={busy} aria-label="Reset this scenario">
            <RotateCcw aria-hidden="true" />
            Reset
          </Button>
        </div>
      </Step>

      <Step n={3} title="Result">
        <div
          role="status"
          data-testid="sample-run-result"
          className={cn(
            'rounded-xl border p-4',
            result.tone === 'cleared' && 'border-chart-2/40 bg-chart-2/[0.06]',
            result.tone === 'flagged' && 'border-destructive/30 bg-destructive/[0.04]',
            result.tone === 'running' && 'border-brand-orange/30 bg-brand-orange/[0.04]',
            result.tone === 'idle' && 'border-dashed border-border'
          )}>

          <div className="flex items-start gap-3">
            {result.tone === 'cleared' ?
            <CheckCircle2 className="h-6 w-6 shrink-0 text-chart-2" aria-hidden="true" /> :
            result.tone === 'flagged' ?
            <AlertTriangle className="h-6 w-6 shrink-0 text-destructive" aria-hidden="true" /> :
            result.tone === 'running' ?
            <Loader2 className="h-6 w-6 shrink-0 animate-spin text-brand-orange motion-reduce:animate-none" aria-hidden="true" /> :
            <FileText className="h-6 w-6 shrink-0 text-muted-foreground" aria-hidden="true" />}
            <div className="min-w-0">
              <p className="text-base font-semibold text-foreground">{result.headline}</p>
              <p className="mt-0.5 text-sm leading-5 text-muted-foreground">{result.detail}</p>
            </div>
          </div>

          {order.findings.length ?
          <ul className="mt-4 space-y-2.5">
              {order.findings.map((finding) =>
            <li key={finding.id} className="rounded-lg bg-background p-3 ring-1 ring-border">
                  <p className="text-sm font-medium text-foreground">{finding.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{finding.detail}</p>
                  <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">Rule {finding.ruleRef}</p>
                </li>
            )}
            </ul> :
          null}

          {result.tone === 'cleared' || result.tone === 'flagged' ?
          <div className="mt-4 flex flex-wrap gap-2">
              {order.findings.length && order.message ?
            <Button size="sm" asChild>
                  <Link to={`/approvals/${order.id}`}>
                    Review the email
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button> :
            null}
              <Button size="sm" variant="outline" asChild>
                <Link to={`/orders/${order.id}`}>View order</Link>
              </Button>
            </div> :
          null}
        </div>
      </Step>
    </div>);

}
