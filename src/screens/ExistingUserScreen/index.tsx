import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import PrimaryView from '../../components/atoms/PrimaryView';
import useThemeColors from '../../hooks/useThemeColors';
import PrimaryText from '../../components/atoms/PrimaryText';
import Icon from '../../components/atoms/Icons';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserName} from '../../redux/slice/userNameSlice';
import {
  FETCH_ALL_CATEGORY_DATA,
  FETCH_ALL_DEBTOR_DATA,
  FETCH_ALL_USER_DATA,
  FETCH_CURRENCY_DATA,
} from '../../redux/actionTypes';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {createUser} from '../../services/UserService';
import {createCategory} from '../../services/CategoryService';
import {createCurrency} from '../../services/CurrencyService';
import {createDebtor} from '../../services/DebtorService';
import {createDebt} from '../../services/DebtService';
import {createExpense} from '../../services/ExpenseService';
import AsyncStorageService from '../../utils/asyncStorageService';
import {setIsOnboarded} from '../../redux/slice/isOnboardedSlice';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {selectCategoryData} from '../../redux/slice/categoryDataSlice';
import {selectDebtorData} from '../../redux/slice/debtorDataSlice';
import {getExpenseRequest} from '../../redux/slice/expenseDataSlice';
import {deleteAllData} from '../../services/DeleteService';

const ExistingUserScreen = () => {
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

      await AsyncStorageService.setItem('isOnboarded', JSON.stringify(true));
      dispatch(setIsOnboarded(true));
    }
  };

  console.log(allCategoriesCopy.length > 0 && debtorsCopy.length > 0);

  return (
    <PrimaryView colors={colors} style={{justifyContent: 'space-between'}}>
      <View>
        <View style={styles.titleTextContainer}>
          <PrimaryText style={{fontSize: 20}}>
            As an existing user if you have exported your data,
          </PrimaryText>
          <PrimaryText
            style={{
              color: colors.accentGreen,
              fontSize: 15,
              paddingTop: '10%',
            }}>
            Upload your{' '}
            <Text style={{color: colors.accentGreen}}>zero***.json</Text> file
            we will assess your data
          </PrimaryText>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: '5%'}}>
          <View
            style={[
              styles.uploadContainer,
              {
                backgroundColor: colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
              },
            ]}>
            <TouchableOpacity
              style={styles.uploadContent}
              onPress={importRealmData}
              disabled={isValidKey(fileKey)}>
              <Icon
                name={'file-upload'}
                size={25}
                color={colors.accentGreen}
                type={'MaterialCommunityIcons'}
              />
            </TouchableOpacity>
          </View>
          {!userName ? (
            <PrimaryText style={{fontSize: 13, width: '80%'}}>
              {uploadMessage}
            </PrimaryText>
          ) : (
            <View style={{}}>
              <PrimaryText style={{fontSize: 13}}>
                uploaded {fileName}
              </PrimaryText>
              <TouchableOpacity onPress={reUpload}>
                <PrimaryText style={{fontSize: 13, color: colors.accentOrange}}>
                  reUpload
                </PrimaryText>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {isValidKey(fileKey) ? (
          <View style={{marginTop: '5%'}}>
            <TouchableOpacity
              disabled={allCategoriesCopy?.length > 0}
              onPress={populateCategory}>
              <View
                style={[
                  styles.settingsContainer,
                  {
                    backgroundColor:
                      allCategoriesCopy?.length > 0
                        ? colors.accentGreen
                        : colors.containerColor,
                    borderColor: colors.secondaryContainerColor,
                    marginBottom: '3%',
                  },
                ]}>
                <Icon
                  name={'database-sync'}
                  size={25}
                  color={
                    allCategoriesCopy?.length > 0
                      ? colors.buttonText
                      : colors.primaryText
                  }
                  type={'MaterialCommunityIcons'}
                />
                {allCategoriesCopy?.length > 0 ? (
                  <PrimaryText
                    style={{
                      fontSize: 13,
                      color:
                        allCategoriesCopy?.length > 0
                          ? colors.buttonText
                          : colors.primaryText,
                    }}>
                    Synced Expense Data successfully
                  </PrimaryText>
                ) : (
                  <PrimaryText
                    style={{
                      color:
                        allCategoriesCopy?.length > 0
                          ? colors.buttonText
                          : colors.primaryText,
                    }}>
                    Sync Expense Data
                  </PrimaryText>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={debtorsCopy?.length > 0}
              onPress={populate}>
              <View
                style={[
                  styles.settingsContainer,
                  {
                    backgroundColor:
                      debtorsCopy?.length > 0
                        ? colors.accentGreen
                        : colors.containerColor,
                    borderColor: colors.secondaryContainerColor,
                    marginBottom: '3%',
                  },
                ]}>
                <Icon
                  name={'credit-card-sync-outline'}
                  size={25}
                  color={
                    debtorsCopy?.length > 0
                      ? colors.buttonText
                      : colors.primaryText
                  }
                  type={'MaterialCommunityIcons'}
                />
                {debtorsCopy?.length > 0 ? (
                  <PrimaryText
                    style={{
                      fontSize: 13,
                      color:
                        debtorsCopy?.length > 0
                          ? colors.buttonText
                          : colors.primaryText,
                    }}>
                    Synced Debt Data successfully
                  </PrimaryText>
                ) : (
                  <PrimaryText
                    style={{
                      color:
                        debtorsCopy?.length > 0
                          ? colors.buttonText
                          : colors.primaryText,
                    }}>
                    Sync Debt Data
                  </PrimaryText>
                )}
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      <View style={{marginBottom: '10%'}}>
        <PrimaryButton
          onPress={handleDataSubmit}
          colors={colors}
          buttonTitle={'Continue'}
          disabled={!(allCategoriesCopy.length > 0 && debtorsCopy.length > 0)}
        />
      </View>
    </PrimaryView>
  );
};

export default ExistingUserScreen;

const styles = StyleSheet.create({
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
