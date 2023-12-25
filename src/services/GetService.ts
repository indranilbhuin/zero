import {getRealm} from '../utils/realmService';

export const getAllData = async () => {
  const realm = await getRealm();

  try {
    const users = realm.objects('User');
    const categories = realm.objects('Category');
    const expenses = realm.objects('Expense');
    const currencies = realm.objects('Currency');
    const debtors = realm.objects('Debtor');
    const debts = realm.objects('Debt');

    return {
      users: Array.from(users),
      categories: Array.from(categories),
      expenses: Array.from(expenses),
      currencies: Array.from(currencies),
      debtors: Array.from(debtors),
      debts: Array.from(debts),
    };
  } catch (error) {
    console.error('Error getting all data:', error);
    return null;
  }
};
