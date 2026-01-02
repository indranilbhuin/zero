import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import {schema} from './schema';
import {User, Category, Expense, Currency, Debtor, Debt} from './models';

// Create the SQLite adapter with JSI enabled for performance
const adapter = new SQLiteAdapter({
  schema,
  jsi: true, // Enable JSI for high performance
  onSetUpError: error => {
    console.error('WatermelonDB setup error:', error);
  },
});

// Create the database instance
export const database = new Database({
  adapter,
  modelClasses: [User, Category, Expense, Currency, Debtor, Debt],
});

export default database;
