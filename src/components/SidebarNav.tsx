import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Settings2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/Tooltip';
import { NavItem, adminNav, isAdminPath, primaryNav } from '../data/navigation';
import { cn } from '../utils/cn';

interface SidebarNavProps {
  collapsed?: boolean;
  counts: Record<string, number>;
  onNavigate?: () => void;
}

const ADMIN_KEY = 'swift247.adminOpen';

function readAdminOpen(): boolean {
  try {
    return window.localStorage.getItem(ADMIN_KEY) === '1';
  } catch {
    return false;
  }
}

function NavEntry({
  item,
  collapsed,
  count,
  onNavigate



}: {item: NavItem;collapsed: boolean;count: number;onNavigate?: () => void;}) {
  const link =
  <NavLink
    to={item.to}
    end={item.end}
    onClick={onNavigate}
    className={({ isActive }) =>
    cn(
      'group relative flex h-10 cursor-pointer items-center rounded-lg text-sm outline-none transition-colors duration-150',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar',
      collapsed ? 'w-10 justify-center' : 'gap-3 px-3',
      isActive ?
      'bg-background font-medium text-primary shadow-sm ring-1 ring-border' :
      'text-foreground/70 hover:bg-sidebar-accent hover:text-foreground'
    )
    }>

      <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      {collapsed ?
    <>
          <span className="sr-only">{item.label}</span>
          {count > 0 ?
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive" aria-hidden="true" /> :
      null}
        </> :

    <>
          <span className="flex-1 truncate">{item.label}</span>
          {count > 0 ?
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-semibold text-white">
              {count}
              <span className="sr-only"> waiting</span>
            </span> :
      null}
        </>
    }
    </NavLink>;


  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>);

}

export function SidebarNav({ collapsed = false, counts, onNavigate }: SidebarNavProps) {
  const location = useLocation();
  const onAdmin = isAdminPath(location.pathname);
  const [adminOpen, setAdminOpen] = useState(readAdminOpen);

  useEffect(() => {
    if (onAdmin) setAdminOpen(true);
  }, [onAdmin]);

  const toggleAdmin = () => {
    setAdminOpen((open) => {
      try {
        window.localStorage.setItem(ADMIN_KEY, open ? '0' : '1');
      } catch {
        /* storage unavailable */
      }
      return !open;
    });
  };

  const countFor = (item: NavItem) => item.badge ? counts[item.badge] ?? 0 : 0;

  return (
    <nav className={cn('flex h-full flex-col', collapsed ? 'items-center px-2' : 'px-3')} aria-label="Main">
      <div className="flex flex-col gap-1">
        {primaryNav.map((item) =>
        <NavEntry key={item.to} item={item} collapsed={collapsed} count={countFor(item)} onNavigate={onNavigate} />
        )}
      </div>

      <div className={cn('mt-auto pt-6', collapsed && 'flex flex-col items-center')}>
        {collapsed ?
        <div className="mb-2 h-px w-6 bg-sidebar-border" aria-hidden="true" /> :

        <button
          type="button"
          onClick={toggleAdmin}
          aria-expanded={adminOpen}
          aria-controls="admin-nav"
          className="flex h-9 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-sidebar-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">

            <Settings2 className="h-4 w-4" aria-hidden="true" />
            <span className="flex-1 text-left">Admin</span>
            <ChevronDown
            className={cn('h-4 w-4 transition-transform duration-200', adminOpen && 'rotate-180')}
            aria-hidden="true" />

          </button>
        }

        {collapsed || adminOpen ?
        <div id="admin-nav" className={cn('flex flex-col gap-1', !collapsed && 'mt-1')}>
            {adminNav.map((item) =>
          <NavEntry key={item.to} item={item} collapsed={collapsed} count={0} onNavigate={onNavigate} />
          )}
          </div> :
        null}
      </div>
    </nav>);

}
