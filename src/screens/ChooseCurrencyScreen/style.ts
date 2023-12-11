import {StyleSheet} from 'react-native';

const chooseCurrencyStyles = StyleSheet.create({
  titleTextContainer: {
    paddingTop: '15%',
  },
  subtitleTextContainer: {
    paddingTop: '5%',
    paddingBottom: '5%',
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
  currencyContainer: {
    width: 95.5,
    height: 80,
    marginRight: 6,
    marginTop: 6,
    borderRadius: 5,
    borderWidth: 2,
    padding: 5,
    justifyContent: 'space-evenly',
  },
});

export default chooseCurrencyStyles;
