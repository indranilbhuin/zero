import {StyleSheet} from 'react-native';

const everydayTransactionStyles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  noTransactionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '90%',
  },
  noImage: {
    height: 80,
    width: 80,
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});

export default everydayTransactionStyles;
