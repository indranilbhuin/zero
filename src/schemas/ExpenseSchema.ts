import Realm, {ObjectSchema} from 'realm';
import User from './UserSchema';
import Category from './CategorySchema';

class Expense extends Realm.Object<Expense> {
  _id!: Realm.BSON.ObjectId;
  amount!: number;
  description!: string;
  category!: Category;
  user!: User;
  date!: Date;

  static schema: ObjectSchema = {
    name: 'Expense',
    properties: {
      _id: 'objectId',
      amount: 'double',
      description: 'string',
      category: 'Category',
      user: 'User',
      date: 'date',
    },
    primaryKey: '_id',
  };
}

export default Expense;
