import {database} from '../database';
import User from '../models/User';
import Category from '../models/Category';
import Expense from '../models/Expense';
import Currency from '../models/Currency';
import Debtor from '../models/Debtor';
import Debt from '../models/Debt';

// Export format interface - compatible with import in ExistingUserScreen
interface ExportData {
  users: Array<{
    username: string;
    email: string;
  }>;
  categories: Array<{
    name: string;
    icon?: string;
    color?: string;
  }>;
  expenses: Array<{
    title: string;
    amount: number;
    description?: string;
    category: {name: string};
    date: string;
  }>;
  currencies: Array<{
    code: string;
    symbol: string;
    name: string;
  }>;
  debtors: Array<{
    title: string;
    icon?: string;
    type?: string;
    color?: string;
  }>;
  debts: Array<{
    amount: number;
    description: string;
    debtor: {title: string};
    date: string;
    type: string;
  }>;
}

/**
 * Gets all data from the database in a format suitable for export/import
 */
export const getAllData = async (): Promise<ExportData | null> => {
  try {
    const [users, categories, expenses, currencies, debtors, debts] =
      await Promise.all([
        database.get<User>('users').query().fetch(),
        database.get<Category>('categories').query().fetch(),
        database.get<Expense>('expenses').query().fetch(),
        database.get<Currency>('currencies').query().fetch(),
        database.get<Debtor>('debtors').query().fetch(),
        database.get<Debt>('debts').query().fetch(),
      ]);

    // Create lookup maps for category and debtor names
    const categoryMap = new Map<string, string>();
    categories.forEach(c => {
      categoryMap.set(c.id, c.name);
    });

    const debtorMap = new Map<string, string>();
    debtors.forEach(d => {
      debtorMap.set(d.id, d.title);
    });

    return {
      users: users.map(u => ({
        username: u.username,
        email: u.email,
      })),
      categories: categories.map(c => ({
        name: c.name,
        icon: c.icon,
        color: c.color,
      })),
      expenses: expenses.map(e => ({
        title: e.title,
        amount: e.amount,
        description: e.description,
        category: {name: categoryMap.get(e.categoryId) ?? 'Unknown'},
        date: e.date,
      })),
      currencies: currencies.map(c => ({
        code: c.code,
        symbol: c.symbol,
        name: c.name,
      })),
      debtors: debtors.map(d => ({
        title: d.title,
        icon: d.icon,
        type: d.type,
        color: d.color,
      })),
      debts: debts.map(d => ({
        amount: d.amount,
        description: d.description,
        debtor: {title: debtorMap.get(d.debtorId) ?? 'Unknown'},
        date: d.date,
        type: d.type,
      })),
    };
  } catch (error) {
    console.error('Error getting all data:', error);
    return null;
  }
};

/**
 * Debug function to log all data from the database
 */
export const debugLogAllData = async (): Promise<void> => {
  console.log('========== DEBUG: Database Contents ==========');

  try {
    const data = await getAllData();

    if (!data) {
      console.log('No data found');
      return;
    }

    console.log('\n--- USERS ---');
    console.log(`Count: ${data.users.length}`);
    data.users.forEach((user, index) => {
      console.log(`User ${index + 1}:`, JSON.stringify(user, null, 2));
    });

    console.log('\n--- CATEGORIES ---');
    console.log(`Count: ${data.categories.length}`);
    data.categories.forEach((category, index) => {
      console.log(`Category ${index + 1}:`, JSON.stringify(category, null, 2));
    });

    console.log('\n--- EXPENSES ---');
    console.log(`Count: ${data.expenses.length}`);
    data.expenses.forEach((expense, index) => {
      console.log(`Expense ${index + 1}:`, JSON.stringify(expense, null, 2));
    });

    console.log('\n--- CURRENCIES ---');
    console.log(`Count: ${data.currencies.length}`);
    data.currencies.forEach((currency, index) => {
      console.log(`Currency ${index + 1}:`, JSON.stringify(currency, null, 2));
    });

    console.log('\n--- DEBTORS ---');
    console.log(`Count: ${data.debtors.length}`);
    data.debtors.forEach((debtor, index) => {
      console.log(`Debtor ${index + 1}:`, JSON.stringify(debtor, null, 2));
    });

    console.log('\n--- DEBTS ---');
    console.log(`Count: ${data.debts.length}`);
    data.debts.forEach((debt, index) => {
      console.log(`Debt ${index + 1}:`, JSON.stringify(debt, null, 2));
    });

    console.log('\n--- SUMMARY ---');
    console.log({
      users: data.users.length,
      categories: data.categories.length,
      expenses: data.expenses.length,
      currencies: data.currencies.length,
      debtors: data.debtors.length,
      debts: data.debts.length,
    });

    console.log('========== END DEBUG ==========');
  } catch (error) {
    console.error('Error in debugLogAllData:', error);
  }
};
