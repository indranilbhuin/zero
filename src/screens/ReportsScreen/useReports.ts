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
  DateInput,
} from '../../utils/dateUtils';
import {
  getExpenseRequest,
  selectExpenseData,
} from '../../redux/slice/expenseDataSlice';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {ExpenseData as ExpenseDocType} from '../../watermelondb/services';

// Extended type for expenses with optional category info
interface TransactionWithCategory extends ExpenseDocType {
  category?: {
    name?: string;
    icon?: string;
    color?: string;
  };
}

const useReports = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthName());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionWithCategory[]>([]);
  const allTransactions = useSelector(selectExpenseData);
  const currencySymbol = useSelector(selectCurrencySymbol);

  const dayNames = getWeekdayShortNames();

  // Memoize to prevent infinite re-renders
  const allTransactionsCopy = useMemo(
    () => JSON.parse(JSON.stringify(allTransactions)),
    [allTransactions],
  );

  const filterTransactions = useCallback(
    (year: number, month: string) => {
      const filtered = allTransactionsCopy?.filter(
        (item: {date: DateInput}) => {
          const transactionYear = getYear(item.date);
          const transactionMonth = getMonthName(item.date);
          return (
            transactionYear === year && (!month || transactionMonth === month)
          );
        },
      );

      setFilteredTransactions(filtered?.length > 0 ? filtered : []);
    },
    [allTransactionsCopy],
  );

  useEffect(() => {
    dispatch(getExpenseRequest());
  }, [dispatch]);

  useEffect(() => {
    filterTransactions(selectedYear, selectedMonth);
  }, [filterTransactions, selectedYear, selectedMonth]);

  const handleYearPicker = () => {
    setShowYearPicker(true);
  };

  const handleYearPickerClose = () => {
    setShowYearPicker(false);
  };

  const years = Array.from({length: 101}, (_, index) => 2000 + index);
  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setShowYearPicker(false);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
  };

  const totalAmountForMonth = filteredTransactions.reduce(
    (sum, transaction: {amount: number}) => sum + transaction.amount,
    0,
  );

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  return {
    colors,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    showYearPicker,
    setShowYearPicker,
    filterTransactions,
    filteredTransactions,
    setFilteredTransactions,
    allTransactionsCopy,
    currencySymbol,
    dayNames,
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
