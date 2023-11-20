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

export const updateExpenseById = async (
  expenseId: Realm.BSON.ObjectId,
  categoryId?: Realm.BSON.ObjectId,
  newTitle?: string,
  newAmount?: number,
  newDescription?: string,
  newDate?: Date,
) => {
  const realm = await getRealm();

  try {
    realm.write(() => {
      const expense = realm.objectForPrimaryKey('Expense', expenseId);
      const category = realm.objectForPrimaryKey('Category', categoryId);
      if (expense) {
        if (expense.title) {
          expense.title = newTitle;
        }
        if (expense.description) {
          expense.description = newDescription;
        }
        if (expense.amount) {
          expense.amount = newAmount;
        }
        if (expense.date) {
          expense.date = newDate;
        }
        if (expense.category) {
          expense.category = category;
        }
      }
    });
  } catch (error) {
    console.error('Error updating Category:', error);
  }
};

export const deleteExpenseById = async (expenseId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();
  try {
    realm.write(() => {
      const expense = realm.objectForPrimaryKey('Expense', expenseId);
      if (expense) {
        realm.delete(expense);
      } else {
        console.error('Expense not found.');
      }
    });
  } catch (error) {
    console.error('Error deleting Expense:', error);
  }
};

export const getAllExpensesByUserId = async (userId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();
  const expenses = realm.objects('Expense');
  const expensesByUserId = Array.from(expenses).filter(expense => {
    return expense.user && expense.user._id.equals(userId);
  });

  return expensesByUserId;
};
