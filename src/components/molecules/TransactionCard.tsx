import {StyleSheet, View} from 'react-native';
import React from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import PrimaryText from '../atoms/PrimaryText';
import Icon from '../atoms/Icons';
import {getCurrentMonthName} from '../../utils/dateUtils';
import {formatCurrency} from '../../utils/numberUtils';

interface TransactionCardProps {
  currencySymbol: string;
  day: string;
  totalSpent: number;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  currencySymbol,
  day,
  totalSpent,
}) => {
  const colors = useThemeColors();

  const getIconName = (day: string) => {
    console.log(day);
    if (day === 'Today') {
      return 'calendar';
    } else if (day === 'Yesterday') {
      return 'calendar';
    } else if (day === 'This Month') {
      return 'calendar-days';
    }

    return 'calendar';
  };

  return (
    <View style={[styles.card, {backgroundColor: colors.containerColor}]}>
      <View>
        <View style={{marginTop: 7}}>
          <Icon
            name={getIconName(day)}
            size={20}
            color={colors.primaryText}
          />
        </View>
        <PrimaryText style={{marginTop: 10}}>
          {day === 'This Month' ? `${getCurrentMonthName()}'s` : `${day}'s`}
        </PrimaryText>
        <PrimaryText>Transactions</PrimaryText>
      </View>
      <View
        style={[
          styles.transactionContainer,
          {backgroundColor: colors.lightAccent},
        ]}>
        <PrimaryText style={{fontSize: 13}}>
          {currencySymbol}
          {Number.isInteger(totalSpent)
            ? formatCurrency(totalSpent)
            : formatCurrency(Number(totalSpent.toFixed(2)))}
        </PrimaryText>
      </View>
    </View>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({
  card: {
    height: 150,
    width: 150,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between',
    marginRight: 10,
  },
  cardContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  transactionContainer: {
    height: '34%',
    borderRadius: 10,
    justifyContent: 'center',
    padding: 10,
  },
  transactionListContainer: {
    marginTop: 20,
  },
});
