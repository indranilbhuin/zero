import {View, StyleSheet} from 'react-native';
import React from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import PrimaryText from '../atoms/PrimaryText';
import Icon from '../atoms/Icons';
import {getCurrentMonthName} from '../../utils/dateUtils';
import {formatCurrency} from '../../utils/numberUtils';
import {gs} from '../../styles/globalStyles';

interface TransactionCardProps {
  currencySymbol: string;
  day: string;
  totalSpent: number;
}

const getIconName = (day: string) => {
  if (day === 'Today') {
    return 'calendar';
  } else if (day === 'Yesterday') {
    return 'calendar';
  } else if (day === 'This Month') {
    return 'calendar-days';
  }
  return 'calendar';
};

const TransactionCard: React.FC<TransactionCardProps> = React.memo(({currencySymbol, day, totalSpent}) => {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.card,
        gs.rounded12,
        gs.p14,
        gs.gap12,
        gs.mr10,
        {backgroundColor: colors.containerColor},
      ]}>
      <View style={[gs.size30, gs.rounded8, gs.center, {backgroundColor: colors.iconContainer}]}>
        <Icon name={getIconName(day)} size={15} color={colors.accentGreen} />
      </View>
      <View>
        <PrimaryText size={14} weight="semibold">
          {day === 'This Month' ? `${getCurrentMonthName()}'s` : `${day}'s`}
        </PrimaryText>
        <PrimaryText size={11} color={colors.secondaryText}>
          Transactions
        </PrimaryText>
      </View>
      <View style={[gs.rounded8, gs.py8, gs.px10, {backgroundColor: colors.lightAccent}]}>
        <PrimaryText size={14} weight="semibold" variant="number">
          {currencySymbol}
          {Number.isInteger(totalSpent) ? formatCurrency(totalSpent) : formatCurrency(Number(totalSpent.toFixed(2)))}
        </PrimaryText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 155,
  },
});

export default TransactionCard;
