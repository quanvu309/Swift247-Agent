export type ProcessOrder = 1 | 2 | 3 | 4;

export type ProcessStep<Order extends ProcessOrder> = Readonly<{
  order: Order;
  shortLabel: string;
  shortDetail: string;
  title: string;
  description: string;
}>;

export type ProcessSteps = readonly [
  ProcessStep<1>,
  ProcessStep<2>,
  ProcessStep<3>,
  ProcessStep<4>
];

export type SectionIntro = Readonly<{
  heading: string;
  description: string;
}>;

export type ValueItem = Readonly<{
  title: string;
  description: string;
}>;

export type FlowsLandingContent = Readonly<{
  hero: Readonly<{
    heading: string;
    description: string;
    supportingLine: string;
    primaryActionLabel: string;
    processActionLabel: string;
  }>;
  value: Readonly<{
    intro: SectionIntro;
    items: readonly [ValueItem, ValueItem, ValueItem];
  }>;
  how: SectionIntro;
  process: ProcessSteps;
  lanes: SectionIntro;
  closer: Readonly<{
    heading: string;
    description: string;
    actionLabel: string;
  }>;
}>;

export const flowsLandingContent: FlowsLandingContent = {
  hero: {
    heading: 'Every parcel checked before pickup.',
    description:
      'One agent flow reads the documents, applies the cargo rules, and either clears the order or drafts the customer message. CX steps in only when the file is unsure.',
    supportingLine: 'SAS sits between the shipper and SmartKargo. The truck does not leave on an unchecked file.',
    primaryActionLabel: 'Open the default flow',
    processActionLabel: 'How it works'
  },
  value: {
    intro: {
      heading: 'Pickup stays honest.',
      description:
        'The platform is not a run counter. It is the check that has to happen before a parcel is allowed on a truck.'
    },
    items: [
      {
        title: 'Documents become facts',
        description:
          'The agent reads the ID, invoice, packing list, and item photo. Low-confidence fields surface in the run. They do not silently pass.'
      },
      {
        title: 'Rules fire before pickup',
        description:
          'Dangerous goods, restricted items, and destination limits are checked against SmartKargo before a driver is assigned.'
      },
      {
        title: 'CX only sees exceptions',
        description:
          'A clean order is cleared. A problem becomes a drafted customer message in Approvals. Pickup stays on schedule.'
      }
    ]
  },
  how: {
    heading: 'Four beats. Then a gate.',
    description: 'The same language as the canvas. Order, read, rules, decide. Then clear or flag.'
  },
  process: [
    {
      order: 1,
      shortLabel: 'Order',
      shortDetail: 'Created',
      title: 'The order arrives',
      description: 'App, website, Shopee, TikTok Shop, or the partner counter. The lane starts when the shipper submits.'
    },
    {
      order: 2,
      shortLabel: 'Read',
      shortDetail: 'Documents',
      title: 'The agent reads',
      description:
        'Every attached file is extracted. Names, goods, batteries, liquids. The record is what the documents say, not what the form guessed.'
    },
    {
      order: 3,
      shortLabel: 'Check',
      shortDetail: 'Rules',
      title: 'The rules decide',
      description: 'Reference data from SmartKargo is applied once. Pass, or flag. No informal exception on the dock.'
    },
    {
      order: 4,
      shortLabel: 'Decide',
      shortDetail: 'Clear or flag',
      title: 'The lane ends',
      description:
        'Clear writes the order status. Flag drafts the ask and waits for CX. The truck does not leave on an unchecked file.'
    }
  ],
  lanes: {
    heading: 'Flows as products.',
    description: 'Each lane is a way the agent can run. Open one to see the canvas.'
  },
  closer: {
    heading: 'Exceptions stay in Approvals. Pickup stays on the clock.',
    description: 'Open the default lane, or go to the queue that holds the drafts.',
    actionLabel: 'Open the default flow'
  }
};
