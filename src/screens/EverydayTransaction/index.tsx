import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import useThemeColors from '../../hooks/useThemeColors';
import AppHeader from '../../components/AppHeader';
import {goBack} from '../../utils/navigationUtils';
import moment from 'moment';
import TransactionList from '../../components/TransactionList';
import {useSelector} from 'react-redux';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';

type EverydayTransactionRouteProp = RouteProp<
  {
    EverydayTransaction: {
      dayTransactions: Array<object>;
      isDate: string;
    };
  },
  'EverydayTransaction'
>;

const EverydayTransaction = () => {
  const route = useRoute<EverydayTransactionRouteProp>();
  const transactions = route.params.dayTransactions;
  console.log(route.params.dayTransactions);
  const date = transactions[0]?.date;
  console.log(date);
  const noTransactionDate = route.params.isDate;
  console.log(noTransactionDate);
  const formattedDate = moment(date).format('MMM Do YY');
  const formatDate = moment(noTransactionDate).format('MMM Do YY');
  const colors = useThemeColors();
  const currencySymbol = useSelector(selectCurrencySymbol);

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <View style={styles.headerContainer}>
        <AppHeader
          onPress={goBack}
          colors={colors}
          text={formattedDate === undefined ? formattedDate : formatDate}
        />
      </View>
      <View>
        {transactions?.length === 0 ? (
          <View style={styles.noTransactionContainer}>
            {colors.primaryText === '#000000' ? (
              <Image
                source={require('../../../assets/images/lightNoTransaction.png')}
                style={styles.noImage}
              />
            ) : (
              <Image
                source={require('../../../assets/images/darkNoTransaction.png')}
                style={styles.noImage}
              />
            )}
            <Text
              style={[
                styles.subtitleText,
                {color: colors.primaryText, fontSize: 13, marginTop: 5},
              ]}>
              No Transactions on{' '}
              {formattedDate === undefined
                ? moment(date).format('Do MMM YY')
                : moment(noTransactionDate).format('Do MMM YY')}
            </Text>
          </View>
        ) : (
          <TransactionList
            currencySymbol={currencySymbol}
            allExpenses={transactions}
          />
        )}
      </View>
    </View>
  );
};

export default EverydayTransaction;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  noTransactionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '90%',
  },
  noImage: {
    height: 80,
    width: 80,
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});
