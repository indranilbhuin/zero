import {StyleSheet} from 'react-native';

const personalizeStyles = StyleSheet.create({
  titleTextContainer: {
    paddingTop: '15%',
  },
  subtitleTextContainer: {
    paddingTop: '10%',
    paddingBottom: '5%',
  },
  textInput: {
    height: 60,
    borderWidth: 2,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false,
  },
  textInputContainer: {
    marginBottom: '90%',
  },
  skipButtonContainer: {
    alignSelf: 'flex-end',
    paddingTop: '5%',
  },
});

export default personalizeStyles;
