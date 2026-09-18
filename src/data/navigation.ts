import { Bot, LucideIcon, Package, PlugZap, ShieldCheck, UserRound, Workflow } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  badge?: 'ops' | 'agent';
}

export interface NavGroup {
  lane: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
{
  lane: 'Control center',
  items: [{ to: '/', label: 'Flow Design', icon: Workflow, end: true }]
},
{
  lane: 'Operations',
  items: [
  { to: '/agent', label: 'Executions', icon: Bot, end: true, badge: 'agent' },
  { to: '/ops', label: 'Approvals', icon: ShieldCheck, end: true, badge: 'ops' }]

},
{
  lane: 'Integration',
  items: [
  { to: '/smartkargo', label: 'Connection & sync', icon: PlugZap, end: true },
  { to: '/shipper', label: 'Orders', icon: Package, end: true }]

},
{
  lane: 'Workspace',
  items: [{ to: '/account', label: 'Account', icon: UserRound, end: true }]
}];


export interface Crumb {
  label: string;
  to?: string;
}

/** Breadcrumbs: lane › section › record. */
export function resolveBreadcrumbs(pathname: string, recordLabel?: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const root = `/${segments[0] ?? ''}`;

  for (const group of navGroups) {
    const item = group.items.find((i) => i.to === root || root === '/' && i.to === '/');
    if (!item) continue;

    const crumbs: Crumb[] = [{ label: group.lane }, { label: item.label, to: item.to }];
    if (segments.length > 1) crumbs.push({ label: recordLabel ?? segments[1] });
    return crumbs;
  }

  return [{ label: 'Swift247' }];
}