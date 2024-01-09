import {getRealm} from '../utils/realmService';

export const createDebtor = async (
  debtorTitle: string,
  userId: Realm.BSON.ObjectId,
  icon: string | null,
  debtorType: string | null,
  color: string | null,
) => {
  const realm = await getRealm();

  try {
    realm.write(() => {
      const user = realm.objectForPrimaryKey('User', userId);
      if (user) {
        realm.create('Debtor', {
          _id: new Realm.BSON.ObjectId(),
          title: debtorTitle,
          debtorStatus: true,
          user: user,
          icon: icon,
          type: debtorType,
          color: color,
        });
      } else {
        console.error('User not found.');
      }
    });
  } catch (error) {
    console.error('Error creating debtor:', error);
  }
};

export const softDeleteDebtorById = async (debtorId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();
  try {
    realm.write(() => {
      const debtor = realm.objectForPrimaryKey('Debtor', debtorId);
      if (debtor) {
        if (debtor.debtorStatus) {
          debtor.debtorStatus = false;
        }
      } else {
        console.error('Debtor not found.');
      }
    });
  } catch (error) {
    console.error('Error deleting Debtor:', error);
  }
};

export const deleteDebtorById = async (debtorId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();
  try {
    realm.write(() => {
      const debtor = realm.objectForPrimaryKey('Debtor', debtorId);
      if (debtor) {
        realm.delete(debtor);
      } else {
        console.error('Debtor not found.');
      }
    });
  } catch (error) {
    console.error('Error deleting Debt:', error);
  }
};

export const updateDebtorById = async (
  debtorId?: Realm.BSON.ObjectId,
  newDebtorTitle?: string,
  newIcon?: string,
  newDebtorType?: string,
  newColor?: string,
) => {
  const realm = await getRealm();

  try {
    realm.write(() => {
      const debtor = realm.objectForPrimaryKey('Debtor', debtorId);
      if (debtor) {
        if (debtor.title) {
          debtor.title = newDebtorTitle;
        }
        if (debtor.icon) {
          debtor.icon = newIcon;
        }
        if (debtor.type) {
          debtor.type = newDebtorType;
        }
        if (debtor.color) {
          debtor.color = newColor;
        }
      }
    });
  } catch (error) {
    console.error('Error updating Debtor:', error);
  }
};

export const getAllDebtors = async () => {
  const realm = await getRealm();
  return realm.objects('Debtor');
};

export const getAllDebtorsByUserId = async (userId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();
  const debtors = realm.objects('Debtor');
  const debtorsByUserId = Array.from(debtors).filter(debtor => {
    return debtor.isValid() && debtor.user && debtor.user._id.equals(userId);
  });

  return debtorsByUserId;
};

export const getDebtorByDebtorId = async (debtorId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();

  try {
    const debtor = realm.objectForPrimaryKey('Debtor', debtorId);

    if (debtor) {
      return debtor;
    } else {
      console.error('Debtor not found.');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving debtor name:', error);
    return null;
  }
};
