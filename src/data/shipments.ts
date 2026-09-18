import { Shipment } from '../types/cargo';
import { buildMessageDraft, buildSteps } from '../utils/agent';

const o1: Shipment = {
  id: 'shp-1',
  trackingNo: 'SW247-8842119',
  orderRef: 'ORD-2026-118420',
  sender: 'Nguyễn Thanh Tùng',
  contactPhone: '0903 118 442',
  contactEmail: 'tung.nguyen@gmail.com',
  channel: 'Swift247 app',
  recipient: 'Trần Minh Khoa',
  recipientPhone: '0912 660 118',
  origin: 'SGN',
  destination: 'HAN',
  service: 'Same-day',
  flightNo: 'VJ122',
  pickupAt: 'Today 14:30',
  pieces: 1,
  weightKg: 1.4,
  itemCategory: 'Power bank 20,000 mAh (74 Wh)',
  isRestricted: true,
  restrictedType: 'Lithium battery',
  declaredValue: 8900000,
  codAmount: 0,
  stage: 'flagged',
  riskScore: 78,
  createdAt: '2026-09-17T07:12:00',
  docs: [
  { id: 'd1', type: 'ITEM_DECLARATION', fileName: 'declaration.json', pages: 1, uploadedAt: '07:12', status: 'extracted' },
  { id: 'd2', type: 'INVOICE', fileName: 'shopee-receipt.jpg', pages: 1, uploadedAt: '07:12', status: 'extracted' },
  { id: 'd3', type: 'PARCEL_PHOTO', fileName: 'parcel-front.jpg', pages: 1, uploadedAt: '07:13', status: 'extracted' },
  { id: 'd4', type: 'BATTERY_FORM', fileName: '—', pages: 0, uploadedAt: '—', status: 'missing' },
  { id: 'd5', type: 'ID_CARD', fileName: '—', pages: 0, uploadedAt: '—', status: 'missing' }],

  extracted: [
  { label: 'Sender', value: 'Nguyễn Thanh Tùng', confidence: 0.99, source: 'ITEM_DECLARATION' },
  { label: 'Recipient', value: 'Trần Minh Khoa, 0912 660 118', confidence: 0.97, source: 'ITEM_DECLARATION' },
  { label: 'Item', value: 'Power bank Anker 20,000 mAh', confidence: 0.94, source: 'INVOICE' },
  { label: 'Battery capacity', value: '74 Wh', confidence: 0.76, source: 'INVOICE' },
  { label: 'Declared value', value: '8.900.000₫', confidence: 0.96, source: 'INVOICE' },
  { label: 'Weight', value: '1.4 kg', confidence: 0.99, source: 'PARCEL_PHOTO' }],

  findings: [],
  pendingFindings: [
  {
    id: 'f1',
    code: 'MISSING_BATTERY_FORM',
    ruleRef: 'SR-DG-02',
    title: 'Battery declaration missing',
    titleVi: 'Thiếu khai báo pin',
    detail: 'Power banks up to 100 Wh fly only with a battery declaration from the sender.',
    severity: 'critical',
    source: 'restricted',
    requiredDoc: 'BATTERY_FORM'
  },
  {
    id: 'f2',
    code: 'ID_REQUIRED',
    ruleRef: 'SR-KYC-01',
    title: 'Sender ID required above 5,000,000₫',
    titleVi: 'Cần CCCD cho đơn trên 5.000.000₫',
    detail: 'Declared value is 8,900,000₫ — a photo of the sender ID is required.',
    severity: 'critical',
    source: 'kyc',
    requiredDoc: 'ID_CARD'
  },
  {
    id: 'f3',
    code: 'INSURANCE_APPLIED',
    ruleRef: 'SR-INS-03',
    title: 'Insurance fee will be added',
    titleVi: 'Sẽ cộng thêm phí bảo hiểm',
    detail: '0.5% of 8,900,000₫ = 44,500₫ added at pickup.',
    severity: 'warning',
    source: 'pricing'
  }],

  steps: buildSteps({ ocr: 'done', crosscheck: 'done', decision: 'done', flag: 'done' }),
  timeline: [
  { id: 't1', at: '07:12', actor: 'customer', label: 'Order created in app' },
  { id: 't2', at: '07:13', actor: 'agent', label: 'Documents read' },
  { id: 't3', at: '07:14', actor: 'agent', label: '3 issues flagged, message drafted' }]

};
o1.findings = o1.pendingFindings;
o1.message = buildMessageDraft(o1, o1.pendingFindings);

const o2: Shipment = {
  id: 'shp-2',
  trackingNo: 'SW247-8842127',
  orderRef: 'ORD-2026-118431',
  sender: 'Shop Lụa Sài Gòn',
  contactPhone: '0938 204 771',
  contactEmail: 'shop.luasaigon@gmail.com',
  channel: 'Shopee',
  recipient: 'Lê Thị Mai',
  recipientPhone: '0905 337 210',
  origin: 'SGN',
  destination: 'DAD',
  service: 'Next-day',
  flightNo: 'VJ628',
  pickupAt: 'Today 09:00',
  pieces: 2,
  weightKg: 2.1,
  itemCategory: 'Clothing, 2 items',
  isRestricted: false,
  declaredValue: 1250000,
  codAmount: 1250000,
  stage: 'accepted',
  riskScore: 11,
  createdAt: '2026-09-17T06:04:00',
  docs: [
  { id: 'd1', type: 'ITEM_DECLARATION', fileName: 'declaration.json', pages: 1, uploadedAt: '06:04', status: 'extracted' },
  { id: 'd2', type: 'INVOICE', fileName: 'shopee-order-4471.pdf', pages: 1, uploadedAt: '06:04', status: 'extracted' },
  { id: 'd3', type: 'PARCEL_PHOTO', fileName: 'parcel.jpg', pages: 1, uploadedAt: '06:05', status: 'extracted' },
  { id: 'd4', type: 'ID_CARD', fileName: 'cccd-seller.jpg', pages: 1, uploadedAt: '06:05', status: 'extracted' }],

  extracted: [
  { label: 'Sender', value: 'Shop Lụa Sài Gòn', confidence: 0.99, source: 'ITEM_DECLARATION' },
  { label: 'Recipient', value: 'Lê Thị Mai, 0905 337 210', confidence: 0.98, source: 'ITEM_DECLARATION' },
  { label: 'Item', value: 'Áo dài lụa, 2 sản phẩm', confidence: 0.96, source: 'INVOICE' },
  { label: 'COD', value: '1.250.000₫', confidence: 0.99, source: 'INVOICE' },
  { label: 'Weight', value: '2.1 kg', confidence: 0.97, source: 'PARCEL_PHOTO' }],

  findings: [],
  pendingFindings: [],
  steps: buildSteps({ ocr: 'done', crosscheck: 'done', decision: 'done', flag: 'skipped', handoff: 'skipped' }),
  timeline: [
  { id: 't1', at: '06:04', actor: 'customer', label: 'Order synced from Shopee' },
  { id: 't2', at: '06:06', actor: 'agent', label: 'Cleared — no issues' },
  { id: 't3', at: '06:40', actor: 'smartkargo', label: 'Picked up by courier' }]

};

const o3: Shipment = {
  id: 'shp-3',
  trackingNo: 'SW247-8842133',
  orderRef: 'ORD-2026-118447',
  sender: 'Phạm Thu Hà',
  contactPhone: '0987 441 203',
  contactEmail: 'ha.pham93@gmail.com',
  channel: 'Website',
  recipient: 'Đặng Quốc Bảo',
  recipientPhone: '0977 812 004',
  origin: 'HAN',
  destination: 'SGN',
  service: 'Express 4h',
  flightNo: 'VJ160',
  pickupAt: 'Today 11:15',
  pieces: 1,
  weightKg: 3.2,
  itemCategory: 'Perfume & cosmetics',
  isRestricted: true,
  restrictedType: 'Flammable liquid',
  declaredValue: 6400000,
  codAmount: 12000000,
  stage: 'submitted',
  riskScore: 66,
  createdAt: '2026-09-17T08:41:00',
  docs: [
  { id: 'd1', type: 'ITEM_DECLARATION', fileName: 'declaration.json', pages: 1, uploadedAt: '08:41', status: 'processing' },
  { id: 'd2', type: 'PARCEL_PHOTO', fileName: 'parcel-open.jpg', pages: 1, uploadedAt: '08:41', status: 'processing' },
  { id: 'd3', type: 'ID_CARD', fileName: 'cccd-front.jpg', pages: 1, uploadedAt: '08:42', status: 'processing' },
  { id: 'd4', type: 'INVOICE', fileName: '—', pages: 0, uploadedAt: '—', status: 'missing' }],

  extracted: [
  { label: 'Sender', value: 'Phạm Thu Hà', confidence: 0.98, source: 'ID_CARD' },
  { label: 'Item', value: 'Nước hoa 100 ml × 6 + mỹ phẩm', confidence: 0.9, source: 'ITEM_DECLARATION' },
  { label: 'Liquid volume', value: '600 ml', confidence: 0.84, source: 'ITEM_DECLARATION' },
  { label: 'Declared value', value: '6.400.000₫', confidence: 0.93, source: 'ITEM_DECLARATION' },
  { label: 'COD', value: '12.000.000₫', confidence: 0.95, source: 'ITEM_DECLARATION' }],

  findings: [],
  pendingFindings: [
  {
    id: 'f1',
    code: 'LIQUID_LIMIT',
    ruleRef: 'SR-RES-07',
    title: 'Perfume volume over the 500 ml limit',
    titleVi: 'Nước hoa vượt giới hạn 500 ml',
    detail: '600 ml declared. Split the parcel or remove 2 bottles to fly.',
    severity: 'critical',
    source: 'restricted'
  },
  {
    id: 'f2',
    code: 'MISSING_INVOICE',
    ruleRef: 'SR-DOC-01',
    title: 'Invoice missing above 2,000,000₫',
    titleVi: 'Thiếu hoá đơn cho đơn trên 2.000.000₫',
    detail: 'Declared value is 6,400,000₫ — attach the purchase receipt.',
    severity: 'critical',
    source: 'ocr',
    requiredDoc: 'INVOICE'
  },
  {
    id: 'f3',
    code: 'COD_CEILING',
    ruleRef: 'SR-COD-05',
    title: 'COD above the 10,000,000₫ ceiling',
    titleVi: 'COD vượt hạn mức 10.000.000₫',
    detail: 'COD of 12,000,000₫ needs CX approval or a bank transfer instead.',
    severity: 'warning',
    source: 'service'
  }],

  steps: buildSteps({}),
  timeline: [
  { id: 't1', at: '08:41', actor: 'customer', label: 'Order created on web' },
  { id: 't2', at: '08:42', actor: 'agent', label: 'Queued for check' }]

};

const o4: Shipment = {
  id: 'shp-4',
  trackingNo: 'SW247-8842140',
  orderRef: 'ORD-2026-118459',
  sender: 'Võ Hoàng Nam',
  contactPhone: '0931 774 508',
  contactEmail: 'nam.vo@outlook.com',
  channel: 'Swift247 app',
  recipient: 'Võ Thị Lan',
  recipientPhone: '0918 226 473',
  origin: 'SGN',
  destination: 'HAN',
  service: 'Same-day',
  flightNo: 'VJ190',
  pickupAt: 'Today 16:00',
  pieces: 1,
  weightKg: 4.8,
  itemCategory: 'Fresh seafood, chilled',
  isRestricted: true,
  restrictedType: 'Perishable',
  declaredValue: 1800000,
  codAmount: 0,
  stage: 'awaiting_shipper',
  riskScore: 52,
  createdAt: '2026-09-16T21:35:00',
  docs: [
  { id: 'd1', type: 'ITEM_DECLARATION', fileName: 'declaration.json', pages: 1, uploadedAt: '21:35', status: 'extracted' },
  { id: 'd2', type: 'ID_CARD', fileName: 'cccd-front.jpg', pages: 1, uploadedAt: '21:35', status: 'extracted' },
  { id: 'd3', type: 'PARCEL_PHOTO', fileName: '—', pages: 0, uploadedAt: '—', status: 'missing' },
  { id: 'd4', type: 'PERMIT', fileName: '—', pages: 0, uploadedAt: '—', status: 'missing' }],

  extracted: [
  { label: 'Sender', value: 'Võ Hoàng Nam', confidence: 0.98, source: 'ID_CARD' },
  { label: 'Item', value: 'Hải sản tươi ướp đá', confidence: 0.92, source: 'ITEM_DECLARATION' },
  { label: 'Weight', value: '4.8 kg', confidence: 0.96, source: 'ITEM_DECLARATION' }],

  findings: [],
  pendingFindings: [
  {
    id: 'f1',
    code: 'MISSING_PARCEL_PHOTO',
    ruleRef: 'SR-FOOD-11',
    title: 'Packaging photo missing for fresh food',
    titleVi: 'Thiếu ảnh đóng gói cho hàng tươi',
    detail: 'Fresh food needs a photo showing an insulated, leak-proof box.',
    severity: 'critical',
    source: 'restricted',
    requiredDoc: 'PARCEL_PHOTO'
  },
  {
    id: 'f2',
    code: 'MISSING_PERMIT',
    ruleRef: 'SR-PRO-09',
    title: 'Food safety slip missing',
    titleVi: 'Thiếu giấy chứng nhận an toàn thực phẩm',
    detail: 'Chilled seafood above 3 kg needs a vendor food-safety slip.',
    severity: 'critical',
    source: 'restricted',
    requiredDoc: 'PERMIT'
  }],

  steps: buildSteps({ ocr: 'done', crosscheck: 'done', decision: 'done', flag: 'done', handoff: 'done' }),
  timeline: [
  { id: 't1', at: '21:35', actor: 'customer', label: 'Order created in app' },
  { id: 't2', at: '21:37', actor: 'agent', label: '2 issues flagged, message drafted' },
  { id: 't3', at: '21:52', actor: 'cx', label: 'CX approved and sent' }]

};
o4.findings = o4.pendingFindings;
o4.message = { ...buildMessageDraft(o4, o4.pendingFindings), status: 'sent', sentAt: '2026-09-16 21:52' };

const o5: Shipment = {
  id: 'shp-5',
  trackingNo: 'SW247-8842156',
  orderRef: 'ORD-2026-118470',
  sender: 'Đỗ Lan Anh',
  contactPhone: '0966 302 114',
  contactEmail: 'lananh.do@gmail.com',
  channel: 'TikTok Shop',
  recipient: 'Ngô Bảo Châu',
  recipientPhone: '0902 551 338',
  origin: 'HAN',
  destination: 'SGN',
  service: 'Next-day',
  flightNo: 'VJ138',
  pickupAt: 'Tomorrow 08:30',
  pieces: 1,
  weightKg: 0.6,
  itemCategory: 'Books & documents',
  isRestricted: false,
  declaredValue: 350000,
  codAmount: 0,
  stage: 'draft',
  riskScore: 0,
  createdAt: '2026-09-17T09:20:00',
  docs: [
  { id: 'd1', type: 'ITEM_DECLARATION', fileName: 'declaration-draft.json', pages: 1, uploadedAt: '09:20', status: 'extracted' }],

  extracted: [],
  findings: [],
  pendingFindings: [],
  steps: buildSteps({}),
  timeline: [{ id: 't1', at: '09:20', actor: 'customer', label: 'Draft order' }]
};

export const initialShipments: Shipment[] = [o1, o3, o4, o2, o5];