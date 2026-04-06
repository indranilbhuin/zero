import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {ExpenseData as Expense} from '../../watermelondb/services';
import {useCallback, useMemo} from 'react';
import {fetchExpensesByCategory, selectEverydayExpenseData} from '../../redux/slice/everydayExpenseDataSlice';
import {AppDispatch} from '../../redux/store';

export type CategoryTransactionRouteProp = RouteProp<
  {
    CategoryTransactionScreen: {
      categoryId: string;
      categoryName: string;
      categoryColor: string;
      categoryIcon?: string;
      yearMonth: string;
      monthLabel: string;
    };
  },
  'CategoryTransactionScreen'
>;

const useCategoryTransaction = (route: CategoryTransactionRouteProp) => {
  const dispatch = useDispatch<AppDispatch>();
  const transactions = (useSelector(selectEverydayExpenseData) ?? []) as Expense[];
  const colors = useThemeColors();
  const currencySymbol = useSelector(selectCurrencySymbol);

  const {
    categoryId = '',
    categoryName = '',
    categoryColor = '#808080',
    categoryIcon,
    yearMonth = '',
    monthLabel = '',
  } = route.params ?? {};

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchExpensesByCategory({categoryId, yearMonth}));
    }, [dispatch, categoryId, yearMonth]),
  );

  const totalAmount = useMemo(
    () => transactions.reduce((sum: number, t: Expense) => sum + t.amount, 0),
    [transactions],
  );

  return {
    colors,
    currencySymbol,
    transactions,
    totalAmount,
    categoryName,
    categoryColor,
    categoryIcon,
    monthLabel,
    categoryId,
    yearMonth,
  };
};

export default useCategoryTransaction;
