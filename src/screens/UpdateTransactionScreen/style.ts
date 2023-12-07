import {StyleSheet} from 'react-native';

const updateTransactionStyles = StyleSheet.create({
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

export default updateTransactionStyles;
