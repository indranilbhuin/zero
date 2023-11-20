import {StyleSheet} from 'react-native';

const homeStyles = StyleSheet.create({
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
    fontSize: 15,
    includeFontPadding: false,
  },
  initialsContainer: {
    height: 40,
    width: 40,
    padding: 2,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  initialsText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 20,
    includeFontPadding: false,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    justifyContent: 'space-between',
  },
  greetingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '-2%',
    marginRight: '-2%',
    width: '80%'
  },
  settingsContainer: {},
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
  listExpenseContainer: {
    marginTop: '5%',
    marginBottom: '2%'
  },
  card: {
    height: 150,
    width: 150,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between',
    marginRight: 10
  },
  cardContainer: {
    marginTop: 10,
    flexDirection: 'row'
  },
  textContainer: {},
  transactionContainer: {
    height: '40%',
    borderRadius: 10,
    justifyContent: 'center',
    padding: 10,
  },
  transactionListContainer: {
    marginTop: 20
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 15,
    right: 15,
    zIndex: 1,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImage: {
    height: 80,
    width: 80
  },
  noTransactionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 350
  }
});

export default homeStyles;
