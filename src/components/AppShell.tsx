import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronRight, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Separator } from './ui/Separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/Tooltip';
import { SidebarNav } from './SidebarNav';
import { UserMenu } from './UserMenu';
import { useWorkflow } from '../contexts/WorkflowContext';
import { resolveBreadcrumbs } from '../data/navigation';
import { cn } from '../utils/cn';

const MIN_WIDTH = 208;
const MAX_WIDTH = 360;
const RAIL_WIDTH = 60;
const STORAGE_KEY = 'swift247.sidebar';

export function AppShell({ children }: {children: React.ReactNode;}) {
  const { shipments } = useWorkflow();
  const location = useLocation();
  const isCanvas = location.pathname === '/builder';

  const [width, setWidth] = useState(264);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as {width?: number;collapsed?: boolean;};
      if (saved.width) setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, saved.width)));
      if (typeof saved.collapsed === 'boolean') setCollapsed(saved.collapsed);
    } catch {

      /* ignore malformed state */}
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ width, collapsed }));
  }, [width, collapsed]);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const startResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (collapsed) setCollapsed(false);
      setDragging(true);

      const startX = e.clientX;
      const startWidth = collapsed ? MIN_WIDTH : width;

      const onMove = (ev: MouseEvent) => {
        const next = startWidth + (ev.clientX - startX);
        if (next < MIN_WIDTH - 32) {
          setCollapsed(true);
          return;
        }
        setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, next)));
      };
      const onUp = () => {
        setDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [collapsed, width]
  );

  const onHandleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setWidth((w) => Math.max(MIN_WIDTH, w - 16));
    if (e.key === 'ArrowRight') setWidth((w) => Math.min(MAX_WIDTH, w + 16));
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setCollapsed((c) => !c);
    }
  };

  const opsCount = shipments.filter((s) => s.stage === 'flagged').length;
  const agentCount = shipments.filter((s) => s.stage === 'submitted' || s.stage === 'checking').length;
  const counts = { ops: opsCount, agent: agentCount };

  const record = shipments.find((s) => location.pathname.endsWith(s.id));
  const crumbs = resolveBreadcrumbs(location.pathname, record?.trackingNo);
  const sidebarWidth = collapsed ? RAIL_WIDTH : width;

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn('flex w-full bg-background', isCanvas ? 'h-svh overflow-hidden' : 'min-h-svh')}
        ref={frame}>
        {/* Desktop sidebar. Sticky so a long page does not scroll the rail away. */}
        <aside
          className={cn(
            'sticky top-0 z-30 hidden h-svh shrink-0 flex-col self-start border-r border-sidebar-border bg-sidebar lg:flex',
            !dragging && 'transition-[width] duration-150 ease-out'
          )}
          style={{ width: sidebarWidth }}>
          
          <div className={cn('flex h-16 shrink-0 items-center', collapsed ? 'justify-center px-2' : 'px-4')}>
            <Link
              to="/"
              aria-label="Swift247 Control Center"
              className="flex min-w-0 items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
              
              {collapsed ?
              <img src="/swift247-mark.png" alt="" className="h-9 w-9 object-contain" /> :

              <img src="/swift247-logo.png" alt="Swift247" className="h-8 w-auto" />

              }
            </Link>
          </div>

          <Separator />

          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-3">
            <SidebarNav collapsed={collapsed} counts={counts} />
          </div>

          <Separator />

          <div className={cn('flex items-center py-3', collapsed ? 'justify-center px-2' : 'px-4')}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setCollapsed((c) => !c)}
                  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
                  
                  {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</TooltipContent>
            </Tooltip>
          </div>

          {/* Resize handle */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            tabIndex={0}
            onMouseDown={startResize}
            onDoubleClick={() => setCollapsed((c) => !c)}
            onKeyDown={onHandleKey}
            className={cn(
              'group absolute -right-1 top-0 z-30 h-full w-2 cursor-col-resize outline-none',
              'after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:-translate-x-1/2 after:bg-transparent after:transition-colors',
              'hover:after:bg-ring focus-visible:after:bg-ring',
              dragging && 'after:bg-ring'
            )} />
          
        </aside>

        {/* Mobile drawer */}
        {mobileOpen ?
        <div className="fixed inset-0 z-50 lg:hidden">
            <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true" />
          
            <div className="absolute inset-y-0 left-0 flex w-[272px] flex-col border-r border-sidebar-border bg-sidebar shadow-xl">
              <div className="flex h-16 items-center justify-between px-4">
                <img src="/swift247-logo.png" alt="Swift247" className="h-8 w-auto" />
              
                <Button variant="ghost" size="icon-sm" aria-label="Close navigation" onClick={() => setMobileOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Separator />
              <div className="flex-1 overflow-y-auto py-3">
                <SidebarNav counts={counts} onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>
          </div> :
        null}

        {/* Main column */}
        <div className={cn('flex min-w-0 flex-1 flex-col', isCanvas ? 'h-full min-h-0' : 'min-h-svh')}>
          <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur md:px-8">
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}>
              
              <PanelLeftOpen className="h-4 w-4" />
            </Button>

            <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
              <ol className="flex min-w-0 items-center gap-1.5 text-sm">
                {crumbs.map((crumb, i) => {
                  const last = i === crumbs.length - 1;
                  return (
                    <li key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
                      {i > 0 ?
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" aria-hidden="true" /> :
                      null}
                      {crumb.to && !last ?
                      <Link
                        to={crumb.to}
                        className="truncate rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        
                          {crumb.label}
                        </Link> :

                      <span
                        className={cn(
                          'truncate',
                          last ? 'font-medium text-foreground' : 'text-muted-foreground',
                          i === 0 && crumbs.length > 1 && 'hidden sm:inline'
                        )}
                        aria-current={last ? 'page' : undefined}>
                        
                          {crumb.label}
                        </span>
                      }
                    </li>);

                })}
              </ol>
            </nav>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label={`${opsCount} to review`} asChild>
                  <Link to="/approvals">
                    <Bell className="h-4 w-4" />
                    {opsCount > 0 ?
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" aria-hidden="true" /> :
                    null}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{opsCount} to review</TooltipContent>
            </Tooltip>

            <UserMenu />
          </header>

          <main
            className={cn(
              'min-w-0 flex-1',
              isCanvas && 'flex min-h-0 flex-col',
              !isCanvas && 'bg-brand-lavender/40 px-4 py-7 md:px-8 md:py-10'
            )}>
            <div
              className={cn(
                'mx-auto w-full',
                isCanvas && 'flex min-h-0 flex-1 flex-col',
                !isCanvas && 'max-w-[1120px]'
              )}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>);

}