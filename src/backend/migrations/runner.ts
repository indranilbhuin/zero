import StorageService from '../../utils/asyncStorageService';
import {DATA_MIGRATIONS} from './registry';

const MIGRATION_VERSION_KEY = 'data_migration_version';

/**
 * Sequential data migration runner.
 *
 * - Reads current version from MMKV
 * - Runs each pending migration in order (version > current)
 * - Advances version ONLY after each migration succeeds
 * - If a migration fails, stops and retries on next app launch
 *
 * Compatible with the previous dataMigrations.ts system — same MMKV key,
 * so users who already ran migration v1 won't re-run it.
 */
export const runMigrations = async (): Promise<void> => {
  const currentVersion = StorageService.getNumber(MIGRATION_VERSION_KEY) ?? 0;

  const pending = DATA_MIGRATIONS
    .filter(m => m.version > currentVersion)
    .sort((a, b) => a.version - b.version);

  if (pending.length === 0) {
    return;
  }

  for (const migration of pending) {
    try {
      await migration.up();
      StorageService.setNumber(MIGRATION_VERSION_KEY, migration.version);
    } catch (error) {
      if (__DEV__) {
        console.error(`Data migration ${migration.version} (${migration.name}) failed:`, error);
      }
      break;
    }
  }
};
