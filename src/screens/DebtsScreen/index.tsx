import {ScrollView, TouchableOpacity, View} from 'react-native';
import React from 'react';
import HeaderContainer from '../../components/molecules/HeaderContainer';
import homeStyles from '../HomeScreen/style';
import {navigate} from '../../utils/navigationUtils';
import Icon from '../../components/atoms/Icons';
import DebtorList from '../../components/molecules/DebtorList';
import styles from './style';
import useDebts from './useDebts';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';

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
    <PrimaryView colors={colors}>
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
          <PrimaryText
            style={{
              color: colors.buttonText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
            }}>
            Total
          </PrimaryText>
          <PrimaryText
            style={{
              color: colors.buttonText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
            }}>
            {currencySymbol}
            {totalDebts}
          </PrimaryText>
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
          <PrimaryText
            style={{
              color: colors.buttonText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
            }}>
            Person
          </PrimaryText>

          <PrimaryText
            style={{
              color: colors.buttonText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
            }}>
            {currencySymbol}
            {personTotalDebts}
          </PrimaryText>
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
          <PrimaryText
            style={{
              color: colors.buttonText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
            }}>
            Other
          </PrimaryText>
          <PrimaryText
            style={{
              color: colors.buttonText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
            }}>
            {currencySymbol}
            {otherTotalDebts}
          </PrimaryText>
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
          <PrimaryText
            style={{
              color: colors.buttonText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
            }}>
            Person
          </PrimaryText>
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
          <PrimaryText
            style={{
              color: colors.buttonText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
            }}>
            Other Accounts
          </PrimaryText>
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
    </PrimaryView>
  );
};

export default DebtsScreen;
