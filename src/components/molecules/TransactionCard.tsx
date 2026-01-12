import {View} from 'react-native';
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
      style={[gs.size150, gs.rounded10, gs.p10, gs.justifyBetween, gs.mr10, {backgroundColor: colors.containerColor}]}>
      <View>
        <View style={gs.mt7}>
          <Icon name={getIconName(day)} size={20} color={colors.primaryText} />
        </View>
        <PrimaryText style={gs.mt10}>{day === 'This Month' ? `${getCurrentMonthName()}'s` : `${day}'s`}</PrimaryText>
        <PrimaryText>Transactions</PrimaryText>
      </View>
      <View style={[gs.rounded10, gs.justifyCenter, gs.p10, {backgroundColor: colors.lightAccent, height: '34%'}]}>
        <PrimaryText size={13}>
          {currencySymbol}
          {Number.isInteger(totalSpent) ? formatCurrency(totalSpent) : formatCurrency(Number(totalSpent.toFixed(2)))}
        </PrimaryText>
      </View>
    </View>
  );
});

export default TransactionCard;
