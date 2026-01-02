import {Q} from '@nozbe/watermelondb';
import {formatDate} from '../../utils/dateUtils';
import {database} from '../database';
import Expense from '../models/Expense';
import Category from '../models/Category';

// Type for expense data
export interface ExpenseData {
  id: string;
  title: string;
  amount: number;
  description?: string;
  categoryId: string;
  userId: string;
  date: string;
}

// Extended expense type with populated category
export interface ExpenseWithCategory extends ExpenseData {
  category?: {
    id: string;
    name: string;
    icon?: string;
    color: string;
  };
}

/**
 * Creates a new expense
 */
export const createExpense = async (
  userId: string,
  title: string,
  amount: number,
  description: string,
  categoryId: string,
  date: string,
): Promise<string> => {
  let expenseId = '';
  await database.write(async () => {
    const expense = await database.get<Expense>('expenses').create(exp => {
      exp.title = title;
      exp.amount = amount;
      exp.description = description || undefined;
      exp.categoryId = categoryId;
      exp.userId = userId;
      exp.date = date;
    });
    expenseId = expense.id;
  });
  return expenseId;
};

/**
 * Updates an expense by ID
 */
export const updateExpenseById = async (
  expenseId: string,
  categoryId?: string,
  newTitle?: string,
  newAmount?: number,
  newDescription?: string,
  newDate?: string,
): Promise<void> => {
  await database.write(async () => {
    const expense = await database.get<Expense>('expenses').find(expenseId);
    await expense.update(exp => {
      if (newTitle !== undefined) {
        exp.title = newTitle;
      }
      if (newAmount !== undefined) {
        exp.amount = newAmount;
      }
      if (newDescription !== undefined) {
        exp.description = newDescription;
      }
      if (newDate !== undefined) {
        exp.date = newDate;
      }
      if (categoryId !== undefined) {
        exp.categoryId = categoryId;
      }
    });
  });
};

/**
 * Deletes an expense by ID
 */
export const deleteExpenseById = async (expenseId: string): Promise<void> => {
  await database.write(async () => {
    const expense = await database.get<Expense>('expenses').find(expenseId);
    await expense.destroyPermanently();
  });
};

/**
 * Gets all expenses by user ID
 */
export const getAllExpensesByUserId = async (
  userId: string,
): Promise<ExpenseData[]> => {
  const expenses = await database
    .get<Expense>('expenses')
    .query(Q.where('user_id', userId))
    .fetch();
  return expenses.map(e => ({
    id: e.id,
    title: e.title,
    amount: e.amount,
    description: e.description,
    categoryId: e.categoryId,
    userId: e.userId,
    date: e.date,
  }));
};

/**
 * Gets all expenses by user ID with category data populated
 */
export const getAllExpensesByUserIdWithCategory = async (
  userId: string,
): Promise<ExpenseWithCategory[]> => {
  // Get all expenses for the user
  const expenses = await database
    .get<Expense>('expenses')
    .query(Q.where('user_id', userId))
    .fetch();

  // Get all categories for the user
  const categories = await database
    .get<Category>('categories')
    .query(Q.where('user_id', userId))
    .fetch();

  // Create a map of categoryId -> category for fast lookup
  const categoryMap = new Map(
    categories.map(cat => [
      cat.id,
      {id: cat.id, name: cat.name, icon: cat.icon, color: cat.color},
    ]),
  );

  // Join expenses with their categories
  return expenses.map(e => {
    const category = categoryMap.get(e.categoryId);
    return {
      id: e.id,
      title: e.title,
      amount: e.amount,
      description: e.description,
      categoryId: e.categoryId,
      userId: e.userId,
      date: e.date,
      category,
    };
  });
};

/**
 * Gets all expenses by user ID and date
 */
export const getAllExpensesByDate = async (
  userId: string,
  targetDate: string,
): Promise<ExpenseData[]> => {
  const expenses = await database
    .get<Expense>('expenses')
    .query(Q.where('user_id', userId))
    .fetch();

  // Filter by date in memory since date format may vary
  const expensesByDate = expenses.filter(expense => {
    const formattedExpenseDate = formatDate(expense.date, 'YYYY-MM-DD');
    return formattedExpenseDate === targetDate;
  });

  return expensesByDate.map(e => ({
    id: e.id,
    title: e.title,
    amount: e.amount,
    description: e.description,
    categoryId: e.categoryId,
    userId: e.userId,
    date: e.date,
  }));
};

/**
 * Gets an expense by ID
 */
export const getExpenseById = async (
  expenseId: string,
): Promise<ExpenseData | null> => {
  try {
    const expense = await database.get<Expense>('expenses').find(expenseId);
    return {
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      description: expense.description,
      categoryId: expense.categoryId,
      userId: expense.userId,
      date: expense.date,
    };
  } catch {
    return null;
  }
};
