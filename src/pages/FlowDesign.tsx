import '@xyflow/react/dist/style.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MiniMap,
  Node,
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
import { FlowTemplate, buildTemplate, flowTemplates } from '../data/flowTemplates';
import { FlowNodeData, FlowNodeStatus, PaletteNode } from '../types/flow';
import { Shipment, StepStatus } from '../types/cargo';
import { SampleOrderRun } from '../components/SampleOrderRun';
import { PageHeader } from '../components/PageHeader';
import { useWorkflow } from '../contexts/WorkflowContext';

const nodeTypes = { workflow: WorkflowNode };

// Tighter positions for the read-only view so nodes stay legible on a projector.
const VIEW_LAYOUT: Record<string, {x: number;y: number;}> = {
  trigger: { x: 0, y: 150 },
  ocr: { x: 240, y: 150 },
  reference: { x: 480, y: 10 },
  crosscheck: { x: 480, y: 150 },
  decision: { x: 720, y: 150 },
  'status-update': { x: 990, y: 40 },
  accepted: { x: 1230, y: 40 },
  flag: { x: 990, y: 270 },
  approval: { x: 1230, y: 270 },
  'request-docs': { x: 1470, y: 270 }
};

function mapStepStatus(status: StepStatus | undefined): FlowNodeStatus {
  if (status === 'done') return 'done';
  if (status === 'running') return 'running';
  if (status === 'skipped') return 'skipped';
  return 'idle';
}

function statusForNode(nodeId: string, shipment?: Shipment): FlowNodeStatus {
  if (!shipment || shipment.stage === 'draft') return 'idle';
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
    case 'accepted':
      if (shipment.stage === 'compliance_ok' || shipment.stage === 'accepted') return 'done';
      return step('decision') === 'done' && !passed ? 'skipped' : 'idle';
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

function FlowCanvas({ mode }: {mode: 'view' | 'edit';}) {
  const editing = mode === 'edit';
  const { shipments, runCheck, activeDemoId } = useWorkflow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>(initialFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialFlowEdges);
  const [selectedId, setSelectedId] = useState<string | null>('decision');
  const [templateId, setTemplateId] = useState('full');
  const [active, setActive] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [showLibrary, setShowLibrary] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [searchParams] = useSearchParams();

  const activeShipment = useMemo(() => {
    const demo = shipments.find((s) => s.id === activeDemoId);
    if (!editing) return demo;
    if (demo && demo.stage !== 'draft') return demo;
    return (
      shipments.find((s) => s.stage === 'checking') ??
      shipments.find((s) => s.stage === 'flagged') ??
      shipments.find((s) => s.stage === 'submitted') ??
      shipments[0]
    );
  }, [activeDemoId, editing, shipments]);

  useEffect(() => {
    const id = searchParams.get('flow');
    if (!id) return;
    const template = flowTemplates.find((item) => item.id === id);
    if (!template) return;
    const built = buildTemplate(template);
    setNodes(built.nodes);
    setEdges(built.edges);
    setTemplateId(template.id);
    setSelectedId(null);
  }, [searchParams, setEdges, setNodes]);

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

  const shownNodes = useMemo(
    () =>
    editing ?
    nodes :
    nodes.map((n) => ({ ...n, position: VIEW_LAYOUT[n.id] ?? n.position, data: { ...n.data, compact: true } })),
    [editing, nodes]
  );

  const canvas =
  <ReactFlow
    nodes={shownNodes}
    edges={decoratedEdges}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    onConnect={editing ? onConnect : undefined}
    nodeTypes={nodeTypes}
    nodesDraggable={editing}
    nodesConnectable={editing}
    elementsSelectable={editing}
    onNodeClick={editing ? (_, node) => setSelectedId(node.id) : undefined}
    onPaneClick={editing ? () => setSelectedId(null) : undefined}
    fitView
    fitViewOptions={{ padding: editing ? 0.12 : 0.06 }}
    minZoom={0.25}
    zoomOnScroll={editing}
    preventScrolling={editing}
    proOptions={{ hideAttribution: true }}>
    
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="!bg-transparent" />
      <Controls showInteractive={false} position="bottom-right" />
      {editing ? <MiniMap pannable zoomable className="!bg-background" /> : null}
    </ReactFlow>;


  if (!editing) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Check an order"
          description="Pick a scenario and upload its documents. The agent reads them, checks them against SmartKargo, and decides if the parcel can be picked up." />
        

        <section
          aria-label="Agent flow"
          className="relative h-[340px] overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:h-[380px]">
          
          <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-chart-2" aria-hidden="true" />
            {activeShipment && activeShipment.stage !== 'draft' ?
            `${activeShipment.trackingNo} in the agent flow` :
            'Agent flow'}
          </div>
          {canvas}
        </section>

        <SampleOrderRun />
      </div>);

  }

  return (
    <div className="flex h-full min-h-[560px] flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3">
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
          <h1 className="truncate text-base font-semibold text-foreground">Flow Design</h1>
          <Badge variant="outline" className="hidden h-5 px-1.5 font-mono text-[10px] font-normal sm:inline-flex">
            {nodes.length} nodes
          </Badge>
          {dirty ?
          <span className="hidden text-xs text-muted-foreground sm:inline">Unsaved changes</span> :
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

        <div className="relative min-w-0 flex-1 bg-muted/30">{canvas}</div>

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
      <FlowCanvas mode="view" />
    </ReactFlowProvider>);

}

export function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <FlowCanvas mode="edit" />
    </ReactFlowProvider>);

}