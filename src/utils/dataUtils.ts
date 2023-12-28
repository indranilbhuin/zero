import moment from 'moment';
import RNFS from 'react-native-fs';

const generateUniqueKey = () => {
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

export const exportRealmData = async allData => {
  try {
    console.log(allData);
    const currentDateAndTime = moment().format('YYYYMMDDHHmmss');
    const jsonData = JSON.stringify(
      {key: generateUniqueKey(), data: allData},
      null,
      2,
    );
    console.log(jsonData);
    const path = `${RNFS.DownloadDirectoryPath}/zero${currentDateAndTime}.json`;

    RNFS.writeFile(path, jsonData, 'utf8')
      .then(success => {
        console.log('File written successfully!');
        console.log('File path:', path);
      })
      .catch(error => {
        console.error('Error writing file:', error.message);
      });

    console.log('File saved successfully at: ', path);
  } catch (error) {
    console.error('Error saving file:', error);
  }
};
