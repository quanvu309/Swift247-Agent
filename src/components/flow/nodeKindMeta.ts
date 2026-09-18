import {
  CheckCircle2,
  Database,
  GitBranch,
  LucideIcon,
  MessageSquare,
  ScanLine,
  UserCheck,
  Zap } from
'lucide-react';
import { FlowNodeKind, FlowNodeStatus } from '../../types/flow';

export const kindMeta: Record<FlowNodeKind, {icon: LucideIcon;tile: string;label: string;}> = {
  trigger: { icon: Zap, tile: 'bg-chart-2/15 text-chart-2', label: 'Trigger' },
  extract: { icon: ScanLine, tile: 'bg-brand-magenta/15 text-brand-magenta', label: 'AI' },
  lookup: { icon: Database, tile: 'bg-brand-purple/10 text-brand-purple', label: 'Read' },
  condition: { icon: GitBranch, tile: 'bg-brand-orange/15 text-brand-orange', label: 'Condition' },
  action: { icon: MessageSquare, tile: 'bg-brand-red/10 text-brand-red', label: 'Action' },
  human: { icon: UserCheck, tile: 'bg-chart-5/20 text-chart-5', label: 'Human' },
  output: { icon: CheckCircle2, tile: 'bg-brand-purple/10 text-brand-purple', label: 'Write' }
};

export const statusMeta: Record<FlowNodeStatus, {dot: string;text: string;label: string;}> = {
  idle: { dot: 'bg-border', text: 'text-muted-foreground/70', label: 'Idle' },
  running: { dot: 'animate-pulse bg-brand-orange', text: 'text-brand-orange', label: 'Running' },
  done: { dot: 'bg-chart-2', text: 'text-chart-2', label: 'Done' },
  skipped: { dot: 'bg-muted-foreground/40', text: 'text-muted-foreground', label: 'Skipped' },
  error: { dot: 'bg-destructive', text: 'text-destructive', label: 'Error' }
};