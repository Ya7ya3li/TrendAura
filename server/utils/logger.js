/**
 * TrendAura Global Server Logging Matrix
 * Standardizes terminal output visualization across production cloud environments.
 */
export const logger = {
  info: (message, context = '') => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] [${timestamp}] ${message}`, context ? JSON.stringify(context) : '');
  },

  warn: (message, context = '') => {
    const timestamp = new Date().toISOString();
    console.warn(`⚠️ [WARN] [${timestamp}] ${message}`, context ? JSON.stringify(context) : '');
  },

  error: (message, errorInstance = null) => {
    const timestamp = new Date().toISOString();
    console.error(`🚨 [CRITICAL SYSTEM ERROR] [${timestamp}] ${message}`, {
      errorMessage: errorInstance?.message || 'Unknown Exception Boundary',
      errorStack: errorInstance?.stack || 'No Stack Traces Available'
    });
  }
};