import type { DocType } from '../types/cargo';

export type DocFields = Record<string, string | number | null>;

export function findOrderRef(text: string): string;
export function findTrackingNo(text: string): string;
export function parseVnd(raw: string): number | null;
export function detectDocType(input: { name?: string; mime?: string; text?: string }): DocType | null;
export function extractFields(docType: DocType, text: string): DocFields;
export function readDocument(input: { name: string; mime: string; text: string }): {
  fileName: string;
  type: DocType | null;
  fields: DocFields;
};
