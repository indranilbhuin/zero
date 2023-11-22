import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import CustomInput from '../../components/CustomInput';
import AppHeader from '../../components/AppHeader';
import {goBack} from '../../utils/navigationUtils';
import CategoryContainer from '../../components/CategoryContainer';
import SecondaryButton from '../../components/SecondaryButton';
import PrimaryButton from '../../components/PrimaryButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '../../components/Icons';
import moment from 'moment';
import useAddTransaction from './useAddTransaction';
import styles from './style';
import {useSelector} from 'react-redux';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';

const AddTransactionsScreen = () => {
  const {
    colors,
    expenseTitle,
    setExpenseTitle,
    expenseDescription,
    setExpenseDescription,
    expenseAmount,
    setExpenseAmount,
    setShowDatePicker,
    createdAt,
    showDatePicker,
    handleDateChange,
    categories,
    toggleCategorySelection,
    selectedCategories,
    handleAddCategory,
    handleAddExpense,
  } = useAddTransaction();

  const currencySymbol = useSelector(selectCurrencySymbol);

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <View style={styles.headerContainer}>
        <AppHeader onPress={goBack} colors={colors} text="Transaction Screen" />
      </View>

      <CustomInput
        colors={colors}
        input={expenseTitle}
        setInput={setExpenseTitle}
        placeholder="eg. Biryani"
        label="Expense Name"
      />
      <CustomInput
        colors={colors}
        input={expenseDescription}
        setInput={setExpenseDescription}
        placeholder="eg. From Aroma's"
        label="Expense Description"
      />
      <Text
        style={[
          styles.labelText,
          {color: colors.primaryText, fontSize: 14, marginBottom: 5},
        ]}>
        Expense Amount
      </Text>
      <View
        style={[
          styles.textInputContainer,
          {
            borderColor: colors.primaryText,
            backgroundColor: colors.secondaryBackground,
          },
        ]}>
        <Text
          style={[
            styles.subtitleText,
            {color: colors.primaryText, fontSize: 15},
          ]}>
          {currencySymbol}
        </Text>
        <TextInput
          style={[
            styles.textInput,
            {
              color: colors.primaryText,
            },
          ]}
          value={expenseAmount}
          onChangeText={setExpenseAmount}
          placeholder={'eg. 320'}
          placeholderTextColor={colors.secondaryText}
        />
      </View>
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
      <Text
        style={[
          styles.subtitleText,
          {color: colors.primaryText, fontSize: 14, marginBottom: 5},
        ]}>
        Select any category
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CategoryContainer
          categories={categories}
          colors={colors}
          toggleCategorySelection={toggleCategorySelection}
          selectedCategories={selectedCategories}
        />
        <View style={styles.addButtonContainer}>
          <SecondaryButton
            onPress={handleAddCategory}
            buttonText="Add More"
            colors={colors}
            width={100}
          />
        </View>
      </ScrollView>
      <View style={styles.submitButtonContainer}>
        <PrimaryButton
          onPress={handleAddExpense}
          colors={colors}
          buttonTitle="Add"
        />
      </View>
    </View>
  );
};

export default AddTransactionsScreen;
