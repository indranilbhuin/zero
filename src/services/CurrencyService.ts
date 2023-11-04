import {getRealm} from '../utils/realmService';

export const createCurrency = async (
  code: string,
  symbol: string,
  name: string,
) => {
  const realm = await getRealm();

  realm.write(() => {
    const uniqueId = new Realm.BSON.ObjectId();
    realm.create('Currency', {
      _id: uniqueId,
      code,
      symbol,
      name,
    });
  });
};

export const getCurrencyById = async (currencyId: Realm.BSON.ObjectId) => {
  const realm = await getRealm();
  const currency = realm.objectForPrimaryKey('Currency', currencyId);
  return currency;
};

export const getAllCurrencies = async () => {
  const realm = await getRealm();
  const currencies = realm.objects('Currency');
  return Array.from(currencies);
};
