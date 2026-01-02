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
import {useEffect, useState} from 'react';
import currencies from '../../../assets/jsons/currencies.json';
import {getAppVersion} from '../../utils/getVersion';
import {useTheme, ThemeMode} from '../../context/ThemeContext';
import AsyncStorageService from '../../utils/asyncStorageService';
import {updateUserById, updateCurrencyById, deleteAllData} from '../../watermelondb/services';
import {Linking} from 'react-native';
import {setIsOnboarded} from '../../redux/slice/isOnboardedSlice';
import {getAllDataRequest, selectAllData} from '../../redux/slice/allDataSlice';

const useSettings = () => {
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const currencyId = useSelector(selectCurrencyId);
  const currencyCode = useSelector(selectCurrencyCode);
  const currencyName = useSelector(selectCurrencyName);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const allData = useSelector(selectAllData);

  // Use the theme context
  const {colors, themeMode, setThemeMode} = useTheme();

  const currencyData = {
    code: currencyCode,
    name: currencyName,
    symbol: currencySymbol,
  };

  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isStorageModalVisible, setIsStorageModalVisible] = useState(false);

  const [isDownloadSuccessful, setIsDownloadSuccessful] = useState(false);
  const [isDownloadError, setIsDownloadError] = useState(false);

  const [name, setName] = useState(userName);
  const [searchText, setSearchText] = useState('');
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencyData);
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencies);
  const appVersion = getAppVersion();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllDataRequest());
  }, [dispatch]);

  const handleThemeModalClose = () => {
    setIsThemeModalVisible(false);
  };

  const handleNameModalClose = () => {
    setIsNameModalVisible(false);
  };

  const handleCurrencyModalClose = () => {
    setIsCurrencyModalVisible(false);
  };

  const handleCurrencySelect = (currency: {
    code: string;
    name: string;
    symbol: string;
  }) => {
    setSelectedCurrency(currency);
  };

  const handleThemeSelection = async (theme: string) => {
    try {
      await setThemeMode(theme as ThemeMode);
      setIsThemeModalVisible(false);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const handleNameUpdate = async () => {
    try {
      await updateUserById(userId, {
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
      await updateCurrencyById(currencyId, {
        name: selectedCurrency.name,
        code: selectedCurrency.code,
        symbol: selectedCurrency.symbol,
      });
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

  const handleAccessStorageOk = async () => {
    Linking.openSettings();
  };

  const handleAccessStorageCancel = () => {
    setIsStorageModalVisible(false);
  };

  const handleDeleteAllData = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDownloadSuccessful = () => {
    setIsDownloadSuccessful(false);
  };

  const handleDownloadError = () => {
    setIsDownloadError(false);
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
    selectedTheme: themeMode,
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
    allData,
    isStorageModalVisible,
    handleAccessStorageOk,
    handleAccessStorageCancel,
    setIsStorageModalVisible,
    isDownloadSuccessful,
    setIsDownloadSuccessful,
    isDownloadError,
    setIsDownloadError,
    handleDownloadSuccessful,
    handleDownloadError,
  };
};

export default useSettings;
