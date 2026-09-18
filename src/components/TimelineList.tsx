import React from 'react';
import { Bot, Database, Headset, User } from 'lucide-react';
import { Actor, TimelineEvent } from '../types/cargo';

const actorMeta: Record<Actor, {icon: React.ComponentType<{className?: string;}>;label: string;}> = {
  customer: { icon: User, label: 'Customer' },
  agent: { icon: Bot, label: 'AI agent' },
  cx: { icon: Headset, label: 'CX team' },
  smartkargo: { icon: Database, label: 'SmartKargo' }
};

export function TimelineList({ events }: {events: TimelineEvent[];}) {
  return (
    <ol className="space-y-4">
      {[...events].reverse().map((ev) => {
        const meta = actorMeta[ev.actor];
        const Icon = meta.icon;
        return (
          <li key={ev.id} className="flex gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-foreground">{ev.label}</p>
              <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{meta.label}</span>
                <span className="font-mono">{ev.at}</span>
              </p>
            </div>
          </li>);

      })}
    </ol>);

}