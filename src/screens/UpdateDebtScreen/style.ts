import {StyleSheet} from 'react-native';

const updateDebtStyles = StyleSheet.create({
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
    marginTop: '100%',
    marginBottom: 15,
  },
  dateButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 5,
    borderWidth: 2,
    marginRight: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  dateText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});

export default updateDebtStyles;
