export function command(name, text) {
  const target = editor.captureCommand(name);
  if (!target) return { disposition:'unavailable' }; // consumer status, not CommandResult
  try { return target.execute(text); } finally { target.dispose(); }
}
