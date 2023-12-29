import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {selectUserName} from '../../redux/slice/userNameSlice';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {selectCategoryData} from '../../redux/slice/categoryDataSlice';
import {useEffect, useState} from 'react';
import {selectDebtorData} from '../../redux/slice/debtorDataSlice';
import {Linking, Platform} from 'react-native';
import {requestStoragePermission} from '../../utils/dataUtils';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {createUser} from '../../services/UserService';
import {
  FETCH_ALL_CATEGORY_DATA,
  FETCH_ALL_DEBTOR_DATA,
  FETCH_ALL_USER_DATA,
  FETCH_CURRENCY_DATA,
} from '../../redux/actionTypes';
import {deleteAllData} from '../../services/DeleteService';
import {createCategory} from '../../services/CategoryService';
import {createDebtor} from '../../services/DebtorService';
import {createCurrency} from '../../services/CurrencyService';
import {createExpense} from '../../services/ExpenseService';
import {createDebt} from '../../services/DebtService';
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
  const [allData, setAllData] = useState(null);
  const [fileKey, setFileKey] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('Upload your file');
  const [fileName, setFileName] = useState(null);
  const allDebtors = useSelector(selectDebtorData);
  const [isStorageModalVisible, setIsStorageModalVisible] = useState(false);
  const debtorsCopy = allDebtors;

  console.log('lklklkla', debtorsCopy);

  function normalizePath(path: string | undefined) {
    try {
      if (path === undefined) {
        throw console.error('undefined');
      }
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        const filePrefix = 'file:';
        if (path.startsWith(filePrefix)) {
          path = path.substring(filePrefix.length);
        }
        path = decodeURI(path);
        return path;
      }
    } catch (e) {
      console.error({msg: 'Failed to normalize path', data: e});
    }
  }

  const importRealmData = async () => {
    try {
      const storagePermissionGranted = await requestStoragePermission();

      if (!storagePermissionGranted) {
        console.log('Storage permission denied.');
        setIsStorageModalVisible(true);
        return;
      }
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
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
    await importRealmData();
  };

  const isValidKey = key => {
    if (key?.length !== 20) {
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
    const {categories} = allData;

    for (const categoryData of categories) {
      const {name, icon, color} = categoryData;
      await createCategory(
        name,
        Realm.BSON.ObjectID.createFromHexString(userId),
        icon,
        color,
      );
    }

    dispatch({type: FETCH_ALL_CATEGORY_DATA});
  };

  const populate = async () => {
    const {debtors} = allData;

    for (const debtorData of debtors) {
      const {title, icon, type, color} = debtorData;
      await createDebtor(
        title,
        Realm.BSON.ObjectID.createFromHexString(userId),
        icon,
        type,
        color,
      );
    }
    dispatch({type: FETCH_ALL_DEBTOR_DATA});
  };

  useEffect(() => {
    dispatch({type: FETCH_ALL_USER_DATA});
    dispatch({type: FETCH_CURRENCY_DATA});
    dispatch({type: FETCH_ALL_CATEGORY_DATA});
    dispatch({type: FETCH_ALL_DEBTOR_DATA});
  }, []);

  const getCategoryById = (categories?: any, categoryName) => {
    const category = categories.find(item => item.name === categoryName);
    return category ? category._id : null;
  };

  const getDebtorById = (debtors?: any, debtorname) => {
    const debtor = debtors.find(item => item.title === debtorname);
    return debtor ? debtor._id : null;
  };

  const handleDataSubmit = async () => {
    if (allData) {
      const {currencies, expenses, debts} = allData;

      for (const currencyData of currencies) {
        const {code, symbol, name} = currencyData;
        await createCurrency(
          code,
          symbol,
          name,
          Realm.BSON.ObjectID.createFromHexString(userId),
        );
      }

      for (const expenseData of expenses) {
        const {title, amount, description, category, date} = expenseData;
        console.log(category.name);
        const categoryId = String(
          getCategoryById(allCategoriesCopy, category.name),
        );
        console.log(typeof categoryId, categoryId);
        await createExpense(
          Realm.BSON.ObjectID.createFromHexString(userId),
          title,
          amount,
          description,
          Realm.BSON.ObjectID.createFromHexString(categoryId),
          date,
        );
      }

      for (const debtData of debts) {
        const {amount, description, debtor, date, type} = debtData;
        console.log(debtor);
        const debtorId = String(getDebtorById(debtorsCopy, debtor.title));

        await createDebt(
          Realm.BSON.ObjectID.createFromHexString(userId),
          amount,
          description,
          Realm.BSON.ObjectID.createFromHexString(debtorId),
          date,
          type,
        );
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
      (allData?.categories.length > 0 && allCategoriesCopy.length === 0) ||
      (allData?.debtors.length > 0 && debtorsCopy.length === 0)
    );
  };

  return {
    colors,
    importRealmData,
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
