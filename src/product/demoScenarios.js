// Three demo orders as SmartKargo holds them, and the gate rules applied to what was read
// from the uploaded files. The result depends on file content, not on the chosen scenario.

const BASE_ORDER = {
  sender: 'Shop Mỹ Phẩm Hạ Long',
  contactPhone: '0907 512 338',
  contactEmail: 'shop.myphamhalong@gmail.com',
  channel: 'Shopee',
  recipient: 'Phạm Thu Hà',
  recipientPhone: '0918 447 026',
  origin: 'SGN',
  destination: 'HPH',
  service: 'Next-day',
  flightNo: 'VJ286',
  pickupAt: 'Today 15:00',
  pieces: 1,
  weightKg: 1.2,
  itemCategory: 'Skincare set, 6 items',
  isRestricted: false,
  declaredValue: 3400000,
  codAmount: 3400000
};

export const DEMO_SCENARIOS = [
  {
    id: 'demo-a',
    letter: 'A',
    label: 'Complete',
    summary: 'All documents, all values match',
    packHref: '/demo-packs/set-A-complete.zip',
    order: { ...BASE_ORDER, trackingNo: 'SW247-8842153', orderRef: 'ORD-2026-118507' }
  },
  {
    id: 'demo-b',
    letter: 'B',
    label: 'Missing document',
    summary: 'Sender ID not provided',
    packHref: '/demo-packs/set-B-missing-id-card.zip',
    order: { ...BASE_ORDER, trackingNo: 'SW247-8842154', orderRef: 'ORD-2026-118508' }
  },
  {
    id: 'demo-c',
    letter: 'C',
    label: 'Wrong order number',
    summary: 'All documents, invoice order no. differs',
    packHref: '/demo-packs/set-C-order-number-mismatch.zip',
    order: { ...BASE_ORDER, trackingNo: 'SW247-8842155', orderRef: 'ORD-2026-118509' }
  }
];

export const DEMO_IDS = DEMO_SCENARIOS.map((s) => s.id);

export function findScenario(id) {
  return DEMO_SCENARIOS.find((s) => s.id === id);
}

export const DOC_NAMES = {
  ITEM_DECLARATION: { en: 'Item declaration', vi: 'khai báo hàng gửi' },
  INVOICE: { en: 'Invoice', vi: 'hoá đơn' },
  PARCEL_PHOTO: { en: 'Parcel photo', vi: 'ảnh kiện hàng' },
  ID_CARD: { en: 'Sender ID', vi: 'CCCD người gửi' }
};

export function requiredDocs(order) {
  const docs = [
    { type: 'ITEM_DECLARATION', ruleRef: 'SR-DOC-01', why: 'Every order needs an item declaration.' },
    { type: 'PARCEL_PHOTO', ruleRef: 'SR-DOC-01', why: 'Every order needs a parcel photo.' }
  ];
  if (order.declaredValue > 2000000) {
    docs.push({ type: 'INVOICE', ruleRef: 'SR-DOC-01', why: 'Declared value is above 2,000,000₫.' });
  }
  if (order.codAmount > 0 || order.declaredValue > 5000000) {
    docs.push({ type: 'ID_CARD', ruleRef: 'SR-KYC-01', why: 'COD orders need a sender ID.' });
  }
  return docs;
}

function missingFinding(req) {
  const name = DOC_NAMES[req.type];
  return {
    id: `missing-${req.type}`,
    code: req.type === 'ID_CARD' ? 'ID_REQUIRED' : `MISSING_${req.type}`,
    ruleRef: req.ruleRef,
    title: `${name.en} missing`,
    titleVi: `Thiếu ${name.vi}`,
    detail: `${req.why} None of the uploaded files is a ${name.en}.`,
    severity: 'critical',
    source: req.type === 'ID_CARD' ? 'kyc' : 'ocr',
    requiredDoc: req.type
  };
}

function mismatchFinding(doc, field, found, expected) {
  const name = DOC_NAMES[doc.type];
  const isOrder = field === 'orderRef';
  const label = isOrder ? 'order number' : 'tracking number';
  const labelVi = isOrder ? 'Số đơn' : 'Mã vận đơn';
  return {
    id: `mismatch-${field}-${doc.type}`,
    code: isOrder ? 'ORDER_REF_MISMATCH' : 'TRACKING_NO_MISMATCH',
    ruleRef: 'SR-DOC-02',
    title: `${name.en} ${label} does not match the order`,
    titleVi: `${labelVi} trên ${name.vi} (${found}) không khớp đơn hàng ${expected}`,
    detail: `${name.en} reads ${found}. SmartKargo has ${expected}.`,
    severity: 'critical',
    source: 'ocr',
    requiredDoc: doc.type
  };
}

function valueFinding(doc, field, found, expected) {
  const name = DOC_NAMES[doc.type];
  const isCod = field === 'codAmount';
  const fmt = (n) => `${Number(n).toLocaleString('vi-VN')}₫`;
  return {
    id: `mismatch-${field}-${doc.type}`,
    code: isCod ? 'COD_MISMATCH' : 'VALUE_MISMATCH',
    ruleRef: 'SR-DOC-02',
    title: `${name.en} ${isCod ? 'COD amount' : 'declared value'} does not match the order`,
    titleVi: `${isCod ? 'Tiền COD' : 'Giá trị khai báo'} trên ${name.vi} (${fmt(found)}) không khớp đơn hàng ${fmt(expected)}`,
    detail: `${name.en} reads ${fmt(found)}. SmartKargo has ${fmt(expected)}.`,
    severity: 'critical',
    source: 'ocr',
    requiredDoc: doc.type
  };
}

// docs: [{ fileName, type, fields }] as returned by readDocument.
export function evaluatePack(order, docs) {
  const list = (Array.isArray(docs) ? docs : []).filter((d) => d && d.type);
  const findings = [];

  for (const req of requiredDocs(order)) {
    if (!list.some((d) => d.type === req.type)) findings.push(missingFinding(req));
  }

  for (const doc of list) {
    const f = doc.fields ?? {};
    if (f.orderRef && f.orderRef !== order.orderRef) {
      findings.push(mismatchFinding(doc, 'orderRef', f.orderRef, order.orderRef));
    }
    if (f.trackingNo && f.trackingNo !== order.trackingNo) {
      findings.push(mismatchFinding(doc, 'trackingNo', f.trackingNo, order.trackingNo));
    }
    if (f.declaredValue != null && f.declaredValue !== order.declaredValue) {
      findings.push(valueFinding(doc, 'declaredValue', f.declaredValue, order.declaredValue));
    }
    if (f.codAmount != null && f.codAmount !== order.codAmount) {
      findings.push(valueFinding(doc, 'codAmount', f.codAmount, order.codAmount));
    }
  }

  return findings;
}

// Fields shown in the run log, one row per value the agent read.
export function extractedRows(docs) {
  const rows = [];
  const labels = {
    orderRef: 'Order no.',
    trackingNo: 'Tracking no.',
    sender: 'Sender',
    recipient: 'Recipient',
    declaredValue: 'Declared value',
    codAmount: 'COD',
    idNumber: 'Sender ID no.',
    linkedSender: 'ID linked to'
  };
  for (const doc of Array.isArray(docs) ? docs : []) {
    if (!doc || !doc.type) continue;
    for (const [key, label] of Object.entries(labels)) {
      const value = doc.fields?.[key];
      if (value === undefined || value === null || value === '') continue;
      rows.push({
        label: `${label} (${DOC_NAMES[doc.type]?.en ?? doc.type})`,
        value: typeof value === 'number' ? `${value.toLocaleString('vi-VN')}₫` : String(value),
        confidence: doc.type === 'PARCEL_PHOTO' ? 0.9 : 0.99,
        source: doc.type
      });
    }
  }
  return rows;
}
