import { existsSync, readFileSync } from 'node:fs';
import { extname } from 'node:path';

const pages = ['index.html', 'demo.html', '404.html'];
const errors = [];

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) errors.push(`${page}: duplicate IDs: ${[...new Set(duplicates)].join(', ')}`);

  for (const match of html.matchAll(/\s(?:href|src)=["']([^"']+)["']/g)) {
    const url = match[1].split(/[?#]/)[0];
    if (!url || /^(?:#|https?:|mailto:|tel:|data:)/.test(url)) continue;
    const local = url === '/' ? 'index.html' : url === '/demo' ? 'demo.html' : url.replace(/^\//, '');
    if (!existsSync(local)) errors.push(`${page}: missing asset ${match[1]}`);
  }
}

for (const script of ['assets/site.js', 'assets/demo-generator.js']) {
  if (extname(script) !== '.js' || !existsSync(script)) errors.push(`Missing script ${script}`);
}

const source = ['index.html', 'demo.html', 'assets/site.js', 'assets/demo-generator.js', '_headers']
  .map((file) => readFileSync(file, 'utf8')).join('\n');
if (/images\.unsplash\.com/.test(source)) errors.push('External Unsplash dependency found');
if (/María Rodríguez|Carlos López|Andrea Torres/.test(source)) errors.push('Placeholder testimonials found');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Site validation passed.');
