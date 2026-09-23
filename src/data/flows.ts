import { OrderChannel } from '../types/cargo';
import { flowTemplates } from './flowTemplates';
import { operators } from './team';

export interface FlowSummary {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  trigger: string;
  channels: OrderChannel[];
  owner: string;
  outcome: string;
  promise: string;
  steps: string[];
}

interface FlowSeed {
  status: FlowSummary['status'];
  trigger: string;
  channels: OrderChannel[];
  owner: string;
  outcome: string;
  promise: string;
  steps: string[];
}

const seeds: Record<string, FlowSeed> = {
  full: {
    status: 'active',
    trigger: 'Order submitted',
    channels: ['Swift247 app', 'Website', 'Shopee', 'TikTok Shop'],
    owner: operators[0].name,
    outcome: 'Cleared to SmartKargo, or a draft waiting in Approvals.',
    promise: 'The default lane. Read every document, apply the cargo rules, and loop in Operations only when the agent is unsure.',
    steps: ['Receive documents', 'Extract data', 'Check documents and data', 'Decide']
  },
  'fast-track': {
    status: 'active',
    trigger: 'Order submitted',
    channels: ['Swift247 app', 'Website'],
    owner: operators[1].name,
    outcome: 'A pass writes the order status. No Operations queue.',
    promise: 'Skip the human step when the documents are clean and the goods are ordinary.',
    steps: ['Receive documents', 'Extract data', 'Decide', 'Update status']
  },
  'dg-screening': {
    status: 'paused',
    trigger: 'Restricted item detected',
    channels: ['Swift247 app', 'Shopee', 'Partner counter'],
    owner: operators[2].name,
    outcome: 'Restricted items are flagged before they reach the truck.',
    promise: 'Hold the lane on dangerous goods. Everything else can wait.',
    steps: ['Receive documents', 'Extract data', 'DG rules', 'Flag']
  },
  'manual-review': {
    status: 'draft',
    trigger: 'Order submitted',
    channels: ['Partner counter'],
    owner: operators[3].name,
    outcome: 'A draft message sits in Approvals for every order.',
    promise: 'Every order goes to Operations. Use when you want a person on every file.',
    steps: ['Receive documents', 'Extract data', 'Approval', 'Request docs']
  }
};

export const flows: FlowSummary[] = flowTemplates.map((template) => {
  const seed = seeds[template.id];
  if (!seed) {
    throw new Error(`Missing flow seed for ${template.id}`);
  }
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    status: seed.status,
    trigger: seed.trigger,
    channels: seed.channels,
    owner: seed.owner,
    outcome: seed.outcome,
    promise: seed.promise,
    steps: seed.steps
  };
});
