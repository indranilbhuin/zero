import React from 'react';
import {RefreshControl, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Icon from '../../components/atoms/Icons';
import {navigate} from '../../utils/navigationUtils';
import TransactionCard from '../../components/molecules/TransactionCard';
import TransactionList from '../../components/molecules/TransactionList';
import HeaderContainer from '../../components/molecules/HeaderContainer';
import useHome from './useHome';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import EmptyState from '../../components/atoms/EmptyState';
import {gs, hitSlop} from '../../styles/globalStyles';

const HomeScreen = () => {
  const {
    colors,
    refreshing,
    allTransactions,
    expenseLoading,
    expenseError,
    userName,
    currencySymbol,
    onRefresh,
    sortedTransactions,
    formatTodaySpent,
    formatYesterdaySpent,
    formatThisMonthSpent,
  } = useHome();

  if (expenseLoading) {
    return <Text>Loading ...</Text>;
  }

  if (expenseError) {
    return <Text>Error</Text>;
  }

  return (
    <>
      <PrimaryView colors={colors} useBottomPadding={false}>
        <HeaderContainer headerText={`Hey, ${userName}`} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={[gs.mt5p, gs.mb20p]}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={[gs.mt10, gs.row]}>
                <TransactionCard currencySymbol={currencySymbol} day={'Today'} totalSpent={Number(formatTodaySpent)} />
                <TransactionCard
                  currencySymbol={currencySymbol}
                  day={'Yesterday'}
                  totalSpent={Number(formatYesterdaySpent)}
                />
                <TransactionCard
                  currencySymbol={currencySymbol}
                  day={'This Month'}
                  totalSpent={Number(formatThisMonthSpent)}
                />
              </View>
            </ScrollView>
            <View style={gs.mt20}>
              <PrimaryText color={colors.accentGreen}>All Transactions</PrimaryText>

              <View>
                {allTransactions?.length === 0 ? (
                  <EmptyState colors={colors} type={'Transactions'} />
                ) : (
                  <TransactionList currencySymbol={currencySymbol} allExpenses={sortedTransactions} />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </PrimaryView>
      <View style={[gs.absolute, gs.bottom15, gs.right15, gs.zIndex1]}>
        <TouchableOpacity
          style={[gs.size50, gs.rounded8, gs.center, {backgroundColor: colors.secondaryBackground}]}
          onPress={() => navigate('AddTransactionsScreen')}
          hitSlop={hitSlop}
          accessibilityLabel="Add new transaction"
          accessibilityRole="button">
          <Icon name="plus-circle" size={30} color={colors.primaryText} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HomeScreen;
