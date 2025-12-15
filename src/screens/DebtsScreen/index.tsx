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
import EmptyState from '../../components/atoms/EmptyState';
import useAmountColor from '../../hooks/useAmountColor';
import {formatCurrency} from '../../utils/numberUtils';

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
    debtorsCopy,
  } = useDebts();

  const totalColor = useAmountColor(totalDebts);
  const personColor = useAmountColor(personTotalDebts);
  const otherColor = useAmountColor(otherTotalDebts);

  let overallText = null;

  if (Math.abs(totalDebts) !== 0) {
    if (totalDebts > 0) {
      overallText = (
        <PrimaryText
          style={{
            color: colors.accentOrange,
            fontSize: 12,
            marginBottom: '2%',
            textAlign: 'center',
            fontFamily: 'FiraCode-Bold',
          }}>
          Overall, you need to pay others {currencySymbol}{' '}
          {formatCurrency(Math.abs(totalDebts))}
        </PrimaryText>
      );
    } else {
      overallText = (
        <PrimaryText
          style={{
            color: colors.accentGreen,
            fontSize: 12,
            marginBottom: '2%',
            textAlign: 'center',
            fontFamily: 'FiraCode-Bold',
          }}>
          Overall, others need to pay you {currencySymbol}{' '}
          {formatCurrency(Math.abs(totalDebts))}
        </PrimaryText>
      );
    }
  }

  return (
    <PrimaryView colors={colors}>
      <View style={{marginBottom: 15}}>
        <HeaderContainer headerText={'Debts'} />
      </View>
      {debtorsCopy.length === 0 ? (
        <EmptyState colors={colors} type={'Debts'} style={{marginTop: '30%'}} />
      ) : (
        <>
          {overallText}
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <View
              style={[
                styles.categoryContainer,
                {
                  backgroundColor: colors.secondaryAccent,
                  borderWidth: undefined,
                  width: '31%',
                },
              ]}>
              <PrimaryText
                style={{
                  color: totalColor,
                  fontSize: 13,
                  fontFamily: 'FiraCode-SemiBold',
                }}>
                Total
              </PrimaryText>
              <PrimaryText
                style={{
                  color: totalColor,
                  fontSize: 13,
                  fontFamily: 'FiraCode-SemiBold',
                }}>
                {currencySymbol}
                {formatCurrency(Math.abs(totalDebts))}
              </PrimaryText>
            </View>
            <View
              style={[
                styles.categoryContainer,
                {
                  backgroundColor: colors.secondaryAccent,
                  borderWidth: undefined,
                  width: '31%',
                },
              ]}>
              <PrimaryText
                style={{
                  color: personColor,
                  fontSize: 13,
                  fontFamily: 'FiraCode-SemiBold',
                }}>
                Person
              </PrimaryText>

              <PrimaryText
                style={{
                  color: personColor,
                  fontSize: 13,
                  fontFamily: 'FiraCode-SemiBold',
                }}>
                {currencySymbol}
                {formatCurrency(Math.abs(personTotalDebts))}
              </PrimaryText>
            </View>
            <View
              style={[
                styles.categoryContainer,
                {
                  backgroundColor: colors.secondaryAccent,
                  borderWidth: undefined,
                  width: '31%',
                },
              ]}>
              <PrimaryText
                style={{
                  color: otherColor,
                  fontSize: 13,
                  fontFamily: 'FiraCode-SemiBold',
                }}>
                Other
              </PrimaryText>
              <PrimaryText
                style={{
                  color: otherColor,
                  fontSize: 13,
                  fontFamily: 'FiraCode-SemiBold',
                }}>
                {currencySymbol}
                {formatCurrency(Math.abs(otherTotalDebts))}
              </PrimaryText>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
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
                      : colors.secondaryAccent,
                  borderColor: colors.secondaryContainerColor,
                  width: '48%',
                },
              ]}>
              <PrimaryText
                style={{
                  color:
                    debtorType === 'Person'
                      ? colors.buttonText
                      : colors.primaryText,
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
                      : colors.secondaryAccent,
                  borderColor: colors.secondaryContainerColor,
                  width: '48%',
                },
              ]}>
              <PrimaryText
                style={{
                  color:
                    debtorType === 'Other'
                      ? colors.buttonText
                      : colors.primaryText,
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
        </>
      )}
      <View style={homeStyles.addButtonContainer}>
        <TouchableOpacity
          style={[
            homeStyles.addButton,
            {backgroundColor: colors.secondaryBackground},
          ]}
          onPress={() => navigate('AddDebtorScreen')}>
          <Icon
            name={'credit-card-plus'}
            size={30}
            color={colors.primaryText}
            type={'MaterialCommunityIcons'}
          />
        </TouchableOpacity>
      </View>
    </PrimaryView>
  );
};

export default DebtsScreen;
