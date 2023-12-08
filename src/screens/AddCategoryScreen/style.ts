import {StyleSheet} from 'react-native';

const addCategoryStyles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
  },
  iconItem: {
    height: 30,
    width: 30,
    margin: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  colorCircle: {
    height: 25,
    width: 25,
    borderRadius: 50,
  },
});

export default addCategoryStyles;
