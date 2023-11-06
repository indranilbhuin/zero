import {getRealm} from '../utils/realmService';

export const createCurrency = async (
  code: string,
  symbol: string,
  name: string,
  userId: Realm.BSON.ObjectId,
) => {
  const realm = await getRealm();

  realm.write(() => {
    const user = realm.objectForPrimaryKey('User', userId);
    const uniqueId = new Realm.BSON.ObjectId();
    console.log("first")
    if (user) {
      realm.create('Currency', {
        _id: uniqueId,
        code,
        symbol,
        name,
        user: user,
      });
    } else {
      console.error('User not found.');
    }
  });
};

export const getCurrencyById = async (currencyId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();
  const currency = realm.objectForPrimaryKey('Currency', currencyId);
  return currency;
};

export const getCurrencyByUserId = async (userId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();
  const currencies = realm.objects('Currency');

  const currenciesByUserId = Array.from(currencies).filter((currency) => {
    return currency.user && currency.user._id.equals(userId);
  });

  return currenciesByUserId;
};

export const getAllCurrencies = async () => {
  const realm = await getRealm();
  const currencies = realm.objects('Currency');
  return Array.from(currencies);
};
