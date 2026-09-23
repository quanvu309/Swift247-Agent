import { Edge, MarkerType, Node } from '@xyflow/react';
import { FlowNodeData, PaletteNode } from '../types/flow';

export const initialFlowNodes: Node<FlowNodeData>[] = [
{
  id: 'trigger',
  type: 'workflow',
  position: { x: 0, y: 200 },
  data: {
    title: 'Receive documents',
    subtitle: 'Order + document pack',
    kind: 'trigger',
    system: 'Customer',
    params: [
    {
      label: 'Trigger on',
      value: 'Order submit',
      control: 'select',
      options: ['Order submit', 'Re-upload', 'Both']
    },
    {
      label: 'Channels',
      value: 'App, Web, Shopee, TikTok Shop',
      control: 'tags',
      hint: 'Orders from other channels are ignored'
    },
    { label: 'Require uploads', value: 'on', control: 'toggle' }],

    notes: 'Fires when a customer submits or re-uploads anything on an order.',
    status: 'idle',
    enabled: true
  }
},
{
  id: 'ocr',
  type: 'workflow',
  position: { x: 300, y: 200 },
  data: {
    title: 'Extract data',
    subtitle: 'API + OCR',
    kind: 'extract',
    system: 'AI Agent',
    stepKey: 'ocr',
    params: [
    {
      label: 'Engine',
      value: 'DocAI v3',
      control: 'select',
      options: ['DocAI v3', 'DocAI v2', 'Tesseract']
    },
    {
      label: 'Languages',
      value: 'vi, en',
      control: 'tags'
    },
    {
      label: 'Confidence floor',
      value: '0.80',
      control: 'number',
      hint: 'Fields below this are marked low confidence'
    },
    { label: 'Retry on failure', value: 'on', control: 'toggle' }],

    notes: 'Low-confidence fields are surfaced in the run log instead of failing the order.',
    status: 'idle',
    enabled: true
  }
},
{
  id: 'reference',
  type: 'workflow',
  position: { x: 600, y: 10 },
  data: {
    title: 'Fetch SmartKargo data',
    subtitle: 'Orders, rules, restricted list',
    kind: 'lookup',
    system: 'SmartKargo',
    params: [
    {
      label: 'Connection',
      value: 'SmartKargo PROD',
      control: 'select',
      options: ['SmartKargo PROD', 'SmartKargo UAT', 'SmartKargo Sandbox']
    },
    {
      label: 'Datasets',
      value: 'orders, rules, restricted, routes',
      control: 'tags'
    },
    { label: 'Cache', value: '5', control: 'number', unit: 'min' }],

    notes: 'Read-only. No order is modified here.',
    status: 'idle',
    enabled: true
  }
},
{
  id: 'crosscheck',
  type: 'workflow',
  position: { x: 600, y: 240 },
  data: {
    title: 'Check documents and data',
    subtitle: 'Doc set, data match, restricted',
    kind: 'extract',
    system: 'AI Agent',
    stepKey: 'crosscheck',
    params: [
    {
      label: 'Rule sets',
      value: 'Order, Service, Restricted, KYC',
      control: 'tags'
    },
    {
      label: 'On rule error',
      value: 'Continue and flag',
      control: 'select',
      options: ['Continue and flag', 'Stop the run', 'Skip the rule']
    },
    { label: 'Score threshold', value: '40', control: 'number', unit: 'risk' }],

    notes: 'Every violation becomes a finding the customer can act on.',
    status: 'idle',
    enabled: true
  }
},
{
  id: 'decision',
  type: 'workflow',
  position: { x: 900, y: 240 },
  data: {
    title: 'Complete and compliant?',
    subtitle: 'Decision gate',
    kind: 'condition',
    system: 'AI Agent',
    stepKey: 'decision',
    params: [
    {
      label: 'Pass when',
      value: 'No critical findings',
      control: 'select',
      options: ['No critical findings', 'No findings at all', 'Risk below threshold']
    },
    { label: 'Max critical', value: '0', control: 'number' },
    {
      label: 'Hold on warnings',
      value: 'off',
      control: 'toggle',
      hint: 'Warnings such as insurance fees do not block pickup'
    }],

    notes: 'Warnings such as insurance fees are attached to the order instead of blocking it.',
    status: 'idle',
    enabled: true
  }
},
{
  id: 'status-update',
  type: 'workflow',
  position: { x: 1220, y: 70 },
  data: {
    title: 'Update compliance status',
    subtitle: 'SmartKargo, cleared for pickup',
    kind: 'output',
    system: 'SmartKargo',
    params: [
    { label: 'Endpoint', value: 'PATCH /orders/{id}/status', control: 'text' },
    {
      label: 'Set status',
      value: 'CLEARED_FOR_PICKUP',
      control: 'select',
      options: ['CLEARED_FOR_PICKUP', 'READY_TO_FLY', 'ON_HOLD']
    },
    { label: 'Set pickup window', value: 'on', control: 'toggle' }],

    notes: 'The only node that writes to SmartKargo on the cleared path.',
    status: 'idle',
    enabled: true
  }
},
{
  id: 'accepted',
  type: 'workflow',
  position: { x: 1520, y: 70 },
  data: {
    title: 'Shipment accepted',
    subtitle: 'Ready for courier pickup',
    kind: 'output',
    system: 'SmartKargo',
    params: [
    { label: 'Status', value: 'CLEARED_FOR_PICKUP', control: 'text' }],

    notes: 'End of the cleared path. The courier can collect the parcel.',
    status: 'idle',
    enabled: true
  }
},
{
  id: 'flag',
  type: 'workflow',
  position: { x: 1220, y: 400 },
  data: {
    title: 'Flag and draft request email',
    subtitle: 'Email to customer',
    kind: 'action',
    system: 'AI Agent',
    stepKey: 'flag',
    params: [
    {
      label: 'Template',
      value: 'missing-info.vi',
      control: 'select',
      options: ['missing-info.vi', 'missing-info.en', 'restricted-item.vi']
    },
    {
      label: 'Tone',
      value: 'Short, consumer',
      control: 'select',
      options: ['Short, consumer', 'Formal', 'Apologetic']
    },
    { label: 'Include deep link', value: 'on', control: 'toggle' }],

    notes: 'Drafts only. Nothing is sent from this node.',
    status: 'idle',
    enabled: true
  }
},
{
  id: 'approval',
  type: 'workflow',
  position: { x: 1520, y: 400 },
  data: {
    title: 'Operations approves',
    subtitle: 'Human in the loop',
    kind: 'human',
    system: 'Ops team',
    stepKey: 'handoff',
    params: [
    {
      label: 'Queue',
      value: 'Ops approvals',
      control: 'select',
      options: ['Ops approvals', 'Ops escalations', 'Fraud review']
    },
    { label: 'SLA', value: '15', control: 'number', unit: 'min' },
    {
      label: 'Auto-send after SLA',
      value: 'off',
      control: 'toggle',
      hint: 'Leave off to always require a human'
    }],

    notes: 'Operations can edit the email before approving.',
    status: 'idle',
    enabled: true
  }
},
{
  id: 'request-docs',
  type: 'workflow',
  position: { x: 1820, y: 400 },
  data: {
    title: 'Send email to customer',
    subtitle: 'Email',
    kind: 'output',
    system: 'Messaging',
    params: [
    { label: 'Channels', value: 'Email', control: 'tags' },
    { label: 'Reminder every', value: '2', control: 'number', unit: 'h' },
    { label: 'Stop on re-upload', value: 'on', control: 'toggle' }],

    notes: 'Re-uploads re-enter the workflow at the trigger node.',
    status: 'idle',
    enabled: true
  }
}];


const edgeBase = {
  type: 'smoothstep' as const,
  markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 }
};

export const initialFlowEdges: Edge[] = [
{ ...edgeBase, id: 'e-trigger-ocr', source: 'trigger', target: 'ocr' },
{ ...edgeBase, id: 'e-ocr-crosscheck', source: 'ocr', target: 'crosscheck' },
{
  ...edgeBase,
  id: 'e-reference-crosscheck',
  source: 'reference',
  target: 'crosscheck',
  label: 'rules',
  style: { strokeDasharray: '4 4' }
},
{ ...edgeBase, id: 'e-crosscheck-decision', source: 'crosscheck', target: 'decision' },
{
  ...edgeBase,
  id: 'e-decision-ok',
  source: 'decision',
  sourceHandle: 'yes',
  target: 'status-update',
  label: 'YES'
},
{
  ...edgeBase,
  id: 'e-decision-flag',
  source: 'decision',
  sourceHandle: 'no',
  target: 'flag',
  label: 'NO'
},
{ ...edgeBase, id: 'e-status-accepted', source: 'status-update', target: 'accepted' },
{ ...edgeBase, id: 'e-flag-approval', source: 'flag', target: 'approval' },
{ ...edgeBase, id: 'e-approval-request', source: 'approval', target: 'request-docs' },
{
  ...edgeBase,
  id: 'e-request-trigger',
  source: 'request-docs',
  target: 'trigger',
  targetHandle: 'resubmit',
  label: 'customer resubmits',
  style: { strokeDasharray: '4 4' }
}];


export const paletteNodes: PaletteNode[] = [
{
  id: 'order-lookup',
  title: 'Order lookup',
  subtitle: 'Read order from SmartKargo',
  kind: 'lookup',
  system: 'SmartKargo',
  params: [
  { label: 'Endpoint', value: 'GET /orders/{id}', control: 'text' },
  { label: 'Returns', value: 'route, service, COD', control: 'tags' }]

},
{
  id: 'restricted-check',
  title: 'Restricted item check',
  subtitle: 'Match against prohibited list',
  kind: 'extract',
  system: 'AI Agent',
  params: [
  {
    label: 'Source',
    value: '/restricted',
    control: 'select',
    options: ['/restricted', '/restricted/dg', '/restricted/custom']
  },
  { label: 'Scope', value: 'Item text, Photo', control: 'tags' }]

},
{
  id: 'ekyc',
  title: 'eKYC sender ID',
  subtitle: 'Match sender CCCD',
  kind: 'extract',
  system: 'AI Agent',
  params: [
  { label: 'Checks', value: 'Face, ID number', control: 'tags' },
  { label: 'Trigger above', value: '5000000', control: 'number', unit: '₫' }]

},
{
  id: 'cod-insurance',
  title: 'COD & insurance',
  subtitle: 'Apply fees and ceilings',
  kind: 'action',
  system: 'SmartKargo',
  params: [
  { label: 'Insurance rate', value: '0.5', control: 'number', unit: '%' },
  { label: 'COD ceiling', value: '10000000', control: 'number', unit: '₫' }]

},
{
  id: 'notify-cx',
  title: 'Notify CX channel',
  subtitle: 'Post alert to CX channel',
  kind: 'action',
  system: 'CX team',
  params: [
  { label: 'Channel', value: '#swift247-cx', control: 'text' },
  { label: 'Includes', value: 'Order, Findings, Risk', control: 'tags' }]

},
{
  id: 'order-status-write',
  title: 'Write order status',
  subtitle: 'Update order status',
  kind: 'output',
  system: 'SmartKargo',
  params: [
  { label: 'Endpoint', value: 'PATCH /orders/{id}/status', control: 'text' },
  { label: 'Requires approval', value: 'on', control: 'toggle' }]

}];