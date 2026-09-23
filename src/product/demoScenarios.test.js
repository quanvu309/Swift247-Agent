import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readDocument } from './docReader.js';
import { evaluatePack, findScenario } from './demoScenarios.js';

// Text as pdf.js and tesseract return it for the fixture pack (fixtures-domestic).
const declaration = (orderRef, trackingNo) =>
  JSON.stringify({
    orderRef,
    trackingNo,
    sender: { name: 'Shop Mỹ Phẩm Hạ Long' },
    recipient: { name: 'Phạm Thu Hà' },
    payment: { declaredValue: 3400000, codAmount: 3400000 }
  });

const invoice = (orderRef, trackingNo) => `HOÁ ĐƠN BÁN HÀNG / SALES INVOICE
MÃ ĐƠN SÀN / MARKETPLACE ORDER NO.
${orderRef}
MÃ VẬN ĐƠN SWIFT247 / TRACKING NO.
${trackingNo}
NGƯỜI BÁN / SELLER
Shop Mỹ Phẩm Hạ Long
TỔNG CỘNG   3.400.000₫
COD - thu hộ 3.400.000₫`;

const idCard = `SENDER ID DATA
Số định danh / ID number   012345678901
Liên kết đơn hàng / Linked to sender   Shop Mỹ Phẩm Hạ Long`;

const photoOcr = (orderRef, trackingNo) => `SWIFT247\n${trackingNo}\nDon: ${orderRef}\nNguai nhan: Pham Thu Ha`;

function pack(scenarioId, { invoiceRef, withId = true } = {}) {
  const { orderRef, trackingNo } = findScenario(scenarioId).order;
  const files = [
    { name: '01.json', mime: 'application/json', text: declaration(orderRef, trackingNo) },
    { name: '02.pdf', mime: 'application/pdf', text: invoice(invoiceRef ?? orderRef, trackingNo) },
    { name: '03.jpg', mime: 'image/jpeg', text: photoOcr(orderRef, trackingNo) }
  ];
  if (withId) files.push({ name: '04.pdf', mime: 'application/pdf', text: idCard });
  return files.map(readDocument);
}

describe('demo scenarios, judged on file content', () => {
  it('A: complete pack clears', () => {
    assert.deepEqual(evaluatePack(findScenario('demo-a').order, pack('demo-a')), []);
  });

  it('B: no sender ID on a COD order is flagged under SR-KYC-01', () => {
    const findings = evaluatePack(findScenario('demo-b').order, pack('demo-b', { withId: false }));
    assert.deepEqual(findings.map((f) => [f.code, f.ruleRef, f.requiredDoc]), [['ID_REQUIRED', 'SR-KYC-01', 'ID_CARD']]);
  });

  it('C: invoice with a transposed order number is flagged under SR-DOC-02', () => {
    const findings = evaluatePack(findScenario('demo-c').order, pack('demo-c', { invoiceRef: 'ORD-2026-118590' }));
    assert.equal(findings.length, 1);
    assert.equal(findings[0].code, 'ORDER_REF_MISMATCH');
    assert.equal(findings[0].requiredDoc, 'INVOICE');
    assert.match(findings[0].detail, /ORD-2026-118590.*ORD-2026-118509/);
  });

  it('reads OCR-noisy order numbers from the parcel photo', () => {
    const doc = readDocument({ name: 'p.jpg', mime: 'image/jpeg', text: 'SW247 - 8842155\nDon: ORD-2026 -118509' });
    assert.deepEqual(doc.fields, { orderRef: 'ORD-2026-118509', trackingNo: 'SW247-8842155' });
  });
});
