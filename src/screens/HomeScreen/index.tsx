import React, {useEffect, useState} from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './style';
import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch, useSelector} from 'react-redux';
import Icon from '../../components/Icons';
import {navigate} from '../../utils/navigationUtils';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';
import TransactionCard from '../../components/TransactionCard';
import TransactionList from '../../components/TransactionList';
import {selectUserId} from '../../redux/slice/userIdSlice';
import {selectUserName} from '../../redux/slice/userNameSlice';
import {
  FETCH_ALL_CATEGORY_DATA,
  FETCH_ALL_USER_DATA,
  FETCH_CURRENCY_DATA,
} from '../../redux/actionTypes';
import {
  getExpenseRequest,
  selectExpenseData,
  selectExpenseError,
  selectExpenseLoading,
} from '../../redux/slice/expenseDataSlice';
import moment from 'moment';

const HomeScreen = () => {
  const colors = useThemeColors();
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const allTransactions = useSelector(selectExpenseData);
  const expenseLoading = useSelector(selectExpenseLoading);
  const expenseError = useSelector(selectExpenseError);
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const currencySymbol = useSelector(selectCurrencySymbol);

  const onRefresh = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    dispatch({type: FETCH_ALL_USER_DATA});
    dispatch({type: FETCH_CURRENCY_DATA});
    dispatch({type: FETCH_ALL_CATEGORY_DATA});
  }, [userId, userName]);

  useEffect(() => {
    dispatch(getExpenseRequest());
  }, [userId]);

  useEffect(() => {
    if (refreshing) {
      dispatch(getExpenseRequest());
      setRefreshing(false);
    }
  }, [refreshing]);

  if (expenseLoading) {
    return <Text>Loading ...</Text>;
  }

  if (expenseError) {
    return <Text>Error</Text>;
  }

  console.log('in home screen', allTransactions);

  const calculateSpent = (unit, subtract = 0) => {
    const currentDate = moment().utc();
    console.log(currentDate);
    if (unit === 'day') {
      currentDate.subtract(subtract, 'days');
    } else if (unit === 'month') {
      currentDate.startOf('month');
    }

    const filteredTransactions = allTransactions.filter(transaction =>
      moment(transaction.date).isSameOrAfter(currentDate, unit),
    );

    const totalSpent = filteredTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );

    return totalSpent;
  };
  const todaySpent = calculateSpent('day', 0);
  const yesterdaySpent = calculateSpent('day', 1);
  const thisMonthSpent = calculateSpent('month');
  console.log(currencySymbol);

  return (
    <>
      <View
        style={[
          styles.mainContainer,
          {backgroundColor: colors.primaryBackground},
        ]}>
        <View style={styles.headerContainer}>
          <View style={styles.greetingsContainer}>
            <View
              style={[
                styles.initialsContainer,
                {backgroundColor: colors.primaryText},
              ]}>
              <Text style={[styles.initialsText, {color: colors.buttonText}]}>
                {userName
                  .split(' ')
                  .map((name: string) => name.charAt(0))
                  .join('')}
              </Text>
            </View>
            <Text style={[styles.titleText, {color: colors.primaryText}]}>
              Hey, {userName}
            </Text>
          </View>
          <View style={styles.settingsContainer}>
            <TouchableOpacity onPress={() => navigate('SettingsScreen')}>
              <Icon
                name={'setting'}
                size={20}
                color={colors.primaryText}
                type={'AntDesign'}
              />
            </TouchableOpacity>
          </View>
        </View>

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
              <Text
                style={[
                  styles.subtitleText,
                  {color: colors.accentGreen, fontSize: 14},
                ]}>
                All Transactions
              </Text>
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
                    <Text
                      style={[
                        styles.subtitleText,
                        {color: colors.primaryText, fontSize: 13, marginTop: 5},
                      ]}>
                      No Transactions Yet
                    </Text>
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
      </View>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: colors.primaryText}]}
          onPress={() => navigate('AddTransactionsScreen')}>
          <Icon
            name={'credit-card-plus'}
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
