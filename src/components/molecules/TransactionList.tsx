import {TouchableOpacity, View, StyleSheet} from 'react-native';
import React, {useCallback, useRef, memo, useMemo} from 'react';
import Animated from 'react-native-reanimated';
import useThemeColors, {Colors} from '../../hooks/useThemeColors';
import Icon from '../atoms/Icons';
import {formatDate, formatCalendar} from '../../utils/dateUtils';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {navigate} from '../../utils/navigationUtils';
import {deleteExpenseById, ExpenseData as ExpenseDocType} from '../../watermelondb/services';
import {useDispatch} from 'react-redux';
import {fetchExpenses} from '../../redux/slice/expenseDataSlice';
import PrimaryText from '../atoms/PrimaryText';
import {fetchEverydayExpenses} from '../../redux/slice/everydayExpenseDataSlice';
import UndoModal from '../atoms/UndoModal';
import {formatCurrency} from '../../utils/numberUtils';
import {FlashList, useRecyclingState} from '@shopify/flash-list';
import {AppDispatch} from '../../redux/store';
import {gs} from '../../styles/globalStyles';

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
  dispatch: AppDispatch;
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

const TransactionItem: React.FC<TransactionItemProps> = React.memo(
  ({currencySymbol, expense: initialExpense, colors, dispatch, label, targetDate}) => {
    const deletionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Memoize dynamic styles that depend on colors
    const leftActionStyle = useMemo(
      () => ({
        backgroundColor: colors.lightAccent,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
      }),
      [colors.lightAccent],
    );
    const rightActionStyle = useMemo(
      () => ({
        backgroundColor: colors.lightAccent,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      }),
      [colors.lightAccent],
    );
    const actionExtenderStyle = useMemo(() => ({backgroundColor: colors.lightAccent}), [colors.lightAccent]);
    const containerStyle = useMemo(() => ({backgroundColor: colors.containerColor}), [colors.containerColor]);
    const iconContainerStyle = useMemo(() => ({backgroundColor: colors.iconContainer}), [colors.iconContainer]);

    const [expenses, setExpenses] = useRecyclingState<Array<Expense>>(initialExpense || [], [initialExpense], () => {
      if (deletionTimeoutRef.current) {
        clearTimeout(deletionTimeoutRef.current);
      }
    });
    const [deletedItem, setDeletedItem] = useRecyclingState<Expense | null>(null, [initialExpense]);

    const handleEdit = useCallback(
      (
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
      },
      [],
    );

    const handleDelete = useCallback(
      (expenseId: string) => {
        const deletedExpense = expenses.find(expense => String(expense.id) === expenseId);
        setExpenses(prevExpenses => prevExpenses.filter(expense => String(expense.id) !== expenseId));
        setDeletedItem(deletedExpense || null);

        if (deletionTimeoutRef.current) {
          clearTimeout(deletionTimeoutRef.current);
        }

        deletionTimeoutRef.current = setTimeout(async () => {
          await deleteExpenseById(expenseId);
          dispatch(fetchExpenses());
          if (targetDate) {
            dispatch(fetchEverydayExpenses(targetDate));
          }
          setDeletedItem(null);
        }, 3000);
      },
      [expenses, dispatch, targetDate, setExpenses, setDeletedItem],
    );

    const handleUndo = useCallback(() => {
      if (deletedItem) {
        if (deletionTimeoutRef.current) {
          clearTimeout(deletionTimeoutRef.current);
          deletionTimeoutRef.current = null;
        }
        setExpenses(prevExpenses => [...prevExpenses, deletedItem]);
        setDeletedItem(null);
      }
    }, [deletedItem, setExpenses, setDeletedItem]);

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
            style={gs.row}>
            <View style={[gs.h60, gs.w60, gs.center, leftActionStyle]}>
              <Icon name="pencil" size={20} color={colors.accentGreen} />
            </View>
            <View style={[gs.h60, gs.w250, gs.center, actionExtenderStyle, styles.leftExtender]} />
          </TouchableOpacity>
        );
      },
      [colors.accentGreen, handleEdit, leftActionStyle, actionExtenderStyle],
    );

    const renderRightActions = useCallback(
      (expense: Expense) => {
        return (
          <TouchableOpacity style={gs.row} onPress={() => handleDelete(String(expense.id))}>
            <View style={[gs.h60, gs.w250, gs.center, actionExtenderStyle, styles.rightExtender]} />
            <View style={[gs.h60, gs.w60, gs.center, rightActionStyle]}>
              <Icon name="trash-2" size={20} color={colors.accentOrange} />
            </View>
          </TouchableOpacity>
        );
      },
      [colors.accentOrange, handleDelete, rightActionStyle, actionExtenderStyle],
    );

    const renderExpenseItem = useCallback(
      ({item: expense}: {item: Expense}) => (
        <GestureHandlerRootView>
          <Swipeable
            renderLeftActions={() => renderLeftActions(expense)}
            renderRightActions={() => renderRightActions(expense)}
            friction={2}>
            <Animated.View
              style={[gs.h60, gs.rounded10, gs.rowBetweenCenter, gs.p10, gs.mb5, containerStyle, styles.itemContainer]}>
              <View style={gs.rowCenter}>
                <View style={[gs.size35, gs.center, gs.rounded50, gs.mr10, iconContainerStyle]}>
                  <Icon
                    name={expense.category?.icon ?? 'circle-dot'}
                    size={20}
                    color={expense.category?.color ?? colors.buttonText}
                  />
                </View>
                <View>
                  <PrimaryText>{truncateString(expense.title, 15)}</PrimaryText>
                  <View style={gs.row}>
                    <PrimaryText size={10} color={colors.primaryText} style={gs.mr5}>
                      {truncateString(expense.category?.name, 7)} ◦
                    </PrimaryText>

                    {expense.description ? (
                      <PrimaryText size={10} color={colors.primaryText} style={gs.mr5}>
                        {truncateString(expense.description, 4)} ◦
                      </PrimaryText>
                    ) : null}

                    <PrimaryText size={10} color={colors.primaryText} style={gs.mr5}>
                      {formatDate(expense.date, 'Do MMM')}
                    </PrimaryText>
                  </View>
                </View>
              </View>
              <View>
                <PrimaryText size={13}>
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
      [
        colors.buttonText,
        colors.primaryText,
        currencySymbol,
        renderLeftActions,
        renderRightActions,
        containerStyle,
        iconContainerStyle,
      ],
    );

    return (
      <View>
        <PrimaryText size={12} style={gs.mb5}>
          {label}
        </PrimaryText>
        <FlashList
          data={expenses}
          renderItem={renderExpenseItem}
          keyExtractor={item => String(item.id)}
          scrollEnabled={false}
        />
        <UndoModal isVisible={deletedItem !== null} onUndo={handleUndo} type={'Transaction'} />
      </View>
    );
  },
);

const TransactionList: React.FC<TransactionListProps> = ({currencySymbol, allExpenses, targetDate}) => {
  const colors = useThemeColors();
  const dispatch = useDispatch<AppDispatch>();

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
    <View style={gs.mt10}>
      <FlashList
        data={groupedData}
        renderItem={renderGroupItem}
        keyExtractor={item => item.date}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: '99.5%',
  },
  leftExtender: {
    marginRight: -250,
  },
  rightExtender: {
    marginLeft: -250,
  },
});

export default memo(TransactionList);
