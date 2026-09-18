import { StepKey } from './cargo';

export type FlowNodeKind = 'trigger' | 'extract' | 'lookup' | 'condition' | 'action' | 'human' | 'output';

export type FlowNodeStatus = 'idle' | 'running' | 'done' | 'skipped' | 'error';

export type FlowSystem = 'SmartKargo' | 'AI Agent' | 'Customer' | 'CX team' | 'Messaging';

export type FlowParamControl = 'text' | 'number' | 'select' | 'toggle' | 'tags';

export interface FlowNodeParam {
  label: string;
  /** Toggle params store 'on' or 'off'; tags store a comma-separated list. */
  value: string;
  control?: FlowParamControl;
  options?: string[];
  unit?: string;
  hint?: string;
}

export interface FlowNodeData extends Record<string, unknown> {
  title: string;
  subtitle: string;
  kind: FlowNodeKind;
  system: FlowSystem;
  stepKey?: StepKey;
  params: FlowNodeParam[];
  notes: string;
  status: FlowNodeStatus;
  enabled: boolean;
}

export interface PaletteNode {
  id: string;
  title: string;
  subtitle: string;
  kind: FlowNodeKind;
  system: FlowSystem;
  params: FlowNodeParam[];
}