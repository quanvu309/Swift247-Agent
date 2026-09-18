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

const srcRoot = new URL('../src', import.meta.url).pathname;

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
for (const file of walk(srcRoot)) {
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

const nav = readFileSync(join(srcRoot, 'data/navigation.ts'), 'utf8');
if (/label:\s*['"]Flows['"]/.test(nav)) {
  console.error('Flows is still a sidebar label in src/data/navigation.ts.');
  process.exit(1);
}

const app = readFileSync(join(srcRoot, 'App.tsx'), 'utf8');
if (/pages\/Flows/.test(app) || /<Flows\b/.test(app)) {
  console.error('App still mounts the Flows landing.');
  process.exit(1);
}
if (!app.includes('<Route path="/" element={<Navigate to="/design" replace />} />')) {
  console.error('App must send / to /design.');
  process.exit(1);
}

const manifest = readFileSync(join(srcRoot, 'canvas.manifest.js'), 'utf8');
if (/name:\s*"Flows"/.test(manifest) || /scr_flows/.test(manifest)) {
  console.error('Canvas manifest still has a Flows demo screen.');
  process.exit(1);
}

console.log('No legacy /agent /ops /smartkargo /shipper app routes in src.');
console.log('No Flows nav, landing route, or demo entry point.');
