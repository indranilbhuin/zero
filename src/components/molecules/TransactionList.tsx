import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
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
import {getEverydayExpenseRequest} from '../../redux/slice/everydayExpenseDataSlice';
import UndoModal from '../atoms/UndoModal';
import {formatCurrency} from '../../utils/numberUtils';

interface TransactionListProps {
  currencySymbol: string;
  allExpenses: Array<Expense>;
  targetDate?: string;
}

interface TransactionItemProps {
  currencySymbol: string;
  expense?: Array<Expense>;
  colors: Colors;
  dispatch: Dispatch<any>;
  label: string;
  targetDate?: string;
}

const truncateString = (str, maxLength) => {
  if (str?.length > maxLength) {
    return str.substring(0, maxLength) + '..';
  } else {
    return str;
  }
};

const TransactionItem: React.FC<TransactionItemProps> = ({
  currencySymbol,
  expense: initialExpense,
  colors,
  dispatch,
  label,
  targetDate,
}) => {
  const [expenses, setExpenses] = useState<Array<Expense>>(initialExpense);
  const [deletedItem, setDeletedItem] = useState<Expense | null>(null);
  const [deletionTimeoutId, setDeletionTimeoutId] = useState<number | null>(
    null,
  );

  const handleEdit = (
    expenseId: string,
    expenseTitle: string,
    expenseDescription: string,
    category: Category,
    expenseDate: string,
    expenseAmount: number,
  ) => {
    navigate('UpdateTransactionScreen', {
      expenseId,
      expenseTitle,
      expenseDescription,
      category,
      expenseDate,
      expenseAmount,
    });
  };

  const handleDelete = (expenseId: string) => {
    const deletedExpense = expenses.find(
      expense => String(expense._id) === expenseId,
    );
    setExpenses(prevExpenses =>
      prevExpenses.filter(expense => String(expense._id) !== expenseId),
    );
    setDeletedItem(deletedExpense);

    const deletionTimeout = setTimeout(() => {
      if (!deletedItem) {
        deleteExpenseById(Realm.BSON.ObjectID.createFromHexString(expenseId));
        dispatch(getExpenseRequest());
        dispatch(getEverydayExpenseRequest(targetDate));
      }
    }, 3000);

    setTimeout(() => {
      setDeletedItem(null);
    }, 3000);

    setDeletionTimeoutId(deletionTimeout);
  };

  const handleUndo = () => {
    if (deletedItem) {
      clearTimeout(deletionTimeoutId);
      setExpenses(prevExpenses => [...prevExpenses, deletedItem]);
      setDeletedItem(null);
    }
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
              backgroundColor: colors.lightAccent,
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
            {backgroundColor: colors.lightAccent, marginRight: -250},
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
            {backgroundColor: colors.lightAccent, marginLeft: -250},
          ]}
        />
        <View
          style={[
            styles.swipeView,
            {
              backgroundColor: colors.lightAccent,
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
      {expenses?.map((expense: Expense) => (
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
                },
              ]}>
              <View style={styles.iconNameContainer}>
                <View
                  style={[
                    styles.iconContainer,
                    {backgroundColor: colors.iconContainer},
                  ]}>
                  <Icon
                    name={expense.category?.icon ?? 'selection-ellipse'}
                    size={20}
                    color={expense.category?.color ?? colors.buttonText}
                    type={'MaterialCommunityIcons'}
                  />
                </View>
                <View>
                  <PrimaryText>{truncateString(expense.title, 15)}</PrimaryText>
                  <View style={styles.descriptionContainer}>
                    <PrimaryText
                      style={{
                        color: colors.primaryText,
                        fontSize: 10,
                        marginRight: 5,
                      }}>
                      {truncateString(expense.category?.name, 7)} ◦
                    </PrimaryText>

                    {expense.description !== '' ? (
                      <PrimaryText
                        style={{
                          color: colors.primaryText,
                          fontSize: 10,
                          marginRight: 5,
                        }}>
                        {truncateString(expense.description, 4)} ◦
                      </PrimaryText>
                    ) : null}

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
                <PrimaryText style={{fontSize: 13}}>
                  {currencySymbol}
                  {Number.isInteger(expense.amount)
                    ? formatCurrency(expense.amount)
                    : formatCurrency(expense.amount.toFixed(2))}
                </PrimaryText>
              </View>
            </Animated.View>
          </Swipeable>
        </GestureHandlerRootView>
      ))}
      <UndoModal
        isVisible={deletedItem !== null}
        onUndo={handleUndo}
        type={'Transaction'}
      />
    </View>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({
  currencySymbol,
  allExpenses,
  targetDate,
}) => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const groupedExpenses = new Map<string, Array<Expense>>();

  allExpenses?.forEach(expense => {
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
          targetDate={targetDate}
          label={moment(date).calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'DD MMM YYYY',
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
