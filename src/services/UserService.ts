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
  }
};

export const createExistingUser = async (
  userId: Realm.BSON.ObjectId,
  username: string,
  email: string,
) => {
  const realm = await getRealm();
  try {
    realm.write(() => {
      realm.create('User', {
        _id: userId,
        username,
        email,
      });
    });
  } catch (error) {
    console.error('Error creating User:', error);
  }
};

export const updateUserById = async (
  userId: Realm.BSON.ObjectId,
  newUserData: {username?: string; email?: string},
) => {
  const realm = await getRealm();
  try {
    realm.write(() => {
      const user = realm.objectForPrimaryKey('User', userId);
      if (user) {
        if (newUserData.username) {
          user.username = newUserData.username;
        }
        if (newUserData.email) {
          user.email = newUserData.email;
        }
      } else {
        console.error('User not found.');
      }
    });
  } catch (error) {
    console.error('Error updating User:', error);
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
