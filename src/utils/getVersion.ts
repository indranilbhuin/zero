import packageJson from '../../package.json';

export const getAppVersion = () => {
  try {
    return packageJson.version;
  } catch (error) {
    if (__DEV__) {
      console.error('Error reading app version:', error);
    }
    return 'Unknown';
  }
};
