import {ScrollView, TextInput, TouchableOpacity, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import AppHeader from '../../components/atoms/AppHeader';
import CategoryContainer from '../../components/molecules/CategoryContainer';
import CustomInput from '../../components/atoms/CustomInput';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import SecondaryButton from '../../components/molecules/SecondaryButton';
import {goBack} from '../../utils/navigationUtils';
import Icon from '../../components/atoms/Icons';
import addTransactionStyles from '../AddTransactionsScreen/style';
import {useRoute} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import useUpdateTransaction, {
  UpdateTransactionScreenRouteProp,
} from './useUpdateTransaction';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import textInputStyles from '../../styles/textInput';

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
    <PrimaryView colors={colors}>
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

      <PrimaryText style={{marginBottom: 5}}>Expense Amount</PrimaryText>
      <View
        style={[
          textInputStyles.textInputContainer,
          {
            borderColor: colors.primaryText,
            backgroundColor: colors.secondaryBackground,
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

        <PrimaryText>{moment(createdAt).format('Do MMM YYYY')}</PrimaryText>

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
      <PrimaryText style={{marginBottom: 5}}>Select any category</PrimaryText>
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
    </PrimaryView>
  );
};

export default UpdateTransactionScreen;
