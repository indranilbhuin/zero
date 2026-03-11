import {useDispatch, useSelector} from 'react-redux';
import {selectUserName, setUserName} from '../../redux/slice/userNameSlice';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {
  selectCurrencyId,
  selectCurrencyName,
  selectCurrencySymbol,
  setCurrencyData,
} from '../../redux/slice/currencyDataSlice';
import {useCallback, useEffect, useState} from 'react';
import {getAppVersion} from '../../utils/getVersion';
import {useTheme, ThemeMode} from '../../context/ThemeContext';
import StorageService from '../../utils/asyncStorageService';
import {updateUserById, updateCurrencyById, deleteAllData} from '../../watermelondb/services';
import {Linking} from 'react-native';
import {setIsOnboarded} from '../../redux/slice/isOnboardedSlice';
import {fetchAllData, selectAllData} from '../../redux/slice/allDataSlice';
import {AppDispatch} from '../../redux/store';

const useSettings = () => {
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const currencyId = useSelector(selectCurrencyId);
  const currencyName = useSelector(selectCurrencyName);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const allData = useSelector(selectAllData);

  const {colors, themeMode, setThemeMode} = useTheme();

  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isStorageModalVisible, setIsStorageModalVisible] = useState(false);

  const [isDownloadSuccessful, setIsDownloadSuccessful] = useState(false);
  const [isDownloadError, setIsDownloadError] = useState(false);

  const [name, setName] = useState(userName);
  const appVersion = getAppVersion();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllData());
  }, [dispatch]);

  const handleThemeModalClose = useCallback(() => {
    setIsThemeModalVisible(false);
  }, []);

  const handleNameModalClose = useCallback(() => {
    setIsNameModalVisible(false);
  }, []);

  const handleThemeSelection = useCallback(async (theme: string) => {
    try {
      await setThemeMode(theme as ThemeMode);
      setIsThemeModalVisible(false);
    } catch (error) {
      if (__DEV__) {
        console.error('Error saving theme preference:', error);
      }
    }
  }, [setThemeMode]);

  const handleNameUpdate = useCallback(async () => {
    try {
      await updateUserById(userId, {
        username: name,
      });
      dispatch(setUserName(name));
      setIsNameModalVisible(false);
    } catch (error) {
      if (__DEV__) {
        console.error('Error updating the name:', error);
      }
    }
  }, [userId, name, dispatch]);

  const handleCurrencyUpdate = useCallback(
    async (currency: {code: string; name: string; symbol: string}) => {
      try {
        await updateCurrencyById(currencyId, {
          name: currency.name,
          code: currency.code,
          symbol: currency.symbol,
        });
        const updatedCurrencyData = {
          currencyId,
          currencyName: currency.name,
          currencySymbol: currency.symbol,
          currencyCode: currency.code,
        };
        dispatch(setCurrencyData(updatedCurrencyData));
      } catch (error) {
        if (__DEV__) {
          console.error('Error updating the currency:', error);
        }
      }
    },
    [currencyId, dispatch],
  );

  const handleRateNow = useCallback(() => {
    // TODO: Implement rate on playstore functionality
  }, []);

  const handleGithub = useCallback(() => {
    const githubRepoURL = 'https://github.com/indranilbhuin/zero';
    Linking.openURL(githubRepoURL).catch(err => {
      if (__DEV__) {
        console.error('Error opening GitHub:', err);
      }
    });
  }, []);

  const handlePrivacyPolicy = useCallback(() => {
    const privacyPolicyURL = 'https://anotherwhy.com/products/awy-001/privacy-policy';
    Linking.openURL(privacyPolicyURL).catch(err => {
      if (__DEV__) {
        console.error('Error opening Privacy Policy:', err);
      }
    });
  }, []);

  const handleTermsAndConditions = useCallback(() => {
    const termsURL = 'https://anotherwhy.com/products/awy-001/terms';
    Linking.openURL(termsURL).catch(err => {
      if (__DEV__) {
        console.error('Error opening Terms and Conditions:', err);
      }
    });
  }, []);

  const handleDeleteAllDataOk = useCallback(async () => {
    await deleteAllData();
    StorageService.setItemSync('isOnboarded', JSON.stringify(false));
    dispatch(setIsOnboarded(false));
  }, [dispatch]);

  const handleDeleteAllDataCancel = useCallback(() => {
    setIsDeleteModalVisible(false);
  }, []);

  const handleAccessStorageOk = useCallback(async () => {
    Linking.openSettings();
  }, []);

  const handleAccessStorageCancel = useCallback(() => {
    setIsStorageModalVisible(false);
  }, []);

  const handleDeleteAllData = useCallback(() => {
    setIsDeleteModalVisible(true);
  }, []);

  const handleDownloadSuccessful = useCallback(() => {
    setIsDownloadSuccessful(false);
  }, []);

  const handleDownloadError = useCallback(() => {
    setIsDownloadError(false);
  }, []);

  return {
    isThemeModalVisible,
    setIsThemeModalVisible,
    isNameModalVisible,
    setIsNameModalVisible,
    name,
    setName,
    appVersion,
    colors,
    handleThemeModalClose,
    handleNameModalClose,
    handleThemeSelection,
    handleNameUpdate,
    handleCurrencyUpdate,
    selectedTheme: themeMode,
    userName,
    currencySymbol,
    currencyName,
    handleRateNow,
    handleGithub,
    handlePrivacyPolicy,
    handleTermsAndConditions,
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
