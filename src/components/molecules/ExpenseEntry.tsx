import {ScrollView, TextInput, View} from 'react-native';
import React, {useCallback, useEffect, useState, memo} from 'react';
import PrimaryView from '../atoms/PrimaryView';
import AppHeader from '../atoms/AppHeader';
import CustomInput from '../atoms/CustomInput';
import PrimaryText from '../atoms/PrimaryText';
import CategoryContainer from './CategoryContainer';
import SecondaryButton from './SecondaryButton';
import PrimaryButton from '../atoms/PrimaryButton';
import useThemeColors from '../../hooks/useThemeColors';
import {goBack, navigate} from '../../utils/navigationUtils';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {fetchCategories, selectActiveCategories} from '../../redux/slice/categoryDataSlice';
import {createExpense, updateExpenseById} from '../../watermelondb/services';
import {fetchExpenses} from '../../redux/slice/expenseDataSlice';
import DatePicker from '../atoms/DatePicker';
import {getISODateTime} from '../../utils/dateUtils';
import {expenseAmountSchema, expenseDescriptionSchema, expenseSchema} from '../../utils/validationSchema';
import {CategoryData as CategoryDocType} from '../../watermelondb/services';
import {AppDispatch} from '../../redux/store';
import {gs} from '../../styles/globalStyles';

interface ExpenseEntryProps {
  type: string;
  route?: any;
}

const ExpenseEntry: React.FC<ExpenseEntryProps> = ({type, route}) => {
  const expenseData = route?.params;
  const isAddButton = type === 'Add';
  const [hasInteracted, setHasInteracted] = useState(false);
  const categories = useSelector(selectActiveCategories);
  const [selectedCategories, setSelectedCategories] = useState<CategoryDocType[]>(
    isAddButton
      ? []
      : categories?.filter((category: CategoryDocType) => category?.name === expenseData?.category?.name) ?? [],
  );

  const [createdAt, setCreatedAt] = useState(isAddButton ? getISODateTime() : expenseData.expenseDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState(isAddButton ? '' : expenseData.expenseTitle);
  const [expenseDescription, setExpenseDescription] = useState(isAddButton ? '' : expenseData.expenseDescription);
  const [expenseAmount, setExpenseAmount] = useState(isAddButton ? '' : String(expenseData.expenseAmount));

  const expenseAmountError = hasInteracted
    ? expenseAmountSchema?.safeParse(Number(expenseAmount)).error?.issues || []
    : [];

  const isValid =
    expenseSchema.safeParse(expenseTitle).success &&
    expenseDescriptionSchema.safeParse(expenseDescription).success &&
    expenseAmountSchema.safeParse(Number(expenseAmount)).success;

  const userId = useSelector(selectUserId);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const dispatch = useDispatch<AppDispatch>();

  const colors = useThemeColors();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = useCallback(() => {
    navigate('AddCategoryScreen');
  }, []);

  const handleTextInputFocus = useCallback(() => {
    setHasInteracted(true);
  }, []);

  const handleAddExpense = useCallback(async () => {
    if (!isValid || selectedCategories.length === 0) {
      return;
    }
    const categoryId = selectedCategories[0].id;
    try {
      await createExpense(userId, expenseTitle, Number(expenseAmount), expenseDescription, categoryId, createdAt);

      dispatch(fetchExpenses());
      goBack();
    } catch (error) {
      if (__DEV__) {
        console.error('Error creating expense:', error);
      }
    }
  }, [isValid, selectedCategories, userId, expenseTitle, expenseAmount, expenseDescription, createdAt, dispatch]);

  const handleUpdateExpense = useCallback(async () => {
    if (!isValid || selectedCategories.length === 0) {
      return;
    }
    const categoryId = selectedCategories[0].id;
    try {
      await updateExpenseById(
        expenseData?.expenseId,
        categoryId,
        expenseTitle,
        Number(expenseAmount),
        expenseDescription,
        createdAt,
      );

      dispatch(fetchExpenses());
      goBack();
    } catch (error) {
      if (__DEV__) {
        console.error('Error updating expense:', error);
      }
    }
  }, [
    isValid,
    selectedCategories,
    expenseData?.expenseId,
    expenseTitle,
    expenseAmount,
    expenseDescription,
    createdAt,
    dispatch,
  ]);

  const toggleCategorySelection = useCallback(
    (category: CategoryDocType) => {
      if (selectedCategories.includes(category)) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories([category]);
      }
    },
    [selectedCategories],
  );

  return (
    <PrimaryView colors={colors} dismissKeyboardOnTouch>
      <View style={[gs.mb20, gs.mt20]}>
        <AppHeader onPress={() => goBack(() => dispatch(fetchExpenses()))} colors={colors} text="Transaction Screen" />
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
      <PrimaryText style={gs.mb5}>Expense Amount</PrimaryText>
      <View
        style={[
          gs.h48,
          gs.itemsCenter,
          gs.border2,
          gs.mt5,
          gs.rounded10,
          gs.pl10,
          gs.justifyStart,
          gs.row,
          {
            borderColor: colors.secondaryContainerColor,
            backgroundColor: colors.secondaryAccent,
            marginBottom: expenseAmountError.length > 0 ? 5 : 15,
          },
        ]}>
        <PrimaryText size={15}>{currencySymbol}</PrimaryText>
        <TextInput
          style={[gs.px15, gs.h48, gs.wFull, gs.fontMedium, gs.noFontPadding, {color: colors.primaryText}]}
          value={expenseAmount}
          onChangeText={setExpenseAmount}
          placeholder={'eg. 320'}
          onChange={handleTextInputFocus}
          placeholderTextColor={colors.secondaryText}
          keyboardType="numeric"
        />
      </View>
      {expenseAmountError.length > 0 && (
        <View style={gs.mb10}>
          {expenseAmountError.map((error: {message: string}) => (
            <View key={error.message}>
              <PrimaryText size={12} color={colors.accentRed}>
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
      <PrimaryText style={gs.mb5}>Select any category</PrimaryText>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CategoryContainer
          categories={categories}
          colors={colors}
          toggleCategorySelection={toggleCategorySelection}
          selectedCategories={selectedCategories}
        />
        <View style={gs.mb10}>
          <SecondaryButton onPress={handleAddCategory} buttonText="Add More" colors={colors} width={100} />
        </View>
      </ScrollView>
      <View style={gs.mt5}>
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

export default memo(ExpenseEntry);
