import {StyleSheet} from 'react-native';

const existingUserStyles = StyleSheet.create({
  titleTextContainer: {
    paddingTop: '10%',
  },
  uploadContainer: {
    height: 50,
    width: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 5,
  },
  uploadContent: {
    alignItems: 'center',
  },
  settingsContainer: {
    borderWidth: 2,
    borderRadius: 8,
    height: 65,
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  individualSettingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 65,
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
  },
});

export default existingUserStyles;
