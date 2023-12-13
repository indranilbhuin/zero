import {StyleSheet} from 'react-native';

const homeStyles = StyleSheet.create({
  listExpenseContainer: {
    marginTop: '5%',
    marginBottom: '20%',
  },
  cardContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  transactionListContainer: {
    marginTop: 20,
  },
  addButtonContainer: {
    position: 'absolute',
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
});

export default homeStyles;
