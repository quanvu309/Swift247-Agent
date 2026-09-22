import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DocType, Shipment, TimelineEvent } from '../types/cargo';
import { createSampleShipment, initialShipments } from '../data/shipments';
import { decideCargoGate } from '../product/cargoGate.js';
import { SAMPLE_ORDER_ID, applySamplePack } from '../product/sampleOrder.js';
import { buildMessageDraft, buildSteps } from '../utils/agent';

interface WorkflowConfig {
  autoRunOnSubmit: boolean;
  requireOpsApproval: boolean;
}

interface WorkflowContextValue extends WorkflowConfig {
  shipments: Shipment[];
  getShipment: (id: string) => Shipment | undefined;
  runCheck: (id: string) => void;
  attachSamplePack: (fileNames: string[]) => void;
  resetSampleOrder: () => void;
  sendMessage: (id: string, body: string, subject: string, by?: string) => void;
  resubmitDocuments: (id: string, docs: DocType[]) => void;
  acceptCargo: (id: string) => void;
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

function stamp(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function event(actor: TimelineEvent['actor'], label: string): TimelineEvent {
  return { id: `${actor}-${Math.random().toString(36).slice(2, 8)}`, at: stamp(), actor, label };
}

export function WorkflowProvider({
  children,
  autoRunOnSubmit,
  requireOpsApproval




}: {children: React.ReactNode;autoRunOnSubmit: boolean;requireOpsApproval: boolean;}) {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const timers = useRef<number[]>([]);
  const runTokens = useRef<Record<string, number>>({});

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const update = useCallback((id: string, fn: (s: Shipment) => Shipment) => {
    setShipments((prev) => prev.map((s) => s.id === id ? fn(s) : s));
  }, []);

  const schedule = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const runCheck = useCallback(
    (id: string) => {
      const token = (runTokens.current[id] ?? 0) + 1;
      runTokens.current[id] = token;
      const stillThisRun = () => runTokens.current[id] === token;

      update(id, (s) => ({
        ...s,
        stage: 'checking',
        findings: [],
        message: undefined,
        steps: buildSteps({ ocr: 'running' }),
        timeline: [...s.timeline, event('agent', 'Check started')]
      }));

      schedule(1500, () => {
        if (!stillThisRun()) return;
        update(id, (s) => ({
          ...s,
          docs: s.docs.map((d) => d.status === 'processing' ? { ...d, status: 'extracted' } : d),
          steps: buildSteps({ ocr: 'done', crosscheck: 'running' }),
          timeline: [...s.timeline, event('agent', 'Documents read')]
        }));
      });

      schedule(3200, () => {
        if (!stillThisRun()) return;
        update(id, (s) => ({
          ...s,
          steps: buildSteps({ ocr: 'done', crosscheck: 'done', decision: 'running' }),
          timeline: [...s.timeline, event('smartkargo', 'Rules checked')]
        }));
      });

      schedule(4600, () => {
        if (!stillThisRun()) return;
        update(id, (s) => {
          const gate = decideCargoGate(s.pendingFindings);
          return {
            ...s,
            stage: gate.stage,
            findings: gate.findings,
            steps: buildSteps(gate.steps),
            timeline: [...s.timeline, event('agent', gate.timelineLabel)],
            ...(gate.riskScore === undefined ? {} : { riskScore: gate.riskScore })
          };
        });
      });

      schedule(6000, () => {
        if (!stillThisRun()) return;
        update(id, (s) => {
          if (s.stage !== 'flagged') return s;
          const draft = buildMessageDraft(s, s.findings);
          if (requireOpsApproval) {
            return {
              ...s,
              steps: buildSteps({ ocr: 'done', crosscheck: 'done', decision: 'done', flag: 'done', handoff: 'pending' }),
              message: draft,
              timeline: [...s.timeline, event('agent', 'Message drafted for CX review')]
            };
          }
          return {
            ...s,
            stage: 'awaiting_shipper',
            steps: buildSteps({ ocr: 'done', crosscheck: 'done', decision: 'done', flag: 'done', handoff: 'skipped' }),
            message: { ...draft, status: 'sent', sentAt: stamp() },
            timeline: [...s.timeline, event('agent', 'Message auto-sent to customer')]
          };
        });
      });
    },
    [requireOpsApproval, schedule, update]
  );

  const sendMessage = useCallback(
    (id: string, body: string, subject: string, by?: string) => {
      update(id, (s) => ({
        ...s,
        stage: 'awaiting_shipper',
        steps: buildSteps({ ocr: 'done', crosscheck: 'done', decision: 'done', flag: 'done', handoff: 'done' }),
        message: s.message ? { ...s.message, body, subject, status: 'sent', sentAt: stamp() } : s.message,
        timeline: [...s.timeline, event('cx', by ? `Approved and sent by ${by}` : 'Approved and sent')]
      }));
    },
    [update]
  );

  const resubmitDocuments = useCallback(
    (id: string, docs: DocType[]) => {
      update(id, (s) => ({
        ...s,
        stage: 'submitted',
        pendingFindings: s.pendingFindings.filter((f) => !f.requiredDoc || !docs.includes(f.requiredDoc)),
        findings: [],
        docs: s.docs.map((d) =>
        docs.includes(d.type) ?
        { ...d, status: 'processing', fileName: `${d.type.toLowerCase()}-new.jpg`, pages: 1, uploadedAt: stamp() } :
        d
        ),
        steps: buildSteps({}),
        timeline: [...s.timeline, event('customer', `${docs.length} document(s) re-uploaded`)]
      }));
      schedule(500, () => runCheck(id));
    },
    [runCheck, schedule, update]
  );

  const acceptCargo = useCallback(
    (id: string) => {
      update(id, (s) => ({
        ...s,
        stage: 'accepted',
        timeline: [...s.timeline, event('smartkargo', 'Picked up by courier')]
      }));
    },
    [update]
  );

  const attachSamplePack = useCallback(
    (fileNames: string[]) => {
      update(SAMPLE_ORDER_ID, (s) => {
        const names = Array.isArray(fileNames) ? fileNames : [];
        const next = applySamplePack(s, names, stamp());
        return {
          ...next,
          steps: buildSteps({}),
          timeline: names.length
            ? [...s.timeline, event('customer', 'Sample pack uploaded')]
            : s.timeline
        };
      });
    },
    [update]
  );

  const resetSampleOrder = useCallback(() => {
    runTokens.current[SAMPLE_ORDER_ID] = (runTokens.current[SAMPLE_ORDER_ID] ?? 0) + 1;
    setShipments((prev) => prev.map((s) => (s.id === SAMPLE_ORDER_ID ? createSampleShipment() : s)));
  }, []);

  const value = useMemo<WorkflowContextValue>(
    () => ({
      shipments,
      autoRunOnSubmit,
      requireOpsApproval,
      getShipment: (id: string) => shipments.find((s) => s.id === id),
      runCheck,
      attachSamplePack,
      resetSampleOrder,
      sendMessage,
      resubmitDocuments,
      acceptCargo
    }),
    [
      acceptCargo,
      attachSamplePack,
      autoRunOnSubmit,
      requireOpsApproval,
      resetSampleOrder,
      resubmitDocuments,
      runCheck,
      sendMessage,
      shipments
    ]
  );

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflow(): WorkflowContextValue {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflow must be used inside WorkflowProvider');
  return ctx;
}