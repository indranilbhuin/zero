import {StyleSheet} from 'react-native';

const textInputStyles = StyleSheet.create({
  textInput: {
    height: 48,
    borderWidth: 2,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false,
  },
  textInputContainer: {
    height: 48,
    alignItems: 'center',
    borderWidth: 2,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 10,
    paddingLeft: 15,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  textInputWithIcon: {
    paddingHorizontal: 15,
    height: 48,
    width: '100%',
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false,
  },
});

export default textInputStyles;
