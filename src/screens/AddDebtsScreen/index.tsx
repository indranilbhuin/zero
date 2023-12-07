import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import AppHeader from '../../components/AppHeader';
import {goBack} from '../../utils/navigationUtils';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import moment from 'moment';
import Icon from '../../components/Icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import useAddDebts from './useAddDebts';
import styles from './style';

const AddDebtsScreen = () => {
  const {
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
    debtorName,
  } = useAddDebts();

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
          text={`Add Debts | Account: ${debtorName}`}
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
          onPress={handleAddDebt}
          colors={colors}
          buttonTitle="Add"
        />
      </View>
    </View>
  );
};

export default AddDebtsScreen;
