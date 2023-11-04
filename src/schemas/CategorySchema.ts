import Realm, {ObjectSchema} from 'realm';
import User from './UserSchema';

class Category extends Realm.Object<Category> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  categoryTotal!: number;
  user!: User | null;

  static schema: ObjectSchema = {
    name: 'Category',
    properties: {
      _id: 'objectId',
      name: 'string',
      categoryTotal: 'double',
      user: 'User',
    },
    primaryKey: '_id',
  };
}

export default Category;
