import {useCallback, useEffect, useMemo, useState} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchExpensesByMonth,
  invalidateExpenseCache,
  selectExpenseData,
  selectExpenseError,
  selectExpenseLoading,
} from '../../redux/slice/expenseDataSlice';
import {selectMonthIndex, selectYear, setMonthSelection} from '../../redux/slice/monthSelectionSlice';
import {selectUserName} from '../../redux/slice/userNameSlice';
import {fetchUserData, selectUserId} from '../../redux/slice/userIdSlice';
import {fetchCurrency, selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {fetchCategories} from '../../redux/slice/categoryDataSlice';
import {getCurrentYear, getMonthNumber, getMonthNames, sortByDateDesc} from '../../utils/dateUtils';
import {ExpenseData as Expense} from '../../watermelondb/services';
import {AppDispatch} from '../../redux/store';
import {loadAvailableYears} from '../../utils/availableYearsCache';

const MONTHS = getMonthNames();
const CURRENT_YEAR = getCurrentYear();
const CURRENT_MONTH_INDEX = new Date().getMonth();

const useHome = () => {
  const colors = useThemeColors();
  const [refreshing, setRefreshing] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([CURRENT_YEAR]);

  const dispatch = useDispatch<AppDispatch>();

  const selectedMonthIndex = useSelector(selectMonthIndex);
  const selectedYear = useSelector(selectYear);

  const allTransactions = useSelector(selectExpenseData) ?? [];
  const sortedTransactions = useMemo(() => sortByDateDesc(allTransactions as Expense[]), [allTransactions]);

  const expenseLoading = useSelector(selectExpenseLoading);
  const expenseError = useSelector(selectExpenseError);
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const currencySymbol = useSelector(selectCurrencySymbol);

  const selectedMonthName = MONTHS[selectedMonthIndex];
  const yearMonth = `${selectedYear}-${getMonthNumber(selectedMonthName)}`;

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCurrency());
      dispatch(fetchCategories());
      loadAvailableYears(userId).then(years => {
        if (years.length > 0) {
          setAvailableYears(years);
        }
      });
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchExpensesByMonth(yearMonth));
    }
  }, [dispatch, userId, yearMonth]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    if (refreshing) {
      dispatch(invalidateExpenseCache());
      dispatch(fetchExpensesByMonth(yearMonth));
      setRefreshing(false);
    }
  }, [dispatch, refreshing, yearMonth]);

  const {totalSpent, transactionCount, avgPerDay} = useMemo(() => {
    const total = (allTransactions ?? []).reduce((sum: number, t: Expense) => sum + t.amount, 0);
    const count = (allTransactions ?? []).length;
    const daysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
    const isCurrentMonth = selectedYear === CURRENT_YEAR && selectedMonthIndex === CURRENT_MONTH_INDEX;
    const daysElapsed = isCurrentMonth ? new Date().getDate() : daysInMonth;
    const avg = daysElapsed > 0 ? total / daysElapsed : 0;

    return {totalSpent: total, transactionCount: count, avgPerDay: avg};
  }, [allTransactions, selectedYear, selectedMonthIndex]);

  const handleMonthYearSelect = useCallback(
    (monthIndex: number, year: number) => {
      dispatch(setMonthSelection({monthIndex, year}));
    },
    [dispatch],
  );

  return {
    colors,
    refreshing,
    allTransactions,
    expenseLoading,
    expenseError,
    userName,
    userId,
    currencySymbol,
    onRefresh,
    sortedTransactions,
    selectedYear,
    selectedMonthIndex,
    selectedMonthName,
    yearMonth,
    availableYears,
    totalSpent,
    transactionCount,
    avgPerDay,
    handleMonthYearSelect,
  };
};

export default useHome;
