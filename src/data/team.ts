import { ConnectedAccount, Operator } from '../types/session';

export const operators: Operator[] = [
{
  id: 'op-1',
  name: 'Trần Mỹ Linh',
  email: 'linh.tran@swift247.vn',
  role: 'CX lead',
  team: 'CX, HCM hub',
  initials: 'ML',
  lastActive: 'Now'
},
{
  id: 'op-2',
  name: 'Nguyễn Đức Huy',
  email: 'huy.nguyen@swift247.vn',
  role: 'CX agent',
  team: 'CX, HCM hub',
  initials: 'DH',
  lastActive: '12 min ago'
},
{
  id: 'op-3',
  name: 'Lê Phương Anh',
  email: 'anh.le@swift247.vn',
  role: 'Ops manager',
  team: 'Ops, HAN hub',
  initials: 'PA',
  lastActive: '1 h ago'
},
{
  id: 'op-4',
  name: 'Bùi Quang Vinh',
  email: 'vinh.bui@swift247.vn',
  role: 'Admin',
  team: 'Platform',
  initials: 'QV',
  lastActive: 'Yesterday'
}];


export const defaultAccounts: ConnectedAccount[] = [
{
  id: 'acc-1',
  provider: 'gmail',
  name: 'Customer support inbox',
  account: 'cskh@swift247.vn',
  status: 'connected',
  scopes: ['gmail.send', 'gmail.readonly'],
  connectedAt: '2026-08-14',
  lastActivity: '4 min ago',
  volume7d: 612,
  isSendingIdentity: true
},
{
  id: 'acc-2',
  provider: 'gmail',
  name: 'Marketplace orders',
  account: 'marketplace@swift247.vn',
  status: 'error',
  scopes: ['gmail.readonly'],
  connectedAt: '2026-09-02',
  lastActivity: '2 days ago',
  volume7d: 0,
  errorDetail: 'Token expired, re-authorize to resume reading'
},
{
  id: 'acc-3',
  provider: 'outlook',
  name: 'Ops escalations',
  account: 'ops@swift247.vn',
  status: 'disconnected',
  scopes: ['Mail.Send', 'Mail.Read']
},
{
  id: 'acc-4',
  provider: 'smartkargo',
  name: 'Compliance service account',
  account: 'svc_compliance_agent',
  status: 'connected',
  scopes: ['orders', 'rules', 'orders.status'],
  connectedAt: '2026-07-02',
  lastActivity: '2 min ago',
  volume7d: 4318
}];