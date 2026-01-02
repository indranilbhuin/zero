import Realm, {ObjectSchema} from 'realm';

// Inline Realm schemas for migration only
// These schemas are kept solely for reading legacy Realm data during migration

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
      color: 'string',
    },
    primaryKey: '_id',
  };
}

class Expense extends Realm.Object<Expense> {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  amount!: number;
  description?: string;
  category!: Category;
  user!: User;
  date!: string;

  static schema: ObjectSchema = {
    name: 'Expense',
    properties: {
      _id: 'objectId',
      title: 'string',
      amount: 'double',
      description: 'string',
      category: 'Category',
      user: 'User',
      date: 'string',
    },
    primaryKey: '_id',
  };
}

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

export const realmConfig: Realm.Configuration = {
  schema: [User, Category, Expense, Currency, Debtor, Debt],
  schemaVersion: 0,
};

export const getRealm = (): Promise<Realm> => {
  return Realm.open(realmConfig);
};
