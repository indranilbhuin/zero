import AsyncStorage from '@react-native-async-storage/async-storage';
import {database} from '../database';
import {getRealm} from '../../utils/realmService';
import User from '../models/User';
import Category from '../models/Category';
import Expense from '../models/Expense';
import Currency from '../models/Currency';
import Debtor from '../models/Debtor';
import Debt from '../models/Debt';

const MIGRATION_KEY = 'WATERMELON_MIGRATION_COMPLETED';

// Type definitions for Realm objects (used during migration)
interface RealmObjectId {
  toHexString(): string;
}

interface RealmUser {
  _id: RealmObjectId;
  username: string;
  email: string;
}

interface RealmCategory {
  _id: RealmObjectId;
  name: string;
  categoryStatus: boolean;
  user?: {_id: RealmObjectId};
  icon?: string;
  color: string;
}

interface RealmExpense {
  _id: RealmObjectId;
  title: string;
  amount: number;
  description?: string;
  category?: {_id: RealmObjectId};
  user?: {_id: RealmObjectId};
  date: string;
}

interface RealmCurrency {
  _id: RealmObjectId;
  code: string;
  symbol: string;
  name: string;
  user?: {_id: RealmObjectId};
}

interface RealmDebtor {
  _id: RealmObjectId;
  title: string;
  type: string;
  debtorStatus: boolean;
  user?: {_id: RealmObjectId};
  icon?: string;
  color: string;
}

interface RealmDebt {
  _id: RealmObjectId;
  description: string;
  amount: number;
  debtor?: {_id: RealmObjectId};
  user?: {_id: RealmObjectId};
  date: string;
  type: string;
}

/**
 * Check if migration has already been completed
 */
export const isMigrationCompleted = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(MIGRATION_KEY);
    return value === 'true';
  } catch {
    return false;
  }
};

/**
 * Mark migration as completed
 */
const setMigrationCompleted = async (): Promise<void> => {
  await AsyncStorage.setItem(MIGRATION_KEY, 'true');
};

/**
 * Convert Realm ObjectId to string
 */
const objectIdToString = (objectId: unknown): string => {
  if (!objectId) {
    return '';
  }
  if (typeof objectId === 'string') {
    return objectId;
  }
  if (
    typeof objectId === 'object' &&
    objectId !== null &&
    'toHexString' in objectId &&
    typeof (objectId as RealmObjectId).toHexString === 'function'
  ) {
    return (objectId as RealmObjectId).toHexString();
  }
  return String(objectId);
};

/**
 * Execute the full migration from Realm to WatermelonDB
 */
export const executeRealmToWatermelonMigration = async (): Promise<boolean> => {
  console.log('=== Starting Realm to WatermelonDB Migration ===');

  try {
    // Check if already migrated
    const alreadyMigrated = await isMigrationCompleted();
    if (alreadyMigrated) {
      console.log('Migration already completed, skipping...');
      return true;
    }

    // Open Realm database
    console.log('Opening Realm database...');
    let realm: Realm;
    try {
      realm = await getRealm();
    } catch (error) {
      console.log('No Realm database found or error opening it:', error);
      await setMigrationCompleted();
      return true;
    }

    // Check if Realm has any data
    const hasData =
      realm.objects('User').length > 0 ||
      realm.objects('Category').length > 0 ||
      realm.objects('Expense').length > 0;

    if (!hasData) {
      console.log('No Realm data found, marking migration as complete...');
      await setMigrationCompleted();
      return true;
    }

    console.log('Found Realm data, starting migration...');

    // Execute migration using batch operations for performance
    await database.write(async () => {
      const batchOperations: unknown[] = [];

      // Migrate Users
      const realmUsers = realm.objects('User') as unknown as RealmUser[];
      console.log(`Migrating ${realmUsers.length} users...`);
      for (const realmUser of realmUsers) {
        const id = objectIdToString(realmUser._id);
        batchOperations.push(
          database.get<User>('users').prepareCreate(user => {
            user._raw.id = id;
            user.username = realmUser.username || '';
            user.email = realmUser.email || '';
          }),
        );
      }

      // Migrate Categories
      const realmCategories = realm.objects(
        'Category',
      ) as unknown as RealmCategory[];
      console.log(`Migrating ${realmCategories.length} categories...`);
      for (const realmCat of realmCategories) {
        const id = objectIdToString(realmCat._id);
        const userId = objectIdToString(realmCat.user?._id);
        batchOperations.push(
          database.get<Category>('categories').prepareCreate(cat => {
            cat._raw.id = id;
            cat.name = realmCat.name || '';
            cat.categoryStatus = realmCat.categoryStatus ?? true;
            cat.userId = userId;
            cat.icon = realmCat.icon || undefined;
            cat.color = realmCat.color || '#808080';
          }),
        );
      }

      // Migrate Expenses
      const realmExpenses = realm.objects(
        'Expense',
      ) as unknown as RealmExpense[];
      console.log(`Migrating ${realmExpenses.length} expenses...`);
      for (const realmExp of realmExpenses) {
        const id = objectIdToString(realmExp._id);
        const userId = objectIdToString(realmExp.user?._id);
        const categoryId = objectIdToString(realmExp.category?._id);
        batchOperations.push(
          database.get<Expense>('expenses').prepareCreate(exp => {
            exp._raw.id = id;
            exp.title = realmExp.title || '';
            exp.amount = realmExp.amount || 0;
            exp.description = realmExp.description || undefined;
            exp.categoryId = categoryId;
            exp.userId = userId;
            exp.date = realmExp.date || new Date().toISOString();
          }),
        );
      }

      // Migrate Currencies
      const realmCurrencies = realm.objects(
        'Currency',
      ) as unknown as RealmCurrency[];
      console.log(`Migrating ${realmCurrencies.length} currencies...`);
      for (const realmCurr of realmCurrencies) {
        const id = objectIdToString(realmCurr._id);
        const userId = objectIdToString(realmCurr.user?._id);
        batchOperations.push(
          database.get<Currency>('currencies').prepareCreate(curr => {
            curr._raw.id = id;
            curr.code = realmCurr.code || '';
            curr.symbol = realmCurr.symbol || '';
            curr.name = realmCurr.name || '';
            curr.userId = userId;
          }),
        );
      }

      // Migrate Debtors
      const realmDebtors = realm.objects('Debtor') as unknown as RealmDebtor[];
      console.log(`Migrating ${realmDebtors.length} debtors...`);
      for (const realmDebtor of realmDebtors) {
        const id = objectIdToString(realmDebtor._id);
        const userId = objectIdToString(realmDebtor.user?._id);
        batchOperations.push(
          database.get<Debtor>('debtors').prepareCreate(debtor => {
            debtor._raw.id = id;
            debtor.title = realmDebtor.title || '';
            debtor.type = realmDebtor.type || 'Borrow';
            debtor.debtorStatus = realmDebtor.debtorStatus ?? true;
            debtor.userId = userId;
            debtor.icon = realmDebtor.icon || undefined;
            debtor.color = realmDebtor.color || '#808080';
          }),
        );
      }

      // Migrate Debts
      const realmDebts = realm.objects('Debt') as unknown as RealmDebt[];
      console.log(`Migrating ${realmDebts.length} debts...`);
      for (const realmDebt of realmDebts) {
        const id = objectIdToString(realmDebt._id);
        const userId = objectIdToString(realmDebt.user?._id);
        const debtorId = objectIdToString(realmDebt.debtor?._id);
        batchOperations.push(
          database.get<Debt>('debts').prepareCreate(debt => {
            debt._raw.id = id;
            debt.description = realmDebt.description || '';
            debt.amount = realmDebt.amount || 0;
            debt.debtorId = debtorId;
            debt.userId = userId;
            debt.date = realmDebt.date || new Date().toISOString();
            debt.type = realmDebt.type || 'Borrow';
          }),
        );
      }

      // Execute all batch operations
      console.log(`Executing batch insert of ${batchOperations.length} records...`);
      await database.batch(...(batchOperations as Parameters<typeof database.batch>));
    });

    // Verify migration
    console.log('Verifying migration...');
    const wmUsers = await database.get<User>('users').query().fetchCount();
    const wmCategories = await database
      .get<Category>('categories')
      .query()
      .fetchCount();
    const wmExpenses = await database
      .get<Expense>('expenses')
      .query()
      .fetchCount();
    const wmCurrencies = await database
      .get<Currency>('currencies')
      .query()
      .fetchCount();
    const wmDebtors = await database
      .get<Debtor>('debtors')
      .query()
      .fetchCount();
    const wmDebts = await database.get<Debt>('debts').query().fetchCount();

    console.log('Migration counts:');
    console.log(`  Users: ${wmUsers}`);
    console.log(`  Categories: ${wmCategories}`);
    console.log(`  Expenses: ${wmExpenses}`);
    console.log(`  Currencies: ${wmCurrencies}`);
    console.log(`  Debtors: ${wmDebtors}`);
    console.log(`  Debts: ${wmDebts}`);

    await setMigrationCompleted();
    console.log('=== Migration completed successfully! ===');

    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};

/**
 * Reset migration flag (for testing purposes)
 */
export const resetMigration = async (): Promise<void> => {
  await AsyncStorage.removeItem(MIGRATION_KEY);
  console.log('Migration flag reset');
};

export default executeRealmToWatermelonMigration;
