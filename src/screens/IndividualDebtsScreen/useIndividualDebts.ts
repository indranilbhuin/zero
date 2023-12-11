import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {useEffect, useState} from 'react';
import {
  getDebtRequest,
  selectDebtData,
  selectDebtError,
  selectDebtLoading,
} from '../../redux/slice/debtDataSlice';
import {navigate} from '../../utils/navigationUtils';
import {deleteDebtById} from '../../services/DebtService';
import {getAllDebtRequest} from '../../redux/slice/allDebtDataSlice';
import {RouteProp} from '@react-navigation/native';

export type IndividualDebtsScreenRouteProp = RouteProp<
  {
    IndividualDebtsScreen: {
      debtorName: string;
      debtorId: string;
      debtorTotal: number;
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
  const debtLoading = useSelector(selectDebtLoading);
  const debtError = useSelector(selectDebtError);
  const {debtorName, debtorId, debtorTotal} = route.params;
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
  };
};

export default useIndividualDebts;
