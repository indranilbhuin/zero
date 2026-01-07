import {Modal, ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import {PieChart} from 'react-native-svg-charts';
import HeaderContainer from '../../components/molecules/HeaderContainer';
import {
  getFirstDayOfMonth,
  parseDate,
  formatDate,
  isSameDate,
  getMonthIndex,
  getMonthNumber,
} from '../../utils/dateUtils';
import {navigate} from '../../utils/navigationUtils';
import styles from './style';
import useReports from './useReports';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import PieChartLabels from '../../components/atoms/PieChartLabels';
import {ExpenseData as Expense} from '../../watermelondb/services';
import EmptyState from '../../components/atoms/EmptyState';
import {formatCurrency} from '../../utils/numberUtils';
import {FlashList} from '@shopify/flash-list';

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

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const renderYearItem = useCallback(
    ({item: year}: {item: number}) => (
      <TouchableOpacity onPress={() => handleYearSelect(year)}>
        <View
          style={[
            styles.yearContainer,
            {
              backgroundColor: year === selectedYear ? colors.primaryText : colors.containerColor,
              borderColor: colors.secondaryText,
            },
          ]}>
          <PrimaryText
            style={{
              color: year === selectedYear ? colors.buttonText : colors.primaryText,
              fontSize: 13,
            }}>
            {year}
          </PrimaryText>
        </View>
      </TouchableOpacity>
    ),
    [colors, selectedYear, handleYearSelect],
  );

  const renderMonths = () => {
    return (
      <>
        {months.map(month => (
          <TouchableOpacity key={month} onPress={() => handleMonthSelect(month)}>
            <View
              style={[
                styles.categoryContainer,
                {
                  backgroundColor: month === selectedMonth ? colors.accentGreen : colors.secondaryAccent,
                  borderColor: colors.secondaryContainerColor,
                },
              ]}>
              <PrimaryText
                style={{
                  color: month === selectedMonth ? colors.buttonText : colors.primaryText,
                  fontSize: 13,
                }}>
                {month}
              </PrimaryText>
            </View>
          </TouchableOpacity>
        ))}
      </>
    );
  };

  const renderYear = () => {
    return (
      <View
        style={{
          marginRight: 5,
          borderRightWidth: 2,
          borderColor: colors.containerColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity onPress={handleYearPicker}>
          <View
            style={[
              styles.categoryContainer,
              {
                backgroundColor: colors.secondaryAccent,
                borderColor: colors.secondaryContainerColor,
              },
            ]}>
            <PrimaryText
              style={{
                color: colors.primaryText,
                fontSize: 13,
                fontFamily: 'FiraCode-SemiBold',
              }}>
              {selectedYear}
            </PrimaryText>
          </View>
        </TouchableOpacity>
        <Modal visible={showYearPicker} animationType="fade" transparent onRequestClose={handleYearPickerClose}>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <View style={[styles.toastContainer, {backgroundColor: colors.containerColor, padding: 15}]}>
                <View style={[styles.selectedYearContainer, {borderColor: colors.secondaryText}]}>
                  <PrimaryText
                    style={{
                      color: colors.primaryText,
                      fontSize: 20,
                    }}>
                    {selectedYear}
                  </PrimaryText>
                </View>
                <View style={styles.yearListContainer}>
                  <FlashList
                    data={years}
                    renderItem={renderYearItem}
                    numColumns={4}
                    keyExtractor={item => String(item)}
                  />
                </View>
                <View style={[styles.buttonContainer, {borderColor: colors.secondaryText}]}>
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
  };

  const renderPieChart = () => {
    const aggregateData: {category: any; amount: any}[] = [];
    const categoryMap = new Map();

    filteredTransactions?.forEach((transaction: any) => {
      const {amount, category} = transaction;

      const categoryName = category?.name ?? 'Unknown';
      const categoryColor = category?.color ?? '#808080';

      if (categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          ...categoryMap.get(categoryName),
          amount: categoryMap.get(categoryName).amount + amount,
        });
      } else {
        categoryMap.set(categoryName, {
          category: {
            name: categoryName,
            color: categoryColor,
            ...category,
          },
          amount,
        });
      }
    });

    categoryMap.forEach(value => {
      aggregateData.push(value);
    });

    const data = aggregateData.map(item => ({
      key: item.category.name,
      value: item.amount,
      svg: {
        fill: item.category.color ?? '#808080',
        onPress: () => console.log('press', item),
      },
      label: `${item.category.name}: ${currencySymbol} ${item.amount}`,
    }));

    return (
      <View>
        <PieChart style={{height: 200}} data={data} />
        <PieChartLabels slices={data} colors={colors} />
      </View>
    );
  };

  const maxDayAmount = React.useMemo(() => {
    let maxAmount = 0;
    const monthNum = getMonthNumber(selectedMonth);

    for (let day = 1; day <= daysInMonth; day++) {
      const dayPadded = String(day).padStart(2, '0');
      const dateString = `${selectedYear}-${monthNum}-${dayPadded}`;
      const date = parseDate(dateString);

      const dayTransactions = filteredTransactions.filter((item: Expense) => isSameDate(item.date, date, 'day'));

      const totalForDay = dayTransactions.reduce((sum, t: {amount: number}) => sum + t.amount, 0);

      if (totalForDay > maxAmount) {
        maxAmount = totalForDay;
      }
    }
    return maxAmount;
  }, [filteredTransactions, daysInMonth, selectedYear, selectedMonth]);

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
        return hexToRgba(colors.accentGreen, 1.0);
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

  const renderCalendar = () => {
    const firstDayOfMonth = getFirstDayOfMonth(selectedYear, selectedMonth);
    const monthNum = getMonthNumber(selectedMonth);

    const blanks = Array(firstDayOfMonth).fill(0);
    const days = Array.from({length: daysInMonth}, (_, i) => i + 1);

    const calendar = [...blanks, ...days];

    return calendar.map((day, index) => {
      if (day === 0) {
        return <View key={index} style={styles.calendarDay} />;
      }

      const dayPadded = String(day).padStart(2, '0');
      const date = parseDate(`${selectedYear}-${monthNum}-${dayPadded}`);
      const dayTransactions = filteredTransactions.filter((item: Expense) => isSameDate(item.date, date, 'day'));

      const totalAmountForDay = dayTransactions.reduce(
        (sum, transaction: {amount: number}) => sum + transaction.amount,
        0,
      );

      const hasTransactions = dayTransactions.length > 0;
      const backgroundColor = getHeatmapColor(totalAmountForDay, hasTransactions);

      const monthIndex = getMonthIndex(selectedMonth);
      const selectedDate = new Date(selectedYear, monthIndex, day);
      const isDate = formatDate(selectedDate, 'YYYY-MM-DD');

      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.calendarDay,
            styles.heatmapCell,
            {
              backgroundColor,
              borderColor: hasTransactions ? colors.accentGreen : colors.secondaryContainerColor,
            },
          ]}
          onPress={() => navigate('EverydayTransactionScreen', {isDate})}>
          <PrimaryText
            style={{
              color: hasTransactions ? colors.buttonText : colors.primaryText,
              fontSize: 12,
              fontFamily: hasTransactions ? 'FiraCode-SemiBold' : 'FiraCode-Regular',
            }}>
            {day}
          </PrimaryText>
        </TouchableOpacity>
      );
    });
  };

  return (
    <PrimaryView colors={colors} useBottomPadding={false}>
      <HeaderContainer headerText={'Reports'} />
      <View
        style={{
          flexDirection: 'row',
          marginTop: 15,
          paddingBottom: 5,
          borderColor: colors.secondaryText,
        }}>
        {renderYear()}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>{renderMonths()}</View>
        </ScrollView>
      </View>
      <View style={styles.statsContainer}>
        <View style={[styles.statsCard, {backgroundColor: colors.secondaryAccent}]}>
          <PrimaryText style={styles.statsLabel}>Total</PrimaryText>
          <PrimaryText style={styles.statsValue}>
            {currencySymbol}
            {formatCurrency(totalAmountForMonth)}
          </PrimaryText>
        </View>
        <View style={[styles.statsCard, {backgroundColor: colors.secondaryAccent}]}>
          <PrimaryText style={styles.statsLabel}>Avg/Day</PrimaryText>
          <PrimaryText style={styles.statsValue}>
            {currencySymbol}
            {formatCurrency(totalAmountForMonth / daysInMonth)}
          </PrimaryText>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredTransactions.length === 0 ? (
          <EmptyState colors={colors} type={'Insights'} style={{marginTop: '20%'}} />
        ) : (
          <>
            <View style={styles.chartContainer}>{renderPieChart()}</View>
            <View style={styles.calendarContainer}>
              {dayNames.map((day, index) => (
                <View key={index} style={styles.calendarDay}>
                  <PrimaryText
                    style={{
                      color: colors.primaryText,
                      fontSize: 13,
                    }}>
                    {day}
                  </PrimaryText>
                </View>
              ))}
            </View>
            <View style={styles.calendarContainer}>{renderCalendar()}</View>

            <View style={styles.heatmapLegend}>
              <PrimaryText style={{fontSize: 11, color: colors.secondaryText}}>Less</PrimaryText>
              {[0.1, 0.3, 0.5, 0.75, 1.0].map((opacity, i) => (
                <View
                  key={`legend-${i}`}
                  style={[
                    styles.legendCell,
                    {
                      backgroundColor: hexToRgba(colors.accentGreen, opacity),
                      borderColor: colors.secondaryContainerColor,
                    },
                  ]}
                />
              ))}
              <PrimaryText style={{fontSize: 11, color: colors.secondaryText}}>More</PrimaryText>
            </View>
          </>
        )}
      </ScrollView>
    </PrimaryView>
  );
};

export default ReportsScreen;
