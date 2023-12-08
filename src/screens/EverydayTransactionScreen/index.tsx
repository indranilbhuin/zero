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

const EverydayTransactionScreen = () => {
  const route = useRoute<EverydayTransactionRouteProp>();
  const {
    transactions,
    formatDate,
    formattedDate,
    colors,
    currencySymbol,
    date,
    noTransactionDate,
  } = useEverydayTransaction(route);

  return (
    <PrimaryView colors={colors}>
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
            <PrimaryText
              style={{color: colors.primaryText, fontSize: 13, marginTop: 5}}>
              No Transactions on{' '}
              {formattedDate === undefined
                ? moment(date).format('Do MMM YY')
                : moment(noTransactionDate).format('Do MMM YY')}
            </PrimaryText>
          </View>
        ) : (
          <TransactionList
            currencySymbol={currencySymbol}
            allExpenses={transactions}
          />
        )}
      </View>
    </PrimaryView>
  );
};

export default EverydayTransactionScreen;
