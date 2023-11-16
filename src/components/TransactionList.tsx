import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import useThemeColors from '../hooks/useThemeColors';
import Icon from './Icons';
import moment from 'moment';

const TransactionList = ({currencySymbol, allExpenses}) => {
  const colors = useThemeColors();
  if (!allExpenses) {
    return <Text>Loading...</Text>;
  }
  return (
    <View style={styles.mainContainer}>
      {allExpenses.length === 0 ? (
        <Text>No Transactions Yet</Text>
      ) : (
        allExpenses?.map(expense => (
          <TouchableOpacity
            style={[
              styles.transactionContainer,
              {backgroundColor: colors.containerColor},
            ]}
            key={expense._id}>
            <View style={styles.iconNameContainer}>
              <View
                style={[
                  styles.iconContainer,
                  {backgroundColor: colors.primaryText},
                ]}>
                <Icon
                  name={expense.category.icon}
                  size={20}
                  color={colors.buttonText}
                  type={'MaterialCommunityIcons'}
                />
              </View>
              <View>
                <Text
                  style={[styles.transactionText, {color: colors.primaryText}]}>
                  {expense.title}
                </Text>
                <View style={styles.descriptionContainer}>
                  <Text
                    style={[
                      styles.descriptionText,
                      {color: colors.primaryText},
                    ]}>
                    {expense.category.name} .
                  </Text>
                  <Text
                    style={[
                      styles.descriptionText,
                      {color: colors.primaryText},
                    ]}>
                    {expense.description} .
                  </Text>
                  <Text
                    style={[
                      styles.descriptionText,
                      {color: colors.primaryText},
                    ]}>
                    {moment(expense.date).format('Do MMM')}
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <Text
                style={[styles.transactionText, {color: colors.primaryText}]}>
                {currencySymbol} {expense.amount}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 10,
  },
  transactionContainer: {
    height: 60,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
  iconContainer: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginRight: 10,
  },
  iconNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionContainer: {
    flexDirection: 'row',
  },
  descriptionText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 10,
    includeFontPadding: false,
    marginRight: 5,
  },
  transactionText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 14,
    includeFontPadding: false,
  },
});
