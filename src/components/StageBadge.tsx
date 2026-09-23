import { AlertTriangle, CheckCircle2, Circle, Clock, Loader2, Truck, type LucideIcon } from 'lucide-react';
import { ShipmentStage } from '../types/cargo';
import { cn } from '../utils/cn';

type Tone = 'neutral' | 'running' | 'hold' | 'waiting' | 'cleared' | 'done';

export const stageDisplay: Record<ShipmentStage, {label: string;tone: Tone;icon: LucideIcon;}> = {
  draft: { label: 'Not checked', tone: 'neutral', icon: Circle },
  submitted: { label: 'Ready to check', tone: 'neutral', icon: Circle },
  checking: { label: 'Checking', tone: 'running', icon: Loader2 },
  flagged: { label: 'On hold', tone: 'hold', icon: AlertTriangle },
  awaiting_shipper: { label: 'Waiting on customer', tone: 'waiting', icon: Clock },
  compliance_ok: { label: 'Cleared', tone: 'cleared', icon: CheckCircle2 },
  accepted: { label: 'Picked up', tone: 'done', icon: Truck }
};

const toneClass: Record<Tone, string> = {
  neutral: 'bg-muted text-muted-foreground ring-border',
  running: 'bg-brand-orange/10 text-[#B4460F] ring-brand-orange/25',
  hold: 'bg-destructive/10 text-[#B42318] ring-destructive/25',
  waiting: 'bg-chart-5/10 text-[#8A5410] ring-chart-5/30',
  cleared: 'bg-chart-2/10 text-[#1E6B48] ring-chart-2/30',
  done: 'bg-primary/10 text-primary ring-primary/20'
};

export function StageBadge({ stage, className }: {stage: ShipmentStage;className?: string;}) {
  const meta = stageDisplay[stage];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        toneClass[meta.tone],
        className
      )}>

      <Icon className={cn('h-3.5 w-3.5', meta.tone === 'running' && 'animate-spin motion-reduce:animate-none')} aria-hidden="true" />
      {meta.label}
    </span>);

}
