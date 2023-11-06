import Realm, {ObjectSchema} from 'realm';
import User from './UserSchema';

class Currency extends Realm.Object<Currency> {
  _id!: Realm.BSON.ObjectId;
  code!: string;
  symbol!: string;
  name!: string;
  user!: User | null;

  static schema: ObjectSchema = {
    name: 'Currency',
    properties: {
      _id: 'objectId',
      code: 'string',
      symbol: 'string',
      name: 'string',
      user: 'User',
    },
    primaryKey: '_id',
  };
}

export default Currency;
