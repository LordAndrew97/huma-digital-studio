import { existsSync, readFileSync, readdirSync } from 'node:fs';
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

  for (const match of html.matchAll(/<a\b[^>]*\shref=["']#([^"']*)["'][^>]*>/g)) {
    if (match[1] && !ids.includes(match[1])) errors.push(`${page}: missing anchor #${match[1]}`);
  }

  for (const match of html.matchAll(/<a\b[^>]*\starget=["']_blank["'][^>]*>/g)) {
    if (!/\srel=["'][^"']*\bnoopener\b[^"']*["']/.test(match[0])) {
      errors.push(`${page}: target="_blank" link without rel="noopener"`);
    }
  }

  for (const match of html.matchAll(/<(?:input|select|textarea)\b[^>]*>/g)) {
    const tag = match[0];
    if (/\stype=["']hidden["']/.test(tag)) continue;
    const id = tag.match(/\sid=["']([^"']+)["']/)?.[1];
    const hasLabel = id && new RegExp(`<label\\b[^>]*\\bfor=["']${id}["']`).test(html);
    const hasAriaLabel = /\saria-label(?:ledby)?=["'][^"']+["']/.test(tag);
    const lastLabelOpen = html.lastIndexOf('<label', match.index);
    const lastLabelClose = html.lastIndexOf('</label>', match.index);
    if (!hasLabel && !hasAriaLabel && lastLabelOpen <= lastLabelClose) {
      errors.push(`${page}: form control without an accessible label${id ? ` (#${id})` : ''}`);
    }
  }

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt=["'][^"']*["']/.test(match[0])) errors.push(`${page}: image without alt text`);
  }
}

for (const script of ['assets/site.js', 'assets/demo-generator.js']) {
  if (extname(script) !== '.js' || !existsSync(script)) errors.push(`Missing script ${script}`);
}

const source = ['index.html', 'demo.html', 'assets/site.js', 'assets/demo-generator.js', '_headers']
  .map((file) => readFileSync(file, 'utf8')).join('\n');
if (/images\.unsplash\.com/.test(source)) errors.push('External Unsplash dependency found');
if (/María Rodríguez|Carlos López|Andrea Torres/.test(source)) errors.push('Placeholder testimonials found');

const headers = readFileSync('_headers', 'utf8');
for (const header of [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'X-Permitted-Cross-Domain-Policies',
]) {
  if (!headers.includes(`${header}:`)) errors.push(`Missing security header: ${header}`);
}
const scriptPolicy = headers.match(/script-src ([^;]+)/)?.[1] || '';
if (scriptPolicy.includes("'unsafe-inline'")) errors.push("CSP script-src must not allow 'unsafe-inline'");

for (const workflow of readdirSync('.github/workflows').filter((file) => file.endsWith('.yml'))) {
  const yaml = readFileSync(`.github/workflows/${workflow}`, 'utf8');
  for (const match of yaml.matchAll(/uses:\s+[^\s@]+@([^\s#]+)/g)) {
    if (!/^[a-f0-9]{40}$/.test(match[1])) errors.push(`${workflow}: GitHub Action is not pinned to a full commit SHA`);
  }
}

if (!existsSync('.well-known/security.txt')) errors.push('Missing .well-known/security.txt');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Site validation passed.');
