import {RefreshControlProps, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo, memo} from 'react';
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
  handleEditDebt: any;
  handleDeleteDebt: any;
  individualDebts: Array<Debt>;
  currencySymbol: string;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

interface DebtItemProps {
  colors: Colors;
  handleEditDebt: any;
  handleDeleteDebt: any;
  individualDebts: Array<Debt>;
  label: string;
  currencySymbol: string;
}

interface GroupedDebt {
  date: string;
  debts: Array<Debt>;
  label: string;
}

const DebtItem: React.FC<DebtItemProps> = React.memo(
  ({colors, handleEditDebt, handleDeleteDebt, individualDebts, label, currencySymbol}) => {
    const renderDebtItem = useCallback(
      ({item: debt}: {item: Debt}) => (
        <View>
          <View
            style={[
              gs.h40,
              gs.p5,
              gs.mr5,
              gs.rounded5,
              gs.px10,
              gs.center,
              gs.mb5,
              gs.row,
              {backgroundColor: colors.secondaryAccent},
            ]}>
            <TouchableOpacity
              onPress={() => handleEditDebt(String(debt.id), debt.description, debt.amount, debt.date, debt.type)}>
              <PrimaryText size={12} color={colors.primaryText} style={gs.mr5}>
                {debt.description}:{' '}
              </PrimaryText>
              <PrimaryText size={12} color={colors.primaryText} variant="number">
                {currencySymbol}
                {formatCurrency(debt.amount)}
              </PrimaryText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteDebt(String(debt.id))}>
              <Icon name="trash-2" size={20} color={colors.accentOrange} />
            </TouchableOpacity>
          </View>
        </View>
      ),
      [colors, currencySymbol, handleEditDebt, handleDeleteDebt],
    );

    return (
      <View>
        <PrimaryText size={12} style={gs.mb5}>
          {label}
        </PrimaryText>
        <View style={[gs.row, gs.wrap, gs.minH45]}>
          <FlashList
            data={individualDebts}
            renderItem={renderDebtItem}
            keyExtractor={item => String(item.id)}
            scrollEnabled={false}
            horizontal
          />
        </View>
      </View>
    );
  },
);

const DebtList: React.FC<DebtListProps> = ({
  colors,
  handleEditDebt,
  handleDeleteDebt,
  individualDebts,
  currencySymbol,
  ListHeaderComponent,
  refreshControl,
}) => {
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
      <DebtItem
        colors={colors}
        handleEditDebt={handleEditDebt}
        handleDeleteDebt={handleDeleteDebt}
        individualDebts={item.debts}
        currencySymbol={currencySymbol}
        label={item.label}
      />
    ),
    [colors, handleEditDebt, handleDeleteDebt, currencySymbol],
  );

  return (
    <View style={gs.flex1}>
      <FlashList
        data={groupedData}
        renderItem={renderGroupItem}
        keyExtractor={item => item.date}
        ListHeaderComponent={ListHeaderComponent}
        refreshControl={refreshControl}
        contentContainerStyle={gs.pb80}
      />
    </View>
  );
};

export default memo(DebtList);
