import Realm from 'realm';
import User from '../schemas/UserSchema';
import Category from '../schemas/CategorySchema';
import Expense from '../schemas/ExpenseSchema';
import Currency from '../schemas/CurrencySchema';
import Debtor from '../schemas/DebtorSchema';

const realmConfig: Realm.Configuration = {
  schema: [User, Category, Expense, Currency, Debtor],
  schemaVersion: 1,
};

export const getRealm = () => {
  return Realm.open(realmConfig);
};
