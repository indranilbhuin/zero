import {useEffect, useState} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch, useSelector} from 'react-redux';
import {
  getExpenseRequest,
  selectExpenseData,
  selectExpenseError,
  selectExpenseLoading,
} from '../../redux/slice/expenseDataSlice';
import {selectUserName} from '../../redux/slice/userNameSlice';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {
  FETCH_ALL_USER_DATA,
  FETCH_CURRENCY_DATA,
} from '../../redux/actionTypes';
import moment from 'moment';
import Expense from '../../schemas/ExpenseSchema';

const useHome = () => {
  const colors = useThemeColors();
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const allTransactions = useSelector(selectExpenseData);
  const expenseLoading = useSelector(selectExpenseLoading);
  const expenseError = useSelector(selectExpenseError);
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const currencySymbol = useSelector(selectCurrencySymbol);

  const onRefresh = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    dispatch({type: FETCH_ALL_USER_DATA});
    dispatch({type: FETCH_CURRENCY_DATA});
  }, [userId, userName, currencySymbol]);

  useEffect(() => {
    dispatch(getExpenseRequest());
  }, [userId]);

  useEffect(() => {
    if (refreshing) {
      dispatch(getExpenseRequest());
      setRefreshing(false);
    }
  }, [refreshing]);

  console.log('in home screen', allTransactions);

  const calculateSpent = (unit: string | null | undefined, subtract = 0) => {
    const currentDate = moment().utc();
    console.log(currentDate);
    if (unit === 'day') {
      currentDate.subtract(subtract, 'days');
    } else if (unit === 'month') {
      currentDate.startOf('month');
    }

    const filteredTransactions = allTransactions.filter(
      (transaction: Expense) =>
        moment(transaction.date).isSameOrAfter(currentDate, unit),
    );

    const totalSpent = filteredTransactions.reduce(
      (sum, transaction: {amount: number}) => sum + transaction.amount,
      0,
    );

    return totalSpent;
  };
  const todaySpent = calculateSpent('day', 0);
  const yesterdaySpent = calculateSpent('day', 1);
  const thisMonthSpent = calculateSpent('month');

  return {
    colors,
    refreshing,
    setRefreshing,
    allTransactions,
    expenseLoading,
    expenseError,
    userName,
    userId,
    currencySymbol,
    onRefresh,
    calculateSpent,
    todaySpent,
    yesterdaySpent,
    thisMonthSpent,
  };
};

export default useHome;
