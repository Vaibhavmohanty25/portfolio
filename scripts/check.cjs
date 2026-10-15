const fs = require('node:fs');
const vm = require('node:vm');
const file = 'index.html';
const html = fs.readFileSync(file, 'utf8');
const scripts = [...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(Boolean);
for (const [i, source] of scripts.entries()) new vm.Script(source, { filename: `inline-${i}.js` });
console.log(`${scripts.length} inline scripts parse successfully.`);
console.log(`Saarthi URL included: ${html.includes("repo:'Saarthi-A-Verified-Grounded-Adaptive-Tutor'")}`);
const ids = [...html.matchAll(/\bid="([^"$]+)"/g)].map(m => m[1]);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate HTML IDs');
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.includes(match[1])) throw new Error('Broken section anchor: ' + match[1]);
}
console.log('HTML IDs are unique and section links resolve.');
