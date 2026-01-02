import {useDispatch} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {useState} from 'react';
import {Linking, Platform} from 'react-native';
import {requestStoragePermission} from '../../utils/dataUtils';
import {pick, types} from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
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

interface SyncStatus {
  user: 'pending' | 'syncing' | 'done' | 'error';
  categories: 'pending' | 'syncing' | 'done' | 'error';
  debtors: 'pending' | 'syncing' | 'done' | 'error';
  currencies: 'pending' | 'syncing' | 'done' | 'error';
  expenses: 'pending' | 'syncing' | 'done' | 'error';
  debts: 'pending' | 'syncing' | 'done' | 'error';
}

const useExistingUser = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();

  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState('Upload your file');
  const [isStorageModalVisible, setIsStorageModalVisible] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncComplete, setIsSyncComplete] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    user: 'pending',
    categories: 'pending',
    debtors: 'pending',
    currencies: 'pending',
    expenses: 'pending',
    debts: 'pending',
  });
  const [syncStats, setSyncStats] = useState({
    categories: 0,
    expenses: 0,
    debtors: 0,
    debts: 0,
  });

  const normalizePath = (path: string | undefined): string => {
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

  const syncAllData = async (data: ImportedData, userId: string) => {
    const categoryIdMap = new Map<string, string>();
    const debtorIdMap = new Map<string, string>();

    setSyncStatus(prev => ({...prev, categories: 'syncing'}));
    try {
      for (const categoryData of data.categories) {
        const {name, icon, color} = categoryData;
        const newCategoryId = await createCategory(name, userId, icon ?? null, color ?? null);
        if (newCategoryId) {
          categoryIdMap.set(name, newCategoryId);
        }
      }
      setSyncStats(prev => ({...prev, categories: data.categories.length}));
      setSyncStatus(prev => ({...prev, categories: 'done'}));
      dispatch({type: FETCH_ALL_CATEGORY_DATA});
    } catch (error) {
      console.error('Error syncing categories:', error);
      setSyncStatus(prev => ({...prev, categories: 'error'}));
      throw error;
    }

    setSyncStatus(prev => ({...prev, debtors: 'syncing'}));
    try {
      for (const debtorData of data.debtors) {
        const {title, icon, type, color} = debtorData;
        const newDebtorId = await createDebtor(title, userId, icon ?? null, type ?? 'Other', color ?? null);
        if (newDebtorId) {
          debtorIdMap.set(title, newDebtorId);
        }
      }
      setSyncStats(prev => ({...prev, debtors: data.debtors.length}));
      setSyncStatus(prev => ({...prev, debtors: 'done'}));
      dispatch({type: FETCH_ALL_DEBTOR_DATA});
    } catch (error) {
      console.error('Error syncing debtors:', error);
      setSyncStatus(prev => ({...prev, debtors: 'error'}));
      throw error;
    }

    setSyncStatus(prev => ({...prev, currencies: 'syncing'}));
    try {
      for (const currencyData of data.currencies) {
        const {code, symbol, name} = currencyData;
        await createCurrency(code, symbol, name, userId);
      }
      setSyncStatus(prev => ({...prev, currencies: 'done'}));
      dispatch({type: FETCH_CURRENCY_DATA});
    } catch (error) {
      console.error('Error syncing currencies:', error);
      setSyncStatus(prev => ({...prev, currencies: 'error'}));
      throw error;
    }

    setSyncStatus(prev => ({...prev, expenses: 'syncing'}));
    try {
      let expenseCount = 0;
      for (const expenseData of data.expenses) {
        const {title, amount, description, category, date} = expenseData;
        const categoryId = categoryIdMap.get(category.name);
        if (categoryId) {
          await createExpense(userId, title, amount, description ?? '', categoryId, date);
          expenseCount++;
        }
      }
      setSyncStats(prev => ({...prev, expenses: expenseCount}));
      setSyncStatus(prev => ({...prev, expenses: 'done'}));
      dispatch(getExpenseRequest());
    } catch (error) {
      console.error('Error syncing expenses:', error);
      setSyncStatus(prev => ({...prev, expenses: 'error'}));
      throw error;
    }

    setSyncStatus(prev => ({...prev, debts: 'syncing'}));
    try {
      let debtCount = 0;
      for (const debtData of data.debts) {
        const {amount, description, debtor, date, type} = debtData;
        const debtorId = debtorIdMap.get(debtor.title);
        if (debtorId) {
          await createDebt(userId, amount, description, debtorId, date, type);
          debtCount++;
        }
      }
      setSyncStats(prev => ({...prev, debts: debtCount}));
      setSyncStatus(prev => ({...prev, debts: 'done'}));
      dispatch(getAllDebtRequest());
    } catch (error) {
      console.error('Error syncing debts:', error);
      setSyncStatus(prev => ({...prev, debts: 'error'}));
      throw error;
    }
  };

  const importData = async () => {
    try {
      setIsSyncing(false);
      setIsSyncComplete(false);
      setSyncError(null);
      setSyncStatus({
        user: 'pending',
        categories: 'pending',
        debtors: 'pending',
        currencies: 'pending',
        expenses: 'pending',
        debts: 'pending',
      });

      const storagePermissionGranted = await requestStoragePermission();

      if (!storagePermissionGranted) {
        setIsStorageModalVisible(true);
        return;
      }

      const result = await pick({
        type: [types.allFiles],
        allowMultiSelection: false,
      });

      const {0: res} = result;
      const path = normalizePath(res.uri);
      if (!path) {
        setUploadMessage('Invalid file path');
        return;
      }

      const fileContent = await RNFS.readFile(path, 'utf8');
      const jsonData = JSON.parse(fileContent);

      const {key, data} = jsonData;
      if (!key || !isValidKey(key)) {
        setUploadMessage('Invalid key. Please upload a valid zero export file.');
        return;
      }

      setFileName(res.name ?? 'data.json');
      setUploadMessage('Syncing your data...');
      setIsSyncing(true);

      setSyncStatus(prev => ({...prev, user: 'syncing'}));
      const {users} = data as ImportedData;
      const {username, email} = users[0];
      const newUserId = await createUser(username, email);

      if (!newUserId) {
        throw new Error('Failed to create user');
      }

      setSyncStatus(prev => ({...prev, user: 'done'}));
      dispatch({type: FETCH_ALL_USER_DATA});

      await syncAllData(data as ImportedData, newUserId);

      setIsSyncing(false);
      setIsSyncComplete(true);
      setUploadMessage('All data synced successfully!');
    } catch (error) {
      console.error('Error importing data:', error);
      setIsSyncing(false);
      setSyncError('Failed to sync data. Please try again.');
      setUploadMessage('Error syncing data. Try again.');
    }
  };

  const reUpload = async () => {
    await deleteAllData();
    dispatch({type: FETCH_ALL_CATEGORY_DATA});
    dispatch({type: FETCH_ALL_DEBTOR_DATA});
    dispatch({type: FETCH_ALL_USER_DATA});
    setFileName(null);
    setIsSyncComplete(false);
    setSyncError(null);
    setSyncStats({categories: 0, expenses: 0, debtors: 0, debts: 0});
    await importData();
  };

  const handleContinue = async () => {
    await AsyncStorageService.setItem('isOnboarded', JSON.stringify(true));
    dispatch(setIsOnboarded(true));
  };

  const handleAccessStorageOk = async () => {
    Linking.openSettings();
  };

  const handleAccessStorageCancel = () => {
    setIsStorageModalVisible(false);
  };

  return {
    colors,
    importData,
    fileName,
    uploadMessage,
    reUpload,
    handleContinue,
    isSyncing,
    isSyncComplete,
    syncError,
    syncStatus,
    syncStats,
    isStorageModalVisible,
    handleAccessStorageOk,
    handleAccessStorageCancel,
  };
};

export default useExistingUser;
