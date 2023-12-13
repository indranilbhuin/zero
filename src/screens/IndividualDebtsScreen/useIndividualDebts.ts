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
  console.log('all debtsss', individualDebtsCopy);
  const debtLoading = useSelector(selectDebtLoading);
  const debtError = useSelector(selectDebtError);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const {debtorName, debtorId, debtorType} = route.params;

  const debtorTotal = individualDebtsCopy.reduce(
    (total: number, debt: {amount: number}) => total + debt.amount,
    0,
  );

  console.log(debtorId);

  console.log(route.params);

  const onRefresh = () => {
    setRefreshing(true);
  };

  const handleEditDebt = (
    debtId: string,
    debtDescription: string,
    amount: number,
    debtDate: Date,
  ) => {
    navigate('UpdateDebtScreen', {
      debtId,
      debtDescription,
      amount,
      debtorName,
      debtDate,
      debtorId,
    });
  };

  const handleDeleteDebt = (debtId: string) => {
    deleteDebtById(Realm.BSON.ObjectID.createFromHexString(debtId));
    dispatch(getDebtRequest(debtorId));
    dispatch(getAllDebtRequest());
    setRefreshing(true);
  };

  const handleDeleteDebtor = () => {
    deleteDebtorById(Realm.BSON.ObjectID.createFromHexString(debtorId));
    dispatch({type: FETCH_ALL_DEBTOR_DATA});
    goBack();
  };

  const handleMarkAsPaid = () => {
    deleteAllDebtsbyDebtorId(Realm.BSON.ObjectID.createFromHexString(debtorId));
    dispatch(getDebtRequest(debtorId));
    dispatch(getAllDebtRequest());
  };

  const handleUpdateDebtor = () => {
    navigate('UpdateDebtorScreen', {debtorId, debtorName, debtorType});
  };

  useEffect(() => {
    dispatch(getDebtRequest(debtorId));
  }, [debtorId]);

  useEffect(() => {
    if (refreshing) {
      dispatch(getDebtRequest(debtorId));
      setRefreshing(false);
    }
  }, [refreshing]);

  return {
    colors,
    refreshing,
    setRefreshing,
    individualDebts,
    individualDebtsCopy,
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
  };
};

export default useIndividualDebts;
