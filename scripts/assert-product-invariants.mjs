import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const srcRoot = new URL('../src', import.meta.url).pathname;
const indexHtml = new URL('../index.html', import.meta.url).pathname;
const tailwind = new URL('../tailwind.config.js', import.meta.url).pathname;

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

const html = readFileSync(indexHtml, 'utf8');
if (!html.includes('href="/swift247-mark.png"')) {
  hits.push('index.html is missing the Swift247 mark favicon.');
}
if (!html.includes('<title>Swift247 Agent System</title>')) {
  hits.push('index.html title is not Swift247 Agent System.');
}

const css = readFileSync(join(srcRoot, 'index.css'), 'utf8');
if (!css.includes('family=Inter')) {
  hits.push('src/index.css does not import Inter.');
}

const tw = readFileSync(tailwind, 'utf8');
if (!tw.includes("sans: ['Inter'")) {
  hits.push('tailwind.config.js sans stack is not Inter.');
}

const nav = readFileSync(join(srcRoot, 'data/navigation.ts'), 'utf8');
if (/label:\s*['"]Flows['"]/.test(nav)) {
  hits.push('Flows is a sidebar label.');
}
if (!nav.includes("label: 'Flow Design'")) {
  hits.push('Sidebar is missing Flow Design.');
}

const productFiles = walk(srcRoot).filter((file) => /\.(ts|tsx|js)$/.test(file));
for (const file of productFiles) {
  const text = readFileSync(file, 'utf8');
  if (text.includes('\u2014')) {
    hits.push(`${file} contains an em dash.`);
  }
}

if (hits.length) {
  console.error(hits.join('\n'));
  process.exit(1);
}

console.log('Brand, Inter, Flow Design nav, and no em dash in src ts/tsx/js.');
