import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import moment from 'moment';
import AppHeader from '../../components/AppHeader';
import CategoryContainer from '../../components/CategoryContainer';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import {goBack, navigate} from '../../utils/navigationUtils';
import Icon from '../../components/Icons';
import addTransactionStyles from '../AddTransactionsScreen/style';
import {RouteProp, useRoute} from '@react-navigation/native';
import Category from '../../schemas/CategorySchema';
import {useDispatch, useSelector} from 'react-redux';
import {selectCategoryData} from '../../redux/slice/categoryDataSlice';
import {updateExpenseById} from '../../services/ExpenseService';
import DateTimePicker from '@react-native-community/datetimepicker';
import useThemeColors from '../../hooks/useThemeColors';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import { getExpenseRequest } from '../../redux/slice/expenseDataSlice';

type UpdateTransactionScreenRouteProp = RouteProp<
  {
    UpdateTransactionScreen: {
      expenseId: string;
      expenseTitle: string;
      expenseDescription: string;
      category: Category;
      expenseDate: Date;
      expenseAmount: string;
    };
  },
  'UpdateTransactionScreen'
>;

const UpdateTransactionScreen = () => {
  const route = useRoute<UpdateTransactionScreenRouteProp>();
  const expenseData = route.params;
  console.log('first', expenseData);
  const colors = useThemeColors();
  const [selectedCategories, setSelectedCategories] = useState([
    expenseData?.category,
  ]);
  console.log('category', expenseData.expenseAmount);
  const [expenseTitle, setExpenseTitle] = useState(expenseData.expenseTitle);
  const [expenseDescription, setExpenseDescription] = useState(
    expenseData.expenseDescription,
  );
  const [expenseAmount, setExpenseAmount] = useState(
    String(expenseData.expenseAmount),
  );
  const [createdAt, setCreatedAt] = useState(expenseData.expenseDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const categories = useSelector(selectCategoryData);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const dispatch = useDispatch();

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || createdAt;
    const utcDate = moment(currentDate).utc().toDate();
    setCreatedAt(utcDate);
    setShowDatePicker(false);
  };

  const toggleCategorySelection = category => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([category]);
    }
  };

  const handleAddCategory = () => {
    navigate('AddCategoryScreen');
  };

  const handleUpdateExpense = () => {
    if (
      expenseTitle.trim() === '' ||
      expenseAmount === null ||
      selectedCategories.length === 0
    ) {
      return;
    }
    const categoryId = selectedCategories[0]._id;
    try {
      updateExpenseById(
        Realm.BSON.ObjectID.createFromHexString(expenseData.expenseId),
        categoryId,
        expenseTitle,
        Number(expenseAmount),
        expenseDescription,
        createdAt,
      );
      
      dispatch(getExpenseRequest());
      goBack();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  console.log(selectedCategories);

  return (
    <View
      style={[
        addTransactionStyles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <View style={addTransactionStyles.headerContainer}>
        <AppHeader
          onPress={goBack}
          colors={colors}
          text="Transaction Update Screen"
        />
      </View>

      <CustomInput
        colors={colors}
        input={expenseTitle}
        setInput={setExpenseTitle}
        placeholder="eg. Biryani"
        label="Expense Name"
      />
      <CustomInput
        colors={colors}
        input={expenseDescription}
        setInput={setExpenseDescription}
        placeholder="eg. From Aroma's"
        label="Expense Description"
      />

      <Text
        style={[
          styles.labelText,
          {color: colors.primaryText, fontSize: 14, marginBottom: 5},
        ]}>
        Expense Amount
      </Text>
      <View
        style={[
          styles.textInputContainer,
          {
            borderColor: colors.primaryText,
            backgroundColor: colors.secondaryBackground,
          },
        ]}>
        <Text
          style={[
            addTransactionStyles.subtitleText,
            {color: colors.primaryText, fontSize: 15},
          ]}>
          {currencySymbol}
        </Text>
        <TextInput
          style={[
            styles.textInput,
            {
              color: colors.primaryText,
            },
          ]}
          value={expenseAmount}
          onChangeText={setExpenseAmount}
          placeholder={'eg. 320'}
          placeholderTextColor={colors.secondaryText}
        />
      </View>

      <View style={addTransactionStyles.dateContainer}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View
            style={[
              addTransactionStyles.dateButtonContainer,
              {
                backgroundColor: colors.primaryText,
                borderColor: colors.secondaryText,
              },
            ]}>
            <Icon
              name={'calendar'}
              size={20}
              color={colors.buttonText}
              type={'IonIcons'}
            />
          </View>
        </TouchableOpacity>

        <Text
          style={[
            addTransactionStyles.dateText,
            {color: colors.primaryText, fontSize: 14},
          ]}>
          {moment(createdAt).format('Do MMM YYYY')}
        </Text>

        <View>
          {showDatePicker && (
            <DateTimePicker
              value={createdAt}
              mode="date"
              is24Hour={false}
              display="default"
              onChange={handleDateChange}
              style={{backgroundColor: colors.accentGreen}}
            />
          )}
        </View>
      </View>
      <Text
        style={[
          addTransactionStyles.subtitleText,
          {color: colors.primaryText, fontSize: 14, marginBottom: 5},
        ]}>
        Select any category
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CategoryContainer
          categories={categories}
          colors={colors}
          toggleCategorySelection={toggleCategorySelection}
          selectedCategories={selectedCategories}
        />
        <View style={addTransactionStyles.addButtonContainer}>
          <SecondaryButton
            onPress={handleAddCategory}
            buttonText="Add More"
            colors={colors}
            width={100}
          />
        </View>
      </ScrollView>
      <View style={addTransactionStyles.submitButtonContainer}>
        <PrimaryButton
          onPress={handleUpdateExpense}
          colors={colors}
          buttonTitle="Update"
        />
      </View>
    </View>
  );
};

export default UpdateTransactionScreen;

const styles = StyleSheet.create({
  textInputContainer: {
    height: 60,
    alignItems: 'center',
    borderWidth: 2,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 15,
    paddingLeft: 20,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  textInput: {
    padding: 20,
    height: 60,
    width: '100%',
    fontFamily: 'FiraCode-Medium',
    includeFontPadding: false,
  },
  labelText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});
