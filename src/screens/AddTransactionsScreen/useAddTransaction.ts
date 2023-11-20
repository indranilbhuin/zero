import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {FETCH_ALL_CATEGORY_DATA} from '../../redux/actionTypes';
import {selectCategoryData} from '../../redux/slice/categoryDataSlice';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {createExpense} from '../../services/ExpenseService';
import {navigate, goBack} from '../../utils/navigationUtils';
import moment from 'moment';
import { getExpenseRequest } from '../../redux/slice/expenseDataSlice';

const useAddTransaction = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [createdAt, setCreatedAt] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const userId = useSelector(selectUserId);

  const colors = useThemeColors();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategoryData);

  useEffect(() => {
    dispatch({type: FETCH_ALL_CATEGORY_DATA});
  }, []);

  const toggleCategorySelection = category => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([category]);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || createdAt;
    const utcDate = moment(currentDate).utc().toDate();
    setCreatedAt(utcDate);
    setShowDatePicker(false);
  };

  const handleAddCategory = () => {
    navigate('CategoryScreen');
  };

  const handleAddExpense = () => {
    if (
      expenseTitle.trim() === '' ||
      expenseAmount === null ||
      selectedCategories.length === 0
    ) {
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

  console.log(
    'selected category',
    selectedCategories,
    expenseTitle,
    expenseAmount,
    expenseDescription,
    createdAt,
  );

  return {
    colors,
    expenseTitle,
    setExpenseTitle,
    expenseDescription,
    setExpenseDescription,
    expenseAmount,
    setExpenseAmount,
    setShowDatePicker,
    createdAt,
    showDatePicker,
    handleDateChange,
    categories,
    toggleCategorySelection,
    selectedCategories,
    handleAddCategory,
    handleAddExpense,
  };
};

export default useAddTransaction;
