import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {fetchDebtsByDebtor, selectDebtData, selectDebtError, selectDebtLoading} from '../../redux/slice/debtDataSlice';
import {goBack, navigate} from '../../utils/navigationUtils';
import {deleteAllDebtsByDebtorId, deleteDebtById, deleteDebtorById} from '../../watermelondb/services';
import {fetchAllDebts} from '../../redux/slice/allDebtDataSlice';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {fetchDebtors} from '../../redux/slice/debtorDataSlice';
import {sortByDateDesc} from '../../utils/dateUtils';
import {DebtData as DebtDocType} from '../../watermelondb/services';
import useAmountColor from '../../hooks/useAmountColor';
import {fetchIndividualDebtor, selectIndividualDebtorData} from '../../redux/slice/IndividualDebtorSlice';
import {AppDispatch} from '../../redux/store';

export type IndividualDebtsScreenRouteProp = RouteProp<
  {
    IndividualDebtsScreen: {
      debtorName: string;
      debtorId: string;
      debtorType: string;
    };
  },
  'IndividualDebtsScreen'
>;

const useIndividualDebts = (route: IndividualDebtsScreenRouteProp) => {
  const colors = useThemeColors();
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState(false);
  const individualDebts = (useSelector(selectDebtData) ?? []) as DebtDocType[];
  const debtLoading = useSelector(selectDebtLoading);
  const debtError = useSelector(selectDebtError);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const [paidToastVisible, setPaidToastVisible] = useState(false);
  const [deleteDebtorVisible, setDeleteDebtorVisible] = useState(false);
  const {debtorId = '', debtorType = ''} = route.params ?? {};
  const individualDebtor = useSelector(selectIndividualDebtorData);
  const debtorName = individualDebtor?.title;

  const {sortedDebts, sortedBorrowings, sortedLendings, totalBorrowings, totalLendings, debtorTotal} = useMemo(() => {
    const sorted = sortByDateDesc(individualDebts);
    const borrowings = sorted.filter((debt: DebtDocType) => debt.type === 'Borrow');
    const lendings = sorted.filter((debt: DebtDocType) => debt.type === 'Lend');

    const borrowingsTotal = borrowings.reduce((total: number, debt: DebtDocType) => total + debt.amount, 0);
    const lendingsTotal = lendings.reduce((total: number, debt: DebtDocType) => total + debt.amount, 0);

    return {
      sortedDebts: sorted,
      sortedBorrowings: borrowings,
      sortedLendings: lendings,
      totalBorrowings: borrowingsTotal,
      totalLendings: lendingsTotal,
      debtorTotal: borrowingsTotal - lendingsTotal,
    };
  }, [individualDebts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const debtorTotalColor = useAmountColor(debtorTotal);

  const handleEditDebt = useCallback(
    (debtId: string, debtDescription: string, amount: number, debtDate: string, debtType: string) => {
      navigate('UpdateDebtScreen', {
        debtId,
        debtDescription,
        amount,
        debtorName,
        debtDate,
        debtorId,
        debtType,
      });
    },
    [debtorId, debtorName],
  );

  const handleDeleteDebt = useCallback(
    async (debtId: string) => {
      await deleteDebtById(debtId);
      dispatch(fetchDebtsByDebtor(debtorId));
      dispatch(fetchAllDebts());
      setRefreshing(true);
    },
    [debtorId, dispatch],
  );

  const handleDeleteDebtor = useCallback(async () => {
    if (individualDebts.length === 0) {
      await deleteDebtorById(debtorId);
      dispatch(fetchDebtors());
      goBack();
    } else {
      setDeleteDebtorVisible(true);
    }
  }, [debtorId, dispatch, individualDebts.length]);

  const handleMarkAsPaid = useCallback(() => {
    setPaidToastVisible(true);
  }, []);

  const handleOk = useCallback(async () => {
    await deleteAllDebtsByDebtorId(debtorId);
    dispatch(fetchDebtsByDebtor(debtorId));
    dispatch(fetchAllDebts());
    setPaidToastVisible(false);
  }, [debtorId, dispatch]);

  const handleDeleteOk = useCallback(() => {
    setPaidToastVisible(true);
    setDeleteDebtorVisible(false);
  }, []);

  const handleCancel = useCallback(() => {
    setPaidToastVisible(false);
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDebtorVisible(false);
  }, []);

  const handleUpdateDebtor = useCallback(() => {
    navigate('UpdateDebtorScreen', {debtorId, debtorName, debtorType});
  }, [debtorId, debtorName, debtorType]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchDebtsByDebtor(debtorId));
      dispatch(fetchIndividualDebtor(debtorId));
    }, [debtorId, dispatch]),
  );

  useEffect(() => {
    if (refreshing) {
      dispatch(fetchDebtsByDebtor(debtorId));
      dispatch(fetchIndividualDebtor(debtorId));
      setRefreshing(false);
    }
  }, [dispatch, debtorId, refreshing]);

  return {
    colors,
    refreshing,
    debtLoading,
    debtError,
    debtorName,
    debtorId,
    debtorTotal,
    onRefresh,
    handleEditDebt,
    handleDeleteDebt,
    currencySymbol,
    handleDeleteDebtor,
    handleMarkAsPaid,
    handleUpdateDebtor,
    sortedDebts,
    sortedBorrowings,
    sortedLendings,
    debtorTotalColor,
    totalBorrowings,
    totalLendings,
    paidToastVisible,
    handleOk,
    handleCancel,
    deleteDebtorVisible,
    handleDeleteOk,
    handleDeleteCancel,
  };
};

export default useIndividualDebts;
