import '@xyflow/react/dist/style.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MiniMap,
  Node,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection } from
'@xyflow/react';
import { PanelLeft, PanelRight, Play, Save } from 'lucide-react';
import { WorkflowNode } from '../components/flow/WorkflowNode';
import { FlowSidebar } from '../components/flow/FlowSidebar';
import { NodeInspector } from '../components/flow/NodeInspector';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Separator } from '../components/ui/Separator';
import { Switch } from '../components/ui/CSwitch';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/Tooltip';
import { cn } from '../utils/cn';
import { initialFlowEdges, initialFlowNodes } from '../data/flowGraph';
import { FlowTemplate, buildTemplate } from '../data/flowTemplates';
import { FlowNodeData, FlowNodeStatus, PaletteNode } from '../types/flow';
import { Shipment, StepStatus } from '../types/cargo';
import { useWorkflow } from '../contexts/WorkflowContext';

const nodeTypes = { workflow: WorkflowNode };

function mapStepStatus(status: StepStatus | undefined): FlowNodeStatus {
  if (status === 'done') return 'done';
  if (status === 'running') return 'running';
  if (status === 'skipped') return 'skipped';
  return 'idle';
}

function statusForNode(nodeId: string, shipment?: Shipment): FlowNodeStatus {
  if (!shipment) return 'idle';
  const step = (key: string) => shipment.steps.find((s) => s.key === key)?.status;
  const passed = step('decision') === 'done' && shipment.findings.length === 0;

  switch (nodeId) {
    case 'trigger':
      return 'done';
    case 'ocr':
      return mapStepStatus(step('ocr'));
    case 'reference':
    case 'crosscheck':
      return mapStepStatus(step('crosscheck'));
    case 'decision':
      return mapStepStatus(step('decision'));
    case 'status-update':
      if (shipment.stage === 'compliance_ok' || shipment.stage === 'accepted') return 'done';
      return passed ? 'running' : step('decision') === 'done' ? 'skipped' : 'idle';
    case 'flag':
      return mapStepStatus(step('flag'));
    case 'approval':
      return mapStepStatus(step('handoff'));
    case 'request-docs':
      if (shipment.message?.status === 'sent') return 'done';
      return passed ? 'skipped' : 'idle';
    default:
      return 'idle';
  }
}

function FlowCanvas() {
  const { shipments, runCheck } = useWorkflow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>(initialFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialFlowEdges);
  const [selectedId, setSelectedId] = useState<string | null>('decision');
  const [templateId, setTemplateId] = useState('full');
  const [active, setActive] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [showLibrary, setShowLibrary] = useState(true);
  const [showInspector, setShowInspector] = useState(true);

  const activeShipment = useMemo(
    () =>
    shipments.find((s) => s.stage === 'checking') ??
    shipments.find((s) => s.stage === 'flagged') ??
    shipments.find((s) => s.stage === 'submitted') ??
    shipments[0],
    [shipments]
  );

  useEffect(() => {
    setNodes((current) =>
    current.map((node) => {
      const status = statusForNode(node.id, activeShipment);
      return status === node.data.status ? node : { ...node, data: { ...node.data, status } };
    })
    );
  }, [activeShipment, setNodes]);

  const runningIds = useMemo(
    () => new Set(nodes.filter((n) => n.data.status === 'running').map((n) => n.id)),
    [nodes]
  );

  const decoratedEdges = useMemo(
    () =>
    edges.map((edge) => ({
      ...edge,
      animated: runningIds.has(edge.target),
      labelBgPadding: [6, 3] as [number, number],
      labelBgBorderRadius: 4,
      labelStyle: { fontSize: 10, fontFamily: 'Geist Mono, monospace' }
    })),
    [edges, runningIds]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((current) => addEdge({ ...connection, type: 'smoothstep' }, current));
      setDirty(true);
    },
    [setEdges]
  );

  const addNode = useCallback(
    (palette: PaletteNode) => {
      const id = `${palette.id}-${Date.now()}`;
      setNodes((current) => [
      ...current,
      {
        id,
        type: 'workflow',
        position: { x: 300 + current.length % 4 * 60, y: 620 + current.length * 12 },
        data: {
          title: palette.title,
          subtitle: palette.subtitle,
          kind: palette.kind,
          system: palette.system,
          params: palette.params,
          notes: 'Connect this node into a branch.',
          status: 'idle',
          enabled: true
        }
      }]
      );
      setSelectedId(id);
      setDirty(true);
      toast.success(`${palette.title} added`);
    },
    [setNodes]
  );

  const applyTemplate = useCallback(
    (template: FlowTemplate) => {
      const built = buildTemplate(template);
      setNodes(built.nodes);
      setEdges(built.edges);
      setTemplateId(template.id);
      setSelectedId(null);
      setDirty(template.id !== 'full');
      toast.success(`${template.name} loaded`);
    },
    [setEdges, setNodes]
  );

  const toggleNodeEnabled = useCallback(
    (id: string, enabled: boolean) => {
      setNodes((current) => current.map((n) => n.id === id ? { ...n, data: { ...n.data, enabled } } : n));
      setDirty(true);
    },
    [setNodes]
  );

  const renameNode = useCallback(
    (id: string, title: string) => {
      setNodes((current) => current.map((n) => n.id === id ? { ...n, data: { ...n.data, title } } : n));
      setDirty(true);
    },
    [setNodes]
  );

  const updateParam = useCallback(
    (id: string, label: string, value: string) => {
      setNodes((current) =>
      current.map((n) =>
      n.id === id ?
      {
        ...n,
        data: {
          ...n.data,
          params: n.data.params.map((p) => p.label === label ? { ...p, value } : p)
        }
      } :
      n
      )
      );
      setDirty(true);
    },
    [setNodes]
  );

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;

  const test = () => {
    const target = shipments.find((s) => s.stage === 'submitted') ?? activeShipment;
    if (!target) return;
    runCheck(target.id);
    toast.success('Test started', { description: target.trackingNo });
  };

  return (
    <div className="flex h-full min-h-[560px] flex-col">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={showLibrary ? 'Hide node library' : 'Show node library'}
              aria-pressed={showLibrary}
              onClick={() => setShowLibrary((v) => !v)}
              className="hidden lg:inline-flex">
              
              <PanelLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Node library</TooltipContent>
        </Tooltip>

        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate text-sm font-medium text-foreground">Parcel compliance</h1>
          <Badge variant="outline" className="hidden h-5 px-1.5 font-mono text-[10px] font-normal sm:inline-flex">
            {nodes.length} nodes
          </Badge>
          {dirty ?
          <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">Unsaved</span> :
          null}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <label className="mr-1 hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <Switch size="sm" checked={active} onCheckedChange={setActive} aria-label="Workflow active" />
            {active ? 'Active' : 'Paused'}
          </label>
          <Button variant="outline" size="sm" onClick={test}>
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            Test
          </Button>
          <Button
            size="sm"
            disabled={!dirty}
            onClick={() => {
              setDirty(false);
              toast.success('Saved');
            }}>
            
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            Save
          </Button>
          <Separator orientation="vertical" className="mx-0.5 hidden h-5 xl:block" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={showInspector ? 'Hide inspector' : 'Show inspector'}
                aria-pressed={showInspector}
                onClick={() => setShowInspector((v) => !v)}
                className="hidden xl:inline-flex">
                
                <PanelRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Inspector</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {showLibrary ?
        <aside className="hidden w-[232px] shrink-0 border-r border-border lg:block">
            <FlowSidebar onAddNode={addNode} onApplyTemplate={applyTemplate} activeTemplateId={templateId} />
          </aside> :
        null}

        <div className="relative min-w-0 flex-1 bg-muted/30">
          <ReactFlow
            nodes={nodes}
            edges={decoratedEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedId(node.id)}
            onPaneClick={() => setSelectedId(null)}
            fitView
            fitViewOptions={{ padding: 0.16 }}
            minZoom={0.25}>
            
            <Background variant={BackgroundVariant.Dots} gap={18} size={1} className="!bg-transparent" />
            <Controls showInteractive={false} />
            <MiniMap pannable zoomable className="!bg-background" />

            {activeShipment ?
            <Panel position="top-right">
                <Link
                to={`/executions/${activeShipment.id}`}
                className="flex items-center gap-2 rounded-md border border-border bg-background/95 px-2.5 py-1.5 font-mono text-[11px] shadow-sm backdrop-blur transition-colors hover:border-foreground/40">
                
                  <span className="font-medium text-foreground">{activeShipment.trackingNo}</span>
                  <span className="text-muted-foreground">{activeShipment.stage.replace('_', ' ')}</span>
                </Link>
              </Panel> :
            null}
          </ReactFlow>
        </div>

        <aside className={cn('hidden w-[300px] shrink-0 border-l border-border', showInspector && 'xl:block')}>
          <NodeInspector
            node={selectedNode}
            nodes={nodes}
            edges={edges}
            onToggleEnabled={toggleNodeEnabled}
            onRename={renameNode}
            onUpdateParam={updateParam}
            onClose={() => setSelectedId(null)} />
          
        </aside>
      </div>
    </div>);

}

export function FlowDesign() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>);

}