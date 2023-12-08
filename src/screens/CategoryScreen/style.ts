import {StyleSheet} from 'react-native';

const categoryStyles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  transactionContainer: {
    height: 60,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 5,
    alignItems: 'center',
    marginBottom: 5,
  },
  iconContainer: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginRight: 10,
  },
  iconNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionContainer: {
    flexDirection: 'row',
  },
  swipeView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
  },
  stretchView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 250,
  },
  buttonContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  actionButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

export default categoryStyles;
