import React, {useState, memo, useCallback} from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import AppHeader from '../../components/atoms/AppHeader';
import CustomInput from '../../components/atoms/CustomInput';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import PrimaryView from '../../components/atoms/PrimaryView';
import {goBack} from '../../utils/navigationUtils';
import useThemeColors from '../../hooks/useThemeColors';
import {createDebt, updateDebtById} from '../../watermelondb/services';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {fetchAllDebts} from '../../redux/slice/allDebtDataSlice';
import {fetchDebtsByDebtor} from '../../redux/slice/debtDataSlice';
import DatePicker from '../atoms/DatePicker';
import {DebtsScreenProp} from '../../screens/AddDebtsScreen';
import {getISODateTime} from '../../utils/dateUtils';
import {expenseAmountSchema, expenseSchema} from '../../utils/validationSchema';
import PrimaryText from '../atoms/PrimaryText';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import {AppDispatch} from '../../redux/store';
import {gs} from '../../styles/globalStyles';

interface DebtEntryProps {
  buttonText: string;
  route: DebtsScreenProp;
}

const DebtEntry: React.FC<DebtEntryProps> = ({buttonText, route}) => {
  const colors = useThemeColors();
  const dispatch = useDispatch<AppDispatch>();
  const currencySymbol = useSelector(selectCurrencySymbol);
  const {debtId, debtDescription, amount, debtorName, debtDate, debtorId, debtType} = route.params;
  const isAddButton = buttonText === 'Add';
  const [hasInteracted, setHasInteracted] = useState(false);
  const [debtName, setDebtName] = useState(isAddButton ? '' : debtDescription);
  const [debtAmount, setDebtAmount] = useState(isAddButton ? '' : String(amount));
  const [createdAt, setCreatedAt] = useState(isAddButton ? getISODateTime() : debtDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [debtsType, setDebtsType] = useState(isAddButton ? 'Borrow' : debtType);
  const userId = useSelector(selectUserId);

  const debtAmountError = hasInteracted ? expenseAmountSchema?.safeParse(Number(debtAmount)).error?.issues || [] : [];

  const isValid =
    expenseSchema.safeParse(debtName).success && expenseAmountSchema.safeParse(Number(debtAmount)).success;

  const handleAddDebt = useCallback(async () => {
    if (!isValid) {
      return;
    }
    try {
      await createDebt(userId, Number(debtAmount), debtName, debtorId, createdAt, debtsType);
      dispatch(fetchAllDebts());
      dispatch(fetchDebtsByDebtor(debtorId));
      goBack();
    } catch (error) {
      if (__DEV__) {
        console.error('Error creating debt:', error);
      }
    }
  }, [isValid, userId, debtAmount, debtName, debtorId, createdAt, debtsType, dispatch]);

  const handleUpdateDebt = useCallback(async () => {
    if (!isValid) {
      return;
    }
    try {
      await updateDebtById(debtId, debtorId, Number(debtAmount), debtDescription, createdAt, debtsType);

      dispatch(fetchAllDebts());
      dispatch(fetchDebtsByDebtor(debtorId));
      goBack();
    } catch (error) {
      if (__DEV__) {
        console.error('Error updating debt:', error);
      }
    }
  }, [isValid, debtId, debtorId, debtAmount, debtDescription, createdAt, debtsType, dispatch]);

  const handleTextInputFocus = useCallback(() => {
    setHasInteracted(true);
  }, []);

  return (
    <PrimaryView colors={colors} style={gs.justifyBetween} dismissKeyboardOnTouch>
      <View>
        <View style={[gs.mb20, gs.mt20]}>
          <AppHeader onPress={goBack} colors={colors} text={`${buttonText} Debt ◦ ${debtorName}`} />
        </View>
        <View style={[gs.row, gs.wFull, gs.center, gs.mb15]}>
          <TouchableOpacity
            onPress={() => setDebtsType('Borrow')}
            style={[
              gs.h40,
              gs.p3,
              gs.rounded5,
              gs.border2,
              gs.center,
              {
                backgroundColor: debtsType === 'Borrow' ? colors.accentOrange : colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
                width: '48.5%',
                height: 50,
              },
            ]}>
            <PrimaryText
              size={13}
              weight="semibold"
              color={debtsType === 'Borrow' ? colors.buttonText : colors.primaryText}>
              Borrowing from
            </PrimaryText>
            <PrimaryText
              size={13}
              weight="semibold"
              color={debtsType === 'Borrow' ? colors.buttonText : colors.primaryText}>
              {debtorName}
            </PrimaryText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDebtsType('Lend')}
            style={[
              gs.h40,
              gs.p3,
              gs.rounded5,
              gs.border2,
              gs.center,
              {
                backgroundColor: debtsType === 'Lend' ? colors.accentGreen : colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
                width: '48.5%',
                height: 50,
              },
            ]}>
            <PrimaryText
              size={13}
              weight="semibold"
              color={debtsType === 'Lend' ? colors.buttonText : colors.primaryText}>
              Lending to
            </PrimaryText>
            <PrimaryText
              size={13}
              weight="semibold"
              color={debtsType === 'Lend' ? colors.buttonText : colors.primaryText}>
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
        <PrimaryText style={gs.mb5}>{debtsType} Amount</PrimaryText>

        <View
          style={[
            gs.h48,
            gs.itemsCenter,
            gs.border2,
            gs.mt5,
            gs.rounded10,
            gs.pl10,
            gs.justifyStart,
            gs.row,
            {
              borderColor: colors.secondaryContainerColor,
              backgroundColor: colors.secondaryAccent,
              marginBottom: debtAmountError.length > 0 ? 5 : 15,
            },
          ]}>
          <PrimaryText size={15}>{currencySymbol}</PrimaryText>
          <TextInput
            style={[gs.px15, gs.h48, gs.wFull, gs.fontMedium, gs.noFontPadding, {color: colors.primaryText}]}
            value={debtAmount}
            onChangeText={setDebtAmount}
            placeholder={'eg. 200'}
            onChange={handleTextInputFocus}
            placeholderTextColor={colors.secondaryText}
            keyboardType="numeric"
          />
        </View>
        {debtAmountError.length > 0 && (
          <View style={gs.mb10}>
            {debtAmountError.map((error: {message: string}) => (
              <View key={error.message}>
                <PrimaryText size={12} color={colors.accentRed}>
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

      <View style={gs.mb10p}>
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

export default memo(DebtEntry);
