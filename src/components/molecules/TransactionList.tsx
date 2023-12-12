import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useRef} from 'react';
import useThemeColors, {Colors} from '../../hooks/useThemeColors';
import Icon from '../atoms/Icons';
import moment from 'moment';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {navigate} from '../../utils/navigationUtils';
import Category from '../../schemas/CategorySchema';
import {deleteExpenseById} from '../../services/ExpenseService';
import {useDispatch} from 'react-redux';
import {getExpenseRequest} from '../../redux/slice/expenseDataSlice';
import Expense from '../../schemas/ExpenseSchema';
import {Dispatch} from 'redux';
import PrimaryText from '../atoms/PrimaryText';

interface TransactionListProps {
  currencySymbol: string;
  allExpenses: Array<Expense>;
}

interface TransactionItemProps {
  currencySymbol: string;
  expense: Array<Expense>;
  colors: Colors;
  dispatch: Dispatch<any>;
  label: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  currencySymbol,
  expense,
  colors,
  dispatch,
  label,
}) => {
  const slideAnim = useRef(new Animated.Value(1)).current;

  const handleEdit = (
    expenseId: string,
    expenseTitle: string,
    expenseDescription: string,
    category: Category,
    expenseDate: string,
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

  const handleDelete = (expenseId: string) => {
    Animated.timing(slideAnim, {
      toValue: -200,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      deleteExpenseById(Realm.BSON.ObjectID.createFromHexString(expenseId));
      dispatch(getExpenseRequest());
    });
  };

  const renderLeftActions = (expense: Expense) => {
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

  const renderRightActions = (expense: Expense) => {
    return (
      <TouchableOpacity
        style={{flexDirection: 'row'}}
        onPress={() => handleDelete(String(expense._id))}>
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
    <View>
      <PrimaryText style={{fontSize: 12, marginBottom: 5}}>{label}</PrimaryText>
      {expense.map((expense: Expense) => (
        <GestureHandlerRootView key={String(expense._id)}>
          <Swipeable
            renderLeftActions={() => renderLeftActions(expense)}
            renderRightActions={() => renderRightActions(expense)}
            friction={2}>
            <Animated.View
              style={[
                styles.transactionContainer,
                {
                  backgroundColor: colors.containerColor,
                  transform: [{translateX: slideAnim}],
                },
              ]}>
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
                  <PrimaryText>{expense.title}</PrimaryText>
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
                <PrimaryText>
                  {currencySymbol} {expense.amount}
                </PrimaryText>
              </View>
            </Animated.View>
          </Swipeable>
        </GestureHandlerRootView>
      ))}
    </View>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({
  currencySymbol,
  allExpenses,
}) => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const groupedExpenses = new Map<string, Array<Expense>>();

  allExpenses.forEach(expense => {
    const date = moment(expense.date).format('YYYY-MM-DD');
    const currentGroup = groupedExpenses.get(date) ?? [];
    currentGroup.push(expense);
    groupedExpenses.set(date, currentGroup);
  });

  return (
    <View style={styles.mainContainer}>
      {Array.from(groupedExpenses.keys()).map(date => (
        <TransactionItem
          key={date}
          currencySymbol={currencySymbol}
          expense={groupedExpenses.get(date) ?? []}
          colors={colors}
          dispatch={dispatch}
          label={moment(date).calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'MMM YYYY',
          })}
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
    width: '99.5%',
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
