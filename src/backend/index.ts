import {runMigrations} from './migrations/runner';

/**
 * Initialize the backend layer.
 * Called once on app startup before any screens render.
 *
 * Responsibilities:
 * - Run pending data migrations (sequential, versioned, idempotent)
 * - Future: cache warmup, integrity checks, etc.
 */
export const initBackend = async (): Promise<void> => {
  try {
    await runMigrations();
  } catch (error) {
    if (__DEV__) {
      console.error('Backend initialization failed:', error);
    }
  }
};
