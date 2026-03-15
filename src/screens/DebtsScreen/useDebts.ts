import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {fetchDebtors, selectDebtorData} from '../../redux/slice/debtorDataSlice';
import {fetchAllDebts, selectAllDebtData} from '../../redux/slice/allDebtDataSlice';
import {useCallback, useMemo, useState} from 'react';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {DebtorData as Debtor, DebtData as Debt} from '../../watermelondb/services';
import {AppDispatch} from '../../redux/store';
import {useFocusEffect} from '@react-navigation/native';

interface DebtWithDebtor extends Debt {
  debtor?: {type: string};
}

const useDebts = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch<AppDispatch>();
  const debtors = useSelector(selectDebtorData) as Debtor[];
  const allDebts = useSelector(selectAllDebtData) as DebtWithDebtor[];
  const [debtorType, setDebtorType] = useState('Person');
  const currencySymbol = useSelector(selectCurrencySymbol);

  const {personDebtors, otherAccountsDebtors} = useMemo(
    () => ({
      personDebtors: debtors.filter((debtor: Debtor) => debtor.type === 'Person'),
      otherAccountsDebtors: debtors.filter((debtor: Debtor) => debtor.type !== 'Person'),
    }),
    [debtors],
  );

  const {totalDebts, personTotalDebts, otherTotalDebts} = useMemo(() => {
    let personBorrowings = 0;
    let personLendings = 0;
    let otherBorrowings = 0;
    let otherLendings = 0;

    allDebts.forEach((debt: DebtWithDebtor) => {
      const isPerson = debt?.debtor?.type === 'Person';
      if (debt.type === 'Borrow') {
        if (isPerson) {
          personBorrowings += debt.amount;
        } else {
          otherBorrowings += debt.amount;
        }
      } else {
        if (isPerson) {
          personLendings += debt.amount;
        } else {
          otherLendings += debt.amount;
        }
      }
    });

    return {
      totalDebts: personBorrowings + otherBorrowings - (personLendings + otherLendings),
      personTotalDebts: personBorrowings - personLendings,
      otherTotalDebts: otherBorrowings - otherLendings,
    };
  }, [allDebts]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchDebtors());
      dispatch(fetchAllDebts());
    }, [dispatch]),
  );

  return {
    colors,
    allDebts,
    debtorType,
    setDebtorType,
    currencySymbol,
    personDebtors,
    otherAccountsDebtors,
    totalDebts,
    personTotalDebts,
    otherTotalDebts,
    debtors,
  };
};

export default useDebts;
