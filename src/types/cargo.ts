export type DocType =
'ID_CARD' |
'INVOICE' |
'PARCEL_PHOTO' |
'ITEM_DECLARATION' |
'BATTERY_FORM' |
'PERMIT';

export type DocStatus = 'extracted' | 'processing' | 'missing' | 'invalid';

export interface CargoDocument {
  id: string;
  type: DocType;
  fileName: string;
  pages: number;
  uploadedAt: string;
  status: DocStatus;
}

export type ShipmentStage =
'draft' |
'submitted' |
'checking' |
'flagged' |
'awaiting_shipper' |
'compliance_ok' |
'accepted';

export type Severity = 'critical' | 'warning' | 'info';

export type FindingSource = 'ocr' | 'service' | 'pricing' | 'restricted' | 'kyc';

export interface Finding {
  id: string;
  code: string;
  ruleRef: string;
  title: string;
  titleVi: string;
  detail: string;
  severity: Severity;
  source: FindingSource;
  requiredDoc?: DocType;
}

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  source: DocType;
}

export type StepKey = 'ocr' | 'crosscheck' | 'decision' | 'flag' | 'handoff';

export type StepStatus = 'pending' | 'running' | 'done' | 'skipped';

export interface AgentStep {
  key: StepKey;
  label: string;
  detail: string;
  status: StepStatus;
  owner: 'agent' | 'cx';
}

export type MessageChannel = 'Zalo' | 'App push' | 'Email';

export interface MessageDraft {
  channel: MessageChannel;
  to: string;
  subject: string;
  body: string;
  status: 'draft' | 'sent';
  sentAt?: string;
}

export type Actor = 'customer' | 'agent' | 'cx' | 'smartkargo';

export interface TimelineEvent {
  id: string;
  at: string;
  actor: Actor;
  label: string;
}

export type OrderChannel = 'Swift247 app' | 'Website' | 'Shopee' | 'TikTok Shop' | 'Partner counter';

export type ServiceLevel = 'Express 4h' | 'Same-day' | 'Next-day';

export interface Shipment {
  id: string;
  trackingNo: string;
  orderRef: string;
  sender: string;
  contactPhone: string;
  contactEmail: string;
  channel: OrderChannel;
  recipient: string;
  recipientPhone: string;
  origin: string;
  destination: string;
  service: ServiceLevel;
  flightNo: string;
  pickupAt: string;
  pieces: number;
  weightKg: number;
  itemCategory: string;
  isRestricted: boolean;
  restrictedType?: string;
  declaredValue: number;
  codAmount: number;
  stage: ShipmentStage;
  riskScore: number;
  createdAt: string;
  docs: CargoDocument[];
  extracted: ExtractedField[];
  findings: Finding[];
  pendingFindings: Finding[];
  steps: AgentStep[];
  message?: MessageDraft;
  timeline: TimelineEvent[];
}

export interface ReferenceRule {
  id: string;
  code: string;
  category: 'Order' | 'Service rules' | 'Restricted items' | 'KYC';
  title: string;
  value: string;
  updatedAt: string;
}