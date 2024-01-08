import moment from 'moment';
import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {RouteProp} from '@react-navigation/native';
import Expense from '../../schemas/ExpenseSchema';
import {useEffect} from 'react';
import {
  getEverydayExpenseRequest,
  selectEverydayExpenseData,
} from '../../redux/slice/everydayExpenseDataSlice';

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
  const dispatch = useDispatch();
  const allEverdayTransaction = useSelector(selectEverydayExpenseData);
  const allEverdayTransactionCopy = JSON.parse(
    JSON.stringify(allEverdayTransaction),
  );
  const expenseDate = route.params.isDate;
  console.log('no ', expenseDate);
  const formattedDate = moment(expenseDate).format('MMM Do YY');
  const formatDate = moment(expenseDate).format('MMM Do YY');
  const colors = useThemeColors();
  const currencySymbol = useSelector(selectCurrencySymbol);

  useEffect(() => {
    dispatch(getEverydayExpenseRequest(expenseDate));
  }, [expenseDate]);

  const totalAmountForTheDay = allEverdayTransactionCopy.reduce(
    (sum: number, transaction: {amount: number}) => sum + transaction.amount,
    0,
  );

  return {
    formatDate,
    formattedDate,
    colors,
    currencySymbol,
    expenseDate,
    allEverdayTransaction,
    allEverdayTransactionCopy,
    totalAmountForTheDay
  };
};

export default useEverydayTransaction;
