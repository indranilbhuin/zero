import Realm, {ObjectSchema} from 'realm';
import User from './UserSchema';

class Debtor extends Realm.Object<Debtor> {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  type!: string;
  debtorStatus!: boolean;
  user!: User | null;
  icon?: string | null;
  color!: string | null;

  static schema: ObjectSchema = {
    name: 'Debtor',
    properties: {
      _id: 'objectId',
      title: 'string',
      type: 'string',
      debtorStatus: 'bool',
      user: 'User',
      icon: {type: 'string', optional: true},
      color: 'string',
    },
    primaryKey: '_id',
  };
}

export default Debtor;
