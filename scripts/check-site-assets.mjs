import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, relative, extname, sep } from 'node:path';
import { createHash } from 'node:crypto';

export function artifactManifest(root) {
  const files = {};
  function visit(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = resolve(dir, entry.name);
      if (entry.isDirectory()) visit(path);
      else files[relative(root, path).split(sep).join('/')] = createHash('sha256').update(readFileSync(path)).digest('hex');
    }
  }
  visit(root);
  return files;
}

// Check generated HTML/CSS, not source Markdown: resolve URLs as a static host does.
export function checkSiteAssets(root, baseUrl) {
  const base = new URL(baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  const manifest = artifactManifest(root);
  const errors = [];
  let references = 0;
  for (const name of Object.keys(manifest).filter(name => ['.html', '.css'].includes(extname(name)))) {
    const text = readFileSync(resolve(root, name), 'utf8');
    const page = new URL(name.replace(/index\.html$/, ''), base);
    const targets = extname(name) === '.html'
      ? [...text.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/g)].map(m => m[1])
      : [...text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)].map(m => m[1]);
    for (const target of targets) {
      if (/^(?:#|data:|mailto:|tel:)/.test(target)) continue;
      const url = new URL(target.replaceAll('&amp;', '&'), page);
      if (url.origin !== base.origin) continue;
      references++;
      // Static hosts redirect the mount directory to its trailing-slash URL.
      const mountRoot = url.pathname === base.pathname.replace(/\/$/, '');
      if (!mountRoot && !url.pathname.startsWith(base.pathname)) {
        errors.push(`${name}: URL escapes base path: ${target}`);
        continue;
      }
      let path = resolve(root, decodeURIComponent(url.pathname.slice(base.pathname.length)));
      if (!path.startsWith(`${resolve(root)}${sep}`) && path !== resolve(root)) {
        errors.push(`${name}: URL escapes output: ${target}`);
        continue;
      }
      if (existsSync(path) && statSync(path).isDirectory()) path = resolve(path, 'index.html');
      if (!existsSync(path)) errors.push(`${name}: missing local target: ${target}`);
    }
  }
  return { files: Object.keys(manifest).length, html: Object.keys(manifest).filter(n => n.endsWith('.html')).length, references, errors };
}
