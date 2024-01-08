import {Image, View} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import AppHeader from '../../components/atoms/AppHeader';
import {goBack} from '../../utils/navigationUtils';
import moment from 'moment';
import TransactionList from '../../components/molecules/TransactionList';
import useEverydayTransaction, {
  EverydayTransactionRouteProp,
} from './useEverydayTransaction';
import styles from './style';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import mainStyles from '../../styles/main';
import reportsStyles from '../ReportsScreen/style';
import { formatCurrency } from '../../utils/numberUtils';

const EverydayTransactionScreen = () => {
  const route = useRoute<EverydayTransactionRouteProp>();
  const {
    formatDate,
    formattedDate,
    colors,
    currencySymbol,
    expenseDate,
    allEverdayTransaction,
    allEverdayTransactionCopy,
    totalAmountForTheDay
  } = useEverydayTransaction(route);

  return (
    <PrimaryView colors={colors}>
      <View style={mainStyles.headerContainer}>
        <AppHeader
          onPress={goBack}
          colors={colors}
          text={formattedDate === undefined ? formattedDate : formatDate}
        />
      </View>
      <View>
        {allEverdayTransaction?.length === 0 ? (
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
            <PrimaryText
              style={{color: colors.primaryText, fontSize: 13, marginTop: 5}}>
              No Transactions on {moment(expenseDate).format('Do MMM YY')}
            </PrimaryText>
          </View>
        ) : (
          <>
            <View
              style={[
                reportsStyles.categoryContainer,
                {
                  backgroundColor: colors.secondaryAccent,
                  borderWidth: undefined,
                  width: '100%',
                  height: 50,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  paddingLeft: 10,
                  paddingRight: 10
                },
              ]}>
              <PrimaryText
                style={{
                  color: colors.primaryText,
                  fontSize: 13,
                  fontFamily: 'FiraCode-SemiBold',
                  textAlign: 'center',
                }}>
                Total Spent
              </PrimaryText>
              <PrimaryText
                style={{
                  color: colors.primaryText,
                  fontSize: 13,
                  fontFamily: 'FiraCode-SemiBold',
                  textAlign: 'center',
                }}>
                {currencySymbol}
                {formatCurrency(totalAmountForTheDay)}
              </PrimaryText>
            </View>
            <TransactionList
              currencySymbol={currencySymbol}
              allExpenses={allEverdayTransactionCopy}
            />
          </>
        )}
      </View>
    </PrimaryView>
  );
};

export default EverydayTransactionScreen;
