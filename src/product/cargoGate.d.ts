import type { Finding, Shipment, StepKey, StepStatus } from '../types/cargo';

export function decideCargoGate(pendingFindings: Finding[]): {
  stage: Extract<Shipment['stage'], 'compliance_ok' | 'flagged'>;
  findings: Finding[];
  steps: Partial<Record<StepKey, StepStatus>>;
  timelineLabel: string;
  riskScore?: number;
};
