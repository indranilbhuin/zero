import Realm, {ObjectSchema} from 'realm';

class Currency extends Realm.Object<Currency> {
  _id!: Realm.BSON.ObjectId;
  code!: string;
  symbol!: string;
  name!: string;

  static schema: ObjectSchema = {
    name: 'Currency',
    properties: {
      _id: 'objectId',
      code: 'string',
      symbol: 'string',
      name: 'string',
    },
    primaryKey: '_id',
  };
}

export default Currency;
