import React, {useEffect} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import styles from './style';
import useThemeColors from '../../hooks/useThemeColors';
import {useDispatch, useSelector} from 'react-redux';
import {getAllUsers} from '../../services/UserService';
import {setUserData} from '../../redux/slice/userDataSlice';
import Icon from '../../components/Icons';
import {navigate} from '../../utils/navigationUtils';
import {getCurrencyByUserId} from '../../services/CurrencyService';
import {setCurrencyData} from '../../redux/slice/currencyDataSlice';
import TransactionCard from '../../components/TransactionCard';

const HomeScreen = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const allTransactions = [];
  const userName = useSelector(
    (state: {userData: {userName: any}}) => state.userData.userName,
  );
  const userId = useSelector(
    (state: {userData: {userId: any}}) => state.userData.userId,
  );

  const currencySymbol = useSelector(
    (state: {currencyData: {currencySymbol: any}}) =>
      state.currencyData.currencySymbol,
  );

  const fetchAllUsers = async () => {
    try {
      const users = await getAllUsers();
      const userId = String(users[0]?._id);
      console.log(userId);
      const username = users[0]?.username;
      const email = users[0]?.email;
      const userData = {userId, username, email};
      dispatch(setUserData(userData));
    } catch (error) {}
  };

  const fetchCurrency = async () => {
    try {
      const currencies = await getCurrencyByUserId(
        Realm.BSON.ObjectID.createFromHexString(userId),
      );
      console.log(currencies);
      const currencyId = String(currencies[0]?._id);
      const currencyName = currencies[0]?.name;
      const currencySymbol = currencies[0]?.symbol;
      const currencyCode = currencies[0]?.code;
      const currencyData = {
        currencyId,
        currencyName,
        currencySymbol,
        currencyCode,
      };
      dispatch(setCurrencyData(currencyData));
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllUsers();
    fetchCurrency();
  }, []);
  const todaySpent = 800;
  const yesterdaySpent = 1200;
  const thisMonthSpent = 3000;

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
            {/* <Text
            style={[
              styles.subtitleText,
              {color: colors.accentGreen, fontSize: 12},
            ]}>
            How are you doing today !!
          </Text> */}
            <ScrollView horizontal={true}>
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
                  <Text>No Transactions Yet</Text>
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
