import Realm, {ObjectSchema} from 'realm';
import User from './UserSchema';

class Category extends Realm.Object<Category> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  categoryStatus!: boolean;
  user!: User | null;
  icon?: string | null;
  color!: string | null;

  static schema: ObjectSchema = {
    name: 'Category',
    properties: {
      _id: 'objectId',
      name: 'string',
      categoryStatus: 'bool',
      user: 'User',
      icon: {type: 'string', optional: true},
      color: 'string'
    },
    primaryKey: '_id',
  };
}

export default Category;
