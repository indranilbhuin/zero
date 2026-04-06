import {ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {PieChart} from 'react-native-svg-charts';
import HeaderContainer from '../../components/molecules/HeaderContainer';
import {getFirstDayOfMonth, formatDate, getMonthIndex, getMonthNumber} from '../../utils/dateUtils';
import {navigate} from '../../utils/navigationUtils';
import useReports from './useReports';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import PieChartLabels from '../../components/atoms/PieChartLabels';
import {ExpenseData as Expense} from '../../watermelondb/services';
import EmptyState from '../../components/atoms/EmptyState';
import {formatCurrency} from '../../utils/numberUtils';
import {SheetManager} from 'react-native-actions-sheet';
import Icon from '../../components/atoms/Icons';
import {gs} from '../../styles/globalStyles';

const ReportsScreen = () => {
  const {
    colors,
    selectedYear,
    selectedMonth,
    filteredTransactions,
    currencySymbol,
    dayNames,
    availableYears,
    handleMonthYearSelect,
    totalAmountForMonth,
    daysInMonth,
  } = useReports();

  const openMonthPicker = useCallback(() => {
    const monthIndex = getMonthIndex(selectedMonth);
    void SheetManager.show('month-year-picker-sheet', {
      payload: {
        selectedMonth: monthIndex,
        selectedYear,
        availableYears,
        onSelect: (monthIdx: number, year: number) => {
          handleMonthYearSelect(monthIdx, year);
        },
      },
    });
  }, [selectedMonth, selectedYear, availableYears, handleMonthYearSelect]);

  const yearMonth = useMemo(
    () => `${selectedYear}-${getMonthNumber(selectedMonth)}`,
    [selectedYear, selectedMonth],
  );

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
      categoryId: item.category.id,
      categoryIcon: item.category.icon,
    }));
  }, [filteredTransactions, currencySymbol]);

  const handleCategoryPress = useCallback(
    (categoryId: string, categoryName: string, categoryColor: string, categoryIcon?: string) => {
      navigate('CategoryTransactionScreen', {
        categoryId,
        categoryName,
        categoryColor,
        categoryIcon,
        yearMonth,
        monthLabel: `${selectedMonth} ${selectedYear}`,
      });
    },
    [yearMonth, selectedMonth, selectedYear],
  );

  const renderPieChart = useCallback(() => {
    return (
      <View>
        <PieChart style={gs.h200} data={pieChartData} />
        <PieChartLabels
          slices={pieChartData}
          colors={colors}
          currencySymbol={currencySymbol}
          onCategoryPress={handleCategoryPress}
        />
      </View>
    );
  }, [pieChartData, colors, currencySymbol, handleCategoryPress]);

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
            color={hasTransactions ? colors.buttonText : colors.primaryText}
            variant="number">
            {day}
          </PrimaryText>
        </TouchableOpacity>
      );
    });
  }, [calendarData, selectedMonth, selectedYear, colors, getHeatmapColor]);

  return (
    <PrimaryView colors={colors} useBottomPadding={false}>
      <HeaderContainer headerText={'Reports'} />
      <View style={[gs.row, gs.wFull, gs.justifyBetween, gs.gap6, gs.mt10]}>
        <TouchableOpacity
          onPress={openMonthPicker}
          activeOpacity={0.7}
          style={[gs.rowCenter, gs.gap4, gs.px12, gs.py10, gs.rounded8, {backgroundColor: colors.accentGreen}]}>
          <PrimaryText size={13} weight="semibold" color={colors.buttonText}>
            {selectedMonth} {selectedYear}
          </PrimaryText>
          <Icon name="chevron-down" size={14} color={colors.buttonText} />
        </TouchableOpacity>
        <View style={[gs.flex1, gs.px12, gs.py10, gs.rounded8, {backgroundColor: colors.secondaryAccent}]}>
          <PrimaryText size={11} color={colors.secondaryText}>Total</PrimaryText>
          <PrimaryText size={14} weight="semibold" variant="number" numberOfLines={1}>
            {currencySymbol}{formatCurrency(totalAmountForMonth)}
          </PrimaryText>
        </View>
        <View style={[gs.flex1, gs.px12, gs.py10, gs.rounded8, {backgroundColor: colors.secondaryAccent}]}>
          <PrimaryText size={11} color={colors.secondaryText}>Avg/Day</PrimaryText>
          <PrimaryText size={14} weight="semibold" variant="number" numberOfLines={1}>
            {currencySymbol}{formatCurrency(totalAmountForMonth / daysInMonth)}
          </PrimaryText>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredTransactions.length === 0 ? (
          <EmptyState colors={colors} type={'Insights'} style={gs.mt20} />
        ) : (
          <>
            <View style={[gs.row, gs.wrap, gs.mt15]}>
              {dayNames.map(day => (
                <View key={day} style={[gs.h34, gs.center, {width: '13.5%', margin: 0.5}]}>
                  <PrimaryText size={13}>{day}</PrimaryText>
                </View>
              ))}
            </View>
            <View style={[gs.row, gs.wrap]}>{renderCalendar()}</View>

            <View style={[gs.rowCenter, gs.justifyCenter, gs.mt10, gs.mb10, gs.gap4]}>
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

            <View style={[gs.mt20, gs.mb20]}>{renderPieChart()}</View>
          </>
        )}
      </ScrollView>
    </PrimaryView>
  );
};

export default ReportsScreen;
