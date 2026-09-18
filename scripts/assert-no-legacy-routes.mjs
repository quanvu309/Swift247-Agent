import { execFileSync } from 'node:child_process';

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
const src = new URL('../src', import.meta.url).pathname;

let hits = [];
for (const needle of banned) {
  let out = '';
  try {
    out = execFileSync('rg', ['-n', '--glob', '!**/utils/agent.ts', needle, src], {
      encoding: 'utf8'
    });
  } catch (error) {
    if (error.status !== 1) throw error;
  }
  if (out.trim()) hits.push(out.trim());
}

if (hits.length) {
  console.error('Legacy app routes still appear in src:\n' + hits.join('\n'));
  process.exit(1);
}

console.log('No legacy /agent /ops /smartkargo /shipper app routes in src.');
