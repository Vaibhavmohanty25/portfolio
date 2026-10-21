const fs = require('node:fs');
const vm = require('node:vm');
const file = 'index.html';
const html = fs.readFileSync(file, 'utf8');
const scripts = [...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(Boolean);
for (const [i, source] of scripts.entries()) new vm.Script(source, { filename: `inline-${i}.js` });
console.log(`${scripts.length} inline scripts parse successfully.`);
if (!html.includes('Saarthi-A-Verified-Grounded-Adaptive-Tutor')) throw new Error('Missing Saarthi repository link');
if (!/<h1[^>]*>VAIBHAV<br\s*\/?><em>MOHANTY<\/em><\/h1>/.test(html)) throw new Error('Missing personalized heading');
for (const match of html.matchAll(/(?:src|href)="(\.?\/_next\/[^"?#]+)"/g)) {
  if (!fs.existsSync(match[1].replace(/^\//, ''))) throw new Error('Missing exported asset: ' + match[1]);
}
const ids = [...html.matchAll(/\bid="([^"$]+)"/g)].map(m => m[1]);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate HTML IDs');
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.includes(match[1])) throw new Error('Broken section anchor: ' + match[1]);
}
console.log('HTML IDs are unique and section links resolve.');
