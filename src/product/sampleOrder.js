export const SAMPLE_ORDER_ID = 'shp-sample';

export const SAMPLE_PACK_ZIP = 'SW247-sample-pack.zip';

export const SAMPLE_PACK_HREF = '/sample-order/SW247-sample-pack.zip';

export const SAMPLE_PACK = [
  { fileName: 'declaration.pdf', docType: 'ITEM_DECLARATION' },
  { fileName: 'invoice.pdf', docType: 'INVOICE' },
  { fileName: 'parcel-photo.jpg', docType: 'PARCEL_PHOTO' }
];

export const SAMPLE_EXTRACTED = [
  { label: 'Sender', value: 'Lê Minh Châu', confidence: 0.99, source: 'ITEM_DECLARATION' },
  { label: 'Recipient', value: 'Phạm Quốc Huy', confidence: 0.98, source: 'ITEM_DECLARATION' },
  { label: 'Item', value: 'Cotton shirts, 3 pieces', confidence: 0.96, source: 'INVOICE' },
  { label: 'Declared value', value: '890.000₫', confidence: 0.97, source: 'INVOICE' },
  { label: 'Weight', value: '1.1 kg', confidence: 0.95, source: 'PARCEL_PHOTO' }
];

const DOC_COPY = {
  ITEM_DECLARATION: {
    title: 'Item declaration missing',
    titleVi: 'Thiếu khai báo hàng gửi',
    detail: 'The sample pack needs declaration.pdf before this parcel can clear.'
  },
  INVOICE: {
    title: 'Invoice missing',
    titleVi: 'Thiếu hoá đơn',
    detail: 'The sample pack needs invoice.pdf before this parcel can clear.'
  },
  PARCEL_PHOTO: {
    title: 'Parcel photo missing',
    titleVi: 'Thiếu ảnh kiện hàng',
    detail: 'The sample pack needs parcel-photo.jpg before this parcel can clear.'
  }
};

function basename(fileName) {
  const raw = String(fileName ?? '').trim();
  const parts = raw.split(/[/\\]/);
  return (parts[parts.length - 1] || '').toLowerCase();
}

export function matchSamplePack(fileNames) {
  const names = (Array.isArray(fileNames) ? fileNames : []).map(basename).filter(Boolean);
  const zipName = SAMPLE_PACK_ZIP.toLowerCase();

  if (names.includes(zipName)) {
    return {
      complete: true,
      via: 'zip',
      matched: SAMPLE_PACK.map((item) => item.fileName),
      missing: [],
      extra: names.filter((name) => name !== zipName)
    };
  }

  const expected = new Set(SAMPLE_PACK.map((item) => item.fileName.toLowerCase()));
  const matched = SAMPLE_PACK.filter((item) => names.includes(item.fileName.toLowerCase())).map(
    (item) => item.fileName
  );
  const missing = SAMPLE_PACK.filter((item) => !names.includes(item.fileName.toLowerCase())).map(
    (item) => item.fileName
  );
  const extra = names.filter((name) => !expected.has(name));

  return {
    complete: missing.length === 0,
    via: 'files',
    matched,
    missing,
    extra
  };
}

export function findingsForSamplePack(match) {
  const missing = match && Array.isArray(match.missing) ? match.missing : SAMPLE_PACK.map((item) => item.fileName);

  return missing.map((fileName) => {
    const item = SAMPLE_PACK.find((entry) => entry.fileName === fileName);
    const copy = DOC_COPY[item.docType];
    return {
      id: `sample-missing-${item.docType}`,
      code: `MISSING_${item.docType}`,
      ruleRef: 'SR-DOC-01',
      title: copy.title,
      titleVi: copy.titleVi,
      detail: copy.detail,
      severity: 'critical',
      source: 'ocr',
      requiredDoc: item.docType
    };
  });
}

export function applySamplePack(shipment, fileNames, uploadedAt = '') {
  const match = matchSamplePack(fileNames);
  const pendingFindings = findingsForSamplePack(match);
  const docs = SAMPLE_PACK.map((item) => {
    const uploaded = match.matched.includes(item.fileName);
    return {
      id: `sample-${item.docType}`,
      type: item.docType,
      fileName: uploaded ? item.fileName : '',
      pages: uploaded ? 1 : 0,
      uploadedAt: uploaded ? uploadedAt : '',
      status: uploaded ? 'processing' : 'missing'
    };
  });

  return {
    ...shipment,
    stage: 'submitted',
    docs,
    pendingFindings,
    findings: [],
    extracted: match.complete ? SAMPLE_EXTRACTED : []
  };
}

export function describeSampleResult(stage, findings) {
  const list = Array.isArray(findings) ? findings : [];

  if (stage === 'checking') {
    return {
      tone: 'running',
      headline: 'Checking documents',
      detail: 'Reading the pack and applying cargo rules.'
    };
  }

  if (stage === 'compliance_ok' || stage === 'accepted') {
    return {
      tone: 'cleared',
      headline: 'Cleared. No issues',
      detail: 'This parcel may go to pickup.'
    };
  }

  if (stage === 'flagged' || stage === 'awaiting_shipper') {
    const count = list.length;
    return {
      tone: 'flagged',
      headline: count === 1 ? '1 issue found' : `${count} issues found`,
      detail: 'Pickup is on hold until the sample pack is complete.'
    };
  }

  if (stage === 'submitted') {
    return {
      tone: 'ready',
      headline: 'Pack attached',
      detail: 'Run the cargo check.'
    };
  }

  return {
    tone: 'idle',
    headline: 'Upload the sample pack',
    detail: 'Then run the cargo check.'
  };
}
