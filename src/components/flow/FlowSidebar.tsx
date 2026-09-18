import React from 'react';
import { Check, Plus, Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { ScrollArea } from '../ui/ScrollArea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { kindMeta } from './nodeKindMeta';
import { paletteNodes } from '../../data/flowGraph';
import { FlowTemplate, flowTemplates } from '../../data/flowTemplates';
import { PaletteNode } from '../../types/flow';
import { cn } from '../../utils/cn';

interface FlowSidebarProps {
  onAddNode: (node: PaletteNode) => void;
  onApplyTemplate: (template: FlowTemplate) => void;
  activeTemplateId: string;
}

export function FlowSidebar({ onAddNode, onApplyTemplate, activeTemplateId }: FlowSidebarProps) {
  const [query, setQuery] = React.useState('');
  const nodes = paletteNodes.filter(
    (n) => n.title.toLowerCase().includes(query.toLowerCase()) || n.system.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Tabs defaultValue="templates" className="flex h-full min-h-0 flex-col gap-0 bg-sidebar/40">
      <div className="shrink-0 border-b border-border bg-background p-2">
        <TabsList className="w-full">
          <TabsTrigger value="templates" className="flex-1">
            Templates
          </TabsTrigger>
          <TabsTrigger value="nodes" className="flex-1">
            Nodes
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="templates" className="mt-0 min-h-0 flex-1">
        <ScrollArea className="h-full">
          <ul className="space-y-2 p-2">
            {flowTemplates.map((template) => {
              const active = activeTemplateId === template.id;
              return (
                <li key={template.id}>
                  <button
                    type="button"
                    onClick={() => onApplyTemplate(template)}
                    aria-pressed={active}
                    className={cn(
                      'group w-full rounded-lg border bg-background p-2.5 text-left outline-none transition-all',
                      'focus-visible:ring-2 focus-visible:ring-ring',
                      active ?
                      'border-ring ring-1 ring-ring/25' :
                      'border-border hover:border-ring/50 hover:shadow-sm'
                    )}>
                    
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 truncate text-xs font-medium text-foreground">{template.name}</p>
                      {active ?
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" /> :
                      null}
                    </div>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{template.description}</p>
                    <div className="mt-2 flex items-center gap-1">
                      {template.nodeIds.slice(0, 7).map((id, i) =>
                      <span
                        key={`${id}-${i}`}
                        className={cn(
                          'h-1 flex-1 rounded-full',
                          active ? 'bg-primary/50' : 'bg-border group-hover:bg-ring/40'
                        )}
                        aria-hidden="true" />

                      )}
                      <span className="ml-1 shrink-0 font-mono text-[9px] text-muted-foreground">
                        {template.nodeIds.length}
                      </span>
                    </div>
                  </button>
                </li>);

            })}
          </ul>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="nodes" className="mt-0 flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-border bg-background p-2">
          <div className="relative">
            <Search
              className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true" />
            
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search nodes"
              aria-label="Search nodes"
              className="h-8 pl-8 text-xs" />
            
          </div>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <ul className="space-y-1.5 p-2">
            {nodes.map((node) => {
              const kind = kindMeta[node.kind];
              const Icon = kind.icon;
              return (
                <li key={node.id}>
                  <button
                    type="button"
                    onClick={() => onAddNode(node)}
                    className="group flex w-full items-center gap-2.5 rounded-lg border border-border bg-background p-2 text-left outline-none transition-all hover:border-ring/50 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring">
                    
                    <span
                      className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md', kind.tile)}>
                      
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-foreground">{node.title}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">{node.subtitle}</span>
                    </span>
                    <Plus
                      className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true" />
                    
                  </button>
                </li>);

            })}
            {!nodes.length ?
            <li className="px-1 py-6 text-center text-xs text-muted-foreground">No matches</li> :
            null}
          </ul>
        </ScrollArea>
      </TabsContent>
    </Tabs>);

}