import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {useEffect, useState} from 'react';
import {
  getDebtRequest,
  selectDebtData,
  selectDebtError,
  selectDebtLoading,
} from '../../redux/slice/debtDataSlice';
import {goBack, navigate} from '../../utils/navigationUtils';
import {
  deleteAllDebtsbyDebtorId,
  deleteDebtById,
} from '../../services/DebtService';
import {getAllDebtRequest} from '../../redux/slice/allDebtDataSlice';
import {RouteProp} from '@react-navigation/native';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {deleteDebtorById} from '../../services/DebtorService';
import {FETCH_ALL_DEBTOR_DATA} from '../../redux/actionTypes';
import moment from 'moment';
import Debt from '../../schemas/DebtSchema';
import useAmountColor from '../../hooks/useAmountColor';
import {
  getIndividualDebtorRequest,
  selectIndividualDebtorData,
} from '../../redux/slice/IndividualDebtorSlice';

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
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const individualDebts = useSelector(selectDebtData);
  const individualDebtsCopy = JSON.parse(JSON.stringify(individualDebts));
  const sortedDebts = individualDebtsCopy.sort(
    (a: {date: moment.MomentInput}, b: {date: moment.MomentInput}) =>
      moment(b.date).diff(moment(a.date)),
  );
  console.log('all debtsss', individualDebtsCopy);
  const debtLoading = useSelector(selectDebtLoading);
  const debtError = useSelector(selectDebtError);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const [paidToastVisible, setPaidToastVisible] = useState(false);
  const [deleteDebtorVisible, setDeleteDebtorVisible] = useState(false);
  const {debtorId, debtorType} = route.params;
  const individualDebtor = useSelector(selectIndividualDebtorData);
  console.log('individuallll', individualDebtor);
  const debtorName = individualDebtor?.title;

  const borrowings = individualDebtsCopy.filter(
    (debt: Debt) => debt.type === 'Borrow',
  );
  const lendings = individualDebtsCopy.filter(
    (debt: Debt) => debt.type === 'Lend',
  );

  console.log('first', borrowings);
  console.log('second', lendings);

  const sortedBorrowings = borrowings.sort(
    (a: {date: moment.MomentInput}, b: {date: moment.MomentInput}) =>
      moment(b.date).diff(moment(a.date)),
  );

  const sortedLendings = lendings.sort(
    (a: {date: moment.MomentInput}, b: {date: moment.MomentInput}) =>
      moment(b.date).diff(moment(a.date)),
  );

  const totalBorrowings = borrowings.reduce(
    (total: number, debt: {amount: number}) => total + debt.amount,
    0,
  );

  const totalLendings = lendings.reduce(
    (total: number, debt: {amount: number}) => total + debt.amount,
    0,
  );
  console.log('firstttttt', totalBorrowings, totalLendings);
  const debtorTotal = totalBorrowings - totalLendings;

  const onRefresh = () => {
    setRefreshing(true);
  };

  const debtorTotalColor = useAmountColor(debtorTotal);

  const handleEditDebt = (
    debtId: string,
    debtDescription: string,
    amount: number,
    debtDate: string,
    debtType: string,
  ) => {
    navigate('UpdateDebtScreen', {
      debtId,
      debtDescription,
      amount,
      debtorName,
      debtDate,
      debtorId,
      debtType,
    });
  };

  const handleDeleteDebt = (debtId: string) => {
    deleteDebtById(Realm.BSON.ObjectID.createFromHexString(debtId));
    dispatch(getDebtRequest(debtorId));
    dispatch(getAllDebtRequest());
    setRefreshing(true);
  };

  const handleDeleteDebtor = () => {
    if (individualDebtsCopy.length === 0) {
      deleteDebtorById(Realm.BSON.ObjectID.createFromHexString(debtorId));
      dispatch({type: FETCH_ALL_DEBTOR_DATA});
      goBack();
    } else {
      setDeleteDebtorVisible(true);
    }
  };

  const handleMarkAsPaid = () => {
    setPaidToastVisible(true);
  };

  const handleOk = () => {
    deleteAllDebtsbyDebtorId(Realm.BSON.ObjectID.createFromHexString(debtorId));
    dispatch(getDebtRequest(debtorId));
    dispatch(getAllDebtRequest());
    setPaidToastVisible(false);
  };

  const handleDeleteOk = () => {
    setPaidToastVisible(true);
    setDeleteDebtorVisible(false);
  };

  const handleCancel = () => {
    setPaidToastVisible(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDebtorVisible(false);
  };
  const handleUpdateDebtor = () => {
    navigate('UpdateDebtorScreen', {debtorId, debtorName, debtorType});
  };

  useEffect(() => {
    dispatch(getDebtRequest(debtorId));
    dispatch(
      getIndividualDebtorRequest(
        Realm.BSON.ObjectID.createFromHexString(debtorId),
      ),
    );
  }, [debtorId]);

  useEffect(() => {
    if (refreshing) {
      dispatch(getDebtRequest(debtorId));
      dispatch(getIndividualDebtorRequest(debtorId));
      setRefreshing(false);
    }
  }, [refreshing]);

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
