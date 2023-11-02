import Realm, {ObjectSchema} from 'realm';

class Category extends Realm.Object<Category> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  categoryTotal!: number;

  static schema: ObjectSchema = {
    name: 'Category',
    properties: {
      _id: 'objectId',
      name: 'string',
      categoryTotal: 'double'
    },
    primaryKey: '_id',
  };
}

export default Category;
