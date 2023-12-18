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
  FETCH_ALL_CATEGORY_DATA,
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
  const allTransactionsCopy = JSON.parse(JSON.stringify(allTransactions));
  const sortedTransactions = allTransactionsCopy.sort(
    (a: {date: moment.MomentInput}, b: {date: moment.MomentInput}) =>
      moment(b.date).diff(moment(a.date)),
  );

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
    dispatch({type: FETCH_ALL_CATEGORY_DATA});
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

  const currentDate = moment();

  const todaySpent = allTransactions
    .filter((transaction: Expense) =>
      moment(transaction.date).isSame(currentDate, 'day'),
    )
    .reduce(
      (total, transaction: {amount: number}) => total + transaction.amount,
      0,
    );

  const formatTodaySpent = Number.isInteger(todaySpent)
    ? todaySpent
    : todaySpent.toFixed(2);

  const yesterdayDate = moment().subtract(1, 'days');

  const yesterdaySpent = allTransactions
    .filter((transaction: Expense) =>
      moment(transaction.date).isSame(yesterdayDate, 'day'),
    )
    .reduce(
      (total, transaction: {amount: number}) => total + transaction.amount,
      0,
    );

  const formatYesterdaySpent = Number.isInteger(yesterdaySpent)
    ? yesterdaySpent
    : yesterdaySpent.toFixed(2);

  const thisMonthSpent = allTransactions
    .filter((transaction: Expense) =>
      moment(transaction.date).isSame(currentDate, 'month'),
    )
    .reduce(
      (total, transaction: {amount: number}) => total + transaction.amount,
      0,
    );

  const formatThisMonthSpent = Number.isInteger(thisMonthSpent)
    ? thisMonthSpent
    : thisMonthSpent.toFixed(2);

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
    todaySpent,
    yesterdaySpent,
    thisMonthSpent,
    sortedTransactions,
    formatTodaySpent,
    formatYesterdaySpent,
    formatThisMonthSpent
  };
};

export default useHome;
