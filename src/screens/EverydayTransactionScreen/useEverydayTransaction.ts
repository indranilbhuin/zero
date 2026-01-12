import {formatDate} from '../../utils/dateUtils';
import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {RouteProp} from '@react-navigation/native';
import {ExpenseData as Expense} from '../../watermelondb/services';
import {useEffect, useMemo} from 'react';
import {fetchEverydayExpenses, selectEverydayExpenseData} from '../../redux/slice/everydayExpenseDataSlice';
import {AppDispatch} from '../../redux/store';

export type EverydayTransactionRouteProp = RouteProp<
  {
    EverydayTransaction: {
      dayTransactions: Array<Expense>;
      isDate: string;
    };
  },
  'EverydayTransaction'
>;

const useEverydayTransaction = (route: EverydayTransactionRouteProp) => {
  const dispatch = useDispatch<AppDispatch>();
  const allEverydayTransactions = useSelector(selectEverydayExpenseData) as Expense[];
  const expenseDate = route.params.isDate;
  const formattedDate = formatDate(expenseDate, 'MMM Do YY');
  const formattedDateDisplay = formatDate(expenseDate, 'MMM Do YY');
  const colors = useThemeColors();
  const currencySymbol = useSelector(selectCurrencySymbol);

  useEffect(() => {
    dispatch(fetchEverydayExpenses(expenseDate));
  }, [dispatch, expenseDate]);

  const totalAmountForTheDay = useMemo(
    () => allEverydayTransactions.reduce((sum: number, transaction: Expense) => sum + transaction.amount, 0),
    [allEverydayTransactions],
  );

  return {
    formatDate: formattedDateDisplay,
    formattedDate,
    colors,
    currencySymbol,
    expenseDate,
    allEverydayTransactions,
    totalAmountForTheDay,
  };
};

export default useEverydayTransaction;
