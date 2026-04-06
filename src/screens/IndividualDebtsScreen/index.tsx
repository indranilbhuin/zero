import {RefreshControl, TouchableOpacity, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import AppHeader from '../../components/atoms/AppHeader';
import {goBack, navigate} from '../../utils/navigationUtils';
import {useRoute} from '@react-navigation/native';
import Icon from '../../components/atoms/Icons';
import useIndividualDebts, {IndividualDebtsScreenRouteProp} from './useIndividualDebts';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import DebtList from '../../components/molecules/DebtList';
import {formatCurrency} from '../../utils/numberUtils';
import {gs, hitSlop} from '../../styles/globalStyles';

const IndividualDebtsScreen = () => {
  const route = useRoute<IndividualDebtsScreenRouteProp>();
  const {
    colors,
    refreshing,
    debtorName,
    debtorId,
    debtorTotal,
    onRefresh,
    handleEditDebt,
    handleDeleteDebt,
    currencySymbol,
    handleDeleteDebtor,
    handleMarkAsPaid,
    handleUpdateDebtor,
    sortedBorrowings,
    sortedLendings,
    totalBorrowings,
    totalLendings,
  } = useIndividualDebts(route);

  const [debtsType, setDebtsType] = useState('Borrow');


  const netColor = useMemo(() => {
    if (debtorTotal > 0) return colors.accentOrange;
    if (debtorTotal < 0) return colors.accentGreen;
    return colors.primaryText;
  }, [debtorTotal, colors]);

  const netLabel = useMemo(() => {
    if (debtorTotal > 0) return 'You owe';
    if (debtorTotal < 0) return 'Owes you';
    return 'Settled';
  }, [debtorTotal]);

  const ListHeader = useMemo(
    () => (
      <View style={gs.mx16}>
        <View style={[gs.row, gs.gap8, gs.mb10]}>
          <View
            style={[
              gs.flex1,
              gs.py10,
              gs.px14,
              gs.rounded12,
              {backgroundColor: colors.accentOrange + '14'},
            ]}>
            <PrimaryText size={11} color={colors.accentOrange} style={gs.mb5}>
              Borrowed
            </PrimaryText>
            <PrimaryText size={18} weight="bold" variant="number" color={colors.accentOrange}>
              {currencySymbol}{formatCurrency(totalBorrowings)}
            </PrimaryText>
          </View>
          <View
            style={[
              gs.flex1,
              gs.py10,
              gs.px14,
              gs.rounded12,
              {backgroundColor: colors.accentGreen + '14'},
            ]}>
            <PrimaryText size={11} color={colors.accentGreen} style={gs.mb5}>
              Lent
            </PrimaryText>
            <PrimaryText size={18} weight="bold" variant="number" color={colors.accentGreen}>
              {currencySymbol}{formatCurrency(totalLendings)}
            </PrimaryText>
          </View>
        </View>

        <View style={[gs.rowBetweenCenter, gs.mb15]}>
          <PrimaryText size={12} color={colors.secondaryText}>
            {netLabel}{' '}
            <PrimaryText size={12} weight="bold" variant="number" color={netColor}>
              {currencySymbol}{formatCurrency(Math.abs(debtorTotal))}
            </PrimaryText>
          </PrimaryText>

          <View style={[gs.row, gs.gap8]}>
            <TouchableOpacity onPress={handleMarkAsPaid} hitSlop={hitSlop}>
              <View style={[gs.size32, gs.roundedFull, gs.center, {backgroundColor: colors.secondaryAccent}]}>
                <Icon name="check-circle" size={16} color={colors.accentBlue} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUpdateDebtor} hitSlop={hitSlop}>
              <View style={[gs.size32, gs.roundedFull, gs.center, {backgroundColor: colors.secondaryAccent}]}>
                <Icon name="pencil" size={16} color={colors.accentGreen} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteDebtor} hitSlop={hitSlop}>
              <View style={[gs.size32, gs.roundedFull, gs.center, {backgroundColor: colors.secondaryAccent}]}>
                <Icon name="trash-2" size={16} color={colors.accentOrange} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[gs.row, gs.gap8, gs.mb15]}>
          <TouchableOpacity
            onPress={() => setDebtsType('Borrow')}
            activeOpacity={0.7}
            style={[
              gs.py8,
              gs.px14,
              gs.rounded12,
              {backgroundColor: debtsType === 'Borrow' ? colors.primaryText : colors.secondaryAccent},
            ]}>
            <PrimaryText
              size={13}
              weight="semibold"
              color={debtsType === 'Borrow' ? colors.buttonText : colors.secondaryText}>
              Borrowed
            </PrimaryText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDebtsType('Lend')}
            activeOpacity={0.7}
            style={[
              gs.py8,
              gs.px14,
              gs.rounded12,
              {backgroundColor: debtsType === 'Lend' ? colors.primaryText : colors.secondaryAccent},
            ]}>
            <PrimaryText
              size={13}
              weight="semibold"
              color={debtsType === 'Lend' ? colors.buttonText : colors.secondaryText}>
              Lent
            </PrimaryText>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [colors, currencySymbol, debtsType, debtorTotal, handleDeleteDebtor, handleMarkAsPaid, handleUpdateDebtor, netColor, netLabel, totalBorrowings, totalLendings],
  );

  return (
    <PrimaryView colors={colors} useBottomPadding={false} useSidePadding={false}>
      <View style={[gs.px16, gs.mb15, gs.mt20]}>
        <AppHeader onPress={goBack} colors={colors} text={debtorName ?? ''} />
      </View>
      <DebtList
        colors={colors}
        handleEditDebt={handleEditDebt}
        handleDeleteDebt={handleDeleteDebt}
        individualDebts={debtsType === 'Borrow' ? sortedBorrowings : sortedLendings}
        currencySymbol={currencySymbol}
        ListHeaderComponent={ListHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <View style={[gs.absolute, gs.bottom15, gs.right15, gs.zIndex1]}>
        <TouchableOpacity
          style={[gs.size50, gs.rounded8, gs.center, {backgroundColor: colors.secondaryBackground}]}
          onPress={() => navigate('AddDebtsScreen', {debtorId, debtorName})}
          hitSlop={hitSlop}
          accessibilityLabel="Add new debt"
          accessibilityRole="button">
          <Icon name="plus" size={30} color={colors.primaryText} />
        </TouchableOpacity>
      </View>
    </PrimaryView>
  );
};

export default IndividualDebtsScreen;
