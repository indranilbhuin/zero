import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import {schema} from './schema';
import {migrations} from './migrations';
import {User, Category, Expense, Currency, Debtor, Debt} from './models';

// Lazy initialization - database is only created on first access
let _database: Database | null = null;

const getDatabase = (): Database => {
  if (!_database) {
    const adapter = new SQLiteAdapter({
      schema,
      migrations,
      jsi: true,
      onSetUpError: error => {
        if (__DEV__) {
          console.error('WatermelonDB setup error:', error);
        }
      },
    });

    _database = new Database({
      adapter,
      modelClasses: [User, Category, Expense, Currency, Debtor, Debt],
    });
  }
  return _database;
};

// Export as a getter to maintain backward compatibility
// This creates the database on first access, not at module load
export const database = new Proxy({} as Database, {
  get(_target, prop) {
    const db = getDatabase();
    const value = db[prop as keyof Database];
    // Bind methods to the database instance
    if (typeof value === 'function') {
      return value.bind(db);
    }
    return value;
  },
});

export {getDatabase};
export default database;
