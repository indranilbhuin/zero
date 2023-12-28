import Realm, {ObjectSchema} from 'realm';
import User from './UserSchema';
import Debtor from './DebtorSchema';

class Debt extends Realm.Object<Debt> {
  _id!: Realm.BSON.ObjectId;
  description!: string;
  amount!: number;
  debtor!: Debtor;
  user!: User;
  date!: string;
  type!: string;

  static schema: ObjectSchema = {
    name: 'Debt',
    properties: {
      _id: 'objectId',
      description: 'string',
      amount: 'double',
      debtor: 'Debtor',
      user: 'User',
      date: 'string',
      type: 'string',
    },
    primaryKey: '_id',
  };
}

export default Debt;
