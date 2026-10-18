export function history(action) {
  editor.root.focus();
  const target = editor.captureHistory();
  if (!target) return { disposition:'unavailable' };
  try { return target.execute(action); } finally { target.dispose(); }
}
