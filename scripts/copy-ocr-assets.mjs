// Copies the OCR worker, wasm core, and English language data into public/ocr so the demo
// reads parcel photos without reaching a CDN.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = new URL('..', import.meta.url).pathname;
const out = join(root, 'public/ocr');
const pkgDir = (name) => dirname(require.resolve(`${name}/package.json`));

const files = [
  [join(pkgDir('tesseract.js'), 'dist/worker.min.js'), 'worker.min.js'],
  [join(pkgDir('tesseract.js-core'), 'tesseract-core-simd-lstm.wasm.js'), 'core/tesseract-core-simd-lstm.wasm.js'],
  [join(pkgDir('tesseract.js-core'), 'tesseract-core-lstm.wasm.js'), 'core/tesseract-core-lstm.wasm.js'],
  [join(pkgDir('@tesseract.js-data/eng'), '4.0.0_best_int/eng.traineddata.gz'), 'lang/eng.traineddata.gz']
];

for (const [from, to] of files) {
  const dest = join(out, to);
  mkdirSync(dirname(dest), { recursive: true });
  if (!existsSync(dest)) copyFileSync(from, dest);
}
console.log('OCR assets ready in public/ocr.');
