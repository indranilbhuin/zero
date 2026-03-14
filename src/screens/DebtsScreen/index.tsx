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
import useAmountColor from '../../hooks/useAmountColor';
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
    personTotalDebts,
    otherTotalDebts,
    debtors,
  } = useDebts();

  const totalColor = useAmountColor(totalDebts);
  const personColor = useAmountColor(personTotalDebts);
  const otherColor = useAmountColor(otherTotalDebts);

  const ListHeader = useMemo(() => {
    let overallText = null;

    if (Math.abs(totalDebts) !== 0) {
      if (totalDebts > 0) {
        overallText = (
          <PrimaryText size={12} weight="bold" color={colors.accentOrange} style={[gs.mb5, gs.textCenter]}>
            Overall, you need to pay others{' '}
            <PrimaryText size={12} weight="bold" color={colors.accentOrange} variant="number">
              {currencySymbol} {formatCurrency(Math.abs(totalDebts))}
            </PrimaryText>
          </PrimaryText>
        );
      } else {
        overallText = (
          <PrimaryText size={12} weight="bold" color={colors.accentGreen} style={[gs.mb5, gs.textCenter]}>
            Overall, others need to pay you{' '}
            <PrimaryText size={12} weight="bold" color={colors.accentGreen} variant="number">
              {currencySymbol} {formatCurrency(Math.abs(totalDebts))}
            </PrimaryText>
          </PrimaryText>
        );
      }
    }

    return (
      <>
        {overallText}
        <View style={[gs.row, gs.wFull, gs.itemsCenter, gs.justifyBetween, gs.mb10]}>
          <View style={[gs.h40, gs.p3, gs.mr5, gs.rounded5, gs.center, {backgroundColor: colors.secondaryAccent, width: '31%'}]}>
            <PrimaryText size={13} weight="semibold" color={totalColor}>Total</PrimaryText>
            <PrimaryText size={13} weight="semibold" color={totalColor} variant="number">
              {currencySymbol}{formatCurrency(Math.abs(totalDebts))}
            </PrimaryText>
          </View>
          <View style={[gs.h40, gs.p3, gs.mr5, gs.rounded5, gs.center, {backgroundColor: colors.secondaryAccent, width: '31%'}]}>
            <PrimaryText size={13} weight="semibold" color={personColor}>Person</PrimaryText>
            <PrimaryText size={13} weight="semibold" color={personColor} variant="number">
              {currencySymbol}{formatCurrency(Math.abs(personTotalDebts))}
            </PrimaryText>
          </View>
          <View style={[gs.h40, gs.p3, gs.mr5, gs.rounded5, gs.center, {backgroundColor: colors.secondaryAccent, width: '31%'}]}>
            <PrimaryText size={13} weight="semibold" color={otherColor}>Other</PrimaryText>
            <PrimaryText size={13} weight="semibold" color={otherColor} variant="number">
              {currencySymbol}{formatCurrency(Math.abs(otherTotalDebts))}
            </PrimaryText>
          </View>
        </View>

        <View style={[gs.row, gs.wFull, gs.itemsCenter, gs.justifyBetween, gs.mb15]}>
          <TouchableOpacity
            onPress={() => setDebtorType('Person')}
            style={[
              gs.h40,
              gs.p3,
              gs.mr5,
              gs.rounded5,
              gs.border2,
              gs.center,
              {
                backgroundColor: debtorType === 'Person' ? colors.accentGreen : colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
                width: '48%',
              },
            ]}>
            <PrimaryText size={13} weight="semibold" color={debtorType === 'Person' ? colors.buttonText : colors.primaryText}>
              Person
            </PrimaryText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDebtorType('Other')}
            style={[
              gs.h40,
              gs.p3,
              gs.mr5,
              gs.rounded5,
              gs.border2,
              gs.center,
              {
                backgroundColor: debtorType === 'Other' ? colors.accentGreen : colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
                width: '48%',
              },
            ]}>
            <PrimaryText size={13} weight="semibold" color={debtorType === 'Other' ? colors.buttonText : colors.primaryText}>
              Other Accounts
            </PrimaryText>
          </TouchableOpacity>
        </View>
      </>
    );
  }, [colors, currencySymbol, debtorType, otherColor, otherTotalDebts, personColor, personTotalDebts, setDebtorType, totalColor, totalDebts]);

  return (
    <PrimaryView colors={colors} useBottomPadding={false}>
      <View style={gs.mb15}>
        <HeaderContainer headerText={'Debts'} />
      </View>
      {debtors.length === 0 ? (
        <EmptyState colors={colors} type={'Debts'} style={gs.mt30p} />
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
