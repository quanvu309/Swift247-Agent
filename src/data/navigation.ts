import { Inbox, ListChecks, LucideIcon, Package, PlugZap, ScanSearch, Users, Workflow } from 'lucide-react';

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

/** What a business user needs every day. */
export const primaryNav: NavItem[] = [
{ to: '/design', label: 'Check an order', icon: ScanSearch },
{ to: '/approvals', label: 'To review', icon: Inbox, badge: 'ops' },
{ to: '/orders', label: 'Orders', icon: Package }];


/** Setup that only admins touch. Collapsed at the bottom of the sidebar. */
export const adminNav: NavItem[] = [
{ to: '/builder', label: 'Flow Design', icon: Workflow },
{ to: '/rules', label: 'Rules', icon: ListChecks },
{ to: '/connections', label: 'SmartKargo', icon: PlugZap },
{ to: '/account', label: 'Users & mailboxes', icon: Users, end: true }];


export const navGroups: NavGroup[] = [
{ lane: 'Workspace', items: primaryNav },
{ lane: 'Admin', items: adminNav }];


export function isAdminPath(pathname: string): boolean {
  const root = `/${pathname.split('/').filter(Boolean)[0] ?? ''}`;
  return adminNav.some((item) => item.to === root);
}

export interface Crumb {
  label: string;
  to?: string;
}

/** Breadcrumbs: section › record. Admin pages keep an Admin prefix. */
export function resolveBreadcrumbs(pathname: string, recordLabel?: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const root = `/${segments[0] ?? ''}`;

  for (const group of navGroups) {
    const item = group.items.find((i) => i.to === root);
    if (!item) continue;

    const crumbs: Crumb[] = group.lane === 'Admin' ? [{ label: 'Admin' }] : [];
    crumbs.push({ label: item.label, to: item.to });
    if (segments.length > 1) crumbs.push({ label: recordLabel ?? segments[1] });
    return crumbs;
  }

  return [{ label: 'Swift247' }];
}
