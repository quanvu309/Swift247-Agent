import React from 'react';
import { NavLink } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/Tooltip';
import { Badge } from './ui/Badge';
import { navGroups } from '../data/navigation';
import { cn } from '../utils/cn';

interface SidebarNavProps {
  collapsed?: boolean;
  counts: Record<string, number>;
  onNavigate?: () => void;
}

export function SidebarNav({ collapsed = false, counts, onNavigate }: SidebarNavProps) {
  return (
    <nav className={cn('flex flex-col gap-5', collapsed ? 'px-2' : 'px-3')} aria-label="Main">
      {navGroups.map((group) =>
      <div key={group.lane} className="space-y-1">
          {collapsed ?
        <div className="mx-auto my-2 h-px w-5 bg-sidebar-border" aria-hidden="true" /> :

        <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
              {group.lane}
            </p>
        }

          {group.items.map((item) => {
          const count = item.badge ? counts[item.badge] ?? 0 : 0;

          const link =
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
            cn(
              'group relative flex h-9 items-center rounded-lg text-sm outline-none transition-colors',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar',
              collapsed ? 'w-9 justify-center' : 'gap-2.5 px-2.5',
              isActive ?
              'bg-primary/10 font-medium text-primary' :
              'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )
            }>
            
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {collapsed ?
            <>
                    <span className="sr-only">{item.label}</span>
                    {count > 0 ?
              <span
                className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive"
                aria-hidden="true" /> :

              null}
                  </> :

            <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {count > 0 ?
              <Badge variant="destructive" className="h-5 min-w-5 justify-center px-1.5 text-[10px]">
                        {count}
                      </Badge> :
              null}
                  </>
            }
              </NavLink>;


          if (!collapsed) return link;

          return (
            <Tooltip key={item.to}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>);

        })}
        </div>
      )}
    </nav>);

}