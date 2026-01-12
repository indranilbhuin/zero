import {RefreshControl, Text, TouchableOpacity, View} from 'react-native';
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
import CustomToast from '../../components/molecules/CustomToast';
import {gs, hitSlop} from '../../styles/globalStyles';

const IndividualDebtsScreen = () => {
  const route = useRoute<IndividualDebtsScreenRouteProp>();
  const {
    colors,
    refreshing,
    debtLoading,
    debtError,
    debtorName,
    debtorId,
    debtorTotal,
    debtorTotalColor,
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
    paidToastVisible,
    handleOk,
    handleCancel,
    deleteDebtorVisible,
    handleDeleteOk,
    handleDeleteCancel,
  } = useIndividualDebts(route);

  const [debtsType, setDebtsType] = useState('Borrow');

  const ListHeader = useMemo(
    () => (
      <>
        <View style={[gs.row, gs.wFull, gs.justifyBetween, gs.itemsCenter]}>
          <View
            style={[
              gs.h40,
              gs.p5,
              gs.mr5,
              gs.rounded5,
              gs.border2,
              gs.center,
              gs.col,
              gs.mb5,
              {backgroundColor: colors.secondaryAccent, borderColor: colors.secondaryContainerColor, width: '49%'},
            ]}>
            <PrimaryText size={12} weight="semibold" color={debtorTotalColor}>Total</PrimaryText>
            <PrimaryText size={12} weight="semibold" color={debtorTotalColor}>
              {currencySymbol}{formatCurrency(Math.abs(debtorTotal))}
            </PrimaryText>
          </View>
          <View style={[gs.row, {width: '49%'}]}>
            <TouchableOpacity
              style={[
                gs.h40,
                gs.p5,
                gs.mr5,
                gs.rounded5,
                gs.border2,
                gs.center,
                gs.mb5,
                {backgroundColor: colors.secondaryAccent, borderColor: colors.secondaryContainerColor, width: '31.2%'},
              ]}
              onPress={handleMarkAsPaid}>
              <Icon name="check-circle" size={20} color={colors.accentBlue} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                gs.h40,
                gs.p5,
                gs.mr5,
                gs.rounded5,
                gs.border2,
                gs.center,
                gs.mb5,
                {backgroundColor: colors.secondaryAccent, borderColor: colors.secondaryContainerColor, width: '31.2%'},
              ]}
              onPress={handleUpdateDebtor}>
              <Icon name="pencil" size={20} color={colors.accentGreen} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                gs.h40,
                gs.p5,
                gs.mr5,
                gs.rounded5,
                gs.border2,
                gs.center,
                gs.mb5,
                {backgroundColor: colors.secondaryAccent, borderColor: colors.secondaryContainerColor, width: '31.2%'},
              ]}
              onPress={handleDeleteDebtor}>
              <Icon name="trash-2" size={20} color={colors.accentOrange} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[gs.row, gs.wFull, gs.itemsCenter, gs.justifyBetween, gs.mb15]}>
          <TouchableOpacity
            onPress={() => setDebtsType('Borrow')}
            style={[
              gs.h40,
              gs.p3,
              gs.rounded5,
              gs.border2,
              gs.center,
              {
                backgroundColor: debtsType === 'Borrow' ? colors.accentOrange : colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
                width: '49%',
                height: 50,
                marginRight: '2%',
              },
            ]}>
            <PrimaryText size={12} weight="semibold" color={debtsType === 'Borrow' ? colors.buttonText : colors.primaryText} style={gs.textCenter}>
              Borrowed
            </PrimaryText>
            <PrimaryText size={12} weight="semibold" color={debtsType === 'Borrow' ? colors.buttonText : colors.primaryText} style={gs.textCenter}>
              {currencySymbol}{formatCurrency(totalBorrowings)}
            </PrimaryText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDebtsType('Lend')}
            style={[
              gs.h40,
              gs.p3,
              gs.rounded5,
              gs.border2,
              gs.center,
              {
                backgroundColor: debtsType === 'Lend' ? colors.accentGreen : colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
                width: '49%',
                height: 50,
              },
            ]}>
            <PrimaryText size={12} weight="semibold" color={debtsType === 'Lend' ? colors.buttonText : colors.primaryText} style={gs.textCenter}>
              Lent
            </PrimaryText>
            <PrimaryText size={12} weight="semibold" color={debtsType === 'Lend' ? colors.buttonText : colors.primaryText} style={gs.textCenter}>
              {currencySymbol}{formatCurrency(totalLendings)}
            </PrimaryText>
          </TouchableOpacity>
        </View>
      </>
    ),
    [colors, currencySymbol, debtsType, debtorTotal, debtorTotalColor, handleDeleteDebtor, handleMarkAsPaid, handleUpdateDebtor, totalBorrowings, totalLendings],
  );

  if (debtLoading) {
    return <Text>Loading ...</Text>;
  }

  if (debtError) {
    return <Text>Error</Text>;
  }

  return (
    <>
      <PrimaryView colors={colors}>
        <View style={[gs.mb20, gs.mt20]}>
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
      <CustomToast
        visible={paidToastVisible}
        message={`You want to settle payment with ${debtorName}`}
        onCancel={handleCancel}
        onOk={handleOk}
        type="success"
      />
      <CustomToast
        visible={deleteDebtorVisible}
        message={`First you need to settle payment with ${debtorName}`}
        onCancel={handleDeleteCancel}
        onOk={handleDeleteOk}
        type="success"
      />
    </>
  );
};

export default IndividualDebtsScreen;
