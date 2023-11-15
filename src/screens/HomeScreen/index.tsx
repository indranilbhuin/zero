import React, {useEffect} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
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
  FETCH_ALL_USER_DATA,
  FETCH_CURRENCY_DATA,
} from '../../redux/actionTypes';

const HomeScreen = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const allTransactions = [];
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const currencySymbol = useSelector(selectCurrencySymbol);

  useEffect(() => {
    dispatch({type: FETCH_ALL_USER_DATA});
    dispatch({type: FETCH_CURRENCY_DATA});
  }, [userId, userName]);

  const todaySpent = 800;
  const yesterdaySpent = 1200;
  const thisMonthSpent = 3000;
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

        <ScrollView showsVerticalScrollIndicator={false}>
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
                {allTransactions.length === 0 ? (
                  <>
                    <Text>No Transactions Yet</Text>
                    <TransactionList currencySymbol={currencySymbol} />
                  </>
                ) : (
                  <View></View>
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
