import {migration_001} from './scripts/001_sanitize_icon_color';
import {migration_002} from './scripts/002_remap_category_colors';

export interface DataMigration {
  version: number;
  name: string;
  up: () => Promise<void>;
}

/**
 * Ordered list of all data migrations.
 * Each migration runs exactly once, tracked by version in MMKV.
 *
 * To add a new migration:
 * 1. Create src/backend/migrations/scripts/NNN_description.ts
 * 2. Export { version: N, name: '...', up: async () => { ... } }
 * 3. Import and add it to this array
 */
export const DATA_MIGRATIONS: DataMigration[] = [
  migration_001,
  migration_002,
];
