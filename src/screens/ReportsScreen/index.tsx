import {Modal, ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {PieChart} from 'react-native-svg-charts';
import HeaderContainer from '../../components/molecules/HeaderContainer';
import {getFirstDayOfMonth, formatDate, getMonthIndex, getMonthNumber, getMonthNames} from '../../utils/dateUtils';
import {navigate} from '../../utils/navigationUtils';
import useReports from './useReports';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import PieChartLabels from '../../components/atoms/PieChartLabels';
import {ExpenseData as Expense} from '../../watermelondb/services';
import EmptyState from '../../components/atoms/EmptyState';
import {formatCurrency} from '../../utils/numberUtils';
import {FlashList} from '@shopify/flash-list';
import {gs} from '../../styles/globalStyles';

const MONTHS = getMonthNames();

const ReportsScreen = () => {
  const {
    colors,
    selectedYear,
    selectedMonth,
    showYearPicker,
    filteredTransactions,
    currencySymbol,
    dayNames,
    handleYearPicker,
    handleYearPickerClose,
    years,
    handleYearSelect,
    handleMonthSelect,
    totalAmountForMonth,
    daysInMonth,
  } = useReports();

  const renderYearItem = useCallback(
    ({item: year}: {item: number}) => (
      <TouchableOpacity onPress={() => handleYearSelect(year)}>
        <View
          style={[
            gs.p3,
            gs.rounded5,
            gs.m10,
            {
              backgroundColor: year === selectedYear ? colors.primaryText : colors.containerColor,
              borderColor: colors.secondaryText,
            },
          ]}>
          <PrimaryText size={13} color={year === selectedYear ? colors.buttonText : colors.primaryText}>
            {year}
          </PrimaryText>
        </View>
      </TouchableOpacity>
    ),
    [colors, selectedYear, handleYearSelect],
  );

  const renderMonths = useCallback(() => {
    return (
      <>
        {MONTHS.map(month => (
          <TouchableOpacity key={month} onPress={() => handleMonthSelect(month)}>
            <View
              style={[
                gs.h35,
                gs.p5,
                gs.mr5,
                gs.rounded5,
                gs.border2,
                gs.center,
                {
                  backgroundColor: month === selectedMonth ? colors.accentGreen : colors.secondaryAccent,
                  borderColor: colors.secondaryContainerColor,
                },
              ]}>
              <PrimaryText size={13} color={month === selectedMonth ? colors.buttonText : colors.primaryText}>
                {month}
              </PrimaryText>
            </View>
          </TouchableOpacity>
        ))}
      </>
    );
  }, [colors, selectedMonth, handleMonthSelect]);

  const renderYear = useCallback(() => {
    return (
      <View style={[gs.mr5, gs.center, {borderRightWidth: 2, borderColor: colors.containerColor}]}>
        <TouchableOpacity onPress={handleYearPicker}>
          <View
            style={[
              gs.h35,
              gs.p5,
              gs.mr5,
              gs.rounded5,
              gs.border2,
              gs.center,
              {backgroundColor: colors.secondaryAccent, borderColor: colors.secondaryContainerColor},
            ]}>
            <PrimaryText size={13} weight="semibold">{selectedYear}</PrimaryText>
          </View>
        </TouchableOpacity>
        <Modal visible={showYearPicker} animationType="fade" transparent onRequestClose={handleYearPickerClose}>
          <View style={[gs.flex1, gs.center, {backgroundColor: 'rgba(0, 0, 0, 0.3)'}]}>
            <View style={[gs.wFull, gs.itemsCenter]}>
              <View style={[gs.h500, gs.w80p, gs.p15, {backgroundColor: colors.containerColor}]}>
                <View style={[gs.pb10, gs.borderBottom08, {borderColor: colors.secondaryText}]}>
                  <PrimaryText size={20}>{selectedYear}</PrimaryText>
                </View>
                <View style={[gs.flex1, gs.minH200]}>
                  <FlashList data={years} renderItem={renderYearItem} numColumns={4} keyExtractor={String} />
                </View>
                <View style={[gs.justifyEnd, gs.row, gs.pt10, gs.borderTop08, {borderColor: colors.secondaryText}]}>
                  <TouchableOpacity onPress={handleYearPickerClose}>
                    <PrimaryText>CANCEL</PrimaryText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }, [colors, selectedYear, showYearPicker, handleYearPicker, handleYearPickerClose, years, renderYearItem]);

  const pieChartData = useMemo(() => {
    const categoryMap = new Map<string, {category: any; amount: number}>();

    filteredTransactions?.forEach((transaction: any) => {
      const {amount, category} = transaction;
      const categoryName = category?.name ?? 'Unknown';
      const categoryColor = category?.color ?? '#808080';

      if (categoryMap.has(categoryName)) {
        const existing = categoryMap.get(categoryName)!;
        existing.amount += amount;
      } else {
        categoryMap.set(categoryName, {
          category: {name: categoryName, color: categoryColor, ...category},
          amount,
        });
      }
    });

    return Array.from(categoryMap.values()).map(item => ({
      key: item.category.name,
      value: item.amount,
      svg: {fill: item.category.color ?? '#808080', onPress: () => {}},
      label: `${item.category.name}: ${currencySymbol} ${item.amount}`,
    }));
  }, [filteredTransactions, currencySymbol]);

  const renderPieChart = useCallback(() => {
    return (
      <View>
        <PieChart style={gs.h200} data={pieChartData} />
        <PieChartLabels slices={pieChartData} colors={colors} />
      </View>
    );
  }, [pieChartData, colors]);

  const {transactionsByDay, maxDayAmount} = useMemo(() => {
    const byDay = new Map<string, {total: number; count: number}>();
    let maxAmount = 0;

    filteredTransactions?.forEach((transaction: Expense) => {
      const dateKey = formatDate(transaction.date, 'YYYY-MM-DD');
      const current = byDay.get(dateKey) ?? {total: 0, count: 0};
      current.total += transaction.amount;
      current.count += 1;
      byDay.set(dateKey, current);

      if (current.total > maxAmount) {
        maxAmount = current.total;
      }
    });

    return {transactionsByDay: byDay, maxDayAmount: maxAmount};
  }, [filteredTransactions]);

  const hexToRgba = (hex: string, alpha: number): string => {
    const cleanHex = hex.replace('#', '');
    const r = Number.parseInt(cleanHex.substring(0, 2), 16);
    const g = Number.parseInt(cleanHex.substring(2, 4), 16);
    const b = Number.parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getHeatmapColor = useCallback(
    (amount: number, hasTransactions: boolean): string => {
      if (!hasTransactions || amount === 0) {
        return colors.secondaryAccent;
      }

      const ratio = maxDayAmount > 0 ? amount / maxDayAmount : 0;

      if (ratio >= 0.75) {
        return hexToRgba(colors.accentGreen, 1);
      } else if (ratio >= 0.5) {
        return hexToRgba(colors.accentGreen, 0.75);
      } else if (ratio >= 0.25) {
        return hexToRgba(colors.accentGreen, 0.5);
      } else {
        return hexToRgba(colors.accentGreen, 0.3);
      }
    },
    [colors.accentGreen, colors.secondaryAccent, maxDayAmount],
  );

  const calendarData = useMemo(() => {
    const firstDayOfMonth = getFirstDayOfMonth(selectedYear, selectedMonth);
    const monthNum = getMonthNumber(selectedMonth);

    const blanks = new Array(firstDayOfMonth).fill(0);
    const days = Array.from({length: daysInMonth}, (_, i) => i + 1);

    return [...blanks, ...days].map((day, index) => {
      if (day === 0) {
        return {day: 0, index, dateKey: '', total: 0, hasTransactions: false};
      }

      const dayPadded = String(day).padStart(2, '0');
      const dateKey = `${selectedYear}-${monthNum}-${dayPadded}`;
      const dayData = transactionsByDay.get(dateKey);

      return {
        day,
        index,
        dateKey,
        total: dayData?.total ?? 0,
        hasTransactions: (dayData?.count ?? 0) > 0,
      };
    });
  }, [selectedYear, selectedMonth, daysInMonth, transactionsByDay]);

  const renderCalendar = useCallback(() => {
    const monthIndex = getMonthIndex(selectedMonth);

    return calendarData.map(({day, index, dateKey, total, hasTransactions}) => {
      if (day === 0) {
        return <View key={`blank-${index}`} style={[gs.h34, gs.center, {width: '13.5%', margin: 0.5}]} />;
      }

      const backgroundColor = getHeatmapColor(total, hasTransactions);
      const selectedDate = new Date(selectedYear, monthIndex, day);
      const isDate = formatDate(selectedDate, 'YYYY-MM-DD');

      return (
        <TouchableOpacity
          key={dateKey}
          style={[
            gs.h34,
            gs.center,
            gs.rounded4,
            gs.border1,
            {
              width: '13.5%',
              margin: 0.5,
              backgroundColor,
              borderColor: hasTransactions ? colors.accentGreen : colors.secondaryContainerColor,
            },
          ]}
          onPress={() => navigate('EverydayTransactionScreen', {isDate})}>
          <PrimaryText
            size={12}
            weight={hasTransactions ? 'semibold' : 'regular'}
            color={hasTransactions ? colors.buttonText : colors.primaryText}>
            {day}
          </PrimaryText>
        </TouchableOpacity>
      );
    });
  }, [calendarData, selectedMonth, selectedYear, colors, getHeatmapColor]);

  return (
    <PrimaryView colors={colors} useBottomPadding={false}>
      <HeaderContainer headerText={'Reports'} />
      <View style={[gs.row, gs.mt15, gs.pb5, {borderColor: colors.secondaryText}]}>
        {renderYear()}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={gs.rowCenter}>{renderMonths()}</View>
        </ScrollView>
      </View>
      <View style={[gs.row, gs.wFull, gs.justifyBetween, gs.gap8]}>
        <View style={[gs.flex1, gs.rowBetweenCenter, gs.px12, gs.py10, gs.rounded8, {backgroundColor: colors.secondaryAccent}]}>
          <PrimaryText size={12}>Total</PrimaryText>
          <PrimaryText size={13} weight="semibold">
            {currencySymbol}{formatCurrency(totalAmountForMonth)}
          </PrimaryText>
        </View>
        <View style={[gs.flex1, gs.rowBetweenCenter, gs.px12, gs.py10, gs.rounded8, {backgroundColor: colors.secondaryAccent}]}>
          <PrimaryText size={12}>Avg/Day</PrimaryText>
          <PrimaryText size={13} weight="semibold">
            {currencySymbol}{formatCurrency(totalAmountForMonth / daysInMonth)}
          </PrimaryText>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredTransactions.length === 0 ? (
          <EmptyState colors={colors} type={'Insights'} style={gs.mt20} />
        ) : (
          <>
            <View style={[gs.mt8p, gs.mt12p]}>{renderPieChart()}</View>
            <View style={[gs.row, gs.wrap, gs.mt10, gs.mb15]}>
              {dayNames.map(day => (
                <View key={day} style={[gs.h34, gs.center, {width: '13.5%', margin: 0.5}]}>
                  <PrimaryText size={13}>{day}</PrimaryText>
                </View>
              ))}
            </View>
            <View style={[gs.row, gs.wrap, gs.mt10, gs.mb15]}>{renderCalendar()}</View>

            <View style={[gs.rowCenter, gs.justifyCenter, gs.mt15, gs.mb20, gs.gap4]}>
              <PrimaryText size={11} color={colors.secondaryText}>Less</PrimaryText>
              {[0.1, 0.3, 0.5, 0.75, 1].map((opacity, i) => (
                <View
                  key={`legend-${i}`}
                  style={[
                    gs.size16,
                    gs.rounded3,
                    gs.border1,
                    {backgroundColor: hexToRgba(colors.accentGreen, opacity), borderColor: colors.secondaryContainerColor},
                  ]}
                />
              ))}
              <PrimaryText size={11} color={colors.secondaryText}>More</PrimaryText>
            </View>
          </>
        )}
      </ScrollView>
    </PrimaryView>
  );
};

export default ReportsScreen;
