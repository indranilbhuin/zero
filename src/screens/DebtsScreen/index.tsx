import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderContainer from '../../components/HeaderContainer';
import useThemeColors from '../../hooks/useThemeColors';
import homeStyles from '../HomeScreen/style';
import {navigate} from '../../utils/navigationUtils';
import Icon from '../../components/Icons';
import DebtorList from '../../components/DebtorList';
import {useDispatch, useSelector} from 'react-redux';
import {FETCH_ALL_DEBTOR_DATA} from '../../redux/actionTypes';
import {selectDebtorData} from '../../redux/slice/debtorDataSlice';
import {
  getAllDebtRequest,
  selectAllDebtData,
} from '../../redux/slice/allDebtDataSlice';
import {selectCurrencySymbol} from '../../redux/slice/currencyDataSlice';

const DebtsScreen = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const debtors = useSelector(selectDebtorData);
  const allDebts = useSelector(selectAllDebtData);
  const allDebtsCopy = JSON.parse(JSON.stringify(allDebts));
  const [debtorType, setDebtorType] = useState('Person');
  console.log('this is all debts copy', debtors);
  console.log(debtors);
  const currencySymbol = useSelector(selectCurrencySymbol);

  const personDebtors = debtors.filter(debtor => debtor.type === 'Person');
  const otherAccountsDebtors = debtors.filter(
    debtor => debtor.type !== 'Person',
  );

  const totalDebts = allDebtsCopy.reduce(
    (total, debt) => total + debt.amount,
    0,
  );

  let personTotalDebts = 0;
  let otherTotalDebts = 0;

  allDebtsCopy.forEach(debt => {
    if (debt.debtor.type === 'Person') {
      personTotalDebts += debt.amount;
    } else {
      otherTotalDebts += debt.amount;
    }
  });

  useEffect(() => {
    dispatch({type: FETCH_ALL_DEBTOR_DATA});
    dispatch(getAllDebtRequest());
  }, []);

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: colors.primaryBackground},
      ]}>
      <View style={{marginBottom: 15}}>
        <HeaderContainer headerText={'Debts'} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <View
          style={[
            styles.categoryContainer,
            {
              backgroundColor: colors.primaryText,
              borderColor: colors.secondaryText,
              width: '32%',
            },
          ]}>
          <Text
            style={[
              styles.subtitleText,
              {
                color: colors.buttonText,
                fontSize: 13,
                fontFamily: 'FiraCode-SemiBold',
              },
            ]}>
            Total
          </Text>
          <Text
            style={[
              styles.subtitleText,
              {
                color: colors.buttonText,
                fontSize: 13,
                fontFamily: 'FiraCode-SemiBold',
              },
            ]}>
            {currencySymbol}
            {totalDebts}
          </Text>
        </View>
        <View
          style={[
            styles.categoryContainer,
            {
              backgroundColor: colors.primaryText,
              borderColor: colors.secondaryText,
              width: '32%',
            },
          ]}>
          <Text
            style={[
              styles.subtitleText,
              {
                color: colors.buttonText,
                fontSize: 13,
                fontFamily: 'FiraCode-SemiBold',
              },
            ]}>
            Person
          </Text>
          <Text
            style={[
              styles.subtitleText,
              {
                color: colors.buttonText,
                fontSize: 13,
                fontFamily: 'FiraCode-SemiBold',
              },
            ]}>
            {currencySymbol}
            {personTotalDebts}
          </Text>
        </View>
        <View
          style={[
            styles.categoryContainer,
            {
              backgroundColor: colors.primaryText,
              borderColor: colors.secondaryText,
              width: '32%',
            },
          ]}>
          <Text
            style={[
              styles.subtitleText,
              {
                color: colors.buttonText,
                fontSize: 13,
                fontFamily: 'FiraCode-SemiBold',
              },
            ]}>
            Other
          </Text>
          <Text
            style={[
              styles.subtitleText,
              {
                color: colors.buttonText,
                fontSize: 13,
                fontFamily: 'FiraCode-SemiBold',
              },
            ]}>
            {currencySymbol}
            {otherTotalDebts}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 15,
        }}>
        <TouchableOpacity
          onPress={() => setDebtorType('Person')}
          style={[
            styles.categoryContainer,
            {
              backgroundColor:
                debtorType === 'Person'
                  ? colors.accentGreen
                  : colors.primaryText,
              borderColor: colors.secondaryText,
              width: '48.5%',
            },
          ]}>
          <Text
            style={[
              styles.subtitleText,
              {
                color: colors.buttonText,
                fontSize: 13,
                fontFamily: 'FiraCode-SemiBold',
              },
            ]}>
            Person
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDebtorType('Other')}
          style={[
            styles.categoryContainer,
            {
              backgroundColor:
                debtorType === 'Other'
                  ? colors.accentGreen
                  : colors.primaryText,
              borderColor: colors.secondaryText,
              width: '48.5%',
            },
          ]}>
          <Text
            style={[
              styles.subtitleText,
              {
                color: colors.buttonText,
                fontSize: 13,
                fontFamily: 'FiraCode-SemiBold',
              },
            ]}>
            Other Accounts
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <DebtorList
          colors={colors}
          debtors={
            debtorType === 'Person' ? personDebtors : otherAccountsDebtors
          }
          allDebts={allDebtsCopy}
          currencySymbol={currencySymbol}
        />
      </ScrollView>

      <View style={homeStyles.addButtonContainer}>
        <TouchableOpacity
          style={[homeStyles.addButton, {backgroundColor: colors.primaryText}]}
          onPress={() => navigate('AddDebtorScreen')}>
          <Icon
            name={'credit-card-plus'}
            size={30}
            color={colors.buttonText}
            type={'MaterialCommunityIcons'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DebtsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  categoryContainer: {
    height: 40,
    padding: 3,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleText: {
    fontFamily: 'FiraCode-Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});
