// Turns the raw text of an uploaded file into a document type and the fields the gate checks.
// Text comes from JSON, the PDF text layer, or OCR on an image, so patterns tolerate OCR noise.

const ORDER_REF_RE = /ORD\s*[-_.]?\s*(\d{4})\s*[-_.]?\s*(\d{6})/i;
const TRACKING_RE = /SW\s*247\s*[-_.]?\s*(\d{7})/i;

export function findOrderRef(text) {
  const m = ORDER_REF_RE.exec(String(text ?? ''));
  return m ? `ORD-${m[1]}-${m[2]}` : '';
}

export function findTrackingNo(text) {
  const m = TRACKING_RE.exec(String(text ?? ''));
  return m ? `SW247-${m[1]}` : '';
}

export function parseVnd(raw) {
  const digits = String(raw ?? '').replace(/[^\d]/g, '');
  return digits ? Number(digits) : null;
}

function lineAfter(text, label) {
  const lines = String(text ?? '').split(/\r?\n/).map((l) => l.trim());
  const i = lines.findIndex((l) => l.includes(label));
  return i >= 0 && i + 1 < lines.length ? lines[i + 1] : '';
}

function valueAfter(text, label) {
  const lines = String(text ?? '').split(/\r?\n/);
  const line = lines.find((l) => l.includes(label));
  return line ? line.slice(line.indexOf(label) + label.length).trim() : '';
}

function tryJson(text) {
  try {
    const value = JSON.parse(text);
    return value && typeof value === 'object' ? value : null;
  } catch {
    return null;
  }
}

export function detectDocType({ name = '', mime = '', text = '' }) {
  if (/^image\//.test(mime) || /\.(jpe?g|png|webp)$/i.test(name)) return 'PARCEL_PHOTO';
  const json = tryJson(text);
  if (json && (json.orderRef || json.trackingNo)) return 'ITEM_DECLARATION';
  if (/SALES INVOICE|HOÁ ĐƠN|HÓA ĐƠN/i.test(text)) return 'INVOICE';
  if (/SENDER ID|ID number|Số định danh|CCCD/i.test(text)) return 'ID_CARD';
  return null;
}

export function extractFields(docType, text) {
  if (docType === 'ITEM_DECLARATION') {
    const json = tryJson(text) ?? {};
    return {
      orderRef: json.orderRef ?? '',
      trackingNo: json.trackingNo ?? '',
      sender: json.sender?.name ?? '',
      recipient: json.recipient?.name ?? '',
      declaredValue: json.payment?.declaredValue ?? null,
      codAmount: json.payment?.codAmount ?? null
    };
  }
  if (docType === 'INVOICE') {
    const total = /TỔNG CỘNG\s+([\d.,]+)/i.exec(text);
    const cod = /thu hộ\s+([\d.,]+)/i.exec(text);
    return {
      orderRef: findOrderRef(text),
      trackingNo: findTrackingNo(text),
      sender: lineAfter(text, 'SELLER'),
      recipient: lineAfter(text, 'BUYER'),
      declaredValue: total ? parseVnd(total[1]) : null,
      codAmount: cod ? parseVnd(cod[1]) : null
    };
  }
  if (docType === 'ID_CARD') {
    const id = /(\d{12})/.exec(valueAfter(text, 'ID number'));
    return {
      fullName: valueAfter(text, 'Full name'),
      idNumber: id ? id[1] : '',
      linkedSender: valueAfter(text, 'Linked to sender')
    };
  }
  if (docType === 'PARCEL_PHOTO') {
    return {
      orderRef: findOrderRef(text),
      trackingNo: findTrackingNo(text)
    };
  }
  return {};
}

export function readDocument({ name, mime, text }) {
  const type = detectDocType({ name, mime, text });
  return { fileName: name, type, fields: type ? extractFields(type, text) : {} };
}
