import {Modal, ScrollView, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {PieChart} from 'react-native-svg-charts';
import HeaderContainer from '../../components/molecules/HeaderContainer';
import moment from 'moment';
import {navigate} from '../../utils/navigationUtils';
import styles from './style';
import useReports from './useReports';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import PieChartLabels from '../../components/atoms/PieChartLabels';
import Expense from '../../schemas/ExpenseSchema';
import EmptyState from '../../components/atoms/EmptyState';
import {formatCurrency} from '../../utils/numberUtils';

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

  const daysWithTransactions = filteredTransactions.reduce(
    (days, transaction) => {
      const transactionDay = moment(transaction.date).date();
      if (!days.includes(transactionDay)) {
        days.push(transactionDay);
      }
      return days;
    },
    [],
  );

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

  const renderYearPickerItems = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {years.map(year => (
          <TouchableOpacity key={year} onPress={() => handleYearSelect(year)}>
            <View
              style={[
                styles.yearContainer,
                {
                  backgroundColor:
                    year === selectedYear
                      ? colors.primaryText
                      : colors.containerColor,
                  borderColor: colors.secondaryText,
                },
              ]}>
              <PrimaryText
                style={{
                  color:
                    year === selectedYear
                      ? colors.buttonText
                      : colors.primaryText,
                  fontSize: 13,
                }}>
                {year}
              </PrimaryText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMonths = () => {
    return (
      <>
        {months.map(month => (
          <TouchableOpacity
            key={month}
            onPress={() => handleMonthSelect(month)}>
            <View
              style={[
                styles.categoryContainer,
                {
                  backgroundColor:
                    month === selectedMonth
                      ? colors.accentGreen
                      : colors.secondaryAccent,
                  borderColor: colors.secondaryContainerColor,
                },
              ]}>
              <PrimaryText
                style={{
                  color:
                    month === selectedMonth
                      ? colors.buttonText
                      : colors.primaryText,
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
        <Modal
          visible={showYearPicker}
          animationType="fade"
          transparent
          onRequestClose={handleYearPickerClose}>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <View
                style={[
                  styles.toastContainer,
                  {backgroundColor: colors.containerColor, padding: 15},
                ]}>
                <View
                  style={[
                    styles.selectedYearContainer,
                    {borderColor: colors.secondaryText},
                  ]}>
                  <PrimaryText
                    style={{
                      color: colors.primaryText,
                      fontSize: 20,
                    }}>
                    {selectedYear}
                  </PrimaryText>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {renderYearPickerItems()}
                </ScrollView>
                <View
                  style={[
                    styles.buttonContainer,
                    {borderColor: colors.secondaryText},
                  ]}>
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

      const categoryName = category.name;

      if (categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          ...categoryMap.get(categoryName),
          amount: categoryMap.get(categoryName).amount + amount,
        });
      } else {
        categoryMap.set(categoryName, {
          category: {name: categoryName, ...category},
          amount,
        });
      }
    });

    categoryMap.forEach(value => {
      aggregateData.push(value);
    });

    const data = aggregateData.map((item, index) => ({
      key: item.category.name,
      value: item.amount,
      svg: {
        fill: item.category.color,
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

  const renderCalendar = () => {
    const firstDayOfMonth = moment(
      `${selectedYear}-${moment().month(selectedMonth).format('MM')}-01`,
    ).day();

    const blanks = Array(firstDayOfMonth).fill(0);
    const days = Array.from({length: daysInMonth}, (_, i) => i + 1);

    const calendar = [...blanks, ...days];

    return calendar.map((day, index) => {
      const date = moment(
        `${selectedYear}-${selectedMonth}-${day}`,
        'YYYY-MMM-D',
      );
      const dayTransactions = filteredTransactions.filter((item: Expense) =>
        moment(item.date).isSame(date, 'day'),
      );

      const totalAmountForDay = dayTransactions.reduce(
        (sum, transaction: {amount: number}) => sum + transaction.amount,
        0,
      );

      const hasTransactions = dayTransactions.length > 0;

      let opacity = hasTransactions
        ? Math.round(totalAmountForDay) / Math.round(totalAmountForMonth)
        : 1;
      console.log('the opacity is:', opacity);
      let visibility = Math.round(opacity * 200);
      console.log('the visibility is:', visibility);
      let backgroundColor;
      if (hasTransactions) {
        backgroundColor = `${colors.accentGreen}${visibility}`;
      } else {
        backgroundColor = 'transparent';
      }

      if (totalAmountForDay === totalAmountForMonth) {
        backgroundColor = `${colors.accentGreen}60`;
      }

      const opacityThreshold = 0.1;

      if (opacity < opacityThreshold) {
        backgroundColor = `${colors.accentGreen}20`;
      }

      const monthIndex = months.indexOf(selectedMonth);
      const selectedDate = new Date(selectedYear, monthIndex, day);

      const isDate = moment(selectedDate).format('YYYY-MM-DD');

      return day !== 0 ? (
        <TouchableOpacity
          key={index}
          style={[styles.calendarDay, {backgroundColor}]}
          onPress={() => navigate('EverydayTransactionScreen', {isDate})}>
          <PrimaryText
            style={{
              color: colors.primaryText,
              fontSize: 13,
            }}>
            {day !== 0 ? day : ''}
          </PrimaryText>
        </TouchableOpacity>
      ) : (
        <View key={index} style={[styles.calendarDay, {backgroundColor}]}>
          <PrimaryText
            style={{
              color: colors.primaryText,
              fontSize: 13,
            }}>
            {''}
          </PrimaryText>
        </View>
      );
    });
  };

  return (
    <PrimaryView colors={colors}>
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderMonths()}
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={[
            styles.categoryContainer,
            {
              backgroundColor: colors.secondaryAccent,
              borderWidth: undefined,
              width: '48.5%',
              height: 50,
            },
          ]}>
          <PrimaryText
            style={{
              color: colors.primaryText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
              textAlign: 'center',
            }}>
            Total
          </PrimaryText>
          <PrimaryText
            style={{
              color: colors.primaryText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
              textAlign: 'center',
            }}>
            {currencySymbol}
            {formatCurrency(totalAmountForMonth)}
          </PrimaryText>
        </View>
        <View
          style={[
            styles.categoryContainer,
            {
              backgroundColor: colors.secondaryAccent,
              width: '48.5%',
              borderWidth: undefined,
              height: 50,
            },
          ]}>
          <PrimaryText
            style={{
              color: colors.primaryText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
              textAlign: 'center',
            }}>
            Avg/Day
          </PrimaryText>
          <PrimaryText
            style={{
              color: colors.primaryText,
              fontSize: 13,
              fontFamily: 'FiraCode-SemiBold',
              textAlign: 'center',
            }}>
            {currencySymbol}
            {filteredTransactions.length === 0
              ? 0
              : formatCurrency(
                  (totalAmountForMonth / daysWithTransactions.length).toFixed(
                    2,
                  ),
                )}
          </PrimaryText>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredTransactions.length === 0 ? (
          <EmptyState
            colors={colors}
            type={'Insights'}
            style={{marginTop: '20%'}}
          />
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
          </>
        )}
      </ScrollView>
    </PrimaryView>
  );
};

export default ReportsScreen;
