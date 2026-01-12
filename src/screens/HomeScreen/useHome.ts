import {useCallback, useEffect, useMemo, useState} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchExpenses,
  selectExpenseData,
  selectExpenseError,
  selectExpenseLoading,
} from '../../redux/slice/expenseDataSlice';
import {selectUserName} from '../../redux/slice/userNameSlice';
import {fetchUserData, selectUserId} from '../../redux/slice/userIdSlice';
import {fetchCurrency, selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {fetchCategories} from '../../redux/slice/categoryDataSlice';
import {now, isSameDate, getYesterday, sortByDateDesc} from '../../utils/dateUtils';
import {ExpenseData as Expense} from '../../watermelondb/services';
import {AppDispatch} from '../../redux/store';

const useHome = () => {
  const colors = useThemeColors();
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const allTransactions = useSelector(selectExpenseData);

  const sortedTransactions = useMemo(() => sortByDateDesc(allTransactions as Expense[]), [allTransactions]);

  const expenseLoading = useSelector(selectExpenseLoading);
  const expenseError = useSelector(selectExpenseError);
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const currencySymbol = useSelector(selectCurrencySymbol);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCurrency());
      dispatch(fetchCategories());
      dispatch(fetchExpenses());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (refreshing) {
      dispatch(fetchExpenses());
      setRefreshing(false);
    }
  }, [dispatch, refreshing]);

  const {todaySpent, yesterdaySpent, thisMonthSpent} = useMemo(() => {
    const currentDate = now();
    const yesterdayDate = getYesterday();

    const totals = allTransactions.reduce(
      (acc, transaction: Expense) => {
        const isToday = isSameDate(transaction.date, currentDate, 'day');
        const isYesterday = isSameDate(transaction.date, yesterdayDate, 'day');
        const isThisMonth = isSameDate(transaction.date, currentDate, 'month');

        if (isToday) {
          acc.today += transaction.amount;
        } else if (isYesterday) {
          acc.yesterday += transaction.amount;
        }

        if (isThisMonth) {
          acc.thisMonth += transaction.amount;
        }

        return acc;
      },
      {today: 0, yesterday: 0, thisMonth: 0},
    );

    return {
      todaySpent: totals.today,
      yesterdaySpent: totals.yesterday,
      thisMonthSpent: totals.thisMonth,
    };
  }, [allTransactions]);

  const formatTodaySpent = Number.isInteger(todaySpent) ? todaySpent : todaySpent.toFixed(2);

  const formatYesterdaySpent = Number.isInteger(yesterdaySpent) ? yesterdaySpent : yesterdaySpent.toFixed(2);

  const formatThisMonthSpent = Number.isInteger(thisMonthSpent) ? thisMonthSpent : thisMonthSpent.toFixed(2);

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
    formatThisMonthSpent,
  };
};

export default useHome;
