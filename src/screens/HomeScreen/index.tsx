import React from 'react';
import {
  Image,
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
    todaySpent,
    yesterdaySpent,
    thisMonthSpent,
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
                  totalSpent={todaySpent}
                />
                <TransactionCard
                  currencySymbol={currencySymbol}
                  day={'Yesterday'}
                  totalSpent={yesterdaySpent}
                />
                <TransactionCard
                  currencySymbol={currencySymbol}
                  day={'This Month'}
                  totalSpent={thisMonthSpent}
                />
              </View>
            </ScrollView>
            <View style={styles.transactionListContainer}>
              <PrimaryText style={{color: colors.accentGreen}}>
                All Transactions
              </PrimaryText>

              <View>
                {allTransactions?.length === 0 ? (
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
                      style={{
                        color: colors.primaryText,
                        fontSize: 13,
                        marginTop: 5,
                      }}>
                      No Transactions Yet
                    </PrimaryText>
                  </View>
                ) : (
                  <TransactionList
                    currencySymbol={currencySymbol}
                    allExpenses={allTransactions}
                  />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </PrimaryView>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: colors.primaryText}]}
          onPress={() => navigate('AddTransactionsScreen')}>
          <Icon
            name={'wallet-plus'}
            size={30}
            color={colors.buttonText}
            type={'MaterialCommunityIcons'}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HomeScreen;
