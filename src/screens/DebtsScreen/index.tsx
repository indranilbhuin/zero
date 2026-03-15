import {TouchableOpacity, View} from 'react-native';
import React, {useMemo} from 'react';
import HeaderContainer from '../../components/molecules/HeaderContainer';
import {navigate} from '../../utils/navigationUtils';
import Icon from '../../components/atoms/Icons';
import DebtorList from '../../components/molecules/DebtorList';
import useDebts from './useDebts';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import EmptyState from '../../components/atoms/EmptyState';
import {formatCurrency} from '../../utils/numberUtils';
import {gs, hitSlop} from '../../styles/globalStyles';

const DebtsScreen = () => {
  const {
    colors,
    allDebts,
    debtorType,
    setDebtorType,
    currencySymbol,
    personDebtors,
    otherAccountsDebtors,
    totalDebts,
    debtors,
  } = useDebts();

  const overallLabel = useMemo(() => {
    if (totalDebts > 0) return 'You owe others';
    if (totalDebts < 0) return 'Others owe you';
    return 'All settled';
  }, [totalDebts]);

  const amountColor = useMemo(() => {
    if (totalDebts > 0) return colors.accentOrange;
    if (totalDebts < 0) return colors.accentGreen;
    return colors.primaryText;
  }, [totalDebts, colors]);

  const ListHeader = useMemo(() => (
    <View style={gs.mx16}>
      <View
        style={[
          gs.py12,
          gs.px14,
          gs.rounded12,
          gs.mb15,
          gs.center,
          {backgroundColor: colors.containerColor},
        ]}>
        <PrimaryText size={11} weight="medium" color={colors.secondaryText} style={gs.mb5}>
          {overallLabel}
        </PrimaryText>
        <PrimaryText size={28} weight="bold" variant="number" color={amountColor}>
          {currencySymbol}{formatCurrency(Math.abs(totalDebts))}
        </PrimaryText>
        <View style={[gs.rowCenter, gs.gap6, gs.mt6]}>
          <PrimaryText size={11} color={colors.secondaryText} variant="number">
            {personDebtors.length} person{personDebtors.length === 1 ? '' : 's'}
          </PrimaryText>
          <PrimaryText size={11} color={colors.secondaryText}>·</PrimaryText>
          <PrimaryText size={11} color={colors.secondaryText} variant="number">
            {otherAccountsDebtors.length} account{otherAccountsDebtors.length === 1 ? '' : 's'}
          </PrimaryText>
        </View>
      </View>

      <View style={[gs.row, gs.gap8, gs.mb15]}>
        <TouchableOpacity
          onPress={() => setDebtorType('Person')}
          activeOpacity={0.7}
          style={[
            gs.py8,
            gs.px14,
            gs.rounded12,
            {
              backgroundColor: debtorType === 'Person' ? colors.primaryText : colors.secondaryAccent,
            },
          ]}>
          <PrimaryText
            size={13}
            weight="semibold"
            color={debtorType === 'Person' ? colors.buttonText : colors.secondaryText}>
            Person
          </PrimaryText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDebtorType('Other')}
          activeOpacity={0.7}
          style={[
            gs.py8,
            gs.px14,
            gs.rounded12,
            {
              backgroundColor: debtorType === 'Other' ? colors.primaryText : colors.secondaryAccent,
            },
          ]}>
          <PrimaryText
            size={13}
            weight="semibold"
            color={debtorType === 'Other' ? colors.buttonText : colors.secondaryText}>
            Accounts
          </PrimaryText>
        </TouchableOpacity>
      </View>
    </View>
  ), [amountColor, colors, currencySymbol, debtorType, overallLabel, otherAccountsDebtors.length, personDebtors.length, setDebtorType, totalDebts]);

  return (
    <PrimaryView colors={colors} useBottomPadding={false} useSidePadding={false}>
      <View style={[gs.px16, gs.mb15]}>
        <HeaderContainer headerText={'Debts'} />
      </View>
      {debtors.length === 0 ? (
        <View style={gs.px16}>
          <EmptyState colors={colors} type={'Debts'} style={gs.mt30p} />
        </View>
      ) : (
        <DebtorList
          colors={colors}
          debtors={debtorType === 'Person' ? personDebtors : otherAccountsDebtors}
          allDebts={allDebts}
          currencySymbol={currencySymbol}
          ListHeaderComponent={ListHeader}
        />
      )}
      <View style={[gs.absolute, gs.bottom15, gs.right15, gs.zIndex1]}>
        <TouchableOpacity
          style={[gs.size50, gs.rounded8, gs.center, {backgroundColor: colors.secondaryBackground}]}
          onPress={() => navigate('AddDebtorScreen')}
          hitSlop={hitSlop}
          accessibilityLabel="Add new debtor"
          accessibilityRole="button">
          <Icon name="plus-circle" size={30} color={colors.primaryText} />
        </TouchableOpacity>
      </View>
    </PrimaryView>
  );
};

export default DebtsScreen;
