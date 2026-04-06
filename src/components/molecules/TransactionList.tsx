import {RefreshControl, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import React, {useCallback, useMemo, useRef, memo} from 'react';
import Animated, {SharedValue, useAnimatedStyle, interpolate} from 'react-native-reanimated';
import useThemeColors, {Colors} from '../../hooks/useThemeColors';
import Icon from '../atoms/Icons';
import {formatDate, formatCalendar} from '../../utils/dateUtils';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {navigate} from '../../utils/navigationUtils';
import {deleteExpenseById, ExpenseData as ExpenseDocType} from '../../watermelondb/services';
import {useDispatch} from 'react-redux';
import {fetchExpenses, fetchExpensesByMonth, invalidateExpenseCache} from '../../redux/slice/expenseDataSlice';
import PrimaryText from '../atoms/PrimaryText';
import {fetchEverydayExpenses} from '../../redux/slice/everydayExpenseDataSlice';
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
  targetMonth?: string;
  edgeToEdge?: boolean;
  ListHeaderComponent?: React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentContainerStyle?: {paddingBottom?: number};
}

interface TransactionItemProps {
  currencySymbol: string;
  expense?: Array<Expense>;
  colors: Colors;
  dispatch: AppDispatch;
  label: string;
  targetDate?: string;
  targetMonth?: string;
  openSwipeableRef: React.RefObject<{close: () => void} | null>;
  edgeToEdge: boolean;
}

interface ExpenseRowProps {
  expense: Expense;
  colors: Colors;
  currencySymbol: string;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
  openSwipeableRef: React.RefObject<{close: () => void} | null>;
  edgeToEdge: boolean;
}

interface GroupedExpense {
  date: string;
  expenses: Array<Expense>;
  label: string;
}

const ACTION_WIDTH = 50;
const EDGE_INSET = 16;

const SwipeAction = ({
  progress,
  iconName,
  iconColor,
  backgroundColor,
  side,
  onPress,
  edgeToEdge = false,
}: {
  progress: SharedValue<number>;
  iconName: string;
  iconColor: string;
  backgroundColor: string;
  side: 'left' | 'right';
  onPress: () => void;
  edgeToEdge?: boolean;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6, 1], [0, 0.8, 1]),
    transform: [{scale: interpolate(progress.value, [0, 1], [0.6, 1])}],
  }));

  const extraPadding = edgeToEdge ? EDGE_INSET : 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        gs.center,
        {
          flex: 1,
          width: ACTION_WIDTH + extraPadding,
          paddingLeft: side === 'left' ? extraPadding : 0,
          paddingRight: side === 'right' ? extraPadding : 0,
        },
      ]}>
      <Animated.View style={[gs.size40, gs.roundedFull, gs.center, animatedStyle, {backgroundColor}]}>
        <Icon name={iconName} size={18} color={iconColor} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const ExpenseRow: React.FC<ExpenseRowProps> = React.memo(
  ({expense, colors, currencySymbol, onEdit, onDelete, openSwipeableRef, edgeToEdge}) => {
    const swipeableRef = useRef<any>(null);

    const handleSwipeWillOpen = useCallback(() => {
      if (openSwipeableRef.current && openSwipeableRef.current !== swipeableRef.current) {
        openSwipeableRef.current.close();
      }
      openSwipeableRef.current = swipeableRef.current;
    }, [openSwipeableRef]);

    return (
      <View style={gs.mb5}>
        <ReanimatedSwipeable
          ref={swipeableRef}
          renderLeftActions={(progress, _translation, swipeableMethods) => (
            <SwipeAction
              progress={progress}
              iconName="pencil"
              iconColor={colors.accentGreen}
              backgroundColor={colors.lightAccent}
              side="left"
              edgeToEdge={edgeToEdge}
              onPress={() => {
                onEdit(expense);
                swipeableMethods.close();
              }}
            />
          )}
          renderRightActions={(progress, _translation, swipeableMethods) => (
            <SwipeAction
              progress={progress}
              iconName="trash-2"
              iconColor={colors.accentOrange}
              backgroundColor={colors.lightAccent}
              side="right"
              edgeToEdge={edgeToEdge}
              onPress={() => {
                onDelete(String(expense.id));
                swipeableMethods.close();
              }}
            />
          )}
          onSwipeableWillOpen={handleSwipeWillOpen}
          friction={2}
          overshootLeft={false}
          overshootRight={false}
          overshootFriction={8}>
          <View
            style={[
              gs.rounded12,
              gs.rowBetweenCenter,
              gs.px14,
              gs.py10,
              edgeToEdge && gs.mx16,
              {backgroundColor: colors.containerColor},
            ]}>
            <View style={[gs.rowCenter, gs.flex1]}>
              <View style={[gs.size36, gs.center, gs.rounded10, gs.mr10, {backgroundColor: colors.iconContainer}]}>
                <Icon
                  name={expense.category?.icon || 'circle-dot'}
                  size={18}
                  color={expense.category?.color || colors.buttonText}
                />
              </View>
              <View style={[gs.flex1, gs.gap2]}>
                <PrimaryText weight="medium" numberOfLines={1}>{expense.title}</PrimaryText>
                <PrimaryText size={11} color={colors.secondaryText} numberOfLines={1}>
                  {expense.category?.name}
                  {expense.description ? ` · ${expense.description}` : ''}
                  {' · '}
                  {formatDate(expense.date, 'Do MMM')}
                </PrimaryText>
              </View>
            </View>
            <View style={gs.ml10}>
              <PrimaryText size={14} weight="semibold" variant="number">
                {currencySymbol}
                {Number.isInteger(expense.amount)
                  ? formatCurrency(expense.amount)
                  : formatCurrency(Number(expense.amount.toFixed(2)))}
              </PrimaryText>
            </View>
          </View>
        </ReanimatedSwipeable>
      </View>
    );
  },
);

const InlineUndo: React.FC<{
  colors: Colors;
  onUndo: () => void;
  edgeToEdge: boolean;
}> = memo(({colors, onUndo, edgeToEdge}) => (
  <View style={gs.mb5}>
    <View
      style={[
        gs.rounded12,
        gs.rowBetweenCenter,
        gs.px14,
        gs.py12,
        edgeToEdge && gs.mx16,
        {backgroundColor: colors.secondaryAccent},
      ]}>
      <PrimaryText size={13} color={colors.secondaryText}>
        Transaction deleted
      </PrimaryText>
      <TouchableOpacity
        onPress={onUndo}
        activeOpacity={0.7}
        style={[gs.py8, gs.px14, gs.rounded10, {backgroundColor: colors.accentGreen}]}>
        <PrimaryText size={12} weight="semibold" color={colors.buttonText}>
          Undo
        </PrimaryText>
      </TouchableOpacity>
    </View>
  </View>
));

const TransactionItem: React.FC<TransactionItemProps> = React.memo(
  ({currencySymbol, expense: initialExpense, colors, dispatch, label, targetDate, targetMonth, openSwipeableRef, edgeToEdge}) => {
    const deletionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [expenses, setExpenses] = useRecyclingState<Array<Expense>>(initialExpense || [], [initialExpense], () => {
      if (deletionTimeoutRef.current) {
        clearTimeout(deletionTimeoutRef.current);
      }
    });
    const [deletedItemId, setDeletedItemId] = useRecyclingState<string | null>(null, [initialExpense]);
    const deletedItemRef = useRef<Expense | null>(null);

    const handleEdit = useCallback((expense: Expense) => {
      navigate('UpdateTransactionScreen', {
        expenseId: String(expense.id),
        expenseTitle: expense.title,
        expenseDescription: expense.description ?? '',
        category: expense.category,
        expenseDate: expense.date,
        expenseAmount: expense.amount,
      });
    }, []);

    const handleDelete = useCallback(
      (expenseId: string) => {
        const deletedExpense = expenses.find(expense => String(expense.id) === expenseId) ?? null;
        deletedItemRef.current = deletedExpense;
        setDeletedItemId(expenseId);

        if (deletionTimeoutRef.current) {
          clearTimeout(deletionTimeoutRef.current);
        }

        deletionTimeoutRef.current = setTimeout(async () => {
          setExpenses(prev => prev.filter(e => String(e.id) !== expenseId));
          setDeletedItemId(null);
          deletedItemRef.current = null;
          await deleteExpenseById(expenseId);
          dispatch(invalidateExpenseCache());
          if (targetMonth) {
            dispatch(fetchExpensesByMonth(targetMonth));
          } else {
            dispatch(fetchExpenses());
          }
          if (targetDate) {
            dispatch(fetchEverydayExpenses(targetDate));
          }
        }, 3000);
      },
      [expenses, dispatch, targetDate, targetMonth, setExpenses, setDeletedItemId],
    );

    const handleUndo = useCallback(() => {
      if (deletionTimeoutRef.current) {
        clearTimeout(deletionTimeoutRef.current);
        deletionTimeoutRef.current = null;
      }
      setDeletedItemId(null);
      deletedItemRef.current = null;
    }, [setDeletedItemId]);

    return (
      <View>
        <PrimaryText size={12} weight="semibold" color={colors.secondaryText} style={[gs.mb8, gs.mt15, edgeToEdge && gs.px16]}>
          {label}
        </PrimaryText>
        {expenses.map(item =>
          String(item.id) === deletedItemId ? (
            <InlineUndo key={String(item.id)} colors={colors} onUndo={handleUndo} edgeToEdge={edgeToEdge} />
          ) : (
            <ExpenseRow
              key={String(item.id)}
              expense={item}
              colors={colors}
              currencySymbol={currencySymbol}
              onEdit={handleEdit}
              onDelete={handleDelete}
              openSwipeableRef={openSwipeableRef}
              edgeToEdge={edgeToEdge}
            />
          ),
        )}
      </View>
    );
  },
);

const TransactionList: React.FC<TransactionListProps> = ({
  currencySymbol,
  allExpenses,
  targetDate,
  targetMonth,
  edgeToEdge = false,
  ListHeaderComponent,
  ListEmptyComponent,
  refreshing,
  onRefresh,
  contentContainerStyle,
}) => {
  const colors = useThemeColors();
  const dispatch = useDispatch<AppDispatch>();
  const openSwipeableRef = useRef<{close: () => void} | null>(null);

  const groupedData: GroupedExpense[] = useMemo(() => {
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
      expenses: (groupedExpenses.get(date) ?? []).sort((a, b) =>
        b.date.localeCompare(a.date),
      ),
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
        targetMonth={targetMonth}
        label={item.label}
        openSwipeableRef={openSwipeableRef}
        edgeToEdge={edgeToEdge}
      />
    ),
    [currencySymbol, colors, dispatch, targetDate, targetMonth, edgeToEdge],
  );

  const refreshControl = useMemo(
    () =>
      onRefresh ? (
        <RefreshControl refreshing={refreshing ?? false} onRefresh={onRefresh} />
      ) : undefined,
    [refreshing, onRefresh],
  );

  return (
    <FlashList
      data={groupedData}
      renderItem={renderGroupItem}
      keyExtractor={item => item.date}
      extraData={allExpenses}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}
    />
  );
};

export default memo(TransactionList);
