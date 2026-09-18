import { AgentStep, Finding, MessageDraft, Shipment, StepKey, StepStatus } from '../types/cargo';
import { formatVnd } from './format';

export const docLabels: Record<string, {en: string;vi: string;}> = {
  ID_CARD: { en: 'Sender ID (CCCD)', vi: 'CCCD người gửi' },
  INVOICE: { en: 'Invoice / receipt', vi: 'Hoá đơn mua hàng' },
  PARCEL_PHOTO: { en: 'Parcel photo', vi: 'Ảnh kiện hàng' },
  ITEM_DECLARATION: { en: 'Item declaration', vi: 'Khai báo hàng gửi' },
  BATTERY_FORM: { en: 'Battery declaration', vi: 'Khai báo pin' },
  PERMIT: { en: 'Special-goods permit', vi: 'Giấy phép hàng đặc biệt' }
};

export const stepBlueprint: Omit<AgentStep, 'status'>[] = [
{
  key: 'ocr',
  label: 'Read documents',
  detail: 'ID, invoice, item declaration, parcel photo',
  owner: 'agent'
},
{
  key: 'crosscheck',
  label: 'Check rules',
  detail: 'Restricted items, KYC, COD, pricing',
  owner: 'agent'
},
{
  key: 'decision',
  label: 'Decision',
  detail: 'Clear for pickup or hold the order',
  owner: 'agent'
},
{
  key: 'flag',
  label: 'Draft message',
  detail: 'Zalo and app push asking the customer to fix it',
  owner: 'agent'
},
{
  key: 'handoff',
  label: 'CX review',
  detail: 'Approve or edit before the customer is contacted',
  owner: 'cx'
}];


export function buildSteps(statuses: Partial<Record<StepKey, StepStatus>>): AgentStep[] {
  return stepBlueprint.map((step) => ({
    ...step,
    status: statuses[step.key] ?? 'pending'
  }));
}

export function severityRank(severity: Finding['severity']): number {
  return severity === 'critical' ? 0 : severity === 'warning' ? 1 : 2;
}

export function buildMessageDraft(shipment: Shipment, findings: Finding[]): MessageDraft {
  const missing = findings.filter((f) => f.requiredDoc).map((f) => f.requiredDoc as string);
  const uniqueMissing = Array.from(new Set(missing));

  const missingLines = uniqueMissing.map((doc) => `• ${docLabels[doc]?.vi ?? doc}`).join('\n');
  const issueLines = findings.map((f) => `• ${f.titleVi}`).join('\n');

  return {
    channel: 'Zalo',
    to: shipment.contactPhone,
    status: 'draft',
    subject: `Đơn ${shipment.trackingNo} cần bổ sung thông tin`,
    body: `Chào ${shipment.sender},

Đơn ${shipment.trackingNo} (${shipment.origin} → ${shipment.destination}, ${shipment.service}) chưa thể lên chuyến vì:

${issueLines}

${uniqueMissing.length ? `Bạn bổ sung giúp Swift247:\n${missingLines}\n` : ''}
Bổ sung ngay trong app Swift247 (mục Đơn của tôi → ${shipment.trackingNo}). Đơn giữ chỗ đến ${shipment.pickupAt}; hàng giá trị ${formatVnd(shipment.declaredValue)}.

Cảm ơn bạn — Swift247 CX`
  };
}

export const stageMeta: Record<
  Shipment['stage'],
  {label: string;tone: 'default' | 'secondary' | 'destructive' | 'outline';}> =
{
  draft: { label: 'Draft', tone: 'outline' },
  submitted: { label: 'Submitted', tone: 'secondary' },
  checking: { label: 'Checking', tone: 'secondary' },
  flagged: { label: 'Flagged', tone: 'destructive' },
  awaiting_shipper: { label: 'Waiting on customer', tone: 'outline' },
  compliance_ok: { label: 'Cleared', tone: 'default' },
  accepted: { label: 'Picked up', tone: 'default' }
};