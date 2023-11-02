import {StyleSheet} from 'react-native';

const personalizeStyles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  titleTextContainer: {
    paddingTop: '15%',
  },
  titleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 24,
    includeFontPadding: false,
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
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
  },
  textInputContainer: {
    marginBottom: '95%',
  },
  skipButtonContainer: {
    alignSelf: 'flex-end',
    paddingTop: '5%',
  },
});

export default personalizeStyles;
