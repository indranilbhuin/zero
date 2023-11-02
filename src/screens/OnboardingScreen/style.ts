import {StyleSheet} from 'react-native';

const onboardingStyles = StyleSheet.create({
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
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false
  },
  textInputContainer: {
  },
  skipButtonContainer: {
    alignSelf: 'flex-end',
    paddingTop: '5%',
  },
  categoryContainer: {
    height: 45,
    padding: 10,
    marginRight: 5,
    marginTop: 5,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  addButton: {
    height: 45,
    padding: 10,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 2,
    width: 50,
    alignSelf: 'flex-end',
    marginBottom: '10%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default onboardingStyles;
