import React, {useCallback} from 'react';
import {RefreshControl, ScrollView, TouchableOpacity, View} from 'react-native';
import Icon from '../../components/atoms/Icons';
import {navigate} from '../../utils/navigationUtils';
import TransactionList from '../../components/molecules/TransactionList';
import HeaderContainer from '../../components/molecules/HeaderContainer';
import useHome from './useHome';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import EmptyState from '../../components/atoms/EmptyState';
import {formatCurrency} from '../../utils/numberUtils';
import {SheetManager} from 'react-native-actions-sheet';
import {gs, hitSlop} from '../../styles/globalStyles';

const HomeScreen = () => {
  const {
    colors,
    refreshing,
    allTransactions,
    userName,
    currencySymbol,
    onRefresh,
    sortedTransactions,
    selectedYear,
    selectedMonthIndex,
    selectedMonthName,
    yearMonth,
    availableYears,
    totalSpent,
    transactionCount,
    avgPerDay,
    handleMonthYearSelect,
  } = useHome();

  const openMonthPicker = useCallback(() => {
    void SheetManager.show('month-year-picker-sheet', {
      payload: {
        selectedMonth: selectedMonthIndex,
        selectedYear,
        availableYears,
        onSelect: handleMonthYearSelect,
      },
    });
  }, [selectedMonthIndex, selectedYear, availableYears, handleMonthYearSelect]);

  return (
    <>
      <PrimaryView colors={colors} useBottomPadding={false} useSidePadding={false}>
        <View style={[gs.px16, gs.mb15]}>
          <HeaderContainer headerText={`Hey, ${userName}`} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={gs.pb80}>

          <TouchableOpacity
            onPress={openMonthPicker}
            activeOpacity={0.7}
            style={[
              gs.mx16,
              gs.px14,
              gs.py12,
              gs.rounded12,
              {backgroundColor: colors.accentGreen},
            ]}>
            <View style={gs.rowBetweenCenter}>
              <View style={[gs.rowCenter, gs.gap6]}>
                <PrimaryText size={14} weight="semibold" color={colors.buttonText}>
                  {selectedMonthName} {selectedYear}
                </PrimaryText>
                <Icon name="chevron-down" size={14} color={colors.buttonText} />
              </View>
              <PrimaryText size={20} weight="bold" variant="number" color={colors.buttonText}>
                {currencySymbol}{formatCurrency(totalSpent)}
              </PrimaryText>
            </View>

            <View style={[gs.rowCenter, gs.gap8, gs.mt4]}>
              <PrimaryText size={11} color={colors.buttonText} variant="number" style={{opacity: 0.7}}>
                {transactionCount} transaction{transactionCount === 1 ? '' : 's'}
              </PrimaryText>
              <PrimaryText size={11} color={colors.buttonText} style={{opacity: 0.7}}>·</PrimaryText>
              <PrimaryText size={11} color={colors.buttonText} variant="number" style={{opacity: 0.7}}>
                avg {currencySymbol}{formatCurrency(Math.round(avgPerDay))}/day
              </PrimaryText>
            </View>
          </TouchableOpacity>

          <View>
            {allTransactions?.length === 0 ? (
              <View style={gs.px16}>
                <EmptyState colors={colors} type={'Transactions'} />
              </View>
            ) : (
              <TransactionList
                currencySymbol={currencySymbol}
                allExpenses={sortedTransactions}
                edgeToEdge
                targetMonth={yearMonth}
              />
            )}
          </View>
        </ScrollView>
      </PrimaryView>
      <View style={[gs.absolute, gs.bottom15, gs.right15, gs.zIndex1]}>
        <TouchableOpacity
          style={[gs.size50, gs.rounded8, gs.center, {backgroundColor: colors.secondaryBackground}]}
          onPress={() => navigate('AddTransactionsScreen')}
          hitSlop={hitSlop}
          accessibilityLabel="Add new transaction"
          accessibilityRole="button">
          <Icon name="plus-circle" size={30} color={colors.primaryText} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HomeScreen;
