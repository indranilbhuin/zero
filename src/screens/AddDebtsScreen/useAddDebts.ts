import {useDispatch, useSelector} from 'react-redux';
import useThemeColors from '../../hooks/useThemeColors';
import {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {createDebt} from '../../services/DebtService';
import {getAllDebtRequest} from '../../redux/slice/allDebtDataSlice';
import {getDebtRequest} from '../../redux/slice/debtDataSlice';
import {goBack} from '../../utils/navigationUtils';
import moment from 'moment';

const useAddDebts = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const [debtName, setDebtName] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const route = useRoute();
  const userId = useSelector(selectUserId);
  const [createdAt, setCreatedAt] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {debtorName, debtorId} = route.params;
  console.log(debtorId);

  const handleAddDebt = () => {
    if (debtName.trim() === '' || debtAmount === null) {
      return;
    }
    try {
      createDebt(
        Realm.BSON.ObjectID.createFromHexString(userId),
        Number(debtAmount),
        debtName,
        Realm.BSON.ObjectID.createFromHexString(debtorId),
        createdAt,
      );
      dispatch(getAllDebtRequest());
      dispatch(getDebtRequest(debtorId));
      goBack();
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || createdAt;
    const utcDate = moment(currentDate).utc().toDate();
    setCreatedAt(utcDate);
    setShowDatePicker(false);
  };

  return {
    colors,
    debtName,
    setDebtName,
    debtAmount,
    setDebtAmount,
    showDatePicker,
    setShowDatePicker,
    createdAt,
    handleDateChange,
    handleAddDebt,
    debtorName
  };
};

export default useAddDebts;
