import {getRealm} from '../utils/realmService';

export const createUser = async (username: string, email: string) => {
  const realm = await getRealm();
  try {
    realm.write(() => {
      const uniqueId = new Realm.BSON.ObjectId();
      realm.create('User', {
        _id: uniqueId,
        username,
        email,
      });
    });
  } catch (error) {
    console.error('Error creating User:', error);
  } finally {
    realm.close();
  }
};

export const getUserById = async (userId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();
  const user = realm.objectForPrimaryKey('User', userId);
  return user;
};

export const getAllUsers = async () => {
  const realm = await getRealm();
  const users = realm.objects('User');
  return Array.from(users);
};
