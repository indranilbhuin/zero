import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import useThemeColors, {Colors} from '../../hooks/useThemeColors';
import Icon from '../atoms/Icons';
import {formatDate, formatCalendar} from '../../utils/dateUtils';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {navigate} from '../../utils/navigationUtils';
import {deleteExpenseById} from '../../watermelondb/services';
import {useDispatch} from 'react-redux';
import {getExpenseRequest} from '../../redux/slice/expenseDataSlice';
import {ExpenseData as ExpenseDocType} from '../../watermelondb/services';
import {Dispatch} from 'redux';
import PrimaryText from '../atoms/PrimaryText';
import {getEverydayExpenseRequest} from '../../redux/slice/everydayExpenseDataSlice';
import UndoModal from '../atoms/UndoModal';
import {formatCurrency} from '../../utils/numberUtils';
import {FlashList} from '@shopify/flash-list';

interface CategoryInfo {
  id?: string;
  name?: string;
  icon?: string;
  color?: string;
}

interface Expense extends ExpenseDocType {
  category?: CategoryInfo;
}

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

interface GroupedExpense {
  date: string;
  expenses: Array<Expense>;
  label: string;
}

const truncateString = (str: string | undefined, maxLength: number): string => {
  if (!str) return '';
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + '..';
  }
  return str;
};

const TransactionItem: React.FC<TransactionItemProps> = ({
  currencySymbol,
  expense: initialExpense,
  colors,
  dispatch,
  label,
  targetDate,
}) => {
  const [expenses, setExpenses] = useState<Array<Expense>>(initialExpense || []);
  const [deletedItem, setDeletedItem] = useState<Expense | null>(null);
  const [deletionTimeoutId, setDeletionTimeoutId] = useState<number | null>(
    null,
  );

  const handleEdit = (
    expenseId: string,
    expenseTitle: string,
    expenseDescription: string,
    category: CategoryInfo | undefined,
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

  const handleDelete = useCallback(
    (expenseId: string) => {
      const deletedExpense = expenses.find(
        expense => String(expense.id) === expenseId,
      );
      setExpenses(prevExpenses =>
        prevExpenses.filter(
          expense => String(expense.id) !== expenseId,
        ),
      );
      setDeletedItem(deletedExpense || null);

      const deletionTimeout = setTimeout(async () => {
        if (!deletedItem) {
          await deleteExpenseById(expenseId);
          dispatch(getExpenseRequest());
          dispatch(getEverydayExpenseRequest(targetDate));
        }
      }, 3000);

      setTimeout(() => {
        setDeletedItem(null);
      }, 3000);

      setDeletionTimeoutId(deletionTimeout as unknown as number);
    },
    [expenses, deletedItem, dispatch, targetDate],
  );

  const handleUndo = () => {
    if (deletedItem) {
      clearTimeout(deletionTimeoutId as number);
      setExpenses(prevExpenses => [...prevExpenses, deletedItem]);
      setDeletedItem(null);
    }
  };

  const renderLeftActions = useCallback(
    (expense: Expense) => {
      return (
        <TouchableOpacity
          onPress={() =>
            handleEdit(
              String(expense.id),
              expense.title,
              expense.description ?? '',
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
              name="pencil"
              size={20}
              color={colors.accentGreen}
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
    },
    [colors],
  );

  const renderRightActions = useCallback(
    (expense: Expense) => {
      return (
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => handleDelete(String(expense.id))}>
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
              name="trash-2"
              size={20}
              color={colors.accentOrange}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [colors, handleDelete],
  );

  const renderExpenseItem = useCallback(
    ({item: expense}: {item: Expense}) => (
      <GestureHandlerRootView>
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
                  name={expense.category?.icon ?? 'circle-dot'}
                  size={20}
                  color={expense.category?.color ?? colors.buttonText}
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
                    {formatDate(expense.date, 'Do MMM')}
                  </PrimaryText>
                </View>
              </View>
            </View>
            <View>
              <PrimaryText style={{fontSize: 13}}>
                {currencySymbol}
                {Number.isInteger(expense.amount)
                  ? formatCurrency(expense.amount)
                  : formatCurrency(Number(expense.amount.toFixed(2)))}
              </PrimaryText>
            </View>
          </Animated.View>
        </Swipeable>
      </GestureHandlerRootView>
    ),
    [colors, currencySymbol, renderLeftActions, renderRightActions],
  );

  return (
    <View>
      <PrimaryText style={{fontSize: 12, marginBottom: 5}}>{label}</PrimaryText>
      <FlashList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={item => String(item.id)}
        scrollEnabled={false}
      />
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

  const groupedData: GroupedExpense[] = React.useMemo(() => {
    const groupedExpenses = new Map<string, Array<Expense>>();

    allExpenses?.forEach(expense => {
      const date = formatDate(expense.date, 'YYYY-MM-DD');
      const currentGroup = groupedExpenses.get(date) ?? [];
      currentGroup.push(expense);
      groupedExpenses.set(date, currentGroup);
    });

    const sortedDates = Array.from(groupedExpenses.keys()).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });

    return sortedDates.map(date => ({
      date,
      expenses: groupedExpenses.get(date) ?? [],
      label: formatCalendar(date),
    }));
  }, [allExpenses]);

  const renderGroupItem = useCallback(
    ({item}: {item: GroupedExpense}) => (
      <TransactionItem
        currencySymbol={currencySymbol}
        expense={item.expenses}
        colors={colors}
        dispatch={dispatch}
        targetDate={targetDate}
        label={item.label}
      />
    ),
    [currencySymbol, colors, dispatch, targetDate],
  );

  return (
    <View style={styles.mainContainer}>
      <FlashList
        data={groupedData}
        renderItem={renderGroupItem}
        keyExtractor={item => item.date}
        scrollEnabled={false}
      />
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
