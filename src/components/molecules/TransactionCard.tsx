import {StyleSheet, View} from 'react-native';
import React from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import PrimaryText from '../atoms/PrimaryText';

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
  return (
    <View style={[styles.card, {backgroundColor: colors.containerColor}]}>
      <View>
        <PrimaryText>{day}'s</PrimaryText>
        <PrimaryText>Transactions</PrimaryText>
      </View>
      <View
        style={[
          styles.transactionContainer,
          {backgroundColor: colors.secondaryBackground},
        ]}>
        <PrimaryText>
          {currencySymbol} {totalSpent}
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
    height: '40%',
    borderRadius: 10,
    justifyContent: 'center',
    padding: 10,
  },
  transactionListContainer: {
    marginTop: 20,
  },
});
