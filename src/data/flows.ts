import { OrderChannel } from '../types/cargo';
import { flowTemplates } from './flowTemplates';
import { operators } from './team';

export interface DayVolume {
  day: string;
  cleared: number;
  flagged: number;
}

export interface FlowSummary {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  trigger: string;
  channels: OrderChannel[];
  owner: string;
  runs7d: number;
  passRate: number;
  avgSeconds: number;
  lastRunAt: string;
  series7d: DayVolume[];
}

interface FlowSeed {
  status: FlowSummary['status'];
  trigger: string;
  channels: OrderChannel[];
  owner: string;
  lastRunAt: string;
  scale: number;
  pass: number;
  avgSeconds: number;
  seed: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const ANCHOR = Date.UTC(2026, 8, 18);

function dayLabel(offset: number): string {
  const date = new Date(ANCHOR - offset * DAY_MS);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function volumeSeries(seed: number, days: number, scale: number, pass: number): DayVolume[] {
  const rows: DayVolume[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const swing = ((seed * (i + 3)) % 9) / 9;
    const total = Math.max(4, Math.round(scale * (0.72 + swing * 0.45)));
    const flagged = Math.max(0, Math.round(total * (1 - pass) * (0.7 + ((seed + i) % 5) / 10)));
    rows.push({ day: dayLabel(i), cleared: total - flagged, flagged });
  }
  return rows;
}

const seeds: Record<string, FlowSeed> = {
  full: {
    status: 'active',
    trigger: 'Order submitted',
    channels: ['Swift247 app', 'Website', 'Shopee', 'TikTok Shop'],
    owner: operators[0].name,
    lastRunAt: '2 min ago',
    scale: 86,
    pass: 0.91,
    avgSeconds: 11.4,
    seed: 17
  },
  'fast-track': {
    status: 'active',
    trigger: 'Order submitted',
    channels: ['Swift247 app', 'Website'],
    owner: operators[1].name,
    lastRunAt: '14 min ago',
    scale: 41,
    pass: 0.97,
    avgSeconds: 6.2,
    seed: 23
  },
  'dg-screening': {
    status: 'paused',
    trigger: 'Restricted item detected',
    channels: ['Swift247 app', 'Shopee', 'Partner counter'],
    owner: operators[2].name,
    lastRunAt: 'Yesterday',
    scale: 18,
    pass: 0.64,
    avgSeconds: 19.8,
    seed: 11
  },
  'manual-review': {
    status: 'draft',
    trigger: 'Order submitted',
    channels: ['Partner counter'],
    owner: operators[3].name,
    lastRunAt: 'Never',
    scale: 0,
    pass: 0,
    avgSeconds: 0,
    seed: 5
  }
};

export const flows: FlowSummary[] = flowTemplates.map((template) => {
  const seed = seeds[template.id];
  const series7d = volumeSeries(seed.seed, 7, seed.scale, seed.pass);
  const runs7d = series7d.reduce((sum, row) => sum + row.cleared + row.flagged, 0);
  const cleared = series7d.reduce((sum, row) => sum + row.cleared, 0);
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    status: seed.status,
    trigger: seed.trigger,
    channels: seed.channels,
    owner: seed.owner,
    runs7d,
    passRate: runs7d ? cleared / runs7d : 0,
    avgSeconds: seed.avgSeconds,
    lastRunAt: seed.lastRunAt,
    series7d
  };
});

export const runVolume14d: DayVolume[] = (() => {
  const byDay = new Map<string, DayVolume>();
  for (const template of flowTemplates) {
    const seed = seeds[template.id];
    for (const row of volumeSeries(seed.seed, 14, seed.scale, seed.pass)) {
      const current = byDay.get(row.day) ?? { day: row.day, cleared: 0, flagged: 0 };
      current.cleared += row.cleared;
      current.flagged += row.flagged;
      byDay.set(row.day, current);
    }
  }
  return volumeSeries(1, 14, 1, 1).map((row) => byDay.get(row.day) ?? row);
})();

export interface FlowKpis {
  orders7d: number;
  passRate: number;
  avgSeconds: number;
  hoursSaved: number;
  ordersDelta: string;
  passDelta: string;
  timeDelta: string;
  hoursDelta: string;
}

export function flowKpis(list: FlowSummary[]): FlowKpis {
  const orders7d = list.reduce((sum, flow) => sum + flow.runs7d, 0);
  const cleared = list.reduce((sum, flow) => sum + flow.runs7d * flow.passRate, 0);
  const passRate = orders7d ? cleared / orders7d : 0;
  const avgSeconds = orders7d
    ? list.reduce((sum, flow) => sum + flow.runs7d * flow.avgSeconds, 0) / orders7d
    : 0;
  const hoursSaved = (cleared * 48) / 3600;
  return {
    orders7d,
    passRate,
    avgSeconds,
    hoursSaved,
    ordersDelta: '+12% vs prior 7d',
    passDelta: '+1.4 pt vs prior 7d',
    timeDelta: '0.4s faster',
    hoursDelta: '+2.1 h vs prior 7d'
  };
}
