import React from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './style';
import Icon from '../../components/atoms/Icons';
import {navigate} from '../../utils/navigationUtils';
import TransactionCard from '../../components/molecules/TransactionCard';
import TransactionList from '../../components/molecules/TransactionList';
import HeaderContainer from '../../components/molecules/HeaderContainer';
import useHome from './useHome';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import EmptyState from '../../components/atoms/EmptyState';

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
      <PrimaryView colors={colors}>
        <HeaderContainer headerText={`Hey, ${userName}`} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.listExpenseContainer}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View style={styles.cardContainer}>
                <TransactionCard
                  currencySymbol={currencySymbol}
                  day={'Today'}
                  totalSpent={Number(formatTodaySpent)}
                />
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
            <View style={styles.transactionListContainer}>
              <PrimaryText style={{color: colors.accentGreen}}>
                All Transactions
              </PrimaryText>

              <View>
                {allTransactions?.length === 0 ? (
                  <EmptyState colors={colors} type={'Transactions'} />
                ) : (
                  <TransactionList
                    currencySymbol={currencySymbol}
                    allExpenses={sortedTransactions}
                  />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </PrimaryView>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={[
            styles.addButton,
            {backgroundColor: colors.secondaryBackground},
          ]}
          onPress={() => navigate('AddTransactionsScreen')}>
          <Icon
            name={'wallet-plus'}
            size={30}
            color={colors.primaryText}
            type={'MaterialCommunityIcons'}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HomeScreen;
