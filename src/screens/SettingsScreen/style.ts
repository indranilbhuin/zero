import {StyleSheet} from 'react-native';

const settingsStyles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 25,
    includeFontPadding: false,
  },
  greetingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsContainer: {
    marginTop: 15,
    borderWidth: 1,
    borderRadius: 8,
  },
  individualSettingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 65,
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
  modal: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButtonContainer: {
    marginRight: 10,
  },
});

export default settingsStyles;
