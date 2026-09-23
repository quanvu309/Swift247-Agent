import { ReferenceRule } from '../types/cargo';

export const referenceRules: ReferenceRule[] = [
{
  id: 'r1',
  code: 'SR-DOC-01',
  category: 'Order',
  title: 'Invoice required above declared value threshold',
  value: '> 2,000,000₫',
  updatedAt: '2026-08-02'
},
{
  id: 'r10',
  code: 'SR-DOC-02',
  category: 'Order',
  title: 'Order number must match across documents',
  value: 'Documents = SmartKargo order',
  updatedAt: '2026-09-22'
},
{
  id: 'r2',
  code: 'SR-KYC-01',
  category: 'KYC',
  title: 'Sender ID required for high-value or COD orders',
  value: '> 5,000,000₫ or any COD',
  updatedAt: '2026-08-02'
},
{
  id: 'r3',
  code: 'SR-INS-03',
  category: 'Service rules',
  title: 'Insurance auto-applied above threshold',
  value: '0.5% of value > 5,000,000₫',
  updatedAt: '2026-07-18'
},
{
  id: 'r4',
  code: 'SR-WGT-04',
  category: 'Service rules',
  title: 'Parcel size & weight limit',
  value: '≤ 30 kg, longest side ≤ 100 cm',
  updatedAt: '2026-07-18'
},
{
  id: 'r5',
  code: 'SR-COD-05',
  category: 'Service rules',
  title: 'COD ceiling per order',
  value: '10,000,000₫',
  updatedAt: '2026-09-01'
},
{
  id: 'r6',
  code: 'SR-DG-02',
  category: 'Restricted items',
  title: 'Power banks & lithium batteries',
  value: '≤ 100 Wh, declaration required',
  updatedAt: '2026-09-10'
},
{
  id: 'r7',
  code: 'SR-RES-07',
  category: 'Restricted items',
  title: 'Perfume, alcohol & flammable liquids',
  value: '≤ 500 ml, ≤ 24% alcohol',
  updatedAt: '2026-09-10'
},
{
  id: 'r8',
  code: 'SR-FOOD-11',
  category: 'Restricted items',
  title: 'Fresh food needs leak-proof packaging photo',
  value: 'Photo + insulated box',
  updatedAt: '2026-06-11'
},
{
  id: 'r9',
  code: 'SR-PRO-09',
  category: 'Restricted items',
  title: 'Prohibited items never accepted',
  value: 'Cash, weapons, drugs, live animals',
  updatedAt: '2026-09-10'
}];