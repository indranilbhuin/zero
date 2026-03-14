import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  getCurrentYear,
  getWeekdayShortNames,
  getDaysInMonth,
  getMonthNumber,
  getMonthNames,
} from '../../utils/dateUtils';

const DAY_NAMES = getWeekdayShortNames();
const MONTHS = getMonthNames();

import {fetchExpensesByMonth, selectExpenseData} from '../../redux/slice/expenseDataSlice';
import {selectMonthIndex, selectYear, setMonthSelection} from '../../redux/slice/monthSelectionSlice';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {ExpenseData as ExpenseDocType} from '../../watermelondb/services';
import {AppDispatch} from '../../redux/store';
import {loadAvailableYears} from '../../utils/availableYearsCache';

interface TransactionWithCategory extends ExpenseDocType {
  category?: {
    name?: string;
    icon?: string;
    color?: string;
  };
}

const CURRENT_YEAR = getCurrentYear();

const useReports = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch<AppDispatch>();
  const [availableYears, setAvailableYears] = useState<number[]>([CURRENT_YEAR]);

  const selectedMonthIndex = useSelector(selectMonthIndex);
  const selectedYear = useSelector(selectYear);
  const selectedMonth = MONTHS[selectedMonthIndex];

  const filteredTransactions = (useSelector(selectExpenseData) ?? []) as TransactionWithCategory[];
  const currencySymbol = useSelector(selectCurrencySymbol);
  const userId = useSelector(selectUserId);

  const yearMonth = `${selectedYear}-${getMonthNumber(selectedMonth)}`;

  useEffect(() => {
    if (userId) {
      loadAvailableYears(userId).then(years => {
        if (years.length > 0) {
          setAvailableYears(years);
        }
      });
    }
  }, [userId]);

  useEffect(() => {
    dispatch(fetchExpensesByMonth(yearMonth));
  }, [dispatch, yearMonth]);

  const handleMonthYearSelect = useCallback(
    (monthIndex: number, year: number) => {
      dispatch(setMonthSelection({monthIndex, year}));
    },
    [dispatch],
  );

  const handleMonthSelect = useCallback(
    (month: string) => {
      const monthIdx = MONTHS.indexOf(month);
      if (monthIdx >= 0) {
        dispatch(setMonthSelection({monthIndex: monthIdx, year: selectedYear}));
      }
    },
    [dispatch, selectedYear],
  );

  const totalAmountForMonth = useMemo(
    () => (filteredTransactions ?? []).reduce((sum: number, transaction: TransactionWithCategory) => sum + transaction.amount, 0),
    [filteredTransactions],
  );

  const daysInMonth = useMemo(() => getDaysInMonth(selectedYear, selectedMonth), [selectedYear, selectedMonth]);

  return {
    colors,
    selectedYear,
    selectedMonth,
    filteredTransactions,
    currencySymbol,
    dayNames: DAY_NAMES,
    availableYears,
    handleMonthYearSelect,
    handleMonthSelect,
    totalAmountForMonth,
    daysInMonth,
  };
};

export default useReports;
