import {PermissionsAndroid, Platform} from 'react-native';

export const generateUniqueKey = () => {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const keyLength = 20;
  let key = 'zero';

  for (let i = 0; i < keyLength - 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    key += characters[randomIndex];
  }

  return key;
};

export const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    const currentApiLevel = Platform.Version;

    if (currentApiLevel > 32) {
      return true;
    }

    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      if (
        granted['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        return true;
      } else {
        const secondRequest = await PermissionsAndroid.requestMultiple(
          permissions,
        );

        if (
          secondRequest['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          secondRequest['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else {
          return false;
        }
      }
    } catch (err) {
      if (__DEV__) {
        console.warn(err);
      }
      return false;
    }
  } else {
    return true;
  }
};
