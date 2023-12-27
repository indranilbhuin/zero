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
import { getExpenseRequest } from '../../redux/slice/expenseDataSlice';

const ExistingUserScreen = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const allCategories = useSelector(selectCategoryData);
  console.log('kkkk', allCategories);
  const cat = Array.from(allCategories);
  const allCategoriesCopy = allCategories;
  const [allData, setAllData] = useState(null);
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
      dispatch(getExpenseRequest());

      await AsyncStorageService.setItem('isOnboarded', JSON.stringify(true));
      dispatch(setIsOnboarded(true));
    }
  };

  return (
    <PrimaryView colors={colors}>
      <View style={styles.titleTextContainer}>
        <PrimaryText style={{fontSize: 20}}>
          As an existing user if you have exported your data,
        </PrimaryText>
        <PrimaryText
          style={{color: colors.accentGreen, fontSize: 15, paddingTop: '10%'}}>
          Upload your{' '}
          <Text style={{color: colors.accentGreen}}>zero***.json</Text> file we
          will assess your data
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
            onPress={importRealmData}>
            <Icon
              name={'file-upload'}
              size={25}
              color={colors.accentGreen}
              type={'MaterialCommunityIcons'}
            />
          </TouchableOpacity>
        </View>
        {!fileName ? (
          <PrimaryText style={{fontSize: 13}}>Upload your file</PrimaryText>
        ) : (
          <PrimaryText style={{fontSize: 13}}>{fileName}</PrimaryText>
        )}
      </View>
      <View style={{marginTop: '5%'}}>
        <PrimaryButton
          onPress={populateCategory}
          colors={colors}
          buttonTitle={'fff'}
          disabled={undefined}
        />
        <PrimaryButton
          onPress={populate}
          colors={colors}
          buttonTitle={'jjj'}
          disabled={undefined}
        />
        <PrimaryButton
          onPress={handleDataSubmit}
          colors={colors}
          buttonTitle={'Submit'}
          disabled={undefined}
        />
      </View>
      <View>
        <PrimaryText>welcome back {userName}</PrimaryText>
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
});
