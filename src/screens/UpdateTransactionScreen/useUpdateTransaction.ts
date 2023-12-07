import {RouteProp} from '@react-navigation/native';
import Category from '../../schemas/CategorySchema';
import useThemeColors from '../../hooks/useThemeColors';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectActiveCategories} from '../../redux/slice/categoryDataSlice';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import moment from 'moment';
import {goBack, navigate} from '../../utils/navigationUtils';
import {updateExpenseById} from '../../services/ExpenseService';
import {getExpenseRequest} from '../../redux/slice/expenseDataSlice';

export type UpdateTransactionScreenRouteProp = RouteProp<
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

const useUpdateTransaction = (route: UpdateTransactionScreenRouteProp) => {
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
  const categories = useSelector(selectActiveCategories);
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
    navigate('CategoryScreen');
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

  return {
    expenseData,
    colors,
    selectedCategories,
    setSelectedCategories,
    expenseTitle,
    setExpenseTitle,
    expenseDescription,
    setExpenseDescription,
    expenseAmount,
    setExpenseAmount,
    createdAt,
    setCreatedAt,
    showDatePicker,
    setShowDatePicker,
    categories,
    currencySymbol,
    handleDateChange,
    toggleCategorySelection,
    handleAddCategory,
    handleUpdateExpense,
  };
};

export default useUpdateTransaction;
