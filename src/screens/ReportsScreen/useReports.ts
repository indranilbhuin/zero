import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  getCurrentYear,
  getCurrentMonthName,
  getWeekdayShortNames,
  getYear,
  getMonthName,
  getDaysInMonth,
} from '../../utils/dateUtils';

const DAY_NAMES = getWeekdayShortNames();
import {fetchExpenses, selectExpenseData} from '../../redux/slice/expenseDataSlice';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {ExpenseData as ExpenseDocType} from '../../watermelondb/services';
import {AppDispatch} from '../../redux/store';

interface TransactionWithCategory extends ExpenseDocType {
  category?: {
    name?: string;
    icon?: string;
    color?: string;
  };
}

const useReports = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthName());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const allTransactions = useSelector(selectExpenseData) as TransactionWithCategory[];
  const currencySymbol = useSelector(selectCurrencySymbol);

  const filteredTransactions = useMemo(() => {
    const filtered = allTransactions?.filter((item: TransactionWithCategory) => {
      const transactionYear = getYear(item.date);
      const transactionMonth = getMonthName(item.date);
      return transactionYear === selectedYear && (!selectedMonth || transactionMonth === selectedMonth);
    });
    return filtered?.length > 0 ? filtered : [];
  }, [allTransactions, selectedYear, selectedMonth]);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleYearPicker = useCallback(() => {
    setShowYearPicker(true);
  }, []);

  const handleYearPickerClose = useCallback(() => {
    setShowYearPicker(false);
  }, []);

  const years = useMemo(() => Array.from({length: 101}, (_, index) => 2000 + index), []);

  const handleYearSelect = useCallback((year: number) => {
    setSelectedYear(year);
    setShowYearPicker(false);
  }, []);

  const handleMonthSelect = useCallback((month: string) => {
    setSelectedMonth(month);
  }, []);

  const totalAmountForMonth = useMemo(
    () => filteredTransactions.reduce((sum, transaction: TransactionWithCategory) => sum + transaction.amount, 0),
    [filteredTransactions],
  );

  const daysInMonth = useMemo(() => getDaysInMonth(selectedYear, selectedMonth), [selectedYear, selectedMonth]);

  return {
    colors,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    showYearPicker,
    setShowYearPicker,
    filteredTransactions,
    allTransactions,
    currencySymbol,
    dayNames: DAY_NAMES,
    handleYearPicker,
    handleYearPickerClose,
    years,
    handleYearSelect,
    handleMonthSelect,
    totalAmountForMonth,
    daysInMonth,
  };
};

export default useReports;
