import packageJson from '../../package.json';

export const getAppVersion = () => {
  try {
    return packageJson.version;
  } catch (error) {
    console.error('Error reading app version:', error);
    return 'Unknown';
  }
};
