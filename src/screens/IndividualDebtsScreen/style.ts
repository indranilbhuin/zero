import {StyleSheet} from 'react-native';

const individualDebtsStyles = StyleSheet.create({
  submitButtonContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  categoryContainer: {
    height: 40,
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    flexDirection: 'row',
  },
  debtsMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default individualDebtsStyles;
