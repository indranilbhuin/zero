import Realm from 'realm';
import User from '../schemas/UserSchema';
import Category from '../schemas/CategorySchema';
import Expense from '../schemas/ExpenseSchema';
import Currency from '../schemas/CurrencySchema';
import Debtor from '../schemas/DebtorSchema';
import Debt from '../schemas/DebtSchema';

const realmConfig: Realm.Configuration = {
  schema: [User, Category, Expense, Currency, Debtor, Debt],
  schemaVersion: 1,
};

export const getRealm = () => {
  return Realm.open(realmConfig);
};
