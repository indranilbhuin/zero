import {StyleSheet} from 'react-native';

const chooseCurrencyStyles = StyleSheet.create({
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
    paddingTop: '5%',
    paddingBottom: '5%',
  },
  textInput: {
    height: 60,
    borderWidth: 2,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
    width: '80%',
    marginRight: 5,
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false,
  },
  textInputContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  skipButtonContainer: {
    alignSelf: 'flex-end',
    paddingTop: '5%',
  },
  addButton: {
    height: 60,
    padding: 10,
    marginRight: 5,
    borderRadius: 10,
    borderWidth: 2,
    width: '18%',
    alignSelf: 'flex-end',
    marginBottom: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  currencyContainer: {
    width: 95.5,
    height: 80,
    marginRight: 6,
    marginTop: 6,
    borderRadius: 5,
    borderWidth: 2,
    padding: 5,
    justifyContent: 'space-evenly'
  },
  symbolContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center'
  }
});

export default chooseCurrencyStyles;
