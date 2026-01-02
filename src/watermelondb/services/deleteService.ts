import {database} from '../database';
import User from '../models/User';
import Category from '../models/Category';
import Expense from '../models/Expense';
import Currency from '../models/Currency';
import Debtor from '../models/Debtor';
import Debt from '../models/Debt';
import {Q} from '@nozbe/watermelondb';

/**
 * Deletes all data from all collections
 */
export const deleteAllData = async (): Promise<void> => {
  try {
    await database.write(async () => {
      // Get all records from each collection
      const users = await database.get<User>('users').query().fetch();
      const categories = await database.get<Category>('categories').query().fetch();
      const expenses = await database.get<Expense>('expenses').query().fetch();
      const currencies = await database.get<Currency>('currencies').query().fetch();
      const debtors = await database.get<Debtor>('debtors').query().fetch();
      const debts = await database.get<Debt>('debts').query().fetch();

      // Batch delete all records
      const allRecords = [
        ...users,
        ...categories,
        ...expenses,
        ...currencies,
        ...debtors,
        ...debts,
      ];

      await database.batch(
        ...allRecords.map(record => record.prepareDestroyPermanently()),
      );
    });

    console.log('All data deleted successfully');
  } catch (error) {
    console.error('Error deleting all data:', error);
    throw error;
  }
};

/**
 * Deletes all expenses for a specific user
 */
export const deleteAllExpensesByUserId = async (
  userId: string,
): Promise<void> => {
  try {
    await database.write(async () => {
      const expenses = await database
        .get<Expense>('expenses')
        .query(Q.where('user_id', userId))
        .fetch();

      await database.batch(
        ...expenses.map(expense => expense.prepareDestroyPermanently()),
      );
    });
  } catch (error) {
    console.error('Error deleting expenses by userId:', error);
    throw error;
  }
};

/**
 * Deletes all categories for a specific user
 */
export const deleteAllCategoriesByUserId = async (
  userId: string,
): Promise<void> => {
  try {
    await database.write(async () => {
      const categories = await database
        .get<Category>('categories')
        .query(Q.where('user_id', userId))
        .fetch();

      await database.batch(
        ...categories.map(category => category.prepareDestroyPermanently()),
      );
    });
  } catch (error) {
    console.error('Error deleting categories by userId:', error);
    throw error;
  }
};
