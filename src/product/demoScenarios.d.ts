import type { DocType, ExtractedField, Finding, OrderChannel, ServiceLevel } from '../types/cargo';
import type { DocFields } from './docReader';

export interface DemoOrder {
  trackingNo: string;
  orderRef: string;
  sender: string;
  contactPhone: string;
  contactEmail: string;
  channel: OrderChannel;
  recipient: string;
  recipientPhone: string;
  origin: string;
  destination: string;
  service: ServiceLevel;
  flightNo: string;
  pickupAt: string;
  pieces: number;
  weightKg: number;
  itemCategory: string;
  isRestricted: boolean;
  declaredValue: number;
  codAmount: number;
}

export interface DemoScenario {
  id: string;
  letter: string;
  label: string;
  summary: string;
  packHref: string;
  order: DemoOrder;
}

export interface ReadDoc {
  fileName: string;
  type: DocType | null;
  fields: DocFields;
}

export const DEMO_SCENARIOS: DemoScenario[];
export const DEMO_IDS: string[];
export const DOC_NAMES: Record<string, { en: string; vi: string }>;
export function findScenario(id: string): DemoScenario | undefined;
export function requiredDocs(order: DemoOrder): { type: DocType; ruleRef: string; why: string }[];
export function evaluatePack(order: DemoOrder, docs: ReadDoc[]): Finding[];
export function extractedRows(docs: ReadDoc[]): ExtractedField[];
