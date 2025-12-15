import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {selectDebtorData} from '../../redux/slice/debtorDataSlice';
import {
  getAllDebtRequest,
  selectAllDebtData,
} from '../../redux/slice/allDebtDataSlice';
import {useEffect, useState} from 'react';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {FETCH_ALL_DEBTOR_DATA} from '../../redux/actionTypes';
import Debtor from '../../schemas/DebtorSchema';
import Debt from '../../schemas/DebtSchema';

const useDebts = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const debtors = useSelector(selectDebtorData);
  const debtorsCopy = JSON.parse(JSON.stringify(debtors));
  console.log('this is debtors', debtorsCopy);
  const allDebts = useSelector(selectAllDebtData);
  const allDebtsCopy = JSON.parse(JSON.stringify(allDebts));
  const [debtorType, setDebtorType] = useState('Person');
  console.log('this is all debts copy', allDebtsCopy);
  console.log(debtorsCopy);
  const currencySymbol = useSelector(selectCurrencySymbol);

  const personDebtors = debtorsCopy.filter(
    (debtor: Debtor) => debtor.type === 'Person',
  );
  const otherAccountsDebtors = debtorsCopy.filter(
    (debtor: Debtor) => debtor.type !== 'Person',
  );

  const allBorrowings = allDebtsCopy.filter(
    (debt: Debt) => debt.type === 'Borrow',
  );
  const allLendings = allDebtsCopy.filter((debt: Debt) => debt.type === 'Lend');

  const allBorrowingsTotal = allBorrowings.reduce(
    (total: number, debt: {amount: number}) => total + debt.amount,
    0,
  );

  const allLendingsTotal = allLendings.reduce(
    (total: number, debt: {amount: number}) => total + debt.amount,
    0,
  );

  const totalDebts = allBorrowingsTotal - allLendingsTotal;

  let personTotalBorrowings = 0;
  let otherTotalBorrowings = 0;

  let personTotalLendings = 0;
  let otherTotalLendings = 0;

  allBorrowings.forEach((debt: {debtor: {type: string}; amount: number}) => {
    if (debt?.debtor?.type === 'Person') {
      personTotalBorrowings += debt.amount;
    } else {
      otherTotalBorrowings += debt.amount;
    }
  });

  allLendings.forEach((debt: {debtor: {type: string}; amount: number}) => {
    if (debt?.debtor?.type === 'Person') {
      personTotalLendings += debt.amount;
    } else {
      otherTotalLendings += debt.amount;
    }
  });

  let personTotalDebts = personTotalBorrowings - personTotalLendings;
  let otherTotalDebts = otherTotalBorrowings - otherTotalLendings;

  useEffect(() => {
    dispatch({type: FETCH_ALL_DEBTOR_DATA});
    dispatch(getAllDebtRequest());
  }, []);

  return {
    colors,
    allDebts,
    allDebtsCopy,
    debtorType,
    setDebtorType,
    currencySymbol,
    personDebtors,
    otherAccountsDebtors,
    totalDebts,
    personTotalDebts,
    otherTotalDebts,
    debtorsCopy,
  };
};

export default useDebts;
