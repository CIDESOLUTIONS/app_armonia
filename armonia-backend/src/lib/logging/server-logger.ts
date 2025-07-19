export const ServerLogger = {
  info: (...args: any[]) => {
    console.log('[ServerLogger INFO]', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('[ServerLogger WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ServerLogger ERROR]', ...args);
  },
};
