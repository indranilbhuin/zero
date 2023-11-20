import {StyleSheet} from 'react-native';

const addTransactionStyles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
  addButtonContainer: {
    marginBottom: 10,
  },
  submitButtonContainer: {
    marginTop: 5,
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
  },
  dateText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
  textInputContainer: {
    height: 60,
    alignItems: 'center',
    borderWidth: 2,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 15,
    paddingLeft: 20,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  textInput: {
    padding: 20,
    height: 60,
    width: '100%',
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false,
  },
  labelText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});

export default addTransactionStyles;
