import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import AppHeader from '../../components/atoms/AppHeader';
import CustomInput from '../../components/atoms/CustomInput';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import PrimaryView from '../../components/atoms/PrimaryView';
import {goBack} from '../../utils/navigationUtils';
import useThemeColors from '../../hooks/useThemeColors';
import {createDebt, updateDebtById} from '../../services/DebtService';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {getAllDebtRequest} from '../../redux/slice/allDebtDataSlice';
import {getDebtRequest} from '../../redux/slice/debtDataSlice';
import mainStyles from '../../styles/main';
import DatePicker from '../atoms/DatePicker';
import {DebtsScreenProp} from '../../screens/AddDebtsScreen';

interface DebtEntryProps {
  buttonText: string;
  route: DebtsScreenProp;
}

const DebtEntry: React.FC<DebtEntryProps> = ({buttonText, route}) => {
  console.log('the app', route);
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const {debtId, debtDescription, amount, debtorName, debtDate, debtorId} =
    route.params;
  const isAddButton = buttonText === 'Add';
  console.log(isAddButton, route.params);
  const [debtName, setDebtName] = useState(isAddButton ? '' : debtDescription);
  const [debtAmount, setDebtAmount] = useState(
    isAddButton ? '' : String(amount),
  );
  const [createdAt, setCreatedAt] = useState(
    isAddButton ? new Date() : new Date(debtDate),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const userId = useSelector(selectUserId);

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

  return (
    <PrimaryView colors={colors}>
      <View style={mainStyles.headerContainer}>
        <AppHeader
          onPress={goBack}
          colors={colors}
          text={`${buttonText} Debt | ${debtorName}`}
        />
      </View>

      <CustomInput
        colors={colors}
        input={debtName}
        setInput={setDebtName}
        placeholder="eg. tea"
        label="Debt Title"
      />
      <CustomInput
        colors={colors}
        input={debtAmount}
        setInput={setDebtAmount}
        placeholder="eg. 20"
        label="Debt Amount"
      />
      <DatePicker
        setShowDatePicker={setShowDatePicker}
        createdAt={createdAt}
        showDatePicker={showDatePicker}
        setCreatedAt={setCreatedAt}
      />
      <View style={styles.submitButtonContainer}>
        <PrimaryButton
          onPress={isAddButton ? handleAddDebt : handleUpdateDebt}
          colors={colors}
          buttonTitle={buttonText}
        />
      </View>
    </PrimaryView>
  );
};

export default DebtEntry;

const styles = StyleSheet.create({
  submitButtonContainer: {
    marginTop: '100%',
    marginBottom: 15,
  },
});
