import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import Debt from '../../schemas/DebtSchema';
import PrimaryText from '../atoms/PrimaryText';
import Icon from '../atoms/Icons';
import moment from 'moment';
import {Colors} from '../../hooks/useThemeColors';
import {formatCurrency} from '../../utils/numberUtils';
import {FlashList} from '@shopify/flash-list';

interface DebtListProps {
  colors: Colors;
  handleEditDebt: any;
  handleDeleteDebt: any;
  individualDebts: Array<Debt>;
  currencySymbol: string;
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

const DebtItem: React.FC<DebtItemProps> = ({
  colors,
  handleEditDebt,
  handleDeleteDebt,
  individualDebts,
  label,
  currencySymbol,
}) => {
  const renderDebtItem = useCallback(
    ({item: debt}: {item: Debt}) => (
      <View>
        <View
          style={[
            styles.categoryContainer,
            {
              backgroundColor: colors.secondaryAccent,
            },
          ]}>
          <TouchableOpacity
            onPress={() =>
              handleEditDebt(
                String(debt._id),
                debt.description,
                debt.amount,
                debt.date,
                debt.type,
              )
            }>
            <PrimaryText
              style={{
                color: colors.primaryText,
                fontSize: 12,
                marginRight: 5,
              }}>
              {debt.description}: {currencySymbol}
              {formatCurrency(debt.amount)}
            </PrimaryText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteDebt(String(debt._id))}>
            <Icon
              name={'delete-empty'}
              size={20}
              color={colors.accentOrange}
              type={'MaterialCommunityIcons'}
            />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [colors, currencySymbol, handleEditDebt, handleDeleteDebt],
  );

  return (
    <View>
      <PrimaryText style={{fontSize: 12, marginBottom: 5}}>{label}</PrimaryText>
      <View style={styles.debtItemsContainer}>
        <FlashList
          data={individualDebts}
          renderItem={renderDebtItem}
          keyExtractor={item => String(item._id)}
          scrollEnabled={false}
          horizontal
        />
      </View>
    </View>
  );
};

const DebtList: React.FC<DebtListProps> = ({
  colors,
  handleEditDebt,
  handleDeleteDebt,
  individualDebts,
  currencySymbol,
}) => {
  const groupedData: GroupedDebt[] = useMemo(() => {
    const groupedExpenses = new Map<string, Array<Debt>>();

    individualDebts?.forEach(debt => {
      const date = moment(debt.date).format('YYYY-MM-DD');
      const currentGroup = groupedExpenses.get(date) ?? [];
      currentGroup.push(debt);
      groupedExpenses.set(date, currentGroup);
    });

    return Array.from(groupedExpenses.keys()).map(date => ({
      date,
      debts: groupedExpenses.get(date) ?? [],
      label: moment(date).calendar(null, {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'DD MMM YYYY',
      }),
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
    <View style={styles.debtsMainContainer}>
      <FlashList
        data={groupedData}
        renderItem={renderGroupItem}
        keyExtractor={item => item.date}
        scrollEnabled={false}
      />
    </View>
  );
};

export default DebtList;

const styles = StyleSheet.create({
  debtsMainContainer: {
    flexDirection: 'column',
    minHeight: 2,
  },
  debtItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 45,
  },
  categoryContainer: {
    height: 40,
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    flexDirection: 'row',
  },
});
