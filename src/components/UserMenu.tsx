import React, { useEffect, useRef, useState } from 'react';
import { Check, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Separator } from './ui/Separator';
import { useSession } from '../contexts/SessionContext';
import { cn } from '../utils/cn';

export function UserMenu() {
  const { user, team, signInAs } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'flex items-center rounded-full border border-transparent p-0.5 outline-none transition-colors',
          'hover:border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          open && 'border-border'
        )}>
        
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-xs text-primary-foreground">{user.initials}</AvatarFallback>
        </Avatar>
        <span className="sr-only">Account menu for {user.name}</span>
      </button>

      {open ?
      <div
        role="menu"
        className="absolute right-0 top-11 z-40 w-[260px] overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
        
          <div className="flex items-start gap-3 p-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-xs text-primary-foreground">{user.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className="text-[10px]">
                  {user.role}
                </Badge>
                <span className="font-mono text-[10px] text-muted-foreground">{user.team}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="max-h-44 overflow-y-auto py-1">
            <p className="px-3 py-1 text-xs font-medium text-muted-foreground">
              Switch user
            </p>
            {team.map((member) =>
          <button
            key={member.id}
            type="button"
            role="menuitem"
            onClick={() => {
              signInAs(member.id);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-accent">
            
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px]">{member.initials}</AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-foreground">{member.name}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">{member.role}</span>
                </span>
                {member.id === user.id ? <Check className="h-3.5 w-3.5 text-foreground" aria-hidden="true" /> : null}
              </button>
          )}
          </div>

          <Separator />

          <div className="p-2">
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" disabled>
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </div> :
      null}
    </div>);

}