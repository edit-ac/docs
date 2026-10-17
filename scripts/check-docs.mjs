import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, extname, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

export function checkDocs(root) {
  const nav = JSON.parse(readFileSync(resolve(root, 'navigation.json'), 'utf8'));
  const errors = [];
  const files = [];
  function visit(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || ['node_modules', 'dist', 'public', 'themes'].includes(entry.name)) continue;
      const file = resolve(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (extname(file) === '.md') files.push(file);
    }
  }
  visit(root);
  if (nav.schemaVersion !== 1 || !Array.isArray(nav.pages) || !nav.pages.length) throw new Error('Invalid navigation');
  if (new Set(nav.pages).size !== nav.pages.length) errors.push('Duplicate navigation entries');
  for (const file of nav.pages) {
    if (!/^content\/.+\.md$/.test(file) || file.split('/').includes('..')) errors.push(`Invalid navigation target: ${file}`);
    if (!existsSync(resolve(root, file))) errors.push(`Missing navigation target: ${file}`);
  }
  for (const file of files) {
    const name = relative(root, file);
    const text = readFileSync(file, 'utf8');
    if (name.startsWith('content/')) {
      if (!/^\+\+\+\ntitle = "[^"]+"/m.test(text)) errors.push(`Missing Zola page title: ${name}`);
      if (!nav.pages.includes(name)) errors.push(`Unlisted public page: ${name}`);
    } else if (!/^# .+/m.test(text)) errors.push(`Missing page title: ${name}`);
    // Code samples can contain illustrative links. Validate prose and Zola's
    // front-matter links; Zola itself checks rendered anchors during site checks.
    const prose = text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[^\n]*(?:\n|$)/gm, '');
    const targets = new Set([
      ...Array.from(prose.matchAll(/\[[^\]]*\]\(<?([^\s)>]+)>?(?:\s+"[^"]*")?\)/g), match => match[1]),
      ...Array.from(prose.matchAll(/^\s*\[[^\]]+\]:\s*<?([^\s>]+)>?/gm), match => match[1]),
      ...Array.from(prose.matchAll(/(?:path|redirect_to)\s*=\s*"(@\/[^"#]+(?:#[^"]*)?)"/g), match => match[1]),
    ]);
    for (const target of targets) {
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      const path = target.split('#')[0];
      const destination = path.startsWith('@/') ? resolve(root, 'content', path.slice(2)) : resolve(dirname(file), path);
      if (!existsSync(destination)) errors.push(`Broken local link: ${name} -> ${target}`);
    }
  }
  return { pages: files.length, navigation: nav.pages.length, errors };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = checkDocs(process.cwd());
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length) process.exitCode = 1;
}
