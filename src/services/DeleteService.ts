import {getRealm} from '../utils/realmService';

export const deleteAllData = async () => {
  const realm = await getRealm();
  realm.write(() => {
    realm.deleteAll();
  });
};
