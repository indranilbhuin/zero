import {StyleSheet} from 'react-native';

const textInputStyles = StyleSheet.create({
  textInput: {
    height: 60,
    borderWidth: 2,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 15,
    padding: 20,
    fontFamily: 'FiraCode-Medium',
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
  textInputWithIcon: {
    padding: 20,
    height: 60,
    width: '100%',
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false,
  },
});

export default textInputStyles;
