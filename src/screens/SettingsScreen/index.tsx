import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorageService from '../../utils/asyncStorageService';
import {
  selectThemePreference,
  setThemePreference,
} from '../../redux/slice/themePreferenceSlice';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import {updateUserById} from '../../services/UserService';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {selectUserName, setUserName} from '../../redux/slice/userNameSlice';
import {selectUserId} from '../../redux/slice/userIdSlice';

const SettingsScreen = () => {
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [name, setName] = useState(userName);
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
  const windowHeight = Dimensions.get('window').height;

  const colors = useThemeColors();
  const dispatch = useDispatch();

  const currencySymbol = useSelector(selectCurrencySymbol);
  const selectedTheme = useSelector(selectThemePreference);

  useEffect(() => {
    const getThemePreference = async () => {
      try {
        const theme = await AsyncStorageService.getItem('themePreference');
        if (theme === null) {
          dispatch(setThemePreference('system'));
        } else {
          dispatch(setThemePreference(theme));
        }
      } catch (error) {
        console.error('Error getting theme preference:', error);
      }
    };

    getThemePreference();
  }, [selectedTheme]);

  const handleThemeModalClose = () => {
    setIsThemeModalVisible(false);
  };

  const handleNameModalClose = () => {
    setIsNameModalVisible(false);
  };

  const handleThemeSelection = async theme => {
    try {
      if (theme === 'system') {
        dispatch(setThemePreference(null));
      } else {
        dispatch(setThemePreference(theme));
      }
      setIsThemeModalVisible(false);
      await AsyncStorageService.setItem('themePreference', theme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const handleNameSubmit = async () => {
    try {
      await updateUserById(Realm.BSON.ObjectID.createFromHexString(userId), {
        username: name,
      });
      dispatch(setUserName(name));
      setIsNameModalVisible(false);
    } catch (error) {}
  };

  const renderRadioButtons = onThemeSelect => {
    const themes = ['light', 'dark', 'system'];
    return themes.map(theme => (
      <TouchableOpacity key={theme} onPress={() => onThemeSelect(theme)}>
        <View style={styles.radioButtonContainer}>
          <Text
            style={[
              styles.subtitleText,
              {color: colors.primaryText, fontSize: 15},
            ]}>
            {theme}
          </Text>
          <View style={[styles.radioButton, {borderColor: colors.primaryText}]}>
            {selectedTheme === theme && (
              <View
                style={[
                  styles.radioButtonSelected,
                  {backgroundColor: colors.primaryText},
                ]}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <View style={styles.headerContainer}>
        <View style={styles.greetingsContainer}>
          <Text style={[styles.titleText, {color: colors.primaryText}]}>
            zero
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.settingsContainer,
            {
              backgroundColor: colors.containerColor,
              borderColor: colors.secondaryText,
            },
          ]}>
          <TouchableOpacity onPress={() => setIsThemeModalVisible(true)}>
            <View
              style={[
                styles.individualSettingsContainer,
                {
                  // backgroundColor: colors.containerColor,
                  borderColor: colors.secondaryText,
                },
              ]}>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14},
                ]}>
                Choose Theme
              </Text>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14},
                ]}>
                {selectedTheme}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsNameModalVisible(true)}>
            <View
              style={[
                styles.individualSettingsContainer,
                {
                  backgroundColor: colors.containerColor,
                  borderColor: colors.secondaryText,
                },
              ]}>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14},
                ]}>
                Change Name
              </Text>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14},
                ]}>
                {userName}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={[
                styles.individualSettingsContainer,
                {
                  backgroundColor: colors.containerColor,
                  borderColor: colors.secondaryText,
                },
              ]}>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14},
                ]}>
                Change Currency Symbol
              </Text>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.primaryText, fontSize: 14},
                ]}>
                {currencySymbol}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isThemeModalVisible}
        onRequestClose={handleThemeModalClose}>
        <View style={[styles.modalContainer]}>
          <View
            style={[styles.modal, {backgroundColor: colors.containerColor}]}>
            <Text
              style={[
                styles.subtitleText,
                {
                  color: colors.primaryText,
                  fontSize: 17,
                  marginTop: 10,
                  marginBottom: 30,
                  fontFamily: 'FiraCode-SemiBold',
                },
              ]}>
              Select Theme
            </Text>
            {renderRadioButtons(handleThemeSelection)}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isNameModalVisible}
        onRequestClose={handleNameModalClose}>
        <View style={[styles.modalContainer]}>
          <View
            style={[styles.modal, {backgroundColor: colors.containerColor}]}>
            <Text
              style={[
                styles.subtitleText,
                {
                  color: colors.primaryText,
                  fontSize: 17,
                  marginTop: 10,
                  marginBottom: 30,
                  fontFamily: 'FiraCode-SemiBold',
                },
              ]}>
              Change Name
            </Text>
            <CustomInput
              colors={colors}
              input={name}
              setInput={setName}
              placeholder={'change user name'}
            />
            <PrimaryButton
              onPress={handleNameSubmit}
              colors={colors}
              buttonTitle={'Update'}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
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
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  individualSettingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
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
    // alignItems: 'center',
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
});
