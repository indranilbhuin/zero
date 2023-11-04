import {getRealm} from '../utils/realmService';

export const createCategory = async (
  name: string,
  userId: Realm.BSON.ObjectId,
) => {
  const realm = await getRealm();

  try {
    realm.write(() => {
      const user = realm.objectForPrimaryKey('User', userId);
      if (user) {
        realm.create('Category', {
          _id: new Realm.BSON.ObjectId(),
          name: name,
          categoryTotal: 0,
          user: user,
        });
      } else {
        console.error('User not found.');
      }
    });
  } catch (error) {
    console.error('Error creating category:', error);
  } finally {
    realm.close();
  }
};

export const getAllCategories = async () => {
  const realm = await getRealm();
  return realm.objects('Category');
};
