import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const banned = [
  '"/agent',
  '"/ops',
  '"/smartkargo',
  '"/shipper',
  "'/agent",
  "'/ops",
  "'/smartkargo",
  "'/shipper",
  '`/agent',
  '`/ops',
  '`/smartkargo',
  '`/shipper'
];

const root = new URL('../src', import.meta.url).pathname;

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else files.push(path);
  }
  return files;
}

const hits = [];
for (const file of walk(root)) {
  const text = readFileSync(file, 'utf8');
  for (const needle of banned) {
    const index = text.indexOf(needle);
    if (index === -1) continue;
    const line = text.slice(0, index).split('\n').length;
    hits.push(`${file}:${line}:${needle}`);
  }
}

if (hits.length) {
  console.error('Legacy app routes still appear in src:\n' + hits.join('\n'));
  process.exit(1);
}

console.log('No legacy /agent /ops /smartkargo /shipper app routes in src.');
