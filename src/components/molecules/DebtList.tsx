import {RefreshControlProps, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo, useRef, memo} from 'react';
import Animated, {SharedValue, useAnimatedStyle, interpolate} from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {DebtData as Debt} from '../../watermelondb/services';
import PrimaryText from '../atoms/PrimaryText';
import Icon from '../atoms/Icons';
import {formatDate, formatCalendar} from '../../utils/dateUtils';
import {Colors} from '../../hooks/useThemeColors';
import {formatCurrency} from '../../utils/numberUtils';
import {FlashList} from '@shopify/flash-list';
import {gs} from '../../styles/globalStyles';

interface DebtListProps {
  colors: Colors;
  handleEditDebt: (debtId: string, description: string, amount: number, date: string, type: string) => void;
  handleDeleteDebt: (debtId: string) => void;
  individualDebts: Array<Debt>;
  currencySymbol: string;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

interface GroupedDebt {
  date: string;
  debts: Array<Debt>;
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
}: {
  progress: SharedValue<number>;
  iconName: string;
  iconColor: string;
  backgroundColor: string;
  side: 'left' | 'right';
  onPress: () => void;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6, 1], [0, 0.8, 1]),
    transform: [{scale: interpolate(progress.value, [0, 1], [0.6, 1])}],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        gs.center,
        {
          width: ACTION_WIDTH + EDGE_INSET,
          paddingLeft: side === 'left' ? EDGE_INSET : 0,
          paddingRight: side === 'right' ? EDGE_INSET : 0,
        },
      ]}>
      <Animated.View style={[gs.size40, gs.roundedFull, gs.center, animatedStyle, {backgroundColor}]}>
        <Icon name={iconName} size={18} color={iconColor} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const DebtRow = memo(({
  debt,
  colors,
  currencySymbol,
  onEdit,
  onDelete,
  openSwipeableRef,
}: {
  debt: Debt;
  colors: Colors;
  currencySymbol: string;
  onEdit: (debt: Debt) => void;
  onDelete: (debtId: string) => void;
  openSwipeableRef: React.RefObject<{close: () => void} | null>;
}) => {
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
            onPress={() => {
              swipeableMethods.close();
              onEdit(debt);
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
            onPress={() => {
              swipeableMethods.close();
              onDelete(String(debt.id));
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
            gs.mx16,
            {backgroundColor: colors.containerColor},
          ]}>
          <View style={[gs.flex1, gs.gap2]}>
            <PrimaryText weight="medium" numberOfLines={1}>
              {debt.description}
            </PrimaryText>
            <PrimaryText size={11} color={colors.secondaryText}>
              {formatDate(debt.date, 'Do MMM YYYY')}
            </PrimaryText>
          </View>
          <View style={gs.ml10}>
            <PrimaryText size={14} weight="semibold" variant="number">
              {currencySymbol}{formatCurrency(debt.amount)}
            </PrimaryText>
          </View>
        </View>
      </ReanimatedSwipeable>
    </View>
  );
});

const DebtGroup = memo(({
  group,
  colors,
  currencySymbol,
  handleEditDebt,
  handleDeleteDebt,
  openSwipeableRef,
}: {
  group: GroupedDebt;
  colors: Colors;
  currencySymbol: string;
  handleEditDebt: (debtId: string, description: string, amount: number, date: string, type: string) => void;
  handleDeleteDebt: (debtId: string) => void;
  openSwipeableRef: React.RefObject<{close: () => void} | null>;
}) => {
  const onEdit = useCallback((debt: Debt) => {
    handleEditDebt(String(debt.id), debt.description, debt.amount, debt.date, debt.type);
  }, [handleEditDebt]);

  const onDelete = useCallback((debtId: string) => {
    handleDeleteDebt(debtId);
  }, [handleDeleteDebt]);

  return (
    <View>
      <PrimaryText size={12} weight="semibold" color={colors.secondaryText} style={[gs.mb8, gs.mt15, gs.px16]}>
        {group.label}
      </PrimaryText>
      {group.debts.map(debt => (
        <DebtRow
          key={String(debt.id)}
          debt={debt}
          colors={colors}
          currencySymbol={currencySymbol}
          onEdit={onEdit}
          onDelete={onDelete}
          openSwipeableRef={openSwipeableRef}
        />
      ))}
    </View>
  );
});

const DebtList: React.FC<DebtListProps> = ({
  colors,
  handleEditDebt,
  handleDeleteDebt,
  individualDebts,
  currencySymbol,
  ListHeaderComponent,
  refreshControl,
}) => {
  const openSwipeableRef = useRef<{close: () => void} | null>(null);

  const groupedData: GroupedDebt[] = useMemo(() => {
    const groupedExpenses = new Map<string, Array<Debt>>();

    individualDebts?.forEach(debt => {
      const date = formatDate(debt.date, 'YYYY-MM-DD');
      const currentGroup = groupedExpenses.get(date) ?? [];
      currentGroup.push(debt);
      groupedExpenses.set(date, currentGroup);
    });

    return Array.from(groupedExpenses.keys()).map(date => ({
      date,
      debts: groupedExpenses.get(date) ?? [],
      label: formatCalendar(date),
    }));
  }, [individualDebts]);

  const renderGroupItem = useCallback(
    ({item}: {item: GroupedDebt}) => (
      <DebtGroup
        group={item}
        colors={colors}
        currencySymbol={currencySymbol}
        handleEditDebt={handleEditDebt}
        handleDeleteDebt={handleDeleteDebt}
        openSwipeableRef={openSwipeableRef}
      />
    ),
    [colors, handleEditDebt, handleDeleteDebt, currencySymbol],
  );

  const ListEmpty = useCallback(() => (
    <View style={[gs.center, gs.mt30p]}>
      <View style={[gs.size50, gs.roundedFull, gs.center, {backgroundColor: colors.secondaryAccent}]}>
        <Icon name="hand-coins" size={22} color={colors.secondaryText} />
      </View>
      <PrimaryText size={13} color={colors.secondaryText} style={gs.mt10}>
        No entries yet
      </PrimaryText>
    </View>
  ), [colors]);

  return (
    <View style={gs.flex1}>
      <FlashList
        data={groupedData}
        renderItem={renderGroupItem}
        keyExtractor={item => item.date}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmpty}
        refreshControl={refreshControl}
        contentContainerStyle={gs.pb80}
      />
    </View>
  );
};

export default memo(DebtList);
