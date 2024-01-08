import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
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
import moment from 'moment';
import {expenseAmountSchema, expenseSchema} from '../../utils/validationSchema';
import textInputStyles from '../../styles/textInput';
import PrimaryText from '../atoms/PrimaryText';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import debtsStyles from '../../screens/DebtsScreen/style';

interface DebtEntryProps {
  buttonText: string;
  route: DebtsScreenProp;
}

const DebtEntry: React.FC<DebtEntryProps> = ({buttonText, route}) => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const currencySymbol = useSelector(selectCurrencySymbol);
  const {
    debtId,
    debtDescription,
    amount,
    debtorName,
    debtDate,
    debtorId,
    debtType,
  } = route.params;
  const isAddButton = buttonText === 'Add';
  console.log(isAddButton, route.params);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [debtName, setDebtName] = useState(isAddButton ? '' : debtDescription);
  const [debtAmount, setDebtAmount] = useState(
    isAddButton ? '' : String(amount),
  );
  const [createdAt, setCreatedAt] = useState(
    isAddButton ? moment().format('YYYY-MM-DDTHH:mm:ss') : debtDate,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [debtsType, setDebtsType] = useState(isAddButton ? 'Borrow' : debtType);
  const userId = useSelector(selectUserId);

  const debtAmountError = hasInteracted
    ? expenseAmountSchema?.safeParse(Number(debtAmount)).error?.errors || []
    : [];

  const isValid =
    expenseSchema.safeParse(debtName).success &&
    expenseAmountSchema.safeParse(Number(debtAmount)).success;
  console.log('debts', debtsType);

  const handleAddDebt = () => {
    if (!isValid) {
      return;
    }
    try {
      createDebt(
        Realm.BSON.ObjectID.createFromHexString(userId),
        Number(debtAmount),
        debtName,
        Realm.BSON.ObjectID.createFromHexString(debtorId),
        createdAt,
        debtsType,
      );
      dispatch(getAllDebtRequest());
      dispatch(getDebtRequest(debtorId));
      goBack();
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleUpdateDebt = () => {
    if (!isValid) {
      return;
    }
    try {
      updateDebtById(
        Realm.BSON.ObjectID.createFromHexString(debtId),
        Realm.BSON.ObjectID.createFromHexString(debtorId),
        Number(debtAmount),
        debtDescription,
        createdAt,
        debtsType,
      );

      dispatch(getAllDebtRequest());
      dispatch(getDebtRequest(debtorId));
      goBack();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleTextInputFocus = () => {
    setHasInteracted(true);
  };

  return (
    <PrimaryView colors={colors} style={{justifyContent: 'space-between'}}>
      <View>
        <View style={mainStyles.headerContainer}>
          <AppHeader
            onPress={goBack}
            colors={colors}
            text={`${buttonText} Debt ◦ ${debtorName}`}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 15,
          }}>
          <TouchableOpacity
            onPress={() => setDebtsType('Borrow')}
            style={[
              debtsStyles.categoryContainer,
              {
                backgroundColor:
                  debtsType === 'Borrow'
                    ? colors.accentOrange
                    : colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
                width: '48.5%',
                height: 50,
              },
            ]}>
            <PrimaryText
              style={{
                color:
                  debtsType === 'Borrow'
                    ? colors.buttonText
                    : colors.primaryText,
                fontSize: 13,
                fontFamily: 'FiraCode-SemiBold',
              }}>
              Borrowing from
            </PrimaryText>
            <PrimaryText
              style={{
                color:
                  debtsType === 'Borrow'
                    ? colors.buttonText
                    : colors.primaryText,
                fontSize: 13,
                fontFamily: 'FiraCode-SemiBold',
              }}>
              {debtorName}
            </PrimaryText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDebtsType('Lend')}
            style={[
              debtsStyles.categoryContainer,
              {
                backgroundColor:
                  debtsType === 'Lend'
                    ? colors.accentGreen
                    : colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
                width: '48.5%',
                height: 50,
              },
            ]}>
            <PrimaryText
              style={{
                color:
                  debtsType === 'Lend' ? colors.buttonText : colors.primaryText,
                fontSize: 13,
                fontFamily: 'FiraCode-SemiBold',
              }}>
              Lending to
            </PrimaryText>
            <PrimaryText
              style={{
                color:
                  debtsType === 'Lend' ? colors.buttonText : colors.primaryText,
                fontSize: 13,
                fontFamily: 'FiraCode-SemiBold',
              }}>
              {debtorName}
            </PrimaryText>
          </TouchableOpacity>
        </View>

        <CustomInput
          colors={colors}
          input={debtName}
          setInput={setDebtName}
          placeholder="eg. tea"
          label={`${debtsType} Title`}
          schema={expenseSchema}
        />
        <PrimaryText style={{marginBottom: 5}}>{debtsType} Amount</PrimaryText>

        <View
          style={[
            textInputStyles.textInputContainer,
            {
              borderColor: colors.secondaryContainerColor,
              backgroundColor: colors.secondaryAccent,
              marginBottom: debtAmountError.length > 0 ? 5 : 15,
            },
          ]}>
          <PrimaryText style={{fontSize: 15}}>{currencySymbol}</PrimaryText>
          <TextInput
            style={[
              textInputStyles.textInputWithIcon,
              {
                color: colors.primaryText,
              },
            ]}
            value={debtAmount}
            onChangeText={setDebtAmount}
            placeholder={'eg. 200'}
            onChange={handleTextInputFocus}
            placeholderTextColor={colors.secondaryText}
            keyboardType="numeric"
          />
        </View>
        {debtAmountError.length > 0 && (
          <View style={{marginBottom: 10}}>
            {debtAmountError.map(error => (
              <View key={error.message}>
                <PrimaryText style={{color: colors.accentRed, fontSize: 12}}>
                  {error.message}
                </PrimaryText>
              </View>
            ))}
          </View>
        )}
        <DatePicker
          setShowDatePicker={setShowDatePicker}
          createdAt={createdAt}
          showDatePicker={showDatePicker}
          setCreatedAt={setCreatedAt}
        />
      </View>

      <View style={{marginBottom: '10%'}}>
        <PrimaryButton
          onPress={isAddButton ? handleAddDebt : handleUpdateDebt}
          colors={colors}
          buttonTitle={buttonText}
          disabled={!isValid}
        />
      </View>
    </PrimaryView>
  );
};

export default DebtEntry;
