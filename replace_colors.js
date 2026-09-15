import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.tsx');

const replacements = [
  { regex: /\[#0a0c0e\]/g, replacement: 'bg-primary' },
  { regex: /\[#161b22\]/g, replacement: 'bg-surface' },
  { regex: /\[#0d1117\]/g, replacement: 'bg-inset' },
  { regex: /\[#2d3139\]/g, replacement: 'border-primary' },
  { regex: /\[#3f4450\]/g, replacement: 'border-hover' },
  { regex: /\[#e0e0e0\]/g, replacement: 'text-primary' },
  { regex: /\[#8b949e\]/g, replacement: 'text-secondary' },
  { regex: /\[#c9d1d9\]/g, replacement: 'text-tertiary' },
];

files.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  let changed = false;
  
  replacements.forEach(({ regex, replacement }) => {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  });

  if (changed) {
    writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
