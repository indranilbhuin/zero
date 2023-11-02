import Realm, {ObjectSchema} from 'realm';

class User extends Realm.Object<User> {
  _id!: Realm.BSON.ObjectId;
  username!: string;
  email!: string;
  
  static schema: ObjectSchema = {
    name: 'User',
    properties: {
      _id: 'objectId',
      username: 'string',
      email: 'string',
    },
    primaryKey: '_id',
  };
}

export default User;
