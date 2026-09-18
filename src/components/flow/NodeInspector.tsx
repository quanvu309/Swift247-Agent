import '@xyflow/react/dist/style.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edge, Node } from '@xyflow/react';
import {
  ArrowRight,
  Check,
  CornerDownRight,
  ExternalLink,
  MousePointerClick,
  Pencil,
  RotateCcw,
  X } from
'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Switch } from '../ui/CSwitch';
import { ScrollArea } from '../ui/ScrollArea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/Tooltip';
import { ParamControl } from './ParamControl';
import { kindMeta, statusMeta } from './nodeKindMeta';
import { FlowNodeData } from '../../types/flow';
import { cn } from '../../utils/cn';

interface NodeInspectorProps {
  node: Node<FlowNodeData> | null;
  nodes: Node<FlowNodeData>[];
  edges: Edge[];
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onRename: (id: string, title: string) => void;
  onUpdateParam: (id: string, label: string, value: string) => void;
  onClose: () => void;
}

function PortRow({ label, tag, direction }: {label: string;tag?: string;direction: 'in' | 'out';}) {
  const Icon = direction === 'in' ? CornerDownRight : ArrowRight;
  return (
    <li className="flex items-center gap-2 px-2.5 py-2">
      <Icon className="h-3 w-3 shrink-0 text-muted-foreground/60" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate text-[11px] text-foreground">{label}</span>
      {tag ?
      <span
        className={cn(
          'shrink-0 rounded px-1 font-mono text-[9px] font-semibold uppercase',
          tag.toLowerCase() === 'no' ? 'bg-destructive/10 text-destructive' : 'bg-chart-2/15 text-chart-2'
        )}>
        
          {tag}
        </span> :
      null}
    </li>);

}

export function NodeInspector({
  node,
  nodes,
  edges,
  onToggleEnabled,
  onRename,
  onUpdateParam,
  onClose
}: NodeInspectorProps) {
  const navigate = useNavigate();
  const [renaming, setRenaming] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');

  useEffect(() => {
    setRenaming(false);
    setTitleDraft(node?.data.title ?? '');
  }, [node?.id, node?.data.title]);

  if (!node) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-border">
          <MousePointerClick className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-foreground">No node selected</p>
        <p className="max-w-[180px] text-xs text-muted-foreground">
          Pick a node on the canvas to edit its parameters.
        </p>
      </div>);

  }

  const kind = kindMeta[node.data.kind];
  const status = statusMeta[node.data.status];
  const Icon = kind.icon;

  const title = (id: string) => nodes.find((n) => n.id === id)?.data.title ?? id;
  const incoming = edges.filter((e) => e.target === node.id);
  const outgoing = edges.filter((e) => e.source === node.id);

  const commitRename = () => {
    const next = titleDraft.trim();
    if (next && next !== node.data.title) onRename(node.id, next);
    setRenaming(false);
  };

  return (
    <div className="flex h-full flex-col bg-sidebar/40">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-background px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', kind.tile)}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            {renaming ?
            <Input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') {
                  setTitleDraft(node.data.title);
                  setRenaming(false);
                }
              }}
              aria-label="Node name"
              className="h-7 px-1.5 text-sm font-medium" /> :


            <button
              type="button"
              onClick={() => setRenaming(true)}
              className="group flex w-full min-w-0 items-center gap-1.5 rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
              
                <span className="truncate text-sm font-medium text-foreground">{node.data.title}</span>
                <Pencil
                className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true" />
              
              </button>
            }
            <p className="truncate text-[11px] text-muted-foreground">
              {kind.label} in {node.data.system}
            </p>
          </div>

          <Button variant="ghost" size="icon-xs" onClick={onClose} aria-label="Close inspector">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-2 py-1.5">
          <span className={cn('flex items-center gap-1.5 text-[11px]', status.text)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} aria-hidden="true" />
            {status.label}
          </span>
          <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
            {node.data.enabled ? 'Active' : 'Disabled'}
            <Switch
              size="sm"
              checked={node.data.enabled}
              onCheckedChange={(value) => onToggleEnabled(node.id, value)}
              aria-label="Node enabled" />
            
          </label>
        </div>
      </div>

      <Tabs defaultValue="parameters" className="flex min-h-0 flex-1 flex-col gap-0">
        <div className="shrink-0 border-b border-border bg-background px-2 py-2">
          <TabsList className="w-full">
            <TabsTrigger value="parameters" className="flex-1 text-xs">
              Parameters
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex-1 text-xs">
              Connections
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="parameters" className="mt-0 min-h-0 flex-1">
          <ScrollArea className="h-full">
            <div className="space-y-3 p-3">
              {node.data.params.map((param) =>
              <ParamControl
                key={param.label}
                param={param}
                onChange={(value) => onUpdateParam(node.id, param.label, value)} />

              )}

              <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                <p className="truncate font-mono text-[10px] text-muted-foreground">{node.id}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => toast.success('Parameters reset')}>
                      
                      <RotateCcw className="h-3 w-3" aria-hidden="true" />
                      Reset
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Restore defaults</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="connections" className="mt-0 min-h-0 flex-1">
          <ScrollArea className="h-full">
            <div className="p-3">
              <div className="overflow-hidden rounded-lg border border-border bg-background">
                <p className="border-b border-border bg-muted/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
                  Input
                </p>
                <ul className="divide-y divide-border">
                  {incoming.length ?
                  incoming.map((edge) => <PortRow key={edge.id} label={title(edge.source)} direction="in" />) :

                  <li className="px-2.5 py-2 text-[11px] text-muted-foreground/70">None</li>
                  }
                </ul>

                <p className="border-y border-border bg-muted/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
                  Output
                </p>
                <ul className="divide-y divide-border">
                  {outgoing.length ?
                  outgoing.map((edge) =>
                  <PortRow
                    key={edge.id}
                    label={title(edge.target)}
                    tag={edge.label ? String(edge.label) : undefined}
                    direction="out" />

                  ) :

                  <li className="px-2.5 py-2 text-[11px] text-muted-foreground/70">None</li>
                  }
                </ul>
              </div>

              <p className="mt-2 px-0.5 text-[11px] text-muted-foreground">
                Drag from a node handle on the canvas to add a connection.
              </p>
            </div>
          </ScrollArea>
        </TabsContent>

      </Tabs>

      {/* Footer */}
      <div className="flex shrink-0 items-center gap-2 border-t border-border bg-background px-3 py-2">
        {node.data.stepKey ?
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => navigate('/executions')}>
          
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
            Executions
          </Button> :
        null}
        <Button size="sm" className="ml-auto h-7 px-3 text-xs" onClick={onClose}>
          <Check className="h-3 w-3" aria-hidden="true" />
          Done
        </Button>
      </div>
    </div>);

}