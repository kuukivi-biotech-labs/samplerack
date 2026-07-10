const LEVELS = ['debug', 'info', 'warn', 'error'];

export function log(level, message, extra = {}) {
  if (!LEVELS.includes(level)) throw new Error(`unknown log level: ${level}`);
  const line = { ts: new Date().toISOString(), level, message, ...extra };
  if (level === 'error') console.error(JSON.stringify(line));
  else console.log(JSON.stringify(line));
}
