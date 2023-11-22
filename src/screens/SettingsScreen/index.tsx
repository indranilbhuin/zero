import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import {
  selectCurrencyCode,
  selectCurrencyId,
  selectCurrencyName,
  selectCurrencySymbol,
  setCurrencyData,
} from '../../redux/slice/currencyDataSlice';
import {selectUserName, setUserName} from '../../redux/slice/userNameSlice';
import {selectUserId} from '../../redux/slice/userIdSlice';
import chooseCurrencyStyles from '../ChooseCurrencyScreen/style';
import currencies from '../../../assets/currencies.json';
import {updateCurrencyById} from '../../services/CurrencyService';
import addCategoryStyles from '../AddCategoryScreen/style';

const SettingsScreen = () => {
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const currencyId = useSelector(selectCurrencyId);
  const currencyCode = useSelector(selectCurrencyCode);
  const currencyName = useSelector(selectCurrencyName);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const selectedTheme = useSelector(selectThemePreference);

  const currencyData = {
    code: currencyCode,
    name: currencyName,
    symbol: currencySymbol,
  };

  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [name, setName] = useState(userName);
  const [searchText, setSearchText] = useState('');
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencyData);
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencies);

  const colors = useThemeColors();
  const dispatch = useDispatch();

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

  const handleCurrencyModalClose = () => {
    setIsCurrencyModalVisible(false);
  };

  const handleCurrencySelect = currency => {
    setSelectedCurrency(currency);
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

  const handleNameUpdate = async () => {
    try {
      await updateUserById(Realm.BSON.ObjectID.createFromHexString(userId), {
        username: name,
      });
      dispatch(setUserName(name));
      setIsNameModalVisible(false);
    } catch (error) {
      console.error('Error updating the name:', error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = currencies.filter(currency => {
      const {code, name, symbol, symbolNative} = currency;
      const searchItem = text.toLowerCase();

      return (
        code.toLowerCase().includes(searchItem) ||
        name.toLowerCase().includes(searchItem) ||
        symbol.toLowerCase().includes(searchItem) ||
        symbolNative.toLowerCase().includes(searchItem)
      );
    });
    setFilteredCurrencies(filtered);
  };

  const handleCurrencyUpdate = async () => {
    try {
      await updateCurrencyById(
        Realm.BSON.ObjectID.createFromHexString(currencyId),
        {
          name: selectedCurrency.name,
          code: selectedCurrency.code,
          symbol: selectedCurrency.symbol,
        },
      );
      const currencyData = {
        currencyId,
        currencyName: selectedCurrency.name,
        currencySymbol: selectedCurrency.symbol,
        currencyCode: selectedCurrency.code,
      };
      dispatch(setCurrencyData(currencyData));
      setIsCurrencyModalVisible(false);
    } catch (error) {
      console.error('Error updating the currency:', error);
    }
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

  console.log(selectedCurrency);

  const renderCurrencySymbol = () => {
    return (
      <View style={chooseCurrencyStyles.currencyMainContainer}>
        {filteredCurrencies.map(currency => (
          <TouchableOpacity
            key={currency.code}
            onPress={() => handleCurrencySelect(currency)}>
            <View
              style={[
                chooseCurrencyStyles.currencyContainer,
                {
                  backgroundColor:
                    selectedCurrency.code === currency.code
                      ? colors.accentGreen
                      : colors.primaryText,
                  borderColor: colors.secondaryText,
                },
              ]}>
              <View style={chooseCurrencyStyles.symbolContainer}>
                <Text
                  style={[
                    styles.subtitleText,
                    {color: colors.buttonText, fontSize: 20},
                  ]}>
                  {currency.symbolNative}
                </Text>
                <Text
                  style={[
                    styles.subtitleText,
                    {color: colors.buttonText, fontSize: 13},
                  ]}>
                  {currency.code}
                </Text>
              </View>
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.buttonText, fontSize: 10},
                ]}>
                {currency.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
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
          <TouchableOpacity onPress={() => setIsCurrencyModalVisible(true)}>
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
                  {color: colors.primaryText, fontSize: 14, width: '50%'},
                ]}>
                Change Currency Symbol
              </Text>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={[
                    styles.subtitleText,
                    {color: colors.primaryText, fontSize: 14},
                  ]}>
                  {currencySymbol}
                </Text>
                <Text
                  style={[
                    styles.subtitleText,
                    {color: colors.primaryText, fontSize: 14},
                  ]}>
                  {currencyName}
                </Text>
              </View>
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
              onPress={handleNameUpdate}
              colors={colors}
              buttonTitle={'Update'}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isCurrencyModalVisible}
        onRequestClose={handleCurrencyModalClose}>
        <View style={[styles.modalContainer]}>
          <View
            style={[styles.modal, {backgroundColor: colors.containerColor}]}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                Select Currency Symbol
              </Text>
              <TextInput
                style={[
                  addCategoryStyles.textInput,
                  {
                    borderColor: colors.primaryText,
                    color: colors.primaryText,
                    backgroundColor: colors.secondaryBackground,
                  },
                ]}
                placeholder="Search Currency"
                value={searchText}
                onChangeText={handleSearch}
              />
              {renderCurrencySymbol()}
              <PrimaryButton
                onPress={handleCurrencyUpdate}
                colors={colors}
                buttonTitle={'Update'}
              />
            </ScrollView>
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
