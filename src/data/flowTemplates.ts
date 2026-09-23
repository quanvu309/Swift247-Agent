import { Edge, MarkerType, Node } from '@xyflow/react';
import { FlowNodeData } from '../types/flow';
import { initialFlowEdges, initialFlowNodes } from './flowGraph';

interface TemplateEdge {
  source: string;
  target: string;
  label?: string;
  sourceHandle?: string;
}

export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  nodeIds: string[];
  edges: TemplateEdge[];
  layout?: Record<string, {x: number;y: number;}>;
}

export const flowTemplates: FlowTemplate[] = [
{
  id: 'full',
  name: 'Full compliance check',
  description: 'OCR, rules and approval loop',
  nodeIds: initialFlowNodes.map((n) => n.id),
  edges: []
},
{
  id: 'fast-track',
  name: 'Fast-track low risk',
  description: 'No human step',
  nodeIds: ['trigger', 'ocr', 'decision', 'status-update'],
  edges: [
  { source: 'trigger', target: 'ocr' },
  { source: 'ocr', target: 'decision' },
  { source: 'decision', target: 'status-update', label: 'YES', sourceHandle: 'yes' }]

},
{
  id: 'dg-screening',
  name: 'DG screening',
  description: 'Dangerous goods only',
  nodeIds: ['trigger', 'ocr', 'reference', 'crosscheck', 'decision', 'flag'],
  edges: [
  { source: 'trigger', target: 'ocr' },
  { source: 'ocr', target: 'crosscheck' },
  { source: 'reference', target: 'crosscheck', label: 'DG rules' },
  { source: 'crosscheck', target: 'decision' },
  { source: 'decision', target: 'flag', label: 'NO', sourceHandle: 'no' }],

  layout: {
    trigger: { x: 0, y: 200 },
    ocr: { x: 300, y: 200 },
    reference: { x: 300, y: 10 },
    crosscheck: { x: 600, y: 200 },
    decision: { x: 900, y: 200 },
    flag: { x: 1200, y: 280 }
  }
},
{
  id: 'manual-review',
  name: 'Manual review only',
  description: 'Every order goes to Operations',
  nodeIds: ['trigger', 'ocr', 'crosscheck', 'approval', 'request-docs'],
  edges: [
  { source: 'trigger', target: 'ocr' },
  { source: 'ocr', target: 'crosscheck' },
  { source: 'crosscheck', target: 'approval' },
  { source: 'approval', target: 'request-docs' }]

}];


export function buildTemplate(template: FlowTemplate): {nodes: Node<FlowNodeData>[];edges: Edge[];} {
  if (template.id === 'full') {
    return {
      nodes: initialFlowNodes.map((node) => ({ ...node, data: { ...node.data, status: 'idle' } })),
      edges: initialFlowEdges
    };
  }

  const nodes = template.nodeIds.map((id, index) => {
    const base = initialFlowNodes.find((n) => n.id === id) as Node<FlowNodeData>;
    return {
      ...base,
      position: template.layout?.[id] ?? { x: index * 300, y: 200 },
      data: { ...base.data, status: 'idle' as const }
    };
  });

  const edges: Edge[] = template.edges.map((edge) => ({
    id: `${template.id}-${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    label: edge.label,
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 }
  }));

  return { nodes, edges };
}