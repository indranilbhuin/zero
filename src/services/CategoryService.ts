import {getRealm} from '../utils/realmService';

export const createCategory = async (
  name: string,
  userId: Realm.BSON.ObjectId,
  icon: string | null,
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
          icon: icon,
        });
      } else {
        console.error('User not found.');
      }
    });
  } catch (error) {
    console.error('Error creating category:', error);
  }
};

export const deleteCategoryById = async (categoryId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();
  try {
    realm.write(() => {
      const category = realm.objectForPrimaryKey('Category', categoryId);
      if (category) {
        realm.delete(category);
      } else {
        console.error('Category not found.');
      }
    });
  } catch (error) {
    console.error('Error deleting Category:', error);
  }
};

export const getAllCategories = async () => {
  const realm = await getRealm();
  return realm.objects('Category');
};

export const getAllCategoriesByUserId = async (userId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();
  const categories = realm.objects('Category');
  const categoriesByUserId = Array.from(categories).filter(category => {
    return category.user && category.user._id.equals(userId);
  });

  return categoriesByUserId;
};
