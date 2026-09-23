/// <reference types="vite/client" />
import type { Worker } from 'tesseract.js';
import { readDocument } from '../product/docReader.js';
import type { DocType } from '../types/cargo';

export interface ReadResult {
  fileName: string;
  type: DocType | null;
  fields: Record<string, string | number | null>;
  method: 'json' | 'pdf' | 'ocr' | 'unsupported';
  error?: string;
}

let ocrWorker: Promise<Worker> | null = null;

function getOcrWorker(): Promise<Worker> {
  if (!ocrWorker) {
    ocrWorker = import('tesseract.js').then(({ createWorker }) =>
      createWorker('eng', 1, {
        workerPath: '/ocr/worker.min.js',
        corePath: '/ocr/core',
        langPath: '/ocr/lang',
        gzip: true
      })
    );
    // A failed load should not poison later attempts.
    ocrWorker.catch(() => {
      ocrWorker = null;
    });
  }
  return ocrWorker;
}

async function pdfText(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    const { default: workerUrl } = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  }
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i += 1) {
    const content = await (await doc.getPage(i)).getTextContent();
    pages.push(
      content.items.map((item) => ('str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '')).join('')
    );
  }
  return pages.join('\n');
}

async function imageText(file: File): Promise<string> {
  const worker = await getOcrWorker();
  const { data } = await worker.recognize(file);
  return data.text;
}

export async function readFile(file: File): Promise<ReadResult> {
  const name = file.name;
  const mime = file.type;
  try {
    if (/json$/i.test(mime) || /\.json$/i.test(name)) {
      return { ...readDocument({ name, mime, text: await file.text() }), method: 'json' };
    }
    if (mime === 'application/pdf' || /\.pdf$/i.test(name)) {
      return { ...readDocument({ name, mime, text: await pdfText(file) }), method: 'pdf' };
    }
    if (/^image\//.test(mime) || /\.(jpe?g|png|webp)$/i.test(name)) {
      return { ...readDocument({ name, mime, text: await imageText(file) }), method: 'ocr' };
    }
    return { fileName: name, type: null, fields: {}, method: 'unsupported' };
  } catch (err) {
    return { fileName: name, type: null, fields: {}, method: 'unsupported', error: String(err) };
  }
}
