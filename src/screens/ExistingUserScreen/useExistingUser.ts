import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {selectUserName} from '../../redux/slice/userNameSlice';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {selectCategoryData} from '../../redux/slice/categoryDataSlice';
import {useEffect, useState} from 'react';
import {selectDebtorData} from '../../redux/slice/debtorDataSlice';
import {Linking, Platform} from 'react-native';
import {requestStoragePermission} from '../../utils/dataUtils';
import {pick, types} from '@react-native-documents/picker';
import RNFS from 'react-native-fs';

// Type for imported data from JSON file
interface ImportedData {
  users: Array<{username: string; email: string}>;
  categories: Array<{name: string; icon?: string; color?: string}>;
  currencies: Array<{code: string; symbol: string; name: string}>;
  expenses: Array<{
    title: string;
    amount: number;
    description?: string;
    category: {name: string};
    date: string;
  }>;
  debtors: Array<{title: string; icon?: string; type?: string; color?: string}>;
  debts: Array<{
    amount: number;
    description: string;
    debtor: {title: string};
    date: string;
    type: string;
  }>;
}
import {
  createUser,
  deleteAllData,
  createCategory,
  createDebtor,
  createCurrency,
  createExpense,
  createDebt,
} from '../../watermelondb/services';
import {
  FETCH_ALL_CATEGORY_DATA,
  FETCH_ALL_DEBTOR_DATA,
  FETCH_ALL_USER_DATA,
  FETCH_CURRENCY_DATA,
} from '../../redux/actionTypes';
import {getExpenseRequest} from '../../redux/slice/expenseDataSlice';
import {getAllDebtRequest} from '../../redux/slice/allDebtDataSlice';
import AsyncStorageService from '../../utils/asyncStorageService';
import {setIsOnboarded} from '../../redux/slice/isOnboardedSlice';

const useExistingUser = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const allCategories = useSelector(selectCategoryData);
  console.log('kkkk', allCategories);
  const allCategoriesCopy = allCategories;
  const [allData, setAllData] = useState<ImportedData | null>(null);
  const [fileKey, setFileKey] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState('Upload your file');
  const [fileName, setFileName] = useState<string | null>(null);
  const allDebtors = useSelector(selectDebtorData);
  const [isStorageModalVisible, setIsStorageModalVisible] = useState(false);
  const debtorsCopy = allDebtors;

  console.log('lklklkla', debtorsCopy);

  function normalizePath(path: string | undefined): string {
    try {
      if (path === undefined) {
        throw new Error('Path is undefined');
      }
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        const filePrefix = 'file:';
        if (path.startsWith(filePrefix)) {
          path = path.substring(filePrefix.length);
        }
        path = decodeURI(path);
      }
      return path;
    } catch (e) {
      console.error({msg: 'Failed to normalize path', data: e});
      return '';
    }
  }

  const importData = async () => {
    try {
      const storagePermissionGranted = await requestStoragePermission();

      if (!storagePermissionGranted) {
        console.log('Storage permission denied.');
        setIsStorageModalVisible(true);
        return;
      }
      const result = await pick({
        type: [types.allFiles],
        allowMultiSelection: false,
      });

      const {0: res} = result;
      const path = normalizePath(res.uri);
      if (path === undefined) {
        throw console.error('undefined');
      }

      console.log(res);
      const fileContent = await RNFS.readFile(path, 'utf8');

      const jsonData = JSON.parse(fileContent);

      const {key, data} = jsonData;
      if (!key) {
        setUploadMessage('Invalid key. Please upload a valid file.');
        return;
      }
      console.log(isValidKey(key));
      if (!isValidKey(key)) {
        setUploadMessage('Invalid key. Please upload a valid file.');
        return;
      }
      setFileKey(key);
      const {users} = data;
      const {username, email} = users[0];
      await createUser(username, email);
      dispatch({type: FETCH_ALL_USER_DATA});

      setAllData(data);
      setFileName(res.name);
    } catch (error) {
      console.error('Error picking or reading file:', error);
    }
  };

  const reUpload = async () => {
    await deleteAllData();
    dispatch({type: FETCH_ALL_CATEGORY_DATA});
    dispatch({type: FETCH_ALL_DEBTOR_DATA});
    await importData();
  };

  const isValidKey = (key: string | null): boolean => {
    if (!key || key.length !== 20) {
      return false;
    }

    const prefix = key.slice(0, 4);
    if (prefix !== 'zero') {
      return false;
    }

    const alphanumericPart = key.slice(4);
    return /^[a-zA-Z0-9]+$/.test(alphanumericPart);
  };

  const populateCategory = async () => {
    if (!allData) return;
    const {categories} = allData;

    for (const categoryData of categories) {
      const {name, icon, color} = categoryData;
      await createCategory(name, userId, icon ?? null, color ?? null);
    }

    dispatch({type: FETCH_ALL_CATEGORY_DATA});
  };

  const populate = async () => {
    if (!allData) return;
    const {debtors} = allData;

    for (const debtorData of debtors) {
      const {title, icon, type, color} = debtorData;
      await createDebtor(title, userId, icon ?? null, type ?? 'Borrow', color ?? null);
    }
    dispatch({type: FETCH_ALL_DEBTOR_DATA});
  };

  useEffect(() => {
    dispatch({type: FETCH_ALL_USER_DATA});
    dispatch({type: FETCH_CURRENCY_DATA});
    dispatch({type: FETCH_ALL_CATEGORY_DATA});
    dispatch({type: FETCH_ALL_DEBTOR_DATA});
  }, [dispatch]);

  const getCategoryById = (categories: Array<{id?: string; name?: string}>, categoryName: string): string => {
    const category = categories.find(item => item.name === categoryName);
    return category?.id ?? '';
  };

  const getDebtorById = (debtors: Array<{id?: string; title?: string}>, debtorname: string): string => {
    const debtor = debtors.find(item => item.title === debtorname);
    return debtor?.id ?? '';
  };

  const handleDataSubmit = async () => {
    if (allData) {
      const {currencies, expenses, debts} = allData;

      for (const currencyData of currencies) {
        const {code, symbol, name} = currencyData;
        await createCurrency(code, symbol, name, userId);
      }

      for (const expenseData of expenses) {
        const {title, amount, description, category, date} = expenseData;
        console.log(category.name);
        const categoryId = getCategoryById(allCategoriesCopy, category.name);
        console.log(typeof categoryId, categoryId);
        await createExpense(userId, title, amount, description ?? '', categoryId, date);
      }

      for (const debtData of debts) {
        const {amount, description, debtor, date, type} = debtData;
        console.log(debtor);
        const debtorId = getDebtorById(debtorsCopy, debtor.title);

        await createDebt(userId, amount, description, debtorId, date, type);
      }

      console.log('Data populated successfully!');
      dispatch({type: FETCH_ALL_USER_DATA});
      dispatch({type: FETCH_CURRENCY_DATA});
      dispatch({type: FETCH_ALL_CATEGORY_DATA});
      dispatch({type: FETCH_ALL_DEBTOR_DATA});
      dispatch(getExpenseRequest());
      dispatch(getAllDebtRequest());

      await AsyncStorageService.setItem('isOnboarded', JSON.stringify(true));
      dispatch(setIsOnboarded(true));
    }
  };

  console.log(allCategoriesCopy.length > 0 && debtorsCopy.length > 0);

  const handleAccessStorageOk = async () => {
    Linking.openSettings();
  };
  const handleAccessStorageCancel = () => {
    setIsStorageModalVisible(false);
  };

  const isDisable = () => {
    return (
      ((allData?.categories?.length ?? 0) > 0 && allCategoriesCopy.length === 0) ||
      ((allData?.debtors?.length ?? 0) > 0 && debtorsCopy.length === 0)
    );
  };

  return {
    colors,
    importData,
    isValidKey,
    fileKey,
    userName,
    uploadMessage,
    fileName,
    reUpload,
    allData,
    allCategoriesCopy,
    populateCategory,
    populate,
    debtorsCopy,
    handleDataSubmit,
    isDisable,
    isStorageModalVisible,
    handleAccessStorageOk,
    handleAccessStorageCancel,
  };
};

export default useExistingUser;
