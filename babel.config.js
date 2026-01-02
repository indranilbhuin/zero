module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    '@babel/plugin-transform-export-namespace-from',
    'react-native-worklets/plugin', // Must be listed last
  ],
};
