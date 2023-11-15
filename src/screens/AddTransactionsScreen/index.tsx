import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import CustomInput from '../../components/CustomInput';
import AppHeader from '../../components/AppHeader';
import {goBack, navigate} from '../../utils/navigationUtils';
import {useDispatch, useSelector} from 'react-redux';
import {FETCH_ALL_CATEGORY_DATA} from '../../redux/actionTypes';
import {selectCategoryData} from '../../redux/slice/categoryDataSlice';
import CategoryContainer from '../../components/CategoryContainer';
import SecondaryButton from '../../components/SecondaryButton';
import PrimaryButton from '../../components/PrimaryButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '../../components/Icons';
import moment from 'moment';

const AddTransactionsScreen = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [createdAt, setCreatedAt] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(null);

  const colors = useThemeColors();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategoryData);

  useEffect(() => {
    dispatch({type: FETCH_ALL_CATEGORY_DATA});
  }, []);

  const toggleCategorySelection = category => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([category]);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || createdAt;
    setShowDatePicker(false);
    setCreatedAt(currentDate);
  };

  const handleAddCategory = () => {
    navigate('AddCategoryScreen');
  };

  const handleAddExpense = () => {
    
  }

  console.log('selected category', selectedCategories);

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
      <CustomInput
        colors={colors}
        input={expenseAmount}
        setInput={setExpenseAmount}
        placeholder="eg. 320"
        label="Expense Amount"
      />
      <View style={styles.dateContainer}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} testID="from">
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

        <View testID="date-time-from-picker">
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={createdAt}
              mode="date"
              is24Hour={true}
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
        <PrimaryButton onPress={handleAddExpense} colors={colors} buttonTitle="Add" />
      </View>
    </View>
  );
};

export default AddTransactionsScreen;

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
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
  addButtonContainer: {
    marginBottom: 10,
  },
  submitButtonContainer: {
    marginTop: 5,
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
  },
  dateText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});
