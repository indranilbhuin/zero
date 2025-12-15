import moment from 'moment';
import {getRealm} from '../utils/realmService';

export const createExpense = async (
  userId: Realm.BSON.ObjectId,
  title: string,
  amount: number,
  description: string,
  categoryId: Realm.BSON.ObjectId,
  date: string,
) => {
  const realm = await getRealm();

  realm.write(() => {
    const user = realm.objectForPrimaryKey('User', userId);
    const category = realm.objectForPrimaryKey('Category', categoryId);
    const uniqueId = new Realm.BSON.ObjectID();

    if (user) {
      const expenseData: any = {
        _id: uniqueId,
        title,
        amount,
        category: category,
        user: user,
        date: date,
      };

      if (description !== undefined) {
        expenseData.description = description;
      }

      realm.create('Expense', expenseData);
    }
  });
};

export const updateExpenseById = async (
  expenseId: Realm.BSON.ObjectId,
  categoryId?: Realm.BSON.ObjectId,
  newTitle?: string,
  newAmount?: number,
  newDescription?: string,
  newDate?: string,
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
    console.error('Error updating Expense:', error);
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
    return expense.user?._id.equals(userId);
  });

  return expensesByUserId;
};

export const getAllExpensesByDate = async (
  userId: Realm.BSON.ObjectId,
  targetDate: string,
) => {
  const realm = await getRealm();
  const expenses = realm.objects('Expense');
  console.log('in service', targetDate);
  const expensesByDate = Array.from(expenses).filter(expense => {
    const formattedExpenseDate = moment(expense.date).format('YYYY-MM-DD');

    return (
      expense.user?._id.equals(userId) && formattedExpenseDate === targetDate
    );
  });

  return expensesByDate;
};
