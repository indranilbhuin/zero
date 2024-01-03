import {ScrollView, StyleSheet, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import PrimaryView from '../atoms/PrimaryView';
import AppHeader from '../atoms/AppHeader';
import CustomInput from '../atoms/CustomInput';
import PrimaryText from '../atoms/PrimaryText';
import textInputStyles from '../../styles/textInput';
import CategoryContainer from './CategoryContainer';
import SecondaryButton from './SecondaryButton';
import PrimaryButton from '../atoms/PrimaryButton';
import useThemeColors from '../../hooks/useThemeColors';
import {goBack, navigate} from '../../utils/navigationUtils';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {selectActiveCategories} from '../../redux/slice/categoryDataSlice';
import {FETCH_ALL_CATEGORY_DATA} from '../../redux/actionTypes';
import {createExpense, updateExpenseById} from '../../services/ExpenseService';
import {getExpenseRequest} from '../../redux/slice/expenseDataSlice';
import mainStyles from '../../styles/main';
import DatePicker from '../atoms/DatePicker';
import moment from 'moment';
import {
  expenseAmountSchema,
  expenseDescriptionSchema,
  expenseSchema,
} from '../../utils/validationSchema';

interface ExpenseEntryProps {
  type: string;
  route?: any;
}

const ExpenseEntry: React.FC<ExpenseEntryProps> = ({type, route}) => {
  const expenseData = route?.params;
  const isAddButton = type === 'Add';
  const [hasInteracted, setHasInteracted] = useState(false);
  const categories = useSelector(selectActiveCategories);
  const [selectedCategories, setSelectedCategories] = useState(
    isAddButton
      ? []
      : categories?.filter(
          category => category?.name === expenseData?.category.name,
        ),
  );

  const [createdAt, setCreatedAt] = useState(
    isAddButton
      ? moment().format('YYYY-MM-DDTHH:mm:ss')
      : expenseData.expenseDate,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState(
    isAddButton ? '' : expenseData.expenseTitle,
  );
  const [expenseDescription, setExpenseDescription] = useState(
    isAddButton ? '' : expenseData.expenseDescription,
  );
  const [expenseAmount, setExpenseAmount] = useState(
    isAddButton ? '' : String(expenseData.expenseAmount),
  );

  const expenseAmountError = hasInteracted
    ? expenseAmountSchema?.safeParse(Number(expenseAmount)).error?.errors || []
    : [];

  const isValid =
    expenseSchema.safeParse(expenseTitle).success &&
    expenseDescriptionSchema.safeParse(expenseDescription).success &&
    expenseAmountSchema.safeParse(Number(expenseAmount)).success;

  const userId = useSelector(selectUserId);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const dispatch = useDispatch();

  const colors = useThemeColors();

  useEffect(() => {
    dispatch({type: FETCH_ALL_CATEGORY_DATA});
  }, []);

  const handleAddCategory = () => {
    navigate('AddCategoryScreen');
  };

  const handleTextInputFocus = () => {
    setHasInteracted(true);
  };

  const handleAddExpense = () => {
    if (!isValid || selectedCategories.length === 0) {
      return;
    }
    const categoryId = selectedCategories[0]._id;
    try {
      createExpense(
        Realm.BSON.ObjectID.createFromHexString(userId),
        expenseTitle,
        Number(expenseAmount),
        expenseDescription,
        categoryId,
        createdAt,
      );

      dispatch(getExpenseRequest());
      goBack();
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleUpdateExpense = () => {
    if (!isValid || selectedCategories.length === 0) {
      return;
    }
    const categoryId = String(selectedCategories[0]._id);
    try {
      updateExpenseById(
        Realm.BSON.ObjectID.createFromHexString(expenseData.expenseId),
        Realm.BSON.ObjectID.createFromHexString(categoryId),
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

  const toggleCategorySelection = (category: any) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([category]);
    }
  };

  return (
    <PrimaryView colors={colors}>
      <View style={mainStyles.headerContainer}>
        <AppHeader
          onPress={() => goBack(() => dispatch(getExpenseRequest()))}
          colors={colors}
          text="Transaction Screen"
        />
      </View>

      <CustomInput
        colors={colors}
        input={expenseTitle}
        setInput={setExpenseTitle}
        placeholder="eg. Biryani"
        label="Expense"
        schema={expenseSchema}
      />
      <CustomInput
        colors={colors}
        input={expenseDescription}
        setInput={setExpenseDescription}
        placeholder="eg. From Aroma's"
        label="Expense Description"
        schema={expenseDescriptionSchema}
      />
      <PrimaryText style={{marginBottom: 5}}>Expense Amount</PrimaryText>
      <View
        style={[
          textInputStyles.textInputContainer,
          {
            borderColor: colors.secondaryContainerColor,
            backgroundColor: colors.secondaryAccent,
            marginBottom: expenseAmountError.length > 0 ? 5 : 15,
          },
        ]}>
        <PrimaryText style={{fontSize: 15}}>{currencySymbol}</PrimaryText>
        <TextInput
          style={[
            textInputStyles.textInputWithIcon,
            {
              color: colors.primaryText,
            },
          ]}
          value={expenseAmount}
          onChangeText={setExpenseAmount}
          placeholder={'eg. 320'}
          onChange={handleTextInputFocus}
          placeholderTextColor={colors.secondaryText}
          keyboardType="numeric"
        />
      </View>
      {expenseAmountError.length > 0 && (
        <View style={{marginBottom: 10}}>
          {expenseAmountError.map(error => (
            <View key={error.message}>
              <PrimaryText style={{color: colors.accentRed, fontSize: 12}}>
                {error.message}
              </PrimaryText>
            </View>
          ))}
        </View>
      )}
      <DatePicker
        setShowDatePicker={setShowDatePicker}
        createdAt={createdAt}
        showDatePicker={showDatePicker}
        setCreatedAt={setCreatedAt}
      />
      <PrimaryText style={{marginBottom: 5}}>Select any category</PrimaryText>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CategoryContainer
          categories={categories}
          colors={colors}
          toggleCategorySelection={toggleCategorySelection}
          selectedCategories={selectedCategories}
        />
        <View style={styles.addButtonContainer}>
          <SecondaryButton
            onPress={handleAddCategory}
            buttonText="Add More"
            colors={colors}
            width={100}
          />
        </View>
      </ScrollView>
      <View style={styles.submitButtonContainer}>
        <PrimaryButton
          onPress={isAddButton ? handleAddExpense : handleUpdateExpense}
          colors={colors}
          buttonTitle={type}
          disabled={!isValid}
        />
      </View>
    </PrimaryView>
  );
};

export default ExpenseEntry;

const styles = StyleSheet.create({
  addButtonContainer: {
    marginBottom: 10,
  },
  submitButtonContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
});
