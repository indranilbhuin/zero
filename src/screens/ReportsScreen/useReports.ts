import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {useEffect, useState} from 'react';
import moment from 'moment';
import {
  getExpenseRequest,
  selectExpenseData,
} from '../../redux/slice/expenseDataSlice';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';

const useReports = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState(Number(moment().format('YYYY')));
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'));
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const allTransactions = useSelector(selectExpenseData);
  const currencySymbol = useSelector(selectCurrencySymbol);

  const dayNames = moment.weekdaysShort();

  const allTransactionsCopy = JSON.parse(JSON.stringify(allTransactions));
  console.log('copy', allTransactionsCopy, 'real', allTransactions);

  const filterTransactions = (year: number, month: string) => {
    const filtered = allTransactionsCopy?.filter(
      (item: {date: moment.MomentInput}) => {
        const transactionYear = moment(item.date).year();
        const transactionMonth = moment(item.date).format('MMMM');
        return (
          transactionYear === year && (!month || transactionMonth === month)
        );
      },
    );

    setFilteredTransactions(filtered.length > 0 ? filtered : []);
  };

  console.log('this is filtered', filteredTransactions);

  useEffect(() => {
    dispatch(getExpenseRequest());
    filterTransactions(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth, allTransactionsCopy?.length]);

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

  const daysInMonth = moment(
    `${selectedYear}-${moment().month(selectedMonth).format('MM')}`,
    'YYYY-MM',
  ).daysInMonth();

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
