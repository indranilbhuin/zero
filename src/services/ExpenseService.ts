import {getRealm} from '../utils/realmService';

export const createExpense = async (
  userId: Realm.BSON.ObjectId,
  title: string,
  amount: number,
  description: string,
  categoryId: Realm.BSON.ObjectId,
  date: Date,
) => {
  const realm = await getRealm();

  realm.write(() => {
    const user = realm.objectForPrimaryKey('User', userId);
    const category = realm.objectForPrimaryKey('Category', categoryId);
    const uniqueId = new Realm.BSON.ObjectID();

    if (user) {
      realm.create('Expense', {
        _id: uniqueId,
        title,
        amount,
        description,
        category: category,
        user: user,
        date: date,
      });

      category.categoryTotal += amount;
    }
  });
};

export const getAllExpensesByUserId = async (userId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();
  const expenses = realm.objects('Expense');
  const expensesByUserId = Array.from(expenses).filter(expense => {
    return expense.user && expense.user._id.equals(userId);
  });

  return expensesByUserId;
};
