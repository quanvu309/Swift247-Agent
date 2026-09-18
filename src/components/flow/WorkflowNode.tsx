import '@xyflow/react/dist/style.css';
import React from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { Loader2, Send } from 'lucide-react';
import { kindMeta, statusMeta } from './nodeKindMeta';
import { FlowNodeData } from '../../types/flow';
import { cn } from '../../utils/cn';

const handleClass = '!h-2.5 !w-2.5 !rounded-full !border-2 !border-muted-foreground/60 !bg-background';

export function WorkflowNode({ data, selected }: NodeProps) {
  const node = data as FlowNodeData;
  const kind = kindMeta[node.kind];
  const status = statusMeta[node.status];
  const Icon = node.kind === 'output' && node.system === 'Messaging' ? Send : kind.icon;
  const isCondition = node.kind === 'condition';

  return (
    <div
      className={cn(
        'w-[248px] rounded-xl border bg-card text-left transition-all',
        selected ?
        'border-ring shadow-md ring-2 ring-ring/25' :
        'border-border shadow-sm hover:border-ring/40 hover:shadow-md',
        node.status === 'running' && 'border-brand-orange ring-2 ring-brand-orange/25',
        node.status === 'skipped' && 'opacity-55',
        !node.enabled && 'opacity-45 saturate-0'
      )}>
      
      {node.kind !== 'trigger' ?
      <Handle type="target" position={Position.Left} className={handleClass} /> :
      null}

      <div className="flex items-start gap-2.5 p-3">
        <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', kind.tile)}>
          {node.status === 'running' ?
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> :

          <Icon className="h-4 w-4" aria-hidden="true" />
          }
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{kind.label}</p>
          <p className="truncate text-sm font-medium leading-snug text-foreground">{node.title}</p>
          <p className="truncate text-xs leading-snug text-muted-foreground">{node.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-1.5">
        <span className="truncate text-[10px] text-muted-foreground">{node.system}</span>
        <span className={cn('flex shrink-0 items-center gap-1.5 text-[10px]', status.text)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} aria-hidden="true" />
          {status.label}
        </span>
      </div>

      {isCondition ?
      <>
          <Handle id="yes" type="source" position={Position.Right} style={{ top: '38%' }} className={handleClass} />
          <Handle id="no" type="source" position={Position.Right} style={{ top: '76%' }} className={handleClass} />
          <span className="pointer-events-none absolute -right-9 top-[30%] rounded bg-chart-2 px-1 font-mono text-[9px] font-semibold text-white">
            YES
          </span>
          <span className="pointer-events-none absolute -right-8 top-[68%] rounded bg-destructive px-1 font-mono text-[9px] font-semibold text-white">
            NO
          </span>
        </> :

      <Handle type="source" position={Position.Right} className={handleClass} />
      }
    </div>);

}