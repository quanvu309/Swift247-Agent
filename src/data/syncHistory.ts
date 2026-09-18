export interface SyncedDataset {
  id: string;
  name: string;
  endpoint: string;
  records: string;
  frequency: string;
  lastSync: string;
  status: 'ok' | 'stale' | 'error';
}

export interface SyncRun {
  id: string;
  at: string;
  dataset: string;
  direction: 'pull' | 'push';
  records: number;
  duration: string;
  status: 'success' | 'partial' | 'failed';
  detail: string;
}

export const syncedDatasets: SyncedDataset[] = [
{
  id: 'orders',
  name: 'Orders',
  endpoint: 'GET /orders',
  records: '42,180',
  frequency: 'Every 5 min',
  lastSync: '2 min ago',
  status: 'ok'
},
{
  id: 'service-rules',
  name: 'Service rules',
  endpoint: 'GET /rules',
  records: '9 active',
  frequency: 'Daily 02:00',
  lastSync: '9 h ago',
  status: 'ok'
},
{
  id: 'restricted',
  name: 'Restricted items',
  endpoint: 'GET /restricted',
  records: '36 entries',
  frequency: 'Hourly',
  lastSync: '48 min ago',
  status: 'stale'
},
{
  id: 'routes',
  name: 'Routes & cut-off',
  endpoint: 'GET /routes',
  records: '14 routes',
  frequency: 'Every 15 min',
  lastSync: '11 min ago',
  status: 'ok'
},
{
  id: 'order-status',
  name: 'Order status',
  endpoint: 'PATCH /orders/{id}',
  records: '128 today',
  frequency: 'On decision',
  lastSync: '6 min ago',
  status: 'ok'
}];


export const syncRuns: SyncRun[] = [
{
  id: 'sr-1',
  at: '2026-09-17 09:42',
  dataset: 'Order status',
  direction: 'push',
  records: 1,
  duration: '0.4s',
  status: 'success',
  detail: 'SW247-8842127 → CLEARED_FOR_PICKUP'
},
{
  id: 'sr-2',
  at: '2026-09-17 09:40',
  dataset: 'Orders',
  direction: 'pull',
  records: 184,
  duration: '1.2s',
  status: 'success',
  detail: 'Delta since 09:35, app + Shopee'
},
{
  id: 'sr-3',
  at: '2026-09-17 09:12',
  dataset: 'Restricted items',
  direction: 'pull',
  records: 36,
  duration: '2.8s',
  status: 'partial',
  detail: '3 entries skipped. Unknown category code'
},
{
  id: 'sr-4',
  at: '2026-09-17 08:41',
  dataset: 'Order status',
  direction: 'push',
  records: 1,
  duration: '0.5s',
  status: 'success',
  detail: 'SW247-8842140 → INFO_REQUESTED'
},
{
  id: 'sr-5',
  at: '2026-09-17 08:00',
  dataset: 'Routes & cut-off',
  direction: 'pull',
  records: 14,
  duration: '0.9s',
  status: 'success',
  detail: 'Cut-off times for today loaded'
},
{
  id: 'sr-6',
  at: '2026-09-17 07:15',
  dataset: 'Orders',
  direction: 'pull',
  records: 0,
  duration: '30.0s',
  status: 'failed',
  detail: 'Gateway timeout. Retried at 07:20'
},
{
  id: 'sr-7',
  at: '2026-09-16 23:00',
  dataset: 'Service rules',
  direction: 'pull',
  records: 9,
  duration: '1.1s',
  status: 'success',
  detail: 'Rule set 2026.09 loaded'
}];