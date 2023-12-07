import {StyleSheet} from 'react-native';

const debtsStyles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  categoryContainer: {
    height: 40,
    padding: 3,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});

export default debtsStyles;
