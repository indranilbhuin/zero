import {Image, ScrollView, View} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import AppHeader from '../../components/atoms/AppHeader';
import {goBack} from '../../utils/navigationUtils';
import {formatDate as formatDateUtil} from '../../utils/dateUtils';
import TransactionList from '../../components/molecules/TransactionList';
import useEverydayTransaction, {EverydayTransactionRouteProp} from './useEverydayTransaction';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import {formatCurrency} from '../../utils/numberUtils';
import {useTheme} from '../../context/ThemeContext';
import {gs} from '../../styles/globalStyles';

const EverydayTransactionScreen = () => {
  const route = useRoute<EverydayTransactionRouteProp>();
  const {isDark} = useTheme();
  const {formatDate, formattedDate, colors, currencySymbol, expenseDate, allEverydayTransactions, totalAmountForTheDay} =
    useEverydayTransaction(route);

  return (
    <PrimaryView colors={colors}>
      <View style={[gs.mb20, gs.mt20]}>
        <AppHeader onPress={goBack} colors={colors} text={formattedDate === undefined ? formattedDate : formatDate} />
      </View>
      {allEverydayTransactions?.length === 0 ? (
        <View style={[gs.center, {height: '90%'}]}>
          <Image
            source={
              isDark
                ? require('../../../assets/images/darkNoTransaction.png')
                : require('../../../assets/images/lightNoTransaction.png')
            }
            style={gs.size80}
          />
          <PrimaryText size={13} style={gs.mt5}>
            No Transactions on {formatDateUtil(expenseDate, 'Do MMM YY')}
          </PrimaryText>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={[
              gs.h50,
              gs.rounded5,
              gs.rowBetweenCenter,
              gs.px10,
              {backgroundColor: colors.secondaryAccent},
            ]}>
            <PrimaryText size={13} weight="semibold" style={gs.textCenter}>Total Spent</PrimaryText>
            <PrimaryText size={13} weight="semibold" style={gs.textCenter}>
              {currencySymbol}{formatCurrency(totalAmountForTheDay)}
            </PrimaryText>
          </View>
          <TransactionList currencySymbol={currencySymbol} allExpenses={allEverydayTransactions} targetDate={expenseDate} />
        </ScrollView>
      )}
    </PrimaryView>
  );
};

export default EverydayTransactionScreen;
