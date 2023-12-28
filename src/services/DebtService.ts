import {getRealm} from '../utils/realmService';

export const createDebt = async (
  userId: Realm.BSON.ObjectId,
  amount: number,
  description: string,
  debtorId: Realm.BSON.ObjectId,
  date: string,
  debtType: string,
) => {
  const realm = await getRealm();

  realm.write(() => {
    const user = realm.objectForPrimaryKey('User', userId);
    const debtor = realm.objectForPrimaryKey('Debtor', debtorId);
    const uniqueId = new Realm.BSON.ObjectID();

    if (user) {
      realm.create('Debt', {
        _id: uniqueId,
        amount,
        description,
        debtor: debtor,
        user: user,
        date: date,
        type: debtType,
      });
    }
  });
};

export const updateDebtById = async (
  debtId: Realm.BSON.ObjectId,
  debtorId?: Realm.BSON.ObjectId,
  newAmount?: number,
  newDescription?: string,
  newDate?: string,
  newDebtType?: string,
) => {
  const realm = await getRealm();

  try {
    realm.write(() => {
      const debt = realm.objectForPrimaryKey('Debt', debtId);
      const debtor = realm.objectForPrimaryKey('Debtor', debtorId);
      if (debt) {
        if (debt.description) {
          debt.description = newDescription;
        }
        if (debt.amount) {
          debt.amount = newAmount;
        }
        if (debt.date) {
          debt.date = newDate;
        }
        if (debt.debtor) {
          debt.debtor = debtor;
        }
        if (debt.type) {
          debt.type = newDebtType;
        }
      }
    });
  } catch (error) {
    console.error('Error updating Debt:', error);
  }
};

export const deleteDebtById = async (debtId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();
  try {
    realm.write(() => {
      const debt = realm.objectForPrimaryKey('Debt', debtId);
      if (debt) {
        realm.delete(debt);
      } else {
        console.error('Debt not found.');
      }
    });
  } catch (error) {
    console.error('Error deleting Debt:', error);
  }
};

export const deleteAllDebtsbyDebtorId = async (
  debtorId: Realm.BSON.ObjectId,
) => {
  const realm = await getRealm();

  try {
    realm.write(() => {
      const debts = realm.objects('Debt');

      for (let i = debts.length - 1; i >= 0; i--) {
        const debt = debts[i];
        if (debt.debtor?._id.equals(debtorId)) {
          realm.delete(debt);
        }
      }
    });
  } catch (error) {
    console.error('Error deleting debts by debtorId:', error);
  }
};

export const getAllDebtsByUserId = async (userId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();
  const debts = realm.objects('Debt');
  const debtsByUserId = Array.from(debts).filter(debt => {
    return debt.user?._id.equals(userId);
  });

  return debtsByUserId;
};

export const getAllDebtsByUserIdAndDebtorId = async (
  userId: Realm.BSON.ObjectId,
  debtorId: Realm.BSON.ObjectId,
) => {
  const realm = await getRealm();
  const debts = realm.objects('Debt');
  const debtsByUserIdAndDebtorId = Array.from(debts).filter(debt => {
    return debt.user?._id.equals(userId) && debt.debtor?._id.equals(debtorId);
  });

  return debtsByUserIdAndDebtorId;
};
