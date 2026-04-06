import {View} from 'react-native';
import React, {useMemo} from 'react';
import {useRoute} from '@react-navigation/native';
import AppHeader from '../../components/atoms/AppHeader';
import {goBack} from '../../utils/navigationUtils';
import {formatDate as formatDateUtil} from '../../utils/dateUtils';
import TransactionList from '../../components/molecules/TransactionList';
import useEverydayTransaction, {EverydayTransactionRouteProp} from './useEverydayTransaction';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import Icon from '../../components/atoms/Icons';
import {formatCurrency} from '../../utils/numberUtils';
import {gs} from '../../styles/globalStyles';

const EverydayTransactionScreen = () => {
  const route = useRoute<EverydayTransactionRouteProp>();
  const {formatDate, formattedDate, colors, currencySymbol, expenseDate, allEverydayTransactions, totalAmountForTheDay} =
    useEverydayTransaction(route);

  const listHeader = useMemo(
    () => (
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
    ),
    [colors, currencySymbol, totalAmountForTheDay],
  );

  const listEmpty = useMemo(
    () => (
      <View style={[gs.center, gs.mt30p]}>
        <View style={[gs.size50, gs.roundedFull, gs.center, {backgroundColor: colors.secondaryAccent}]}>
          <Icon name="receipt" size={22} color={colors.secondaryText} />
        </View>
        <PrimaryText size={13} color={colors.secondaryText} style={gs.mt10}>
          No transactions on {formatDateUtil(expenseDate, 'Do MMM YY')}
        </PrimaryText>
      </View>
    ),
    [colors, expenseDate],
  );

  return (
    <PrimaryView colors={colors}>
      <View style={[gs.mb20, gs.mt20]}>
        <AppHeader onPress={goBack} colors={colors} text={formattedDate === undefined ? formattedDate : formatDate} />
      </View>
      <TransactionList
        currencySymbol={currencySymbol}
        allExpenses={allEverydayTransactions}
        targetDate={expenseDate}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
      />
    </PrimaryView>
  );
};

export default EverydayTransactionScreen;
