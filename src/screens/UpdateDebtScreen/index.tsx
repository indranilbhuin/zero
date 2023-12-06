import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import AppHeader from '../../components/AppHeader';
import {goBack} from '../../utils/navigationUtils';
import useThemeColors from '../../hooks/useThemeColors';
import CustomInput from '../../components/CustomInput';
import Icon from '../../components/Icons';
import moment from 'moment';
import PrimaryButton from '../../components/PrimaryButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import {updateDebtById} from '../../services/DebtService';
import {getAllDebtRequest} from '../../redux/slice/allDebtDataSlice';
import {useDispatch} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import {getDebtRequest} from '../../redux/slice/debtDataSlice';

const UpdateDebtScreen = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const route = useRoute();
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

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <View style={styles.headerContainer}>
        <AppHeader
          onPress={goBack}
          colors={colors}
          text={`Update Debt | ${debtorName}`}
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
      <View style={styles.dateContainer}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View
            style={[
              styles.dateButtonContainer,
              {
                backgroundColor: colors.primaryText,
                borderColor: colors.secondaryText,
              },
            ]}>
            <Icon
              name={'calendar'}
              size={20}
              color={colors.buttonText}
              type={'IonIcons'}
            />
          </View>
        </TouchableOpacity>

        <Text
          style={[styles.dateText, {color: colors.primaryText, fontSize: 14}]}>
          {moment(createdAt).format('Do MMM YYYY')}
        </Text>

        <View>
          {showDatePicker && (
            <DateTimePicker
              value={createdAt}
              mode="date"
              is24Hour={false}
              display="default"
              onChange={handleDateChange}
              style={{backgroundColor: colors.accentGreen}}
            />
          )}
        </View>
      </View>
      <View style={styles.submitButtonContainer}>
        <PrimaryButton
          onPress={handleUpdateDebt}
          colors={colors}
          buttonTitle="Update"
        />
      </View>
    </View>
  );
};

export default UpdateDebtScreen;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  submitButtonContainer: {
    marginTop: '100%',
    marginBottom: 15,
  },
  dateButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 5,
    borderWidth: 2,
    marginRight: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  dateText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});
