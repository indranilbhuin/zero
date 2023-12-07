import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import moment from 'moment';
import AppHeader from '../../components/AppHeader';
import CategoryContainer from '../../components/CategoryContainer';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import {goBack} from '../../utils/navigationUtils';
import Icon from '../../components/Icons';
import addTransactionStyles from '../AddTransactionsScreen/style';
import {useRoute} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import useUpdateTransaction, {
  UpdateTransactionScreenRouteProp,
} from './useUpdateTransaction';
import styles from './style';

const UpdateTransactionScreen = () => {
  const route = useRoute<UpdateTransactionScreenRouteProp>();
  const {
    colors,
    selectedCategories,
    expenseTitle,
    setExpenseTitle,
    expenseDescription,
    setExpenseDescription,
    expenseAmount,
    setExpenseAmount,
    createdAt,
    showDatePicker,
    setShowDatePicker,
    categories,
    currencySymbol,
    handleDateChange,
    toggleCategorySelection,
    handleAddCategory,
    handleUpdateExpense,
  } = useUpdateTransaction(route);

  return (
    <View
      style={[
        addTransactionStyles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <View style={addTransactionStyles.headerContainer}>
        <AppHeader
          onPress={goBack}
          colors={colors}
          text="Transaction Update Screen"
        />
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
            addTransactionStyles.subtitleText,
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

      <View style={addTransactionStyles.dateContainer}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View
            style={[
              addTransactionStyles.dateButtonContainer,
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
          style={[
            addTransactionStyles.dateText,
            {color: colors.primaryText, fontSize: 14},
          ]}>
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
          addTransactionStyles.subtitleText,
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
        <View style={addTransactionStyles.addButtonContainer}>
          <SecondaryButton
            onPress={handleAddCategory}
            buttonText="Add More"
            colors={colors}
            width={100}
          />
        </View>
      </ScrollView>
      <View style={addTransactionStyles.submitButtonContainer}>
        <PrimaryButton
          onPress={handleUpdateExpense}
          colors={colors}
          buttonTitle="Update"
        />
      </View>
    </View>
  );
};

export default UpdateTransactionScreen;
