import moment from 'moment';
import useThemeColors from '../../hooks/useThemeColors';
import {useSelector} from 'react-redux';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {RouteProp} from '@react-navigation/native';
import Expense from '../../schemas/ExpenseSchema';

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
  const transactions = route.params.dayTransactions;
  const date = transactions[0]?.date;
  const noTransactionDate = route.params.isDate;
  const formattedDate = moment(date).format('MMM Do YY');
  const formatDate = moment(noTransactionDate).format('MMM Do YY');
  const colors = useThemeColors();
  const currencySymbol = useSelector(selectCurrencySymbol);

  return {
    transactions,
    formatDate,
    formattedDate,
    colors,
    currencySymbol,
    date,
    noTransactionDate,
  };
};

export default useEverydayTransaction;
