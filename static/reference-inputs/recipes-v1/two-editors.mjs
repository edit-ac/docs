function mount(name, { optional, readOnly = false, preset = 'task' } = {}) {
  const record = records.get(name); if (!record) throw Error(`Seed missing: ${name}`);
  const root = document.createElement('div'); root.id = `${name}-${++sequence}`; document.querySelector('#editors').append(root);
  const key = root.id;
  const started = performance.now();
  const editor = createEditor(root, { ...record, assetUrl, indexedDB, locks: navigator.locks,
    ...(preset === 'task' ? taskPreset() : { preset: 'minimal' }), markdown: optional,
    plainTextPolicy: optional ? 'markdown' : 'literal', readOnly, label: name,
    recover: async options => {
      const session = await recoverLocalDocument(options); observations.recovered++;
      const destroy = session.storage.destroy.bind(session.storage); let released = false;
      session.storage.destroy = async options => { const result = await destroy(options); if (!released) { released = true; observations.released++; } return result; };
      return session;
    },
  });
  observations.timings[key] = { started };
  void editor.ready.then(() => { observations.timings[key].readyMs = performance.now() - started; requestAnimationFrame(() => { observations.timings[key].firstFrameMs = performance.now() - started; }); }, () => {});
  const off = editor.subscribe(state => { observations.callbacks[key] = (observations.callbacks[key] ?? 0) + 1; if (state.phase === 'ready' && !root.isConnected) observations.late.push(key); });
  live.set(key, { editor, root, off }); return key;
}
