import {useDispatch, useSelector} from 'react-redux';
import {selectUserName, setUserName} from '../../redux/slice/userNameSlice';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {
  selectCurrencyCode,
  selectCurrencyId,
  selectCurrencyName,
  selectCurrencySymbol,
  setCurrencyData,
} from '../../redux/slice/currencyDataSlice';
import {
  selectThemePreference,
  setThemePreference,
} from '../../redux/slice/themePreferenceSlice';
import {useEffect, useState} from 'react';
import currencies from '../../../assets/jsons/currencies.json';
import {getAppVersion} from '../../utils/getVersion';
import useThemeColors from '../../hooks/useThemeColors';
import AsyncStorageService from '../../utils/asyncStorageService';
import {updateUserById} from '../../services/UserService';
import {updateCurrencyById} from '../../services/CurrencyService';
import {Linking} from 'react-native';
import {setIsOnboarded} from '../../redux/slice/isOnboardedSlice';
import {deleteAllData} from '../../services/DeleteService';
import { getAllDataRequest, selectAllData } from '../../redux/slice/allDataSlice';
import { resetAllSlices } from '../../redux/resetAllSlices';

const useSettings = () => {
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const currencyId = useSelector(selectCurrencyId);
  const currencyCode = useSelector(selectCurrencyCode);
  const currencyName = useSelector(selectCurrencyName);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const selectedTheme = useSelector(selectThemePreference);
  const allData = useSelector(selectAllData)
  console.log(allData)

  const currencyData = {
    code: currencyCode,
    name: currencyName,
    symbol: currencySymbol,
  };

  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [name, setName] = useState(userName);
  const [searchText, setSearchText] = useState('');
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencyData);
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencies);
  const appVersion = getAppVersion();

  const colors = useThemeColors();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllDataRequest());
  }, []);

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

  const handleThemeSelection = async (theme: string) => {
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

  const handleRateNow = () => {
    console.log('rate on playstore');
  };

  const handleGithub = () => {
    const githubRepoURL = 'https://github.com/indranilbhuin/zero';
    Linking.openURL(githubRepoURL).catch(err =>
      console.error('Error opening GitHub:', err),
    );
  };

  const handlePrivacyPolicy = () => {
    const privacyPolicyURL =
      'https://github.com/indranilbhuin/zero/blob/master/PRIVACYPOLICY.md';
    Linking.openURL(privacyPolicyURL).catch(err =>
      console.error('Error opening GitHub:', err),
    );
  };

  const handleDeleteAllDataOk = async () => {
    await deleteAllData();
    await AsyncStorageService.setItem('isOnboarded', JSON.stringify(false));
    dispatch(setIsOnboarded(false));
  };
  const handleDeleteAllDataCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleDeleteAllData = () => {
    setIsDeleteModalVisible(true);
  };

  return {
    isThemeModalVisible,
    setIsThemeModalVisible,
    isNameModalVisible,
    setIsNameModalVisible,
    name,
    setName,
    searchText,
    setSearchText,
    isCurrencyModalVisible,
    setIsCurrencyModalVisible,
    filteredCurrencies,
    setFilteredCurrencies,
    appVersion,
    colors,
    handleThemeModalClose,
    handleNameModalClose,
    handleCurrencyModalClose,
    handleCurrencySelect,
    handleThemeSelection,
    handleNameUpdate,
    handleSearch,
    handleCurrencyUpdate,
    selectedCurrency,
    selectedTheme,
    userName,
    currencySymbol,
    currencyName,
    handleRateNow,
    handleGithub,
    handlePrivacyPolicy,
    handleDeleteAllData,
    isDeleteModalVisible,
    handleDeleteAllDataOk,
    handleDeleteAllDataCancel,
    allData
  };
};

export default useSettings;
