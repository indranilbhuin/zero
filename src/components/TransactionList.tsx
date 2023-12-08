import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useRef} from 'react';
import useThemeColors from '../hooks/useThemeColors';
import Icon from './Icons';
import moment from 'moment';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {navigate} from '../utils/navigationUtils';
import Category from '../schemas/CategorySchema';
import {deleteExpenseById} from '../services/ExpenseService';
import {useDispatch} from 'react-redux';
import {getExpenseRequest} from '../redux/slice/expenseDataSlice';
import Expense from '../schemas/ExpenseSchema';
import {Colors} from '../types/colorType';
import {Dispatch} from 'redux';
import PrimaryText from './atoms/PrimaryText';

interface TransactionListProps {
  currencySymbol: string;
  allExpenses: Array<Expense>;
}

interface TransactionItemProps {
  currencySymbol: string;
  expense: Expense;
  colors: Colors;
  dispatch: Dispatch<any>;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  currencySymbol,
  expense,
  colors,
  dispatch,
}) => {
  const slideAnim = useRef(new Animated.Value(1)).current;

  const handleEdit = (
    expenseId: string,
    expenseTitle: string,
    expenseDescription: string,
    category: Category,
    expenseDate: Date,
    expenseAmount: number,
  ) => {
    Animated.timing(slideAnim, {
      toValue: 200,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      navigate('UpdateTransactionScreen', {
        expenseId,
        expenseTitle,
        expenseDescription,
        category,
        expenseDate,
        expenseAmount,
      });
    });
  };

  const handleDelete = (expenseId: Realm.BSON.ObjectId) => {
    Animated.timing(slideAnim, {
      toValue: -200,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      deleteExpenseById(expenseId);
      dispatch(getExpenseRequest());
    });
  };

  const renderLeftActions = () => {
    return (
      <TouchableOpacity
        onPress={() =>
          handleEdit(
            String(expense._id),
            expense.title,
            expense.description,
            expense.category,
            expense.date,
            expense.amount,
          )
        }
        style={{flexDirection: 'row'}}>
        <View
          style={[
            styles.swipeView,
            {
              backgroundColor: colors.cardBackground,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
            },
          ]}>
          <Icon
            name={'edit'}
            size={20}
            color={colors.accentGreen}
            type={'MaterialIcons'}
          />
        </View>
        <View
          style={[
            styles.stretchView,
            {backgroundColor: colors.cardBackground, marginRight: -250},
          ]}
        />
      </TouchableOpacity>
    );
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={{flexDirection: 'row'}}
        onPress={() => handleDelete(expense._id)}>
        <View
          style={[
            styles.stretchView,
            {backgroundColor: colors.cardBackground, marginLeft: -250},
          ]}
        />
        <View
          style={[
            styles.swipeView,
            {
              backgroundColor: colors.cardBackground,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            },
          ]}>
          <Icon
            name={'delete-empty'}
            size={20}
            color={colors.accentOrange}
            type={'MaterialCommunityIcons'}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        friction={2}>
        <Animated.View
          style={[
            styles.transactionContainer,
            {
              backgroundColor: colors.containerColor,
              transform: [{translateX: slideAnim}],
            },
          ]}
          key={String(expense._id)}>
          <View style={styles.iconNameContainer}>
            <View
              style={[
                styles.iconContainer,
                {backgroundColor: colors.primaryText},
              ]}>
              <Icon
                name={expense.category.icon ?? 'selection-ellipse'}
                size={20}
                color={expense.category.color ?? colors.buttonText}
                type={'MaterialCommunityIcons'}
              />
            </View>
            <View>
              <PrimaryText style={{color: colors.primaryText}}>
                {expense.title}
              </PrimaryText>
              <View style={styles.descriptionContainer}>
                <PrimaryText
                  style={{
                    color: colors.primaryText,
                    fontSize: 10,
                    marginRight: 5,
                  }}>
                  {expense.category.name} .
                </PrimaryText>
                <PrimaryText
                  style={{
                    color: colors.primaryText,
                    fontSize: 10,
                    marginRight: 5,
                  }}>
                  {expense.description} .
                </PrimaryText>
                <PrimaryText
                  style={{
                    color: colors.primaryText,
                    fontSize: 10,
                    marginRight: 5,
                  }}>
                  {moment(expense.date).format('Do MMM')}
                </PrimaryText>
              </View>
            </View>
          </View>
          <View>
            <PrimaryText style={{color: colors.primaryText}}>
              {currencySymbol} {expense.amount}
            </PrimaryText>
          </View>
        </Animated.View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({
  currencySymbol,
  allExpenses,
}) => {
  const colors = useThemeColors();
  const dispatch = useDispatch();

  return (
    <View style={styles.mainContainer}>
      {allExpenses?.map((expense: Expense) => (
        <TransactionItem
          key={String(expense._id)}
          expense={expense}
          currencySymbol={currencySymbol}
          colors={colors}
          dispatch={dispatch}
        />
      ))}
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 10,
  },
  transactionContainer: {
    height: 60,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
  iconContainer: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginRight: 10,
  },
  iconNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionContainer: {
    flexDirection: 'row',
  },
  swipeView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
  },
  stretchView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 250,
  },
});
