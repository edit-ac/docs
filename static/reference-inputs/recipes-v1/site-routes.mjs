async function options(name, optional = false) {
  const extension = optional ? await import('@edit-ac/markdown').then(async ({ initMarkdown }) => {
    const { markdownExtension } = await import('@edit-ac/markdown/web');
    const { default: markdownUrl } = await import('@edit-ac/markdown/wasm?url');
    return markdownExtension(await initMarkdown(markdownUrl));
  }) : undefined;
  return { ...records.get(name), ...taskPreset(), assetUrl, indexedDB, locks: navigator.locks,
    markdown: extension, plainTextPolicy: optional ? 'markdown' : 'literal', label: name };
}
async function mount(binding = 'plain', name = 'description', optional = false) {
  const started = performance.now(), opts = await options(name, optional);
  const root = document.createElement('div'); root.id = 'site-' + ++sequence;
  document.querySelector('#editors').append(root);
  let editor, close;
  if (binding === 'react') {
    const [{ createElement }, { createRoot }, { EditorHost }] = await Promise.all([import('react'), import('react-dom/client'), import('@edit-ac/react')]);
    const react = createRoot(root);
    editor = await new Promise((resolve, reject) => react.render(createElement(EditorHost, { options: opts, onReady: resolve, onError: reject, onDispose: report => reports.push(report) })));
    close = async () => { const report = await editor.destroy(); react.unmount(); return report; };
  } else if (binding === 'astro') {
    const { mountEditorHost } = await import('@edit-ac/astro');
    // The HTML surface comes from the installed Editor.astro component, compiled
    // by Astro in the same site graph, rather than a synthetic framework host.
    root.innerHTML = document.querySelector('#astro-template').innerHTML;
    const host = mountEditorHost(root.querySelector('edit-ac-editor'), opts);
    editor = await host.ready; close = () => host.dispose();
  } else { editor = createEditor(root, opts); await editor.ready; close = () => editor.destroy(); }
  await new Promise(resolve => requestAnimationFrame(resolve));
  const sample = { binding, name, optional, readyAndFrameMs: performance.now() - started, realmToFrameMs: performance.now(), timingScope: 'mount invocation through options/runtime/DOM and next animation frame; realm sample includes page bootstrap' };
  timings.push(sample); live.set(root.id, { editor, root, close, sample }); return root.id;
}
