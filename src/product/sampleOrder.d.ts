import type { CargoDocument, DocType, ExtractedField, Finding, Shipment, ShipmentStage } from '../types/cargo';

export const SAMPLE_ORDER_ID: 'shp-sample';
export const SAMPLE_PACK_ZIP: 'SW247-sample-pack.zip';
export const SAMPLE_PACK_HREF: '/sample-order/SW247-sample-pack.zip';

export const SAMPLE_PACK: ReadonlyArray<{
  fileName: string;
  docType: Extract<DocType, 'ITEM_DECLARATION' | 'INVOICE' | 'PARCEL_PHOTO'>;
}>;

export const SAMPLE_EXTRACTED: ExtractedField[];

export function matchSamplePack(fileNames: string[]): {
  complete: boolean;
  via: 'zip' | 'files';
  matched: string[];
  missing: string[];
  extra: string[];
};

export function findingsForSamplePack(match: { missing: string[] }): Finding[];

export function applySamplePack(
  shipment: Shipment,
  fileNames: string[],
  uploadedAt?: string
): Shipment & {
  stage: 'submitted';
  docs: CargoDocument[];
  pendingFindings: Finding[];
  findings: Finding[];
  extracted: ExtractedField[];
};

export function describeSampleResult(
  stage: ShipmentStage,
  findings: Finding[]
): {
  tone: 'idle' | 'ready' | 'running' | 'cleared' | 'flagged';
  headline: string;
  detail: string;
};
