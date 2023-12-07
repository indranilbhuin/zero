import {useDispatch} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {updateDebtById} from '../../services/DebtService';
import {useState} from 'react';
import moment from 'moment';
import {getAllDebtRequest} from '../../redux/slice/allDebtDataSlice';
import {getDebtRequest} from '../../redux/slice/debtDataSlice';
import {goBack} from '../../utils/navigationUtils';

const useUpdateDebt = route => {
  const colors = useThemeColors();
  const dispatch = useDispatch();

  const {debtId, debtDescription, amount, debtorName, debtDate, debtorId} =
    route.params;

  const [debtName, setDebtName] = useState(debtDescription);
  const [debtAmount, setDebtAmount] = useState(String(amount));
  const [createdAt, setCreatedAt] = useState(new Date(debtDate));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || createdAt;
    const utcDate = moment(currentDate).utc().toDate();
    setCreatedAt(utcDate);
    setShowDatePicker(false);
  };

  const handleUpdateDebt = () => {
    if (debtName.trim() === '' || debtAmount === null) {
      return;
    }
    try {
      updateDebtById(
        Realm.BSON.ObjectID.createFromHexString(debtId),
        Realm.BSON.ObjectID.createFromHexString(debtorId),
        Number(debtAmount),
        debtDescription,
        createdAt,
      );

      dispatch(getAllDebtRequest());
      dispatch(getDebtRequest(debtorId));
      goBack();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  return {
    colors,
    debtorName,
    debtName,
    setDebtName,
    debtAmount,
    setDebtAmount,
    createdAt,
    showDatePicker,
    setShowDatePicker,
    handleDateChange,
    handleUpdateDebt,
  };
};

export default useUpdateDebt;
