import {StyleSheet} from 'react-native';

const individualDebtsStyles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  submitButtonContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  categoryContainer: {
    height: 35,
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    flexDirection: 'row',
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
  debtsMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default individualDebtsStyles;
