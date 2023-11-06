import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import useThemeColors from '../hooks/useThemeColors';

const TransactionCard = ({currencySymbol, day, totalSpent}) => {
  const colors = useThemeColors();
  return (
    <View style={[styles.card, {backgroundColor: colors.primaryText}]}>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.subtitleText,
            {color: colors.buttonText, fontSize: 14},
          ]}>
          {day}'s
        </Text>
        <Text
          style={[
            styles.subtitleText,
            {color: colors.buttonText, fontSize: 14},
          ]}>
          Transactions
        </Text>
      </View>
      <View
        style={[
          styles.transactionContainer,
          {backgroundColor: colors.secondaryBackground},
        ]}>
        <Text
          style={[
            styles.subtitleText,
            {color: colors.primaryText, fontSize: 14},
          ]}>
          {currencySymbol} {totalSpent}
        </Text>
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
  textContainer: {},
  transactionContainer: {
    height: '40%',
    borderRadius: 10,
    justifyContent: 'center',
    padding: 10,
  },
  transactionListContainer: {
    marginTop: 20,
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});
