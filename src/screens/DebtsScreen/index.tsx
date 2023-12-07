import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import HeaderContainer from '../../components/HeaderContainer';
import homeStyles from '../HomeScreen/style';
import {navigate} from '../../utils/navigationUtils';
import Icon from '../../components/Icons';
import DebtorList from '../../components/DebtorList';
import styles from './style';
import useDebts from './useDebts';

const DebtsScreen = () => {
  const {
    colors,
    allDebtsCopy,
    debtorType,
    setDebtorType,
    currencySymbol,
    personDebtors,
    otherAccountsDebtors,
    totalDebts,
    personTotalDebts,
    otherTotalDebts,
  } = useDebts();

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
