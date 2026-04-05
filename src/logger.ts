/**
 * The Voice of the Harness.
 * Manages dialectic output with philosophical precision.
 */
export const Logger = {
  info: (message: string, ...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    console.log(`[Info] ${message}`, ...args);
  },

  warn: (message: string, ...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    console.warn(`[Warn] ${message}`, ...args);
  },

  error: (message: string, ...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    console.error(`[Error] ${message}`, ...args);
  },

  debug: (message: string, ...args: unknown[]): void => {
    if (process.env.HARNESS_DEBUG) {
      // eslint-disable-next-line no-console
      console.debug(`[Debug] ${message}`, ...args);
    }
  },
};
